import {prisma} from "@/lib/prisma.js";
import {createLiveKitToken} from "@/services/livekit.service.js";


export async function createMeeting(userId:string,title:string){
    return prisma.meeting.create({
        data:{
            title,
            hostId:userId,
            participants:{
                create:{
                    userId,
                    role:"HOST",
                    status:"APPROVED"
                }
            }
        }
    })
}

export async function joinMeeting(meetingId:string,userId:string){


    const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
    if (!meeting) {
        throw new Error('Meeting not found');
    }
    if (meeting.status === 'ENDED') {
        throw new Error('Meeting has ended');
    }
    
    const existingMeet=await prisma.participant.findUnique({
        where:{
            meetingId_userId:{
                meetingId,
                userId
            }}
    })

    if(existingMeet){
        return {
            status:existingMeet.status,
            isHost: meeting.hostId === userId
        }
    }

    await prisma.participant.create({
        data:{
            meetingId,
            userId,
            role:"MEMBER",
            status:"WAITING",
        }
    })

    return {
        status:"WAITING",
        isHost: meeting.hostId === userId
    }
}

export async function getWaitingUsers(meetingId:string){
    
    return prisma.participant.findMany({
        where:{
            meetingId,
            status:"WAITING"
        },
        include:{
            user:true
        }
    })
}

export async function approveParticipant(meetingId:string,participantId:string){
     await prisma.participant.update({
         where:{id:participantId,meetingId},
         data:{status:"APPROVED"}
     })
}

export async function rejectParticipant(meetingId:string,participantId:string){
    await prisma.participant.update({
        where:{id:participantId,meetingId},
        data:{status:"REJECTED"}
    })
}

export async function leaveMeeting(meetingId:string,userId:string){
    await prisma.participant.update({
        where:{
            meetingId_userId:{
                meetingId,
                userId
            }
        },
        data:{
            status:"LEFT",
            leftAt:new Date()
        }
    })
}

export async function getParticipants(meetingId:string){
    return prisma.participant.findMany({
        where: {
            meetingId,
            status: "APPROVED"
        },
        include: {
            user: true
        }
    });
}

export async function generateToken(meetingId:string,userId:string){


    const participant=await prisma.participant.findUnique({
        where:{
            meetingId_userId:{
                meetingId,
                userId
            }
        }
    })

    if(!participant||participant.status!=="APPROVED"){
        throw new Error("Not authorized to generate token")
    }

    return createLiveKitToken(meetingId,userId)
}