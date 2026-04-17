'use client'

import {useMeetingStore} from "@/store/meetingStore";
import {useRouter} from "next/navigation";
import {endMeeting, leaveMeeting} from "@/services/api";
import {socket} from "@/lib/socket";
import {LiveKitRoom} from "@livekit/components-react";
import {toast} from "sonner";
import {useEffect, useRef, useState} from "react";
import {RoomContent} from "@/components/RoomContent";

interface MeetingLayoutProps {
    meetingId: string;
}


export default function MeetingLayout({meetingId}: MeetingLayoutProps ){

    const token=useMeetingStore(store=>store.token)
    const clearToken=useMeetingStore(store=>store.clearToken)
    const isHost=useMeetingStore(store=>store.isHost)
    const setHost = useMeetingStore(store => store.setHost)
    const mediaPreferences=useMeetingStore(store=>store.mediaPreferences)

    const router=useRouter()
    const isLeavingRef = useRef(false)
    const [meetingEnded, setMeetingEnded] = useState(false)

    const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    useEffect(() => {
        const handleNewWaitingUser = (data: unknown) => {
            if (isHost) {
                toast.message("New user joined the waiting room");
            }
            console.log("new user waiting", data);
        };

        const handleUserLeaveEvent=(data: unknown)=>{
            toast.message("User left the meeting");
            console.log("user left",data)
        }

        const handleMeetingEnded = () => {
            clearToken()
            setHost(false)
            setMeetingEnded(true)
            toast.message("This meeting has ended")
        }

        socket.on('new-waiting-user', handleNewWaitingUser);
        socket.on('user-left',handleUserLeaveEvent)
        socket.on('meeting-ended', handleMeetingEnded)

        return () => {
            socket.off('new-waiting-user', handleNewWaitingUser);
            socket.off('user-left',handleUserLeaveEvent)
            socket.off('meeting-ended', handleMeetingEnded)
        };
    }, [clearToken, isHost, setHost, token]);

    const handleLeave=async ()=>{
        if (isLeavingRef.current) {
            return
        }

        isLeavingRef.current = true

        try{
            const response = await leaveMeeting(meetingId)
            socket.emit('leave-meeting', {meetingId, meetingEnded: Boolean(response?.meetingEnded)})
            clearToken()
            setHost(false)
            router.push('/')
        }
        catch (e){
            console.error("Error Leaving meeting",e)
            isLeavingRef.current = false
        }
    }

    const handleEndMeeting = async () => {
        if (isLeavingRef.current) {
            return
        }

        isLeavingRef.current = true

        try {
            await endMeeting(meetingId)
            socket.emit('meeting-ended', {meetingId})
            clearToken()
            setHost(false)
            setMeetingEnded(true)
        } catch (e) {
            console.error("Error ending meeting", e)
            isLeavingRef.current = false
        }
    }

    if (meetingEnded) {
        return (
            <div className="h-full flex items-center justify-center text-destructive px-6 text-center">
                This meeting has already ended.
            </div>
        );
    }

    if (!token || !LIVEKIT_URL) {
        return (
            <div className="h-full flex items-center justify-center text-destructive">
                Missing connection details. Please rejoin the meeting.
            </div>
        );
    }

    const videoInput = mediaPreferences.videoEnabled
        ? (mediaPreferences.videoDeviceId ? {deviceId: mediaPreferences.videoDeviceId} : true)
        : false

    const audioInput = mediaPreferences.audioEnabled
        ? (mediaPreferences.audioDeviceId ? {deviceId: mediaPreferences.audioDeviceId} : true)
        : false


    return(

        <div className={'flex flex-col w-full h-screen overflow-hidden'}>
            <LiveKitRoom
                serverUrl={LIVEKIT_URL}
                token={token}
                video={videoInput}
                audio={audioInput}
                onDisconnected={handleLeave}
                className="flex flex-col h-full w-full"
                data-lk-theme="default"
            >
                <RoomContent handleLeave={handleLeave} handleEndMeeting={handleEndMeeting} meetingId={meetingId}/>

            </LiveKitRoom>
        </div>


    )

}
