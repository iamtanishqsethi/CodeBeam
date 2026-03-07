'use client'

import "@livekit/components-styles";
import {useMeetingStore} from "@/store/meetingStore";
import {useRouter} from "next/navigation";
import {leaveMeeting} from "@/services/api";
import {connectSocket, disconnectSocket, socket} from "@/lib/socket";
import {LiveKitRoom, RoomAudioRenderer} from "@livekit/components-react";
import LayoutManager from "@/components/LayoutManager";
import Controls from "@/components/Controls";
import ParticipantsSidebar from "@/components/ParticipantsSidebar";
import ChatPanel from "@/components/ChatPanel";
import {toast} from "sonner";
import {useEffect} from "react";
import {useUser} from "@clerk/nextjs";

interface MeetingLayoutProps {
    meetingId: string;
}


export default function MeetingLayout({meetingId}: MeetingLayoutProps ){

    const token=useMeetingStore(store=>store.token)
    const clearToken=useMeetingStore(store=>store.clearToken)
    const isChatOpen=useMeetingStore(store=>store.isChatOpen)
    const isParticipantsOpen=useMeetingStore(store=>store.isParticipantsOpen)

    const router=useRouter()

    const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!token || !LIVEKIT_URL) {
        return (
            <div className="h-screen flex items-center justify-center text-destructive">
                Missing connection details. Please rejoin the meeting.
            </div>
        );
    }

    const handleLeave=async ()=>{
        try{
            await leaveMeeting(meetingId)
            socket.emit('leave-meeting', {meetingId})
            clearToken()
            router.push('/dashboard')
        }
        catch (e){
            console.error("Error Leaving meeting",e)
        }
    }

    useEffect(() => {
        const handleNewWaitingUser = (data: any) => {
            toast.message("New user joined the waiting room");
            console.log("new user waiting", data);
        };

        socket.on('new-waiting-user', handleNewWaitingUser);

        return () => {
            socket.off('new-waiting-user', handleNewWaitingUser);
        };
    }, []);


    return(

       <LiveKitRoom
           serverUrl={LIVEKIT_URL}
           token={token}
           video={true}
           audio={true}
           onDisconnected={handleLeave}
           className="h-screen"
           dark-lk-theme="default"
       >
           <div className={'h-full flex'}>
               <div className={'flex-1 flex flex-col'}>
                   <LayoutManager/>
                   <Controls meetingId={meetingId} onLeave={handleLeave}/>
               </div>
               {isParticipantsOpen && <ParticipantsSidebar meetingId={meetingId}/>}
               {isChatOpen && <ChatPanel meetingId={meetingId}/>}
               <RoomAudioRenderer/>
           </div>


       </LiveKitRoom>

    )

}