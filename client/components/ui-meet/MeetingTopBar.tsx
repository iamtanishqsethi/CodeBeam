"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Copy, Grid2X2, Radio} from "lucide-react";
import {toast} from "sonner";
import {getFormatedTime} from "@/utils/getFormatedTime";
import {motion} from "framer-motion";

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
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute top-0 left-0 right-0 z-40 flex items-start justify-between p-3 sm:p-4"
        >
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
                <Badge
                    variant="secondary"
                    className="gap-2 border border-white/10 bg-white/5 px-3 py-1.5 font-mono shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl text-white/90"
                >
                    <Radio className="animate-pulse text-red-400 size-4" />
                    {getFormatedTime(duration)}
                </Badge>
                <Badge
                    variant="secondary"
                    className="max-w-48 border border-white/10 bg-white/5 px-3 py-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl text-white/90"
                    title={roomName}
                >
                    <span className="truncate">{displayName}</span>
                </Badge>
                <Badge
                    variant="outline"
                    className="bg-white/5 border-white/10 px-3 py-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl text-white/90"
                >
                    <Grid2X2 className="size-4 mr-2 opacity-70" />
                    <span className="text-xs uppercase tracking-widest font-bold">
                        {layoutMode === "speaker" ? "Speaker" : "Grid"}
                    </span>
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
                            className="interactive-lift gap-2 border border-white/10 bg-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-2xl text-white/90 hover:bg-white/10"
                        >
                            <Copy className="size-4" />
                            <span className="hidden sm:inline text-xs uppercase tracking-widest font-bold">Invite</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-white/10 text-white">Copy meeting ID</TooltipContent>
                </Tooltip>
            </div>
        </motion.div>
    );
}
