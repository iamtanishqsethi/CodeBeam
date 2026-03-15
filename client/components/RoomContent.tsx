'use client';

import {RoomAudioRenderer, useRoomContext, VideoConference} from "@livekit/components-react";
import {useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import Controls from "@/components/Controls";
import {useMeetingStore} from "@/store/meetingStore";
import ParticipantsSidebar from "@/components/ParticipantsSidebar";
import ChatPanel from "@/components/ChatPanel";

export function RoomContent({handleLeave, meetingId}: { handleLeave: () => Promise<void>, meetingId: string }) {
    const isChatOpen = useMeetingStore(store => store.isChatOpen);
    const isParticipantsOpen = useMeetingStore(store => store.isParticipantsOpen);

    const room = useRoomContext();
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (room.state === 'connected') {
                setDuration((prev) => prev + 1);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [room.state]);

    if (room.state === 'connecting' || room.state === 'reconnecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground animate-pulse font-medium">
                    {room.state === 'connecting' ? 'Joining the meeting...' : 'Reconnecting...'}
                </p>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [
            hrs > 0 ? hrs : null,
            mins.toString().padStart(2, '0'),
            secs.toString().padStart(2, '0'),
        ]
            .filter((v) => v !== null)
            .join(':');
    };

    return (
        <div className="relative h-full w-full overflow-hidden flex">
            <div className="flex-1 relative">
                {/* Header Info */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-3 pointer-events-none">
                    <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>
                        <span className="text-xs font-mono font-medium">
                            {formatTime(duration)}
                        </span>
                    </div>
                    <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm text-xs font-medium">
                        {room.name || 'Room'}
                    </div>
                </div>

                {/* Main Video Grid */}
                <div className="h-full w-full">
                    <VideoConference
                        variant="grid"
                        components={{
                            ControlBar: () => null,
                        }}
                    />
                </div>

                {/* Custom Controls */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-30">
                    <div className="pointer-events-auto bg-background/90 backdrop-blur-xl p-2 rounded-2xl border shadow-2xl transition-all hover:bg-background/95">
                        <Controls meetingId={meetingId} onLeave={handleLeave}/>
                    </div>
                </div>
            </div>

            {/* Sidebars */}
            {isParticipantsOpen && <ParticipantsSidebar meetingId={meetingId}/>}
            {isChatOpen && <ChatPanel meetingId={meetingId}/>}
            
            <RoomAudioRenderer/>
        </div>
    );
}
