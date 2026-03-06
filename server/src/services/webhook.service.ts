import express, {Router} from 'express';
import {Webhook} from "svix";
import {prisma} from "@/lib/prisma.js";

const router = Router();


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

    let evt
    try{
        evt=wh.verify(payload,headers)
    }catch (e){
        return res.status(400).send("Invalid signature");
    }

    const eventType = evt.type;
    const data = evt.data;

    if (eventType === "user.created" || eventType === "user.updated") {
        const user = {
            id: data.id,
            email: data.email_addresses?.[0]?.email_address,
            firstName: data.first_name,
            lastName: data.last_name,
            imageUrl: data.image_url,
        };

        await prisma.user.upsert({
            where: { id: user.id },
            update: user,
            create: user,
        })
    }

    res.status(200).json({ success: true });
})

export default router;