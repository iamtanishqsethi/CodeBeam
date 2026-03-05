import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware,clerkClient, requireAuth, getAuth } from '@clerk/express'
import {prisma} from "@/lib/prisma.js";
import {verifyWebhook} from "@clerk/express/webhooks";
import {Webhook} from "svix";

dotenv.config()

const port = process.env.PORT || 5051;
const app = express();

// CORS should be applied early
app.use(cors(
    {
        origin:['http://localhost:3000'],
        credentials:true
    }
));

// Webhook route MUST be placed BEFORE any body-parsing middleware and BEFORE clerkMiddleware
// to ensure it can receive the raw body for signature verification.
app.post('/api/webhooks', express.raw({ type: 'application/json' }), async (req, res) => {

        console.log("webhook received")
         const payload = req.body;
        const headers=req.headers;

        const wh=new Webhook(process.env.CLERK_WEBHOOK_SIGNING_SECRET as string)

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
            imageUrl: data.profile_image_url,
        };

        await prisma.user.upsert({
            where: { id: user.id },
            update: user,
            create: user,
        })
    }

    res.status(200).json({ success: true });


})

// Global clerkMiddleware for all subsequent routes
app.use(clerkMiddleware());


// Use requireAuth() to protect this route
// If user isn't authenticated, requireAuth() will redirect back to the homepage
app.get('/protected', requireAuth(), async (req, res) => {
    // Use `getAuth()` to get the user's `userId`
    const { userId } = getAuth(req)

    // Use Clerk's JS Backend SDK to get the user's User object
    const user = await clerkClient.users.getUser(userId as string)

    return res.json({ user })
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
