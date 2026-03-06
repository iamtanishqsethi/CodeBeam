import type {Server} from "socket.io";
import {prisma} from "@/lib/prisma.js";
import * as meetingService from "@/services/meeting.service.js";
export default function registerMeetingSocket(io:Server) {
    io.on('connection',(socket)=>{

        socket.on('join-waiting-room',({meetingId})=>{
            try{
                socket.join(meetingId)
                socket.to(meetingId).emit('new-waiting-user')
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

                io.to(meetingId).emit('participant-approved', {participantId})
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