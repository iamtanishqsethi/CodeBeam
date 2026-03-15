import type {Server} from "socket.io";
import {prisma} from "@/lib/prisma.js";
import * as meetingService from "@/services/meeting.service.js";
export default function registerMeetingSocket(io:Server) {
    //authentication middleware
    io.use((socket,next)=>{
        const userId=socket.handshake.auth.userId
        if(!userId){
            return next(new Error("Unauthorized"))
        }
        socket.data.userId=userId
        next()
    })

    io.on('connection',(socket)=>{

        socket.on('join-meeting',async ({meetingId})=>{
            try{
                socket.join(meetingId)

                const participant=await prisma.participant.findUnique({
                    where:{
                        meetingId_userId:{
                            meetingId,
                            userId:socket.data.userId
                        },
                    },
                    include:{
                        user:true,
                    }
                })

                if(!participant){
                    throw new Error("Participant not found")
                }

                //check for waiting user
                if(participant.status==="WAITING"){
                    socket.to(meetingId).emit('new-waiting-user', {
                        userName: participant.user.firstName,
                        userId:socket.data.userId,
                        imageUrl:participant.user.imageUrl,
                        participantId: participant.id
                    });
                }
            }
            catch (e){
                socket.emit('meeting:error',{message:"Error joining room"})
                console.error(e)
            }
        })

        socket.on('approve-user',async ({participantId,meetingId})=>{
            try{
                const userId=socket.data.userId
                const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
                if (!meeting || meeting.hostId !== userId) {
                    socket.emit('meeting:error', { message: 'Unauthorized' });
                    return;
                }


                await meetingService.approveParticipant(meetingId, participantId);

                socket.to(meetingId).emit('participant-approved', {participantId})
            }
            catch (e){
                socket.emit('meeting:error',{message:"Error approving user"})
                console.error(e)

            }

        })

        socket.on('leave-meeting',({meetingId})=>{
            try{
                const userId=socket.data.userId
                socket.leave(meetingId)
                socket.to(meetingId).emit('user-left',{userId})
            }
            catch (e){
                socket.emit('meeting:error',{message:"Error leaving meeting"})
                console.error(e)
            }


        })
    })
}