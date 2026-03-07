import {AccessToken} from "livekit-server-sdk";
import {prisma} from "@/lib/prisma.js";

export async function createLiveKitToken(meetingId:string,userId:string){
    if(!meetingId || !userId){
        throw new Error('Meeting ID and User ID are required')
    }
    const LiveKitApiKey=process.env.LIVEKIT_API_KEY
    const LiveKitApiSecret=process.env.LIVEKIT_API_SECRET
    if(!LiveKitApiKey || !LiveKitApiSecret){
        throw new Error('LiveKit API Key and Secret are required')
    }
    const user=await prisma.user.findUnique({where:{id:userId}})
    if(!user){
        throw new Error('User not found')
    }

    const accessToken=new AccessToken(LiveKitApiKey,LiveKitApiSecret,{identity:user.firstName})
    accessToken.addGrant(({
        room:meetingId,
        canPublish:true,
        canSubscribe:true,
        roomJoin:true,
    }))

    const token=await accessToken.toJwt()
    return token

}