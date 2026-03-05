import { Router } from "express";
import * as meetingController from "../controllers/meeting.controller.js";
import {requireAuth} from "@clerk/express";

export const router = Router();

router.post('/',requireAuth(),meetingController.createMeeting)

router.post('/:meetingId/join',requireAuth(),meetingController.joinMeeting)

router.get('/:meetingId/waiting',requireAuth(),meetingController.getWaitingRoom)

router.post('/:meetingId/approve',requireAuth(),meetingController.approveParticipants)

router.post('/:meetingId/reject',requireAuth(),meetingController.rejectParticipants)

router.post('/:meetingId/token',requireAuth(),meetingController.getLiveKitToken)

router.post('/:meetingId/leave',requireAuth(),meetingController.leaveMeeting)

router.get('/:meetingId/participants',requireAuth(),meetingController.getParticipants)



export default router;