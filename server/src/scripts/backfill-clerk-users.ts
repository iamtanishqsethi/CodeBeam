import {clerkClient} from "@clerk/express";
import {prisma} from "../lib/prisma.js";
import {syncUser} from "../services/user.service.js";

const PAGE_SIZE = 100;

async function main() {
    let offset = 0;
    let processed = 0;

    while (true) {
        const response = await clerkClient.users.getUserList({
            limit: PAGE_SIZE,
            offset,
        });
        const users = response.data;

        if (users.length === 0) {
            break;
        }

        for (const user of users) {
            await syncUser(user.id, {
                email: user.emailAddresses[0]?.emailAddress,
                firstName: user.firstName?.trim(),
                lastName: user.lastName?.trim() ?? null,
                imageUrl: user.imageUrl ?? null,
            });

            processed += 1;
            console.log(`Synced ${processed}: ${user.id}`);
        }

        if (users.length < PAGE_SIZE) {
            break;
        }

        offset += PAGE_SIZE;
    }

    console.log(`Completed Clerk user sync. Total users processed: ${processed}`);
}

main()
    .catch((error) => {
        console.error("Failed to backfill Clerk users", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
