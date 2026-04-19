"use client";

import {useLocalParticipant, useRoomContext} from "@livekit/components-react";
import {AnimatePresence, motion} from "framer-motion";
import {
    Loader2,
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
import {Dock, DockIcon} from "@/components/ui/dock";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";

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

function IconSwap({active, on, off}: {active: boolean; on: React.ReactNode; off: React.ReactNode}) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.span
                key={active ? "on" : "off"}
                initial={{opacity: 0, scale: 0.78}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.78}}
                transition={{duration: 0.15}}
                className="flex items-center justify-center"
            >
                {active ? on : off}
            </motion.span>
        </AnimatePresence>
    );
}

function DockTooltip({label, children}: {label: string; children: React.ReactNode}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side="top" className="border-white/10 bg-background/90 backdrop-blur-xl">
                {label}
            </TooltipContent>
        </Tooltip>
    );
}

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

    const controlBtnClass = "rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]";

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3, ease: "easeOut"}}
        >
            <Dock
                iconSize={44}
                iconMagnification={58}
                iconDistance={120}
                direction="bottom"
                className="mx-auto h-[62px] gap-1.5 rounded-lg border bg-control-bar-bg px-3 py-2 shadow-lg backdrop-blur-2xl"
            >
                {/* Mic */}
                <DockIcon className={cn(controlBtnClass, !isMicrophoneEnabled && "bg-destructive/90 text-white")}>
                    <DockTooltip label={isMicrophoneEnabled ? "Mute" : "Unmute"}>
                        <button
                            type="button"
                            aria-label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
                            disabled={pendingAction === "mic"}
                            onClick={() => runMediaAction("mic", () => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled))}
                            className="flex size-full items-center justify-center"
                        >
                            {pendingAction === "mic"
                                ? <Loader2 className="animate-spin" />
                                : <IconSwap active={isMicrophoneEnabled} on={<Mic />} off={<MicOff />} />
                            }
                        </button>
                    </DockTooltip>
                </DockIcon>

                {/* Camera */}
                <DockIcon className={cn(controlBtnClass, !isCameraEnabled && "bg-destructive/90 text-white")}>
                    <DockTooltip label={isCameraEnabled ? "Camera off" : "Camera on"}>
                        <button
                            type="button"
                            aria-label={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
                            disabled={pendingAction === "camera"}
                            onClick={() => runMediaAction("camera", () => localParticipant.setCameraEnabled(!isCameraEnabled))}
                            className="flex size-full items-center justify-center"
                        >
                            {pendingAction === "camera"
                                ? <Loader2 className="animate-spin" />
                                : <IconSwap active={isCameraEnabled} on={<Video />} off={<VideoOff />} />
                            }
                        </button>
                    </DockTooltip>
                </DockIcon>

                {/* Screen Share */}
                <DockIcon className={cn(controlBtnClass, isScreenShareEnabled && "bg-primary/90 text-primary-foreground")}>
                    <DockTooltip label={isScreenShareEnabled ? "Stop sharing" : "Share screen"}>
                        <button
                            type="button"
                            aria-label={isScreenShareEnabled ? "Stop sharing screen" : "Share screen"}
                            disabled={pendingAction === "screen"}
                            onClick={() => runMediaAction("screen", () => localParticipant.setScreenShareEnabled(!isScreenShareEnabled))}
                            className="flex size-full items-center justify-center"
                        >
                            {pendingAction === "screen"
                                ? <Loader2 className="animate-spin" />
                                : <IconSwap active={isScreenShareEnabled} on={<ScreenShareOff />} off={<ScreenShare />} />
                            }
                        </button>
                    </DockTooltip>
                </DockIcon>

                {/* Reactions */}
                <DockIcon className={controlBtnClass}>
                    <Popover>
                        <DockTooltip label="Reactions">
                            <PopoverTrigger asChild>
                                <button type="button" aria-label="Send reaction" className="flex size-full items-center justify-center">
                                    <Smile />
                                </button>
                            </PopoverTrigger>
                        </DockTooltip>
                        <PopoverContent side="top" className="w-fit rounded-lg bg-background/86 p-2 backdrop-blur-2xl">
                            <div className="flex gap-1">
                                {reactionItems.map((emoji) => (
                                    <Button
                                        key={emoji}
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`React ${emoji}`}
                                        onClick={() => onReaction(emoji)}
                                        className="interactive-lift size-10 text-lg"
                                    >
                                        {emoji}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </DockIcon>

                {/* Participants */}
                <DockIcon className={cn(controlBtnClass, activePanel === "participants" && "bg-secondary")}>
                    <DockTooltip label="Participants">
                        <button
                            type="button"
                            aria-label="Open participants"
                            onClick={() => onTogglePanel("participants")}
                            className="flex size-full items-center justify-center"
                        >
                            <Users />
                        </button>
                    </DockTooltip>
                </DockIcon>

                {/* Chat */}
                <DockIcon className={cn(controlBtnClass, activePanel === "chat" && "bg-secondary")}>
                    <DockTooltip label="Chat">
                        <button
                            type="button"
                            aria-label="Open chat"
                            onClick={() => onTogglePanel("chat")}
                            className="relative flex size-full items-center justify-center"
                        >
                            <MessageCircle />
                            {unreadCount > 0 && (
                                <Badge className="absolute -top-1 -right-1 min-w-4 px-1 text-[10px] animate-pulse">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                            )}
                        </button>
                    </DockTooltip>
                </DockIcon>

                {/* Settings */}
                <DockIcon className={controlBtnClass}>
                    <DockTooltip label="Settings">
                        <button
                            type="button"
                            aria-label="Open settings"
                            onClick={onOpenSettings}
                            className="flex size-full items-center justify-center"
                        >
                            <Settings />
                        </button>
                    </DockTooltip>
                </DockIcon>

                {/* Leave */}
                <DockIcon className="rounded-lg bg-destructive text-white shadow-sm shadow-destructive/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-destructive/40 active:scale-[0.98]">
                    <DockTooltip label="Leave call">
                        <button
                            type="button"
                            aria-label="Leave call"
                            disabled={pendingAction === "leave"}
                            onClick={leave}
                            className="flex size-full items-center justify-center"
                        >
                            {pendingAction === "leave" ? <Loader2 className="animate-spin" /> : <PhoneOff />}
                        </button>
                    </DockTooltip>
                </DockIcon>

                {/* End Meeting (host only) */}
                {isHost && (
                    <DockIcon className={controlBtnClass}>
                        <DockTooltip label="End for everyone">
                            <button
                                type="button"
                                aria-label="End meeting for everyone"
                                disabled={pendingAction === "end"}
                                onClick={endMeeting}
                                className="flex size-full items-center justify-center"
                            >
                                {pendingAction === "end" ? <Loader2 className="animate-spin" /> : <LogOut />}
                            </button>
                        </DockTooltip>
                    </DockIcon>
                )}
            </Dock>
        </motion.div>
    );
}
