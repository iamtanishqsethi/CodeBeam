'use client'

import {useParticipants} from "@livekit/components-react";
import {useMeetingStore} from "@/store/meetingStore";
import {Button} from "@/components/ui/button";
import {X, Users, Mic, MicOff, Video, VideoOff, Check} from "lucide-react";
import {useEffect, useState} from "react";
import {socket} from "@/lib/socket";
import {approveParticipant, getWaitingRoom, rejectParticipant} from "@/services/api";
import {toast} from "sonner";

interface ParticipantsPanelProps {
    meetingId: string;
}

interface WaitingParticipant {
    id: string;
    user: {
        id: string;
        firstName: string;
        lastName?: string;
        imageUrl?: string;
    };
}

export default function ParticipantsSidebar({meetingId}:ParticipantsPanelProps) {
    const participants = useParticipants();
    const [waitingRoomParticipants, setWaitingRoomParticipants] = useState<WaitingParticipant[]>([]);
    const toggleParticipants = useMeetingStore(state => state.toggleParticipants);
    const isHost = useMeetingStore(state => state.isHost);

    const fetchWaitingRoom = async () => {
        try {
            const data = await getWaitingRoom(meetingId);
            setWaitingRoomParticipants(data);
        } catch (error) {
            console.error('Error fetching waiting room:', error);
        }
    };

    useEffect(() => {
        isHost && fetchWaitingRoom();

        isHost && socket.on('new-waiting-user', () => {
            fetchWaitingRoom();
        });

        return () => {
            socket.off('new-waiting-user');
        };
    }, [meetingId,isHost]);

    const handleApprove = async (participantId: string) => {
        try {
            await approveParticipant(meetingId, participantId);
            socket.emit('approve-user', {meetingId, participantId});
            toast.success("Participant approved");
            setWaitingRoomParticipants(prev => prev.filter(p => p.id !== participantId));
        } catch (error) {
            toast.error("Failed to approve participant");
        }
    };

    const handleReject = async (participantId: string) => {
        try {
            await rejectParticipant(meetingId, participantId);
            socket.emit('reject-user', {meetingId, participantId});
            toast.success("Participant rejected");
            setWaitingRoomParticipants(prev => prev.filter(p => p.id !== participantId));
        } catch (error) {
            toast.error("Failed to reject participant");
        }
    };


    return (
        <div className="w-80 border-l flex flex-col bg-background h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground"/>
                    <h3 className="font-semibold text-sm">
                        Participants ({participants.length + waitingRoomParticipants.length})
                    </h3>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleParticipants}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Waiting Room Section */}
                {waitingRoomParticipants.length > 0 && (
                    <div className="p-2 border-b bg-muted/30">
                        <div className="px-2 py-1 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Waiting Room ({waitingRoomParticipants.length})
                            </span>
                        </div>
                        {waitingRoomParticipants.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between px-2 py-2 rounded-lg"
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[10px] font-medium text-primary">
                                            {p.user.firstName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium truncate">
                                        {p.user.firstName} {p.user.lastName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => handleApprove(p.id)}
                                    >
                                        <Check className="h-4 w-4"/>
                                    </Button>
                                    <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                        onClick={() => handleReject(p.id)}
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* Active Participants List */}
                <div className="p-2">
                    {waitingRoomParticipants.length > 0 && (
                        <div className="px-2 py-1 mb-1 mt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                In Meeting ({participants.length})
                            </span>
                        </div>
                    )}
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
    </div>
    );
}
