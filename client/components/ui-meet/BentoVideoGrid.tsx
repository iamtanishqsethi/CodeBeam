"use client";

import type {ParticipantTileProps} from "@livekit/components-react";
import {AnimatePresence} from "framer-motion";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useMemo, useState} from "react";
import {Button} from "@/components/ui/button";
import ParticipantTile, {getMeetingTrackId} from "@/components/ui-meet/ParticipantTile";
import {cn} from "@/lib/utils";

type TrackRef = NonNullable<ParticipantTileProps["trackRef"]>;

interface BentoVideoGridProps {
    tracks: TrackRef[];
    spotlightTrack?: TrackRef;
    pinnedTrackId: string | null;
    isHost: boolean;
    onTogglePin: (trackId: string) => void;
}

function getGridClass(count: number) {
    if (count <= 1) return "grid-cols-1 place-items-center [&>*]:w-full [&>*]:max-w-[720px]";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count <= 9) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

export default function BentoVideoGrid({
    tracks,
    spotlightTrack,
    pinnedTrackId,
    isHost,
    onTogglePin,
}: BentoVideoGridProps) {
    const [gridPage, setGridPage] = useState(0);

    const gridTracks = useMemo(() =>
        spotlightTrack
            ? tracks.filter(t => getMeetingTrackId(t) !== getMeetingTrackId(spotlightTrack))
            : tracks,
        [tracks, spotlightTrack]
    );

    const pageSize = gridTracks.length >= 10 ? 12 : gridTracks.length || 1;
    const pageCount = Math.max(1, Math.ceil(gridTracks.length / pageSize));
    const safeGridPage = Math.min(gridPage, pageCount - 1);
    const pagedGridTracks = gridTracks.slice(safeGridPage * pageSize, safeGridPage * pageSize + pageSize);

    return (
        <div className="relative h-full min-h-0">
            <AnimatePresence mode="popLayout">
                {spotlightTrack ? (
                    <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[minmax(0,0.72fr)_minmax(14rem,0.28fr)]">
                        <ParticipantTile
                            trackRef={spotlightTrack}
                            isPinned={pinnedTrackId === getMeetingTrackId(spotlightTrack)}
                            isHost={isHost}
                            onTogglePin={onTogglePin}
                            className="min-h-[22rem]"
                        />
                        <div className="grid min-h-0 grid-cols-2 gap-3 overflow-y-auto lg:grid-cols-1">
                            {gridTracks.map(trackRef => {
                                const trackId = getMeetingTrackId(trackRef);
                                return (
                                    <ParticipantTile
                                        key={trackId}
                                        trackRef={trackRef}
                                        isPinned={pinnedTrackId === trackId}
                                        isHost={isHost}
                                        onTogglePin={onTogglePin}
                                        className="min-h-28"
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className={cn(
                        "grid h-full min-h-0 auto-rows-fr gap-3",
                        getGridClass(pagedGridTracks.length)
                    )}>
                        {pagedGridTracks.map(trackRef => {
                            const trackId = getMeetingTrackId(trackRef);
                            return (
                                <ParticipantTile
                                    key={trackId}
                                    trackRef={trackRef}
                                    isPinned={pinnedTrackId === trackId}
                                    isHost={isHost}
                                    onTogglePin={onTogglePin}
                                />
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {pageCount > 1 && !spotlightTrack && (
                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background/72 px-3 py-1.5 shadow-sm backdrop-blur-xl">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Previous participant page"
                        disabled={safeGridPage === 0}
                        className="size-7"
                        onClick={() => setGridPage(page => Math.max(0, page - 1))}
                    >
                        <ChevronLeft data-icon="inline-start" />
                    </Button>
                    <span className="text-xs font-medium text-muted-foreground tabular-nums">
                        {safeGridPage + 1} / {pageCount}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Next participant page"
                        disabled={safeGridPage >= pageCount - 1}
                        className="size-7"
                        onClick={() => setGridPage(page => Math.min(pageCount - 1, page + 1))}
                    >
                        <ChevronRight data-icon="inline-start" />
                    </Button>
                </div>
            )}
        </div>
    );
}
