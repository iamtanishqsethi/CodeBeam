import {clerkClient} from "@clerk/express";
import {prisma} from "../lib/prisma.js";

type SessionClaims = Record<string, unknown>;

function getString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
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

export async function ensureUserExists(userId: string, sessionClaims?: SessionClaims | null) {
    const existingUser = await prisma.user.findUnique({
        where: {id: userId}
    });

    if (existingUser) {
        return existingUser;
    }

    const claimsProfile = getUserProfileFromClaims(sessionClaims);
    const clerkProfile = claimsProfile.email && claimsProfile.firstName
        ? null
        : await getUserProfileFromClerk(userId);
    const fallbackProfile = getPlaceholderProfile(userId);

    return prisma.user.upsert({
        where: {id: userId},
        update: {},
        create: {
            id: userId,
            email: claimsProfile.email ?? clerkProfile?.email ?? fallbackProfile.email,
            firstName: claimsProfile.firstName ?? clerkProfile?.firstName ?? fallbackProfile.firstName,
            lastName: claimsProfile.lastName ?? clerkProfile?.lastName ?? fallbackProfile.lastName,
            imageUrl: claimsProfile.imageUrl ?? clerkProfile?.imageUrl ?? fallbackProfile.imageUrl,
        }
    });
}
