"use client";

import {useParticipants} from "@livekit/components-react";
import {useMeetingStore} from "@/store/meetingStore";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Check, Crown, Hand, Mic, MicOff, Search, Users, Video, VideoOff, X} from "lucide-react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {socket} from "@/lib/socket";
import {approveParticipant, getWaitingRoom, rejectParticipant} from "@/services/api";
import {toast} from "sonner";
import {cn} from "@/lib/utils";

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

function initials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2)).toUpperCase();
}

export default function ParticipantsSidebar({meetingId}: ParticipantsPanelProps) {
    const participants = useParticipants();
    const [waitingRoomParticipants, setWaitingRoomParticipants] = useState<WaitingParticipant[]>([]);
    const [query, setQuery] = useState("");
    const toggleParticipants = useMeetingStore(state => state.toggleParticipants);
    const isHost = useMeetingStore(state => state.isHost);

    const fetchWaitingRoom = useCallback(async () => {
        try {
            const data = await getWaitingRoom(meetingId);
            setWaitingRoomParticipants(data);
        } catch (error) {
            console.error("Error fetching waiting room:", error);
        }
    }, [meetingId]);

    useEffect(() => {
        if (!isHost) return;
        queueMicrotask(() => void fetchWaitingRoom());

        const handleWaitingUser = () => {
            void fetchWaitingRoom();
        };

        socket.on("new-waiting-user", handleWaitingUser);
        return () => {
            socket.off("new-waiting-user", handleWaitingUser);
        };
    }, [fetchWaitingRoom, isHost]);

    const handleApprove = async (participantId: string) => {
        try {
            await approveParticipant(meetingId, participantId);
            socket.emit("approve-user", {meetingId, participantId});
            toast.success("Participant approved");
            setWaitingRoomParticipants(prev => prev.filter(p => p.id !== participantId));
        } catch (error) {
            console.error(error);
            toast.error("Failed to approve participant");
        }
    };

    const handleReject = async (participantId: string) => {
        try {
            await rejectParticipant(meetingId, participantId);
            socket.emit("reject-user", {meetingId, participantId});
            toast.success("Participant rejected");
            setWaitingRoomParticipants(prev => prev.filter(p => p.id !== participantId));
        } catch (error) {
            console.error(error);
            toast.error("Failed to reject participant");
        }
    };

    const filteredParticipants = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return participants;
        return participants.filter(p => (p.name || p.identity).toLowerCase().includes(q));
    }, [participants, query]);

    const filteredWaiting = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return waitingRoomParticipants;
        return waitingRoomParticipants.filter(p =>
            `${p.user.firstName} ${p.user.lastName ?? ""}`.toLowerCase().includes(q)
        );
    }, [waitingRoomParticipants, query]);

    return (
        <section className="flex h-full w-full flex-col bg-background">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <Users />
                    <h3 className="text-sm font-semibold">
                        Participants
                    </h3>
                    <Badge variant="secondary">{participants.length + waitingRoomParticipants.length}</Badge>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Close participants"
                    className="size-8 rounded-soft transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
                    onClick={toggleParticipants}
                >
                    <X data-icon="inline-start" />
                </Button>
            </div>

            <div className="border-b p-3">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search people"
                        aria-label="Search participants"
                        className="h-10 rounded-soft pl-9"
                    />
                </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="flex flex-col gap-4 p-3">
                    {isHost && filteredWaiting.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-semibold uppercase text-muted-foreground">
                                    Waiting room
                                </span>
                                <Badge variant="outline">{filteredWaiting.length}</Badge>
                            </div>
                            <div className="flex flex-col gap-1">
                                {filteredWaiting.map((p) => {
                                    const name = `${p.user.firstName} ${p.user.lastName ?? ""}`.trim();

                                    return (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <Avatar className="size-9">
                                                    {p.user.imageUrl && <AvatarImage src={p.user.imageUrl} alt="" />}
                                                    <AvatarFallback>{initials(name)}</AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">{name}</p>
                                                    <p className="text-xs text-muted-foreground">Needs approval</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    aria-label={`Approve ${name}`}
                                                    className="size-8 rounded-soft text-[var(--quality-good)] hover:bg-primary/10"
                                                    onClick={() => handleApprove(p.id)}
                                                >
                                                    <Check data-icon="inline-start" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    aria-label={`Reject ${name}`}
                                                    className="size-8 rounded-soft text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleReject(p.id)}
                                                >
                                                    <X data-icon="inline-start" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-semibold uppercase text-muted-foreground">
                                In meeting
                            </span>
                            <Badge variant="outline">{filteredParticipants.length}</Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                            {filteredParticipants.map(p => {
                                const name = p.name || p.identity || "Guest";
                                let metadata: Record<string, any> | null = null;
                                try {
                                    if (p.metadata) metadata = JSON.parse(p.metadata);
                                } catch {}
                                const isMicOn = p.isMicrophoneEnabled;
                                const isCamOn = p.isCameraEnabled;
                                const raisedHand = p.metadata?.toLowerCase().includes("hand");
                                const showHost = isHost && p.isLocal;

                                return (
                                    <div
                                        key={p.identity}
                                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="size-9">
                                                    {metadata?.imageUrl && <AvatarImage src={metadata.imageUrl} alt={name} />}
                                                    <AvatarFallback>{initials(name)}</AvatarFallback>
                                                </Avatar>
                                                <span
                                                    className={cn(
                                                        "absolute right-0 bottom-0 size-2.5 rounded-pill ring-2 ring-background",
                                                        p.isSpeaking ? "bg-[var(--quality-good)]" : "bg-muted-foreground/50"
                                                    )}
                                                    aria-label={p.isSpeaking ? "Speaking" : "Not speaking"}
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex min-w-0 items-center gap-1.5">
                                                    <p className="truncate text-sm font-medium">
                                                        {p.isLocal ? `${name} (You)` : name}
                                                    </p>
                                                    {showHost && (
                                                        <Badge variant="secondary" className="gap-1">
                                                            <Crown />
                                                            Host
                                                        </Badge>
                                                    )}
                                                    {raisedHand && <Hand className="raised-hand text-primary" aria-label="Raised hand" />}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {p.isSpeaking ? "Speaking" : p.connectionQuality}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-1 text-muted-foreground">
                                            {isMicOn ? <Mic aria-label="Microphone on" /> : <MicOff className="text-destructive" aria-label="Muted" />}
                                            {isCamOn ? <Video aria-label="Camera on" /> : <VideoOff className="text-destructive" aria-label="Camera off" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </section>
    );
}
