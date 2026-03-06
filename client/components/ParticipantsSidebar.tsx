'use client'

import {useParticipants} from "@livekit/components-react";
import {useMeetingStore} from "@/store/meetingStore";
import {Button} from "@/components/ui/button";
import {X, Users, Mic, MicOff, Video, VideoOff} from "lucide-react";


export default function ParticipantsSidebar() {
    const participants = useParticipants();
    const toggleParticipants = useMeetingStore(state => state.toggleParticipants);

    return (
        <div className="w-72 border-l flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4"/>
                    <h3 className="font-semibold text-sm">
                        Participants ({participants.length})
                    </h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleParticipants}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>

            {/* Participants list */}
            <div className="flex-1 overflow-y-auto p-2">
                {participants.map(p => {
                    const isMicOn = p.isMicrophoneEnabled;
                    const isCamOn = p.isCameraEnabled;

                    return (
                        <div
                            key={p.identity}
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary">
                                        {(p.name || p.identity || '?').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                        {p.name || p.identity}
                                    </span>
                                    {p.isLocal && (
                                        <span className="text-xs text-muted-foreground">(You)</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                {isMicOn ? (
                                    <Mic className="h-3.5 w-3.5 text-muted-foreground"/>
                                ) : (
                                    <MicOff className="h-3.5 w-3.5 text-destructive"/>
                                )}
                                {isCamOn ? (
                                    <Video className="h-3.5 w-3.5 text-muted-foreground"/>
                                ) : (
                                    <VideoOff className="h-3.5 w-3.5 text-destructive"/>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}