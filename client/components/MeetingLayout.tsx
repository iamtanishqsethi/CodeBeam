'use client'

import {useMeetingStore} from "@/store/meetingStore";
import {useRouter} from "next/navigation";
import {leaveMeeting} from "@/services/api";
import {socket} from "@/lib/socket";
import {LiveKitRoom} from "@livekit/components-react";
import {toast} from "sonner";
import {useEffect} from "react";
import {RoomContent} from "@/components/RoomContent";

interface MeetingLayoutProps {
    meetingId: string;
}


export default function MeetingLayout({meetingId}: MeetingLayoutProps ){

    const token=useMeetingStore(store=>store.token)
    const clearToken=useMeetingStore(store=>store.clearToken)
    const isHost=useMeetingStore(store=>store.isHost)
    const mediaPreferences=useMeetingStore(store=>store.mediaPreferences)

    const router=useRouter()

    const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    const handleNewWaitingUser = (data: any) => {
        if (isHost) {
            toast.message("New user joined the waiting room");
        }
        console.log("new user waiting", data);
    };

    const handleUserLeaveEvent=(data:any)=>{
        toast.message("User left the meeting");
        console.log("user left",data)
    }

    useEffect(() => {
        socket.on('new-waiting-user', handleNewWaitingUser);
        socket.on('user-left',handleUserLeaveEvent)

        return () => {
            socket.off('new-waiting-user', handleNewWaitingUser);
            socket.off('user-left',handleUserLeaveEvent)
        };
    }, [isHost, token]);

    const handleLeave=async ()=>{
        try{
            await leaveMeeting(meetingId)
            socket.emit('leave-meeting', {meetingId})
            clearToken()
            router.push('/')
        }
        catch (e){
            console.error("Error Leaving meeting",e)
        }
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
                dark-lk-theme="default"
            >
                <RoomContent handleLeave={handleLeave} meetingId={meetingId}/>

            </LiveKitRoom>
        </div>


    )

}
