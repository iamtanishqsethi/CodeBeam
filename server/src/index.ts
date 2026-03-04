import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware,clerkClient, requireAuth, getAuth } from '@clerk/express'

dotenv.config()

const port = process.env.PORT || 5051;
const app = express();



app.use(clerkMiddleware());
app.use(cors(
    {
        origin:['http://localhost:3000'],
        credentials:true
    }
));

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
