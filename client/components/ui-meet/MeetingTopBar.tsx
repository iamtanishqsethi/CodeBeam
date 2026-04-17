"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Copy, Grid2X2, Radio, User} from "lucide-react";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {getFormatedTime} from "@/utils/getFormatedTime";

interface MeetingTopBarProps {
    duration: number;
    roomName: string;
    layoutMode: "grid" | "speaker";
    meetingId: string;
}

function formatRoomName(name: string): string {
    if (!name) return "Room";
    if (/^[0-9a-f]{8}-/i.test(name)) return name.split("-")[0].toUpperCase();
    return name;
}

export function MeetingTopBar({duration, roomName, layoutMode, meetingId}: MeetingTopBarProps) {
    const displayName = formatRoomName(roomName);

    const copyMeetingId = () => {
        void navigator.clipboard.writeText(meetingId);
        toast.success("Meeting ID copied to clipboard");
    };

    return (
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-4">
            {/* Left group */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
                <Badge
                    variant="secondary"
                    className="gap-2 border border-white/10 bg-background/60 px-3 py-1.5 font-mono shadow-lg backdrop-blur-xl"
                >
                    <Radio className="text-red-400 animate-pulse" />
                    {getFormatedTime(duration)}
                </Badge>
                <Badge
                    variant="secondary"
                    className="max-w-48 border border-white/10 bg-background/60 px-3 py-1.5 shadow-lg backdrop-blur-xl"
                    title={roomName}
                >
                    <span className="truncate">{displayName}</span>
                </Badge>
                <Badge
                    variant="outline"
                    className="border-white/10 bg-background/60 px-3 py-1.5 shadow-lg backdrop-blur-xl"
                >
                    <Grid2X2 />
                    {layoutMode === "speaker" ? "Speaker" : "Grid"}
                </Badge>
            </div>

            {/* Right group */}
            <div className="pointer-events-auto flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={copyMeetingId}
                            className="gap-2 border border-white/10 bg-background/60 shadow-lg backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
                        >
                            <Copy data-icon="inline-start" />
                            <span className="hidden sm:inline">Invite</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy meeting ID</TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
}
