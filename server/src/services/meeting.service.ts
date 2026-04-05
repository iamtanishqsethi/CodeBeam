import {prisma} from "@/lib/prisma.js";
import {createLiveKitToken} from "@/services/livekit.service.js";
import {nanoid} from "nanoid";

export class MeetingServiceError extends Error {
    statusCode: number;
    code: string;

    constructor(message: string, statusCode = 400, code = "MEETING_ERROR") {
        super(message);
        this.name = "MeetingServiceError";
        this.statusCode = statusCode;
        this.code = code;
    }
}

function meetingNotFound() {
    return new MeetingServiceError("Meeting not found", 404, "MEETING_NOT_FOUND");
}

function meetingEnded() {
    return new MeetingServiceError("Meeting has already ended", 410, "MEETING_ENDED");
}

async function getMeetingOrThrow(meetingId: string) {
    const meeting = await prisma.meeting.findUnique({where: {id: meetingId}});
    if (!meeting) {
        throw meetingNotFound();
    }

    return meeting;
}

export async function createMeeting(userId:string,title:string){
    return prisma.meeting.create({
        data:{
            id:nanoid(8),
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
    const meeting = await getMeetingOrThrow(meetingId);
    if (meeting.status === 'ENDED') {
        throw meetingEnded();
    }

    const existingMeet=await prisma.participant.findUnique({
        where:{
            meetingId_userId:{
                meetingId,
                userId
            }}
    })

    if(existingMeet){
        if (existingMeet.status === "LEFT") {
            const rejoinedParticipant = await prisma.participant.update({
                where: {
                    meetingId_userId: {
                        meetingId,
                        userId
                    }
                },
                data: {
                    status: "APPROVED",
                    joinedAt: new Date(),
                    leftAt: null
                }
            });

            return {
                status: rejoinedParticipant.status,
                isHost: meeting.hostId === userId,
                participantId: rejoinedParticipant.id
            };
        }

        return {
            status:existingMeet.status,
            isHost: meeting.hostId === userId,
            participantId: existingMeet.id
        }
    }

    const participant = await prisma.participant.create({
        data:{
            meetingId,
            userId,
            role:"MEMBER",
            status:"WAITING",
        }
    })

    return {
        status:"WAITING",
        isHost: meeting.hostId === userId,
        participantId: participant.id
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
    return prisma.$transaction(async (tx) => {
        const meeting = await tx.meeting.findUnique({
            where: {id: meetingId}
        });

        if (!meeting) {
            throw meetingNotFound();
        }

        if (meeting.status === "ENDED") {
            return {meetingEnded: true};
        }

        await tx.participant.update({
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
        });

        const approvedParticipantsCount = await tx.participant.count({
            where: {
                meetingId,
                status: "APPROVED"
            }
        });

        if (approvedParticipantsCount === 0) {
            await tx.meeting.update({
                where: {id: meetingId},
                data: {
                    status: "ENDED",
                    endedAt: new Date()
                }
            });

            return {meetingEnded: true};
        }

        return {meetingEnded: false};
    });
}

export async function endMeeting(meetingId: string) {
    const meeting = await getMeetingOrThrow(meetingId);

    if (meeting.status === "ENDED") {
        return meeting;
    }

    const endedAt = new Date();

    return prisma.$transaction(async (tx) => {
        await tx.participant.updateMany({
            where: {
                meetingId,
                status: {
                    not: "LEFT"
                }
            },
            data: {
                status: "LEFT",
                leftAt: endedAt
            }
        });

        return tx.meeting.update({
            where: {id: meetingId},
            data: {
                status: "ENDED",
                endedAt
            }
        });
    });
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
    const meeting = await getMeetingOrThrow(meetingId);
    if (meeting.status === "ENDED") {
        throw meetingEnded();
    }

    const participant=await prisma.participant.findUnique({
        where:{
            meetingId_userId:{
                meetingId,
                userId
            }
        }
    })

    if(!participant||participant.status!=="APPROVED"){
        throw new MeetingServiceError("Not authorized to generate token", 403, "TOKEN_FORBIDDEN")
    }

    return createLiveKitToken(meetingId,userId)
}
