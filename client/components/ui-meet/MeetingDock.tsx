"use client";

import {useLocalParticipant, useRoomContext} from "@livekit/components-react";
import {
    LogOut,
    MessageCircle,
    Mic,
    MicOff,
    PhoneOff,
    ScreenShare,
    ScreenShareOff,
    Settings,
    Smile,
    Users,
    Video,
    VideoOff,
} from "lucide-react";
import {useState} from "react";
import {FloatingDock} from "@/components/ui/floating-dock";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Spinner} from "@/components/kibo-ui/spinner";

interface MeetingDockProps {
    onLeave: () => void;
    onEndMeeting: () => void;
    onReaction: (emoji: string) => void;
    onOpenSettings: () => void;
    onTogglePanel: (panel: "chat" | "participants") => void;
    activePanel: "chat" | "participants" | null;
    unreadCount: number;
    layoutMode: "grid" | "speaker";
    onLayoutModeChange: (mode: "grid" | "speaker") => void;
    isHost: boolean;
}

type PendingAction = "mic" | "camera" | "screen" | "leave" | "end" | null;

export default function MeetingDock({
    onLeave,
    onEndMeeting,
    onReaction,
    onOpenSettings,
    onTogglePanel,
    activePanel,
    unreadCount,
    isHost,
}: MeetingDockProps) {
    const room = useRoomContext();
    const {
        localParticipant,
        isMicrophoneEnabled,
        isCameraEnabled,
        isScreenShareEnabled,
    } = useLocalParticipant();
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    const runMediaAction = async (action: PendingAction, fn: () => Promise<unknown>) => {
        if (pendingAction) return;
        setPendingAction(action);
        try {
            await fn();
        } catch (error) {
            console.error(error);
        } finally {
            setPendingAction(null);
        }
    };

    const leave = () => {
        setPendingAction("leave");
        void room.disconnect();
        onLeave();
    };

    const endMeeting = () => {
        setPendingAction("end");
        onEndMeeting();
    };

    const reactionItems = ["👍", "👏", "🔥", "❤️", "😂", "🎉"];

    const items = [
        {
            title: isMicrophoneEnabled ? "Mute" : "Unmute",
            icon: pendingAction === "mic" ? (
                <Spinner variant={'bars'} size={20} />
            ) : isMicrophoneEnabled ? (
                <Mic size={20} />
            ) : (
                <MicOff size={20} />
            ),
            onClick: () => runMediaAction("mic", () => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)),
            className: cn(!isMicrophoneEnabled && "!bg-red-500/20 !text-red-400 !border-red-500/30"),
        },
        {
            title: isCameraEnabled ? "Stop Video" : "Start Video",
            icon: pendingAction === "camera" ? (
                <Spinner variant={'bars'} size={20} />
            ) : isCameraEnabled ? (
                <Video size={20} />
            ) : (
                <VideoOff size={20} />
            ),
            onClick: () => runMediaAction("camera", () => localParticipant.setCameraEnabled(!isCameraEnabled)),
            className: cn(!isCameraEnabled && "!bg-red-500/20 !text-red-400 !border-red-500/30"),
        },
        {
            title: isScreenShareEnabled ? "Stop Sharing" : "Share Screen",
            icon: pendingAction === "screen" ? (
                <Spinner variant={'bars'} size={20} />
            ) : isScreenShareEnabled ? (
                <ScreenShareOff size={20} />
            ) : (
                <ScreenShare size={20} />
            ),
            onClick: () => runMediaAction("screen", () => localParticipant.setScreenShareEnabled(!isScreenShareEnabled)),
            className: cn(isScreenShareEnabled && "!bg-primary/20 !text-primary !border-primary/30"),
        },
        {
            title: "Reactions",
            icon: (
                <Popover>
                    <PopoverTrigger asChild>
                        <div className="flex size-full items-center justify-center">
                            <Smile size={20} />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent side="top" className="w-fit rounded-xl bg-white/5 border border-white/10 p-2 backdrop-blur-2xl shadow-2xl">
                        <div className="flex gap-1">
                            {reactionItems.map((emoji) => (
                                <Button
                                    key={emoji}
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`React ${emoji}`}
                                    onClick={() => onReaction(emoji)}
                                    className="interactive-lift size-10 text-xl hover:bg-white/10"
                                >
                                    {emoji}
                                </Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            ),
        },
        {
            title: "Participants",
            icon: <Users size={20} />,
            onClick: () => onTogglePanel("participants"),
            className: cn(activePanel === "participants" && "!bg-white/15 !border-white/30"),
        },
        {
            title: "Chat",
            icon: (
                <div className="relative flex size-full items-center justify-center">
                    <MessageCircle size={20} />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 min-w-4 px-1 text-[10px] bg-primary text-white border-none animate-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </div>
            ),
            onClick: () => onTogglePanel("chat"),
            className: cn(activePanel === "chat" && "!bg-white/15 !border-white/30"),
        },
        {
            title: "Settings",
            icon: <Settings size={20} />,
            onClick: onOpenSettings,
        },
        {
            title: "Leave",
            icon: pendingAction === "leave" ? <Spinner variant={'bars'} size={20} /> : <PhoneOff size={20} />,
            onClick: leave,
            className: "!bg-red-500 !text-white shadow-[0_8px_24px_rgba(239,68,68,0.4)] hover:bg-red-500/90 !border-none",
        },
    ];

    if (isHost) {
        items.push({
            title: "End Meeting",
            icon: pendingAction === "end" ? <Spinner variant={'bars'} size={20} /> : <LogOut size={20} />,
            onClick: endMeeting,
            className: "!bg-red-600 !text-white shadow-[0_8px_24px_rgba(220,38,38,0.4)] hover:bg-red-600/90 !border-none",
        });
    }

    return (
        <div className="flex items-center justify-center">
            <FloatingDock
                items={items}
                desktopClassName="border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                mobileClassName="translate-y-[-20px]"
            />
        </div>
    );
}
