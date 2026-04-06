import express, {Router} from 'express';
import {Webhook} from "svix";
import {prisma} from "../lib/prisma.js";

const router = Router();

type ClerkWebhookEvent = {
    type: string;
    data: {
        id: string;
        email_addresses?: Array<{ email_address?: string }>;
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string | null;
    };
};

router.post('/',express.raw({ type: 'application/json' }), async (req, res) => {

    console.log("webhook received")
    const payload = req.body;
    const headers={
        'svix-id':req.headers['svix-id'] as string,
        'svix-timestamp':req.headers['svix-timestamp'] as string,
        'svix-signature':req.headers['svix-signature'] as string,
    }

    const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!webhookSecret) {
        return res.status(500).send("Missing webhook secret");
    }

    const wh=new Webhook(webhookSecret)

    let evt: ClerkWebhookEvent
    try{
        evt=wh.verify(payload,headers) as ClerkWebhookEvent
    }catch (e){
        return res.status(400).send("Invalid signature");
    }

    const eventType = evt.type;
    const data = evt.data;

    if (eventType === "user.created" || eventType === "user.updated") {
        const email = data.email_addresses?.[0]?.email_address;
        const firstName = data.first_name?.trim();

        if (!email || !firstName) {
            return res.status(400).send("Missing required user fields");
        }

        const createUser = {
            id: data.id,
            email,
            firstName,
            ...(data.last_name !== undefined ? { lastName: data.last_name } : {}),
            ...(data.image_url !== undefined ? { imageUrl: data.image_url } : {}),
        };

        const updateUser = {
            email,
            firstName,
            ...(data.last_name !== undefined ? { lastName: data.last_name } : {}),
            ...(data.image_url !== undefined ? { imageUrl: data.image_url } : {}),
        };

        await prisma.user.upsert({
            where: { id: data.id },
            update: updateUser,
            create: createUser,
        })
    }

    res.status(200).json({ success: true });
})

export default router;
