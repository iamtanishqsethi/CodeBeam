"use client";

import {MediaDeviceSelect, useLocalParticipant, useRoomContext} from "@livekit/components-react";
import {AnimatePresence, motion} from "framer-motion";
import {
    Loader2,
    LogOut,
    MessageCircle,
    Mic,
    MicOff,
    MoreHorizontal,
    PhoneOff,
    ScreenShare,
    ScreenShareOff,
    Settings,
    Smile,
    Users,
    Video,
    VideoOff,
    Volume2,
} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {Toggle} from "@/components/ui/toggle";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import {useMeetingStore} from "@/store/meetingStore";
import {cn} from "@/lib/utils";

interface ControlsProps {
    onLeave: () => void;
    onEndMeeting: () => void;
    onReaction: (emoji: string) => void;
    unreadCount: number;
    layoutMode: "grid" | "speaker";
    onLayoutModeChange: (mode: "grid" | "speaker") => void;
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

function ControlTooltip({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}

export default function Controls({
    onLeave,
    onEndMeeting,
    onReaction,
    unreadCount,
    layoutMode,
    onLayoutModeChange,
}: ControlsProps) {
    const toggleChat = useMeetingStore(store => store.toggleChat);
    const toggleParticipants = useMeetingStore(store => store.toggleParticipants);
    const isChatOpen = useMeetingStore(store => store.isChatOpen);
    const isParticipantsOpen = useMeetingStore(store => store.isParticipantsOpen);
    const isHost = useMeetingStore(store => store.isHost);
    const room = useRoomContext();
    const {
        localParticipant,
        isMicrophoneEnabled,
        isCameraEnabled,
        isScreenShareEnabled,
    } = useLocalParticipant();
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [noiseSuppression, setNoiseSuppression] = useState(true);
    const [outputVolume, setOutputVolume] = useState([72]);

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

    const controlClass = "interactive-lift size-11 rounded-lg";
    const reactionItems = ["👍", "👏", "🔥", "❤️", "😂", "🎉"];

    return (
        <motion.div
            initial={{opacity: 0, y: 12}}
            animate={{opacity: 1, y: 0}}
            className="flex max-w-[calc(100vw-1.5rem)] items-center justify-center gap-1 overflow-x-auto rounded-lg border bg-control-bar-bg px-2 py-2 shadow-lg backdrop-blur-xl"
        >
            <ControlTooltip label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}>
                <Toggle
                    pressed={isMicrophoneEnabled}
                    aria-label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
                    disabled={pendingAction === "mic"}
                    onPressedChange={() => runMediaAction("mic", () => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled))}
                    className={cn(controlClass, !isMicrophoneEnabled && "bg-destructive text-destructive-foreground")}
                >
                    {pendingAction === "mic" ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                    ) : (
                        <IconSwap
                            active={isMicrophoneEnabled}
                            on={<Mic data-icon="inline-start" />}
                            off={<MicOff data-icon="inline-start" />}
                        />
                    )}
                </Toggle>
            </ControlTooltip>

            <ControlTooltip label={isCameraEnabled ? "Turn camera off" : "Turn camera on"}>
                <Toggle
                    pressed={isCameraEnabled}
                    aria-label={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
                    disabled={pendingAction === "camera"}
                    onPressedChange={() => runMediaAction("camera", () => localParticipant.setCameraEnabled(!isCameraEnabled))}
                    className={cn(controlClass, !isCameraEnabled && "bg-destructive text-destructive-foreground")}
                >
                    {pendingAction === "camera" ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                    ) : (
                        <IconSwap
                            active={isCameraEnabled}
                            on={<Video data-icon="inline-start" />}
                            off={<VideoOff data-icon="inline-start" />}
                        />
                    )}
                </Toggle>
            </ControlTooltip>

            <ControlTooltip label={isScreenShareEnabled ? "Stop sharing screen" : "Share screen"}>
                <Toggle
                    pressed={isScreenShareEnabled}
                    aria-label={isScreenShareEnabled ? "Stop sharing screen" : "Share screen"}
                    disabled={pendingAction === "screen"}
                    onPressedChange={() => runMediaAction("screen", () => localParticipant.setScreenShareEnabled(!isScreenShareEnabled))}
                    className={cn(controlClass, isScreenShareEnabled && "bg-primary text-primary-foreground")}
                >
                    {pendingAction === "screen" ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                    ) : (
                        <IconSwap
                            active={isScreenShareEnabled}
                            on={<ScreenShareOff data-icon="inline-start" />}
                            off={<ScreenShare data-icon="inline-start" />}
                        />
                    )}
                </Toggle>
            </ControlTooltip>

            <Popover>
                <ControlTooltip label="Send reaction">
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" aria-label="Send reaction" className={controlClass}>
                            <Smile data-icon="inline-start" />
                        </Button>
                    </PopoverTrigger>
                </ControlTooltip>
                <PopoverContent side="top" className="w-fit rounded-lg p-2">
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

            <ControlTooltip label="Participants">
                <Button
                    type="button"
                    variant={isParticipantsOpen ? "secondary" : "ghost"}
                    size="icon"
                    aria-label="Open participants"
                    onClick={toggleParticipants}
                    className={controlClass}
                >
                    <Users data-icon="inline-start" />
                </Button>
            </ControlTooltip>

            <ControlTooltip label="Chat">
                <Button
                    type="button"
                    variant={isChatOpen ? "secondary" : "ghost"}
                    size="icon"
                    aria-label="Open chat"
                    onClick={toggleChat}
                    className={cn(controlClass, "relative")}
                >
                    <MessageCircle data-icon="inline-start" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 min-w-5 px-1">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </ControlTooltip>

            <Popover>
                <ControlTooltip label="More controls">
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" aria-label="More controls" className={controlClass}>
                            <MoreHorizontal data-icon="inline-start" />
                        </Button>
                    </PopoverTrigger>
                </ControlTooltip>
                <PopoverContent side="top" align="end" className="w-80 rounded-lg p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Settings />
                                Layout
                            </div>
                            <div className="flex rounded-lg bg-muted p-1">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={layoutMode === "grid" ? "secondary" : "ghost"}
                                    onClick={() => onLayoutModeChange("grid")}
                                    className="interactive-lift"
                                >
                                    Grid
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant={layoutMode === "speaker" ? "secondary" : "ghost"}
                                    onClick={() => onLayoutModeChange("speaker")}
                                    className="interactive-lift"
                                >
                                    Speaker
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Microphone</span>
                            <MediaDeviceSelect kind="audioinput" className="rounded-lg border bg-background px-3 py-2 text-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Camera</span>
                            <MediaDeviceSelect kind="videoinput" className="rounded-lg border bg-background px-3 py-2 text-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <Volume2 />
                                    Output volume
                                </span>
                                <span>{outputVolume[0]}%</span>
                            </div>
                            <Slider value={outputVolume} onValueChange={setOutputVolume} max={100} step={1} aria-label="Output volume" />
                        </div>
                        <label className="flex items-center justify-between gap-3 text-sm">
                            Noise suppression
                            <Switch checked={noiseSuppression} onCheckedChange={setNoiseSuppression} aria-label="Toggle noise suppression" />
                        </label>
                    </div>
                </PopoverContent>
            </Popover>

            <Button
                type="button"
                variant="destructive"
                aria-label="Leave call"
                disabled={pendingAction === "leave"}
                onClick={leave}
                className="interactive-lift ml-1 h-11 min-w-14 px-5"
            >
                {pendingAction === "leave" ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <PhoneOff data-icon="inline-start" />}
            </Button>

            {isHost && (
                <ControlTooltip label="End meeting for everyone">
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        aria-label="End meeting for everyone"
                        disabled={pendingAction === "end"}
                        onClick={endMeeting}
                        className={controlClass}
                    >
                        {pendingAction === "end" ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <LogOut data-icon="inline-start" />}
                    </Button>
                </ControlTooltip>
            )}
        </motion.div>
    );
}
