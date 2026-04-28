import {clerkClient} from "@clerk/express";
import {prisma} from "../lib/prisma.js";

type SessionClaims = Record<string, unknown>;
type UserProfile = {
    email: string | undefined;
    firstName: string | undefined;
    lastName: string | null | undefined;
    imageUrl: string | null | undefined;
};

function getString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function getNameFromEmail(email?: string) {
    if (!email) {
        return undefined;
    }

    const localPart = email.split("@")[0]?.trim();
    return localPart && localPart.length > 0 ? localPart : undefined;
}

function getPrimaryEmailFromClaims(sessionClaims?: SessionClaims | null): string | undefined {
    if (!sessionClaims) {
        return undefined;
    }

    const directEmail = getString(sessionClaims.email) ?? getString(sessionClaims.email_address);
    if (directEmail) {
        return directEmail;
    }

    const emailAddresses = sessionClaims.email_addresses;
    if (Array.isArray(emailAddresses)) {
        for (const entry of emailAddresses) {
            if (entry && typeof entry === "object") {
                const email = getString((entry as Record<string, unknown>).email_address);
                if (email) {
                    return email;
                }
            }
        }
    }

    return undefined;
}

function getUserProfileFromClaims(sessionClaims?: SessionClaims | null) {
    return {
        email: getPrimaryEmailFromClaims(sessionClaims),
        firstName: getString(sessionClaims?.first_name) ?? getString(sessionClaims?.given_name),
        lastName: getString(sessionClaims?.last_name) ?? getString(sessionClaims?.family_name),
        imageUrl: getString(sessionClaims?.image_url) ?? getString(sessionClaims?.picture),
    };
}

async function getUserProfileFromClerk(userId: string) {
    try {
        const clerkUser = await clerkClient.users.getUser(userId);
        return {
            email: clerkUser.emailAddresses[0]?.emailAddress,
            firstName: getString(clerkUser.firstName),
            lastName: getString(clerkUser.lastName),
            imageUrl: getString(clerkUser.imageUrl),
        };
    } catch (error) {
        console.error(`Failed to fetch Clerk user ${userId}`, error);
        return null;
    }
}

function getPlaceholderProfile(userId: string) {
    return {
        email: `${userId}@placeholder.invalid`,
        firstName: "User",
        lastName: null,
        imageUrl: null,
    };
}

function buildResolvedProfile(userId: string, profile?: UserProfile | null) {
    const fallbackProfile = getPlaceholderProfile(userId);
    const resolvedEmail = profile?.email ?? fallbackProfile.email;

    return {
        email: resolvedEmail,
        firstName: profile?.firstName ?? getNameFromEmail(resolvedEmail) ?? fallbackProfile.firstName,
        lastName: profile?.lastName ?? fallbackProfile.lastName,
        imageUrl: profile?.imageUrl ?? fallbackProfile.imageUrl,
    };
}

export async function syncUser(userId: string, profile?: UserProfile | null) {
    const resolvedProfile = buildResolvedProfile(userId, profile);

    return prisma.$transaction(async (tx) => {
        const existingById = await tx.user.findUnique({
            where: {id: userId}
        });

        if (existingById) {
            return tx.user.update({
                where: {id: userId},
                data: resolvedProfile
            });
        }

        const existingByEmail = await tx.user.findUnique({
            where: {email: resolvedProfile.email}
        });

        if (existingByEmail) {
            return tx.user.update({
                where: {id: existingByEmail.id},
                data: {
                    id: userId,
                    ...resolvedProfile
                }
            });
        }

        return tx.user.create({
            data: {
                id: userId,
                ...resolvedProfile
            }
        });
    });
}

export async function ensureUserExists(userId: string, sessionClaims?: SessionClaims | null) {
    const claimsProfile = getUserProfileFromClaims(sessionClaims);
    const clerkProfile = claimsProfile.email && claimsProfile.firstName
        ? null
        : await getUserProfileFromClerk(userId);

    return syncUser(userId, {
        email: claimsProfile.email ?? clerkProfile?.email,
        firstName: claimsProfile.firstName ?? clerkProfile?.firstName,
        lastName: claimsProfile.lastName ?? clerkProfile?.lastName,
        imageUrl: claimsProfile.imageUrl ?? clerkProfile?.imageUrl,
    });
}
