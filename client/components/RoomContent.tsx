"use client";

import {
    RoomAudioRenderer,
    useRoomContext,
    useTracks,
} from "@livekit/components-react";
import {AnimatePresence, motion, MotionConfig} from "framer-motion";
import {ChevronLeft, ChevronRight, Grid2X2, Radio} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {Track, RoomEvent, type Participant} from "livekit-client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {toast} from "sonner";
import {useMeetingStore} from "@/store/meetingStore";
import ParticipantsSidebar from "@/components/ParticipantsSidebar";
import ChatPanel from "@/components/ChatPanel";
import Controls from "@/components/Controls";
import MeetingParticipantTile, {getMeetingTrackId} from "@/components/MeetingParticipantTile";
import {getFormatedTime} from "@/utils/getFormatedTime";
import {socket} from "@/lib/socket";
import {ChatMessage} from "@/types/store.types";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";

function formatRoomName(name: string): string {
    if (!name) return "Room";
    if (/^[0-9a-f]{8}-/i.test(name)) return name.split("-")[0].toUpperCase();
    return name;
}

function getGridClass(count: number) {
    if (count <= 1) return "grid-cols-1 place-items-center [&>*]:w-full [&>*]:max-w-[640px]";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 9) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
}

interface ReactionItem {
    id: string;
    emoji: string;
    x: number;
}

function ReactionsOverlay({reactions}: {reactions: ReactionItem[]}) {
    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center overflow-visible">
            <AnimatePresence>
                {reactions.map((reaction) => (
                    <motion.div
                        key={reaction.id}
                        initial={{opacity: 0, y: 0, x: 0, scale: 0.7}}
                        animate={{opacity: [0, 1, 1, 0], y: -170, x: reaction.x, scale: [0.7, 1.1, 1]}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.8, ease: "easeOut"}}
                        className="absolute rounded-pill bg-background/72 px-3 py-2 text-3xl shadow-lg backdrop-blur"
                    >
                        {reaction.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export function RoomContent({
    handleLeave,
    handleEndMeeting,
    meetingId,
}: {
    handleLeave: () => Promise<void>,
    handleEndMeeting: () => Promise<void>,
    meetingId: string
}) {
    const isChatOpen = useMeetingStore(store => store.isChatOpen);
    const isParticipantsOpen = useMeetingStore(store => store.isParticipantsOpen);
    const toggleChat = useMeetingStore(store => store.toggleChat);
    const toggleParticipants = useMeetingStore(store => store.toggleParticipants);
    const isHost = useMeetingStore(store => store.isHost);
    const addMessage = useMeetingStore(store => store.setChatMessages);

    const room = useRoomContext();
    const [duration, setDuration] = useState(0);
    const [layoutMode, setLayoutMode] = useState<"grid" | "speaker">("grid");
    const [pinnedTrackId, setPinnedTrackId] = useState<string | null>(null);
    const [activeSpeakerIds, setActiveSpeakerIds] = useState<string[]>(() =>
        room.activeSpeakers.map(speaker => speaker.identity)
    );
    const [unreadCount, setUnreadCount] = useState(0);
    const [reactions, setReactions] = useState<ReactionItem[]>([]);
    const [isMobilePanel, setIsMobilePanel] = useState(false);
    const [gridPage, setGridPage] = useState(0);

    const tracks = useTracks(
        [
            {source: Track.Source.Camera, withPlaceholder: true},
            {source: Track.Source.ScreenShare, withPlaceholder: false},
        ],
        {onlySubscribed: false}
    );

    const visibleTracks = useMemo(() =>
            tracks.filter(t =>
                t.source === Track.Source.ScreenShare ||
                t.source === Track.Source.Camera
            ),
        [tracks]
    );

    const screenShareTrack = useMemo(() =>
            visibleTracks.find(t => t.source === Track.Source.ScreenShare),
        [visibleTracks]
    );

    const pinnedTrack = useMemo(() =>
            pinnedTrackId ? visibleTracks.find(t => getMeetingTrackId(t) === pinnedTrackId) : undefined,
        [pinnedTrackId, visibleTracks]
    );

    const speakerTrack = useMemo(() =>
            visibleTracks.find(t =>
                t.source === Track.Source.Camera &&
                activeSpeakerIds.includes(t.participant.identity)
            ),
        [activeSpeakerIds, visibleTracks]
    );

    const spotlightTrack = screenShareTrack ?? pinnedTrack ?? (layoutMode === "speaker" ? speakerTrack : undefined);
    const roomDisplayName = formatRoomName(room.name);
    const sidePanelOpen = isChatOpen || isParticipantsOpen;
    const panelTitle = isParticipantsOpen ? "Participants" : "Chat";
    const gridTracks = spotlightTrack ? visibleTracks.filter(t => getMeetingTrackId(t) !== getMeetingTrackId(spotlightTrack)) : visibleTracks;
    const pageSize = gridTracks.length >= 10 ? 12 : gridTracks.length || 1;
    const pageCount = Math.max(1, Math.ceil(gridTracks.length / pageSize));
    const safeGridPage = Math.min(gridPage, pageCount - 1);
    const pagedGridTracks = gridTracks.slice(safeGridPage * pageSize, safeGridPage * pageSize + pageSize);
    const visibleUnreadCount = isChatOpen ? 0 : unreadCount;

    useEffect(() => {
        const interval = setInterval(() => {
            if (room.state === "connected") setDuration(p => p + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [room.state]);

    useEffect(() => {
        const updateSpeakers = (speakers: Participant[]) => {
            setActiveSpeakerIds(speakers.map(speaker => speaker.identity));
        };

        queueMicrotask(() => updateSpeakers(room.activeSpeakers));
        room.on(RoomEvent.ActiveSpeakersChanged, updateSpeakers);
        return () => {
            room.off(RoomEvent.ActiveSpeakersChanged, updateSpeakers);
        };
    }, [room]);

    useEffect(() => {
        const handleParticipant = (participant: Participant, action: "joined" | "left") => {
            const name = participant.name || participant.identity || "Guest";
            let metadata: Record<string, any> | null = null;
            try {
                if (participant.metadata) metadata = JSON.parse(participant.metadata);
            } catch {}

            toast(
                <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                        {metadata?.imageUrl && <AvatarImage src={metadata.imageUrl} alt={name} />}
                        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{name} {action} the meeting</span>
                </div>
            );
        };

        const onConnected = (participant: Participant) => handleParticipant(participant, "joined");
        const onDisconnected = (participant: Participant) => handleParticipant(participant, "left");

        room.on(RoomEvent.ParticipantConnected, onConnected);
        room.on(RoomEvent.ParticipantDisconnected, onDisconnected);
        return () => {
            room.off(RoomEvent.ParticipantConnected, onConnected);
            room.off(RoomEvent.ParticipantDisconnected, onDisconnected);
        };
    }, [room]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const update = () => setIsMobilePanel(mediaQuery.matches);
        update();
        mediaQuery.addEventListener("change", update);
        return () => mediaQuery.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (isChatOpen) queueMicrotask(() => setUnreadCount(0));
    }, [isChatOpen]);

    useEffect(() => {
        const handleMessage = (message: ChatMessage) => {
            if (message.userId === socket.id) return;
            addMessage(message);
            if (!isChatOpen) {
                setUnreadCount(count => count + 1);
            }
        };

        socket.on("chat-message", handleMessage);
        return () => {
            socket.off("chat-message", handleMessage);
        };
    }, [addMessage, isChatOpen]);

    const togglePin = (trackId: string) => {
        setPinnedTrackId(current => current === trackId ? null : trackId);
    };

    const addReaction = (emoji: string) => {
        const id = `${emoji}-${Date.now()}-${Math.random()}`;
        const reaction = {
            id,
            emoji,
            x: Math.round((Math.random() - 0.5) * 180),
        };

        setReactions(current => [...current, reaction]);
        window.setTimeout(() => {
            setReactions(current => current.filter(item => item.id !== id));
        }, 820);
    };

    const closeMobilePanel = (open: boolean) => {
        if (open) return;
        if (isChatOpen) toggleChat();
        if (isParticipantsOpen) toggleParticipants();
    };

    const sidePanel = isParticipantsOpen ? (
        <ParticipantsSidebar meetingId={meetingId} />
    ) : (
        <ChatPanel meetingId={meetingId} />
    );

    if (room.state === "connecting" || room.state === "reconnecting") {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
                <div className="size-8 animate-spin rounded-pill border-2 border-primary border-t-transparent" />
                <p className="animate-pulse font-medium text-muted-foreground">
                    {room.state === "connecting" ? "Joining the meeting..." : "Reconnecting..."}
                </p>
            </div>
        );
    }

    return (
        <MotionConfig reducedMotion="user">
            <div className="flex h-full w-full overflow-hidden bg-background">
                <div className="relative flex min-w-0 flex-1 flex-col">
                    <main className="relative min-h-0 flex-1 overflow-hidden p-3 pb-28 md:pb-24">
                        {spotlightTrack ? (
                            <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[minmax(0,0.7fr)_minmax(16rem,0.3fr)]">
                                <MeetingParticipantTile
                                    trackRef={spotlightTrack}
                                    isPinned={pinnedTrackId === getMeetingTrackId(spotlightTrack)}
                                    isHost={isHost}
                                    onTogglePin={togglePin}
                                    className="min-h-[22rem]"
                                />
                                <div className="grid min-h-0 grid-cols-2 gap-2 overflow-y-auto pr-1 lg:grid-cols-1">
                                    {gridTracks.map(trackRef => {
                                        const trackId = getMeetingTrackId(trackRef);

                                        return (
                                            <MeetingParticipantTile
                                                key={trackId}
                                                trackRef={trackRef}
                                                isPinned={pinnedTrackId === trackId}
                                                isHost={isHost}
                                                onTogglePin={togglePin}
                                                className="min-h-32"
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className={cn("grid h-full min-h-0 gap-3 auto-rows-fr", getGridClass(pagedGridTracks.length))}>
                                {pagedGridTracks.map(trackRef => {
                                    const trackId = getMeetingTrackId(trackRef);

                                    return (
                                        <MeetingParticipantTile
                                            key={trackId}
                                            trackRef={trackRef}
                                            isPinned={pinnedTrackId === trackId}
                                            isHost={isHost}
                                            onTogglePin={togglePin}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {pageCount > 1 && !spotlightTrack && (
                            <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-pill border bg-background/82 px-2 py-1 shadow-sm backdrop-blur">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Previous participant page"
                                    disabled={safeGridPage === 0}
                                    className="size-8 rounded-pill"
                                    onClick={() => setGridPage(page => Math.max(0, page - 1))}
                                >
                                    <ChevronLeft data-icon="inline-start" />
                                </Button>
                                <span className="text-xs font-medium text-muted-foreground">
                                    {safeGridPage + 1} / {pageCount}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Next participant page"
                                    disabled={safeGridPage >= pageCount - 1}
                                    className="size-8 rounded-pill"
                                    onClick={() => setGridPage(page => Math.min(pageCount - 1, page + 1))}
                                >
                                    <ChevronRight data-icon="inline-start" />
                                </Button>
                            </div>
                        )}

                        <div className="pointer-events-none absolute top-5 left-5 z-20 flex max-w-[calc(100%-2.5rem)] flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="gap-2 bg-background/82 px-3 py-1.5 font-mono shadow-sm backdrop-blur">
                                <Radio />
                                {getFormatedTime(duration)}
                            </Badge>
                            <Badge variant="secondary" className="max-w-48 bg-background/82 px-3 py-1.5 shadow-sm backdrop-blur" title={room.name}>
                                <span className="truncate">{roomDisplayName}</span>
                            </Badge>
                            <Badge variant="outline" className="bg-background/82 px-3 py-1.5 shadow-sm backdrop-blur">
                                <Grid2X2 />
                                {layoutMode === "speaker" ? "Speaker" : "Grid"}
                            </Badge>
                        </div>

                        <ReactionsOverlay reactions={reactions} />
                    </main>

                    <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-4">
                        <Controls
                            onLeave={handleLeave}
                            onEndMeeting={handleEndMeeting}
                            onReaction={addReaction}
                            unreadCount={visibleUnreadCount}
                            layoutMode={layoutMode}
                            onLayoutModeChange={setLayoutMode}
                        />
                    </div>
                </div>

                {!isMobilePanel && (
                    <AnimatePresence>
                        {sidePanelOpen && (
                            <motion.aside
                                initial={{x: 360, opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                exit={{x: 360, opacity: 0}}
                                transition={{duration: 0.3, ease: "easeOut"}}
                                className="hidden w-[22rem] shrink-0 border-l bg-background md:flex"
                            >
                                {sidePanel}
                            </motion.aside>
                        )}
                    </AnimatePresence>
                )}

                {isMobilePanel && (
                    <Sheet open={sidePanelOpen} onOpenChange={closeMobilePanel}>
                        <SheetContent side="right" showCloseButton={false} className="w-full p-0 sm:max-w-none">
                            <SheetTitle className="sr-only">{panelTitle}</SheetTitle>
                            <SheetDescription className="sr-only">
                                Meeting side panel
                            </SheetDescription>
                            {sidePanel}
                        </SheetContent>
                    </Sheet>
                )}

                <RoomAudioRenderer />
            </div>
        </MotionConfig>
    );
}
