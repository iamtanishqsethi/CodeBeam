import * as meetingService from '../services/meeting.service.js';
import {type Request, type Response} from 'express';
import {getAuth} from "@clerk/express";
import {prisma} from "../lib/prisma.js";

function handleControllerError(res: Response, error: Error | any) {
    console.error(error);

    if (error instanceof meetingService.MeetingServiceError) {
        return res.status(error.statusCode).json({
            message: error.message,
            code: error.code
        });
    }

    return res.status(500).json({message: error.message || 'Internal Server Error'});
}

export async function createMeeting(req:Request, res:Response) {
    try{
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meeting=await meetingService.createMeeting(userId,req.body.title)

        return res.status(201).json(meeting)
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }


}

export async function joinMeeting(req:Request,res:Response) {
    try {
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meetingId=req.params.meetingId
        if(!meetingId){
            return res.status(400).json({message:'Meeting ID is required'})
        }


        const result=await meetingService.joinMeeting(meetingId as string,userId)

        return res.status(200).json(result)
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }

}

export async function getWaitingRoom(req:Request,res:Response){
    try{
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meetingId=req.params.meetingId

        if(!meetingId){
            return res.status(400).json({message:'Meeting ID is required'})
        }

        //verify if user is the host
        const meeting=await prisma.meeting.findUnique({
            where:{id:meetingId as string},
        })
        if(!meeting||meeting.hostId!==userId){
            return res.status(403).json({ error: 'Only the host can view the waiting room' });
        }

        const users=await meetingService.getWaitingUsers(meetingId as string)
        return res.status(200).json(users)
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }


}

export async function approveParticipants(req:Request,res:Response){
    try{
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meetingId=req.params.meetingId

        if(!meetingId){
            return res.status(400).json({message:'Meeting ID is required'})
        }

        const meeting=await prisma.meeting.findUnique({
            where:{id:meetingId as string},
        })
        if(!meeting||meeting.hostId!==userId){
            return res.status(403).json({ error: 'Only the host can approve participants' });
        }

        const participantId=req.body.participantId
        if(!participantId){
            return res.status(400).json({message:'Participant ID is required'})
        }

        await meetingService.approveParticipant(meetingId as string,participantId)

        return res.status(200).json({success:true})
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }

}

export async function rejectParticipants(req:Request,res:Response){
    try{

        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meetingId=req.params.meetingId
        if(!meetingId){
            return res.status(400).json({message:'Meeting ID is required'})
        }
        const meeting=await prisma.meeting.findUnique({
            where:{id:meetingId as string},
        })
        if(!meeting||meeting.hostId!==userId){
            return res.status(403).json({ error: 'Only the host can reject  participants' });
        }


        const participantId=req.body.participantId
        if(!participantId){
            return res.status(400).json({message:'Participant ID is required'})
        }
        await meetingService.rejectParticipant(meetingId as string,participantId)
        return res.status(200).json({success:true})
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }


}

export async function getLiveKitToken(req:Request,res:Response){

    try{
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meetingId=req.params.meetingId
        if(!meetingId){
            return res.status(400).json({message:'Meeting ID is required'})
        }

        const token=await meetingService.generateToken(meetingId as string,userId)
        return res.status(200).json({token})
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }

}

export async function leaveMeeting(req:Request,res:Response){
    try{
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meetingId=req.params.meetingId
        if(!meetingId){
            return res.status(400).json({message:'Meeting ID is required'})
        }

        const result = await meetingService.leaveMeeting(meetingId as string,userId)
        return res.status(200).json(
            {success:true, ...result}
        )  // roomEmpty flag is included when returned by leaveMeeting
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }


}

export async function getParticipants(req:Request,res:Response){
    try{
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({message:'Unauthorized'})
        }

        const meetingId=req.params.meetingId
        if(!meetingId){
            return res.status(400).json({message:'Meeting ID is required'})
        }

        const participants=await meetingService.getParticipants(meetingId as string)
        return res.status(200).json(participants)
    }
    catch (e:Error|any){
        return handleControllerError(res, e)
    }


}

export async function endMeeting(req: Request, res: Response) {
    try {
        const {userId} = getAuth(req);
        if (!userId) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const meetingId = req.params.meetingId;
        if (!meetingId) {
            return res.status(400).json({message: 'Meeting ID is required'});
        }

        const meeting = await prisma.meeting.findUnique({
            where: {id: meetingId as string},
        });

        if (!meeting || meeting.hostId !== userId) {
            return res.status(403).json({error: 'Only the host can end the meeting'});
        }

        const endedMeeting = await meetingService.endMeeting(meetingId as string);
        return res.status(200).json({success: true, meeting: endedMeeting});
    } catch (e: Error | any) {
        return handleControllerError(res, e);
    }
}
