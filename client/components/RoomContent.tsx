'use client';

import {
    RoomAudioRenderer,
    useRoomContext,
    GridLayout,
    FocusLayout,
    CarouselLayout,
    ParticipantTile,
    useTracks,
} from "@livekit/components-react";
import {useEffect, useMemo, useRef, useState} from "react";
import {Loader2} from "lucide-react";
import {useMeetingStore} from "@/store/meetingStore";
import ParticipantsSidebar from "@/components/ParticipantsSidebar";
import ChatPanel from "@/components/ChatPanel";
import {Track} from "livekit-client";
import Controls from "@/components/Controls";
import {getFormatedTime} from "@/utils/getFormatedTime";

function formatRoomName(name: string): string {
    if (!name) return 'Room';
    if (/^[0-9a-f]{8}-/i.test(name)) return name.split('-')[0].toUpperCase();
    return name;
}

export function RoomContent({handleLeave, meetingId}: { handleLeave: () => Promise<void>, meetingId: string }) {
    const isChatOpen = useMeetingStore(store => store.isChatOpen);
    const isParticipantsOpen = useMeetingStore(store => store.isParticipantsOpen);

    const room = useRoomContext();
    const [duration, setDuration] = useState(0);

    // Measure the video container so we can pass an explicit pixel height into LiveKit.
    // LiveKit's GridLayout ignores percentage heights — it sizes itself from tile aspect
    // ratios and leaves a dark gap below. Feeding it an exact pixel value fixes this.
    const videoAreaRef = useRef<HTMLDivElement>(null);
    const [videoAreaHeight, setVideoAreaHeight] = useState(0);

    useEffect(() => {
        const el = videoAreaRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setVideoAreaHeight(entry.contentRect.height);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const tracks = useTracks(
        [
            {source: Track.Source.Camera, withPlaceholder: true},
            {source: Track.Source.ScreenShare, withPlaceholder: false},
        ],
        {onlySubscribed: false}
    );

    // Keep camera placeholders so audio-only / camera-off participants still render a tile.
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

    const roomDisplayName = formatRoomName(room.name);

    useEffect(() => {
        const interval = setInterval(() => {
            if (room.state === 'connected') setDuration(p => p + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [room.state]);

    if (room.state === 'connecting' || room.state === 'reconnecting') {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground animate-pulse font-medium">
                    {room.state === 'connecting' ? 'Joining the meeting...' : 'Reconnecting...'}
                </p>
            </div>
        );
    }

    // Padding inside the video area is 12px (p-3 = 0.75rem). Subtract it from measured height.
    const PADDING = 24; // 12px top + 12px bottom
    const gridHeight = videoAreaHeight > 0 ? videoAreaHeight - PADDING : undefined;

    return (
        <div className="flex h-full w-full overflow-hidden bg-background">
            <div className="flex-1 flex flex-col min-w-0 relative">

                {/* VIDEO AREA — flex-1 + min-h-0 correctly shares space in the flex column */}
                <div ref={videoAreaRef} className="flex-1 min-h-0 relative p-3 overflow-hidden">
                    {screenShareTrack ? (
                        <div className="flex h-full w-full gap-3 lg:flex-row flex-col overflow-hidden">
                            <div className="flex-1 relative bg-black/5 rounded-2xl overflow-hidden border shadow-sm min-h-0">
                                <FocusLayout trackRef={screenShareTrack}/>
                            </div>
                            <div className="lg:w-56 w-full flex flex-col shrink-0 overflow-hidden">
                                {/* Desktop: vertical strip */}
                                <CarouselLayout
                                    tracks={visibleTracks.filter(t => t !== screenShareTrack)}
                                    orientation="vertical"
                                    className="hidden lg:flex flex-col gap-2 h-full"
                                >
                                    <div className="rounded-xl border shadow-sm bg-muted overflow-hidden hover:ring-2 hover:ring-primary/50 aspect-video w-full shrink-0">
                                        <ParticipantTile/>
                                    </div>
                                </CarouselLayout>
                                {/* Mobile: horizontal strip */}
                                <CarouselLayout
                                    tracks={visibleTracks.filter(t => t !== screenShareTrack)}
                                    orientation="horizontal"
                                    className="flex lg:hidden h-24 gap-2 shrink-0"
                                >
                                    <div className="rounded-xl border shadow-sm bg-muted aspect-video overflow-hidden">
                                        <ParticipantTile/>
                                    </div>
                                </CarouselLayout>
                            </div>
                        </div>
                    ) : (
                        /*
                         * Pass explicit pixel height so LiveKit fills the container instead
                         * of auto-sizing to tile aspect ratios.
                         * '--lk-tile-aspect-ratio': 'unset' removes LiveKit's internal
                         * letterboxing so each tile stretches to fill its grid cell.
                         */
                        <GridLayout
                            tracks={visibleTracks}
                            style={{
                                height: gridHeight ? `${gridHeight}px` : '100%',
                                width: '100%',
                                '--lk-tile-aspect-ratio': 'unset',
                                '--lk-grid-gap': '0.5rem',
                            } as React.CSSProperties}
                        >
                            <div
                                className="rounded-2xl border shadow-md bg-muted overflow-hidden hover:scale-[1.01] transition-transform"
                                style={{height: '100%', width: '100%'}}
                            >
                                <ParticipantTile style={{height: '100%', width: '100%'}}/>
                            </div>
                        </GridLayout>
                    )}

                    {/* Overlay: timer + room name */}
                    <div className="absolute top-5 left-5 z-20 flex items-center gap-2 pointer-events-none">
                        <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>
                            <span className="text-xs font-mono font-medium">{getFormatedTime(duration)}</span>
                        </div>
                        <div
                            className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm text-xs font-semibold"
                            title={room.name}
                        >
                            {roomDisplayName}
                        </div>
                    </div>
                </div>

                {/* Control bar */}
                <div className="h-20 shrink-0 flex items-center justify-between px-8 bg-background border-t">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground w-1/3">
                        <span className="hidden md:inline-block">
                            {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </span>
                        <span className="hidden md:inline-block opacity-40">|</span>
                        <span className="hidden md:inline-block truncate max-w-[120px]" title={room.name}>
                            {roomDisplayName}
                        </span>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="bg-muted/30 p-2 rounded-full border flex items-center gap-1 shadow-sm">
                            <Controls meetingId={meetingId} onLeave={handleLeave}/>
                        </div>
                    </div>
                    <div className="w-1/3"/>
                </div>
            </div>

            {/* Sidebars */}
            {(isParticipantsOpen || isChatOpen) && (
                <div className="w-80 border-l bg-background overflow-hidden flex flex-col shrink-0 animate-in slide-in-from-right duration-300">
                    {isParticipantsOpen && <ParticipantsSidebar meetingId={meetingId}/>}
                    {isChatOpen && <ChatPanel meetingId={meetingId}/>}
                </div>
            )}

            <RoomAudioRenderer/>
        </div>
    );
}
