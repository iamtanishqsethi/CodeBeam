import type {Server} from "socket.io";
import {prisma} from "@/lib/prisma.js";
import * as meetingService from "@/services/meeting.service.js";
export default function registerMeetingSocket(io:Server) {
    io.on('connection',(socket)=>{

        socket.on('join-waiting-room',({meetingId})=>{
            socket.join(meetingId)

            socket.to(meetingId).emit('new-waiting-user')
        })

        socket.on('approve-user',async ({participantId,meetingId,userId})=>{

            const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
            if (!meeting || meeting.hostId !== userId) {
                socket.emit('error', { message: 'Unauthorized' });
                return;
            }


            await meetingService.approveParticipant(meetingId, participantId);

            io.to(meetingId).emit('participant-approved', {participantId})

        })

        socket.on('leave-meeting',({meetingId,userId})=>{
            socket.leave(meetingId)
            socket.to(meetingId).emit('user-left',{userId})
        })
    })
}