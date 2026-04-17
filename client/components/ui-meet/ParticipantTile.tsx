"use client";

import type {ParticipantTileProps} from "@livekit/components-react";
import {VideoTrack} from "@livekit/components-react";
import {ConnectionQuality, Track} from "livekit-client";
import {motion} from "framer-motion";
import {Maximize2, MicOff, Pin, PinOff, ScreenShare} from "lucide-react";
import {useMemo, useRef} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";

type TrackRef = NonNullable<ParticipantTileProps["trackRef"]>;

interface ParticipantTileProps2 {
    trackRef: TrackRef;
    isPinned?: boolean;
    isHost?: boolean;
    onTogglePin?: (trackId: string) => void;
    className?: string;
}

export function getMeetingTrackId(trackRef: TrackRef) {
    const publicationId = trackRef.publication?.trackSid ?? "placeholder";
    return `${trackRef.participant.identity}-${trackRef.source}-${publicationId}`;
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
    return initials.toUpperCase();
}

function getQualityDots(quality: ConnectionQuality | undefined) {
    if (quality === ConnectionQuality.Excellent) return 3;
    if (quality === ConnectionQuality.Good) return 2;
    if (quality === ConnectionQuality.Poor) return 1;
    return 0;
}

function getQualityClass(quality: ConnectionQuality | undefined) {
    if (quality === ConnectionQuality.Excellent || quality === ConnectionQuality.Good) {
        return "bg-[var(--quality-good)]";
    }
    if (quality === ConnectionQuality.Poor) return "bg-[var(--quality-warn)]";
    return "bg-[var(--quality-poor)]";
}

function TileActionButton({
    label,
    disabled,
    onClick,
    children,
}: {
    label: string;
    disabled?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label={label}
                    disabled={disabled}
                    onClick={(event) => {
                        event.stopPropagation();
                        onClick?.();
                    }}
                    className="size-8 rounded-lg border border-white/10 bg-background/60 backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

export default function ParticipantTile({
    trackRef,
    isPinned = false,
    isHost = false,
    onTogglePin,
    className,
}: ParticipantTileProps2) {
    const tileRef = useRef<HTMLDivElement>(null);
    const participant = trackRef.participant;
    const trackId = useMemo(() => getMeetingTrackId(trackRef), [trackRef]);
    const displayName = participant.name || participant.identity || "Guest";
    const metadata = useMemo(() => {
        try {
            return participant.metadata ? JSON.parse(participant.metadata) : null;
        } catch {
            return null;
        }
    }, [participant.metadata]);
    const qualityDots = getQualityDots(participant.connectionQuality);
    const hasPlayableVideo = Boolean(trackRef.publication?.track && !trackRef.publication.isMuted);
    const isScreenShare = trackRef.source === Track.Source.ScreenShare;
    const isCameraOff = trackRef.source === Track.Source.Camera && (!participant.isCameraEnabled || !hasPlayableVideo);
    const isMuted = !participant.isMicrophoneEnabled;

    const togglePin = () => onTogglePin?.(trackId);
    const requestFullscreen = () => tileRef.current?.requestFullscreen?.();

    return (
        <motion.div
            ref={tileRef}
            layout
            layoutId={trackId}
            initial={{opacity: 0, scale: 0.85}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0.92}}
            transition={{type: "spring", stiffness: 260, damping: 24, duration: 0.25}}
            onDoubleClick={togglePin}
            className={cn(
                "group relative flex size-full min-h-40 overflow-hidden rounded-xl border border-white/[0.08] bg-tile text-primary-foreground shadow-lg outline-none transition-all duration-200",
                "hover:border-white/[0.15] hover:shadow-xl",
                "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                participant.isSpeaking && "speaking-ring border-speaking-ring",
                className
            )}
            tabIndex={0}
            aria-label={`${displayName}${isMuted ? ", muted" : ""}`}
        >
            {/* Video or avatar */}
            {hasPlayableVideo ? (
                <VideoTrack
                    trackRef={trackRef as Exclude<TrackRef, {publication?: never}>}
                    className={cn("size-full object-cover", isCameraOff && "blur-sm")}
                />
            ) : (
                <div className="relative flex size-full items-center justify-center overflow-hidden bg-tile">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent_40%),radial-gradient(circle_at_70%_70%,color-mix(in_oklch,var(--accent)_15%,transparent),transparent_45%)]" />
                    <Avatar className="size-24 border-2 border-white/10 bg-background/12 backdrop-blur">
                        {metadata?.imageUrl && <AvatarImage src={metadata.imageUrl} alt={displayName} />}
                        <AvatarFallback className="bg-transparent text-2xl font-semibold text-primary-foreground">
                            {getInitials(displayName)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}

            {/* Bottom gradient scrim */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Bottom-left: name + mute indicator */}
            <div className="absolute left-3 bottom-3 flex max-w-[calc(100%-6rem)] items-center gap-2">
                {isMuted && (
                    <span className="flex size-7 items-center justify-center rounded-full bg-red-500/80 text-white backdrop-blur">
                        <MicOff aria-label="Muted" />
                    </span>
                )}
                <div className="min-w-0 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-lg">
                    <span className="block truncate">
                        {participant.isLocal ? `${displayName} (You)` : displayName}
                    </span>
                </div>
            </div>

            {/* Top-right: badges + quality */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
                {isScreenShare && (
                    <Badge variant="secondary" className="border border-white/10 bg-background/60 backdrop-blur-xl">
                        <ScreenShare />
                        Screen
                    </Badge>
                )}
                {isPinned && (
                    <Badge className="bg-primary/90 backdrop-blur">
                        <Pin />
                        Pinned
                    </Badge>
                )}
                <div
                    className="flex items-end gap-0.5 rounded-full bg-black/50 px-2 py-1 backdrop-blur-lg"
                    aria-label={`Network quality ${participant.connectionQuality ?? "unknown"}`}
                >
                    {[0, 1, 2].map((dot) => (
                        <span
                            key={dot}
                            className={cn(
                                "block w-1.5 rounded-full transition-colors",
                                dot === 0 && "h-2",
                                dot === 1 && "h-3",
                                dot === 2 && "h-4",
                                dot < qualityDots ? getQualityClass(participant.connectionQuality) : "bg-white/30"
                            )}
                        />
                    ))}
                </div>
            </div>

            {/* Top-left: hover controls */}
            <div className="absolute top-3 left-3 flex translate-y-1 items-center gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <TileActionButton label={isPinned ? "Unpin participant" : "Pin participant"} onClick={togglePin}>
                    {isPinned ? <PinOff data-icon="inline-start" /> : <Pin data-icon="inline-start" />}
                </TileActionButton>
                <TileActionButton label="Fullscreen tile" onClick={requestFullscreen}>
                    <Maximize2 data-icon="inline-start" />
                </TileActionButton>
                {isHost && !participant.isLocal && (
                    <TileActionButton label="Host mute requires moderator access" disabled>
                        <MicOff data-icon="inline-start" />
                    </TileActionButton>
                )}
            </div>
        </motion.div>
    );
}
