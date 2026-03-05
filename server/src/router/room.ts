import { Router } from 'express';
import {clerkClient, getAuth, requireAuth} from "@clerk/express";
import {AccessToken} from "livekit-server-sdk";

const router = Router();


router.get('/token',requireAuth(),async (req,res)=>{
    const {roomId}=req.query;

    if(!roomId){
        return res.status(400).send("Room id is required")
    }
    const { userId } = getAuth(req)
    const user=await clerkClient.users.getUser(userId as string)
    console.log(user.fullName)

    const accessToken=new AccessToken(
        process.env.LIVEKIT_API_KEY as string,
        process.env.LIVEKIT_API_SECRET as string,
        {
            identity:user.fullName as string,
            name:user.fullName as string
        }
    )

    accessToken.addGrant({
        roomJoin:true,
        room:roomId as string,
        canPublish:true,
        canSubscribe:true
    })

    const token=await accessToken.toJwt()

    return res.status(200).send(token)
})

export default router;
