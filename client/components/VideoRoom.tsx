'use client'

import {
    LiveKitRoom,
    RoomAudioRenderer,
    VideoConference,
    useRoomContext,
    ControlBar
} from "@livekit/components-react";
import "@livekit/components-styles";
import {useEffect, useState} from "react";
import {Loader2} from "lucide-react";



interface VideoRoomProps {
    token: string;
    onLeave: () => void;
}

export default function VideoRoom({ token, onLeave }: VideoRoomProps) {
    const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!LIVEKIT_URL) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-destructive font-medium">
                LiveKit URL is not defined. Please check your environment variables.
            </div>
        )
    }

    return (
        <div className="h-screen w-full bg-background overflow-hidden">
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={LIVEKIT_URL}
                onDisconnected={onLeave}
                className="h-full flex flex-col"
                data-lk-theme="default"
            >
                <RoomContent onLeave={onLeave} />
            </LiveKitRoom>
        </div>
    );
}

function RoomContent({ onLeave }: { onLeave: () => void }) {
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
        <>
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3 pointer-events-none">
                <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono font-medium">
                        {formatTime(duration)}
                    </span>
                </div>
                <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm text-xs font-medium">
                    {room.name || 'Room'}
                </div>
            </div>

            <VideoConference
                variant="grid"
                ControlBar={(props) => (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="pointer-events-auto bg-background/90 backdrop-blur-xl p-2 rounded-2xl border shadow-2xl scale-110 transition-transform hover:scale-115">
                            <ControlBar {...props} />
                        </div>
                    </div>
                )}
            />
            <RoomAudioRenderer />
        </>
    );
}
