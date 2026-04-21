"use client";

import {
    RoomAudioRenderer,
    useRoomContext,
    useTracks,
} from "@livekit/components-react";
import {MotionConfig} from "framer-motion";
import {useEffect, useMemo, useState} from "react";
import {Track, RoomEvent, type Participant} from "livekit-client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {toast} from "sonner";
import {useMeetingStore} from "@/store/meetingStore";
import {getMeetingTrackId} from "@/components/ui-meet/ParticipantTile";
import {socket} from "@/lib/socket";
import {ChatMessage} from "@/types/store.types";

import {MeetingTopBar} from "@/components/ui-meet/MeetingTopBar";
import BentoVideoGrid from "@/components/ui-meet/BentoVideoGrid";
import MeetingDock from "@/components/ui-meet/MeetingDock";
import TabbedSidebar from "@/components/ui-meet/TabbedSidebar";
import SettingsDialog from "@/components/ui-meet/SettingsDialog";
import {ReactionsOverlay, type ReactionItem} from "@/components/ui-meet/ReactionsOverlay";
import {playMeetingSound} from "@/lib/meeting-sounds";
import {Spinner} from "@/components/kibo-ui/spinner";
import {motion} from "framer-motion";

export function RoomContent({
    handleLeave,
    handleEndMeeting,
    meetingId,
}: {
    handleLeave: () => Promise<void>,
    handleEndMeeting: () => Promise<void>,
    meetingId: string
}) {
    const isHost = useMeetingStore(store => store.isHost);
    const addMessage = useMeetingStore(store => store.setChatMessages);
    const activePanel = useMeetingStore(store => store.activePanel);
    const setActivePanel = useMeetingStore(store => store.setActivePanel);
    const togglePanel = useMeetingStore(store => store.togglePanel);

    const room = useRoomContext();
    const [duration, setDuration] = useState(0);
    const [layoutMode, setLayoutMode] = useState<"grid" | "speaker">("grid");
    const [pinnedTrackId, setPinnedTrackId] = useState<string | null>(null);
    const [activeSpeakerIds, setActiveSpeakerIds] = useState<string[]>(() =>
        room.activeSpeakers.map(speaker => speaker.identity)
    );
    const [unreadCount, setUnreadCount] = useState(0);
    const [reactions, setReactions] = useState<ReactionItem[]>([]);
    const [settingsOpen, setSettingsOpen] = useState(false);

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

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            if (room.state === "connected") setDuration(p => p + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [room.state]);

    // Active speakers
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

    // Participant join/leave toasts
    useEffect(() => {
        const handleParticipant = (participant: Participant, action: "joined" | "left") => {
            const name = participant.name || participant.identity || "Guest";
            let metadata: Record<string, unknown> | null = null;
            try {
                if (participant.metadata) metadata = JSON.parse(participant.metadata);
            } catch {}

            playMeetingSound(action);

            toast(
                <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                        {typeof metadata?.imageUrl === "string" && <AvatarImage src={metadata.imageUrl} alt={name} />}
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

    // Reset unread when chat is open
    useEffect(() => {
        if (activePanel === "chat") queueMicrotask(() => setUnreadCount(0));
    }, [activePanel]);

    // Chat messages from socket
    useEffect(() => {
        const handleMessage = (message: ChatMessage) => {
            if (message.userId === socket.id) return;
            addMessage(message);
            playMeetingSound("message");
            if (activePanel !== "chat") {
                setUnreadCount(count => count + 1);
            }
        };

        socket.on("chat-message", handleMessage);
        return () => {
            socket.off("chat-message", handleMessage);
        };
    }, [addMessage, activePanel]);

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

    const visibleUnreadCount = activePanel === "chat" ? 0 : unreadCount;

    // Connecting/reconnecting state
    if (room.state === "connecting" || room.state === "reconnecting") {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4 bg-background">
                <motion.div
                    initial={{opacity: 0, scale: 0.95}}
                    animate={{opacity: 1, scale: 1}}
                    className={'flex flex-col items-center justify-center gap-4'}
                >
                    <Spinner variant={'bars'} size={40} />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-wide font-(family-name:--font-share-tech) uppercase text-white/90">
                            {room.state === "connecting" ? "Entering Room" : "Reconnecting"}
                        </h2>
                        <p className="text-muted-foreground mt-2 text-sm">
                            {room.state === "connecting" ? "Preparing your secure session..." : "Restoring your connection..."}
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <MotionConfig reducedMotion="user">
            <div className="flex h-full w-full overflow-hidden bg-background">
                <div className="relative flex min-w-0 flex-1 flex-col">
                    <MeetingTopBar
                        duration={duration}
                        roomName={room.name}
                        layoutMode={layoutMode}
                        onLayoutModeChange={setLayoutMode}
                        meetingId={meetingId}
                    />

                    <main className="relative min-h-0 flex-1 overflow-hidden p-3 pb-24 pt-16 sm:p-4 sm:pb-24 sm:pt-16">
                        <BentoVideoGrid
                            tracks={visibleTracks}
                            spotlightTrack={spotlightTrack}
                            pinnedTrackId={pinnedTrackId}
                            isHost={isHost}
                            onTogglePin={togglePin}
                        />
                    </main>

                    <ReactionsOverlay reactions={reactions} />

                    <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-4">
                        <MeetingDock
                            onLeave={handleLeave}
                            onEndMeeting={handleEndMeeting}
                            onReaction={addReaction}
                            onOpenSettings={() => setSettingsOpen(true)}
                            onTogglePanel={togglePanel}
                            activePanel={activePanel}
                            unreadCount={visibleUnreadCount}
                            layoutMode={layoutMode}
                            onLayoutModeChange={setLayoutMode}
                            isHost={isHost}
                        />
                    </div>
                </div>

                <TabbedSidebar
                    meetingId={meetingId}
                    activePanel={activePanel}
                    onClose={() => setActivePanel(null)}
                    onTabChange={(tab) => setActivePanel(tab)}
                    unreadCount={visibleUnreadCount}
                />

                <SettingsDialog
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    layoutMode={layoutMode}
                    onLayoutModeChange={setLayoutMode}
                />

                <RoomAudioRenderer />
            </div>
        </MotionConfig>
    );
}
