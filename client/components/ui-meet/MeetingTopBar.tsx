"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Copy, Grid2X2, Radio} from "lucide-react";
import {toast} from "sonner";
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
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-3 sm:p-4">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
                <Badge
                    variant="secondary"
                    className="gap-2 border bg-background/72 px-3 py-1.5 font-mono shadow-sm backdrop-blur-xl"
                >
                    <Radio className="animate-pulse text-destructive" />
                    {getFormatedTime(duration)}
                </Badge>
                <Badge
                    variant="secondary"
                    className="max-w-48 border bg-background/72 px-3 py-1.5 shadow-sm backdrop-blur-xl"
                    title={roomName}
                >
                    <span className="truncate">{displayName}</span>
                </Badge>
                <Badge
                    variant="outline"
                    className="bg-background/72 px-3 py-1.5 shadow-sm backdrop-blur-xl"
                >
                    <Grid2X2 />
                    {layoutMode === "speaker" ? "Speaker" : "Grid"}
                </Badge>
            </div>

            <div className="pointer-events-auto flex items-center gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={copyMeetingId}
                            className="interactive-lift gap-2 border bg-background/72 shadow-sm backdrop-blur-xl"
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
