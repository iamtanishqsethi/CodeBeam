"use client";

import {MediaDeviceSelect} from "@livekit/components-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {LayoutGrid, Mic, Monitor, Settings, User, Video, Volume2} from "lucide-react";
import {useState} from "react";
import {motion, AnimatePresence} from "framer-motion";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    layoutMode: "grid" | "speaker";
    onLayoutModeChange: (mode: "grid" | "speaker") => void;
}

export default function SettingsDialog({
    open,
    onOpenChange,
    layoutMode,
    onLayoutModeChange,
}: SettingsDialogProps) {
    const [noiseSuppression, setNoiseSuppression] = useState(true);
    const [outputVolume, setOutputVolume] = useState([72]);
    const [activeTab, setActiveTab] = useState("audio");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[480px] overflow-hidden border border-white/[0.08] bg-zinc-950/70 p-7 shadow-2xl backdrop-blur-3xl sm:rounded-[32px]">
                <DialogHeader className="mb-4">
                    <DialogTitle className="flex flex-row items-center gap-3 text-2xl font-semibold tracking-tight text-white">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/5 shadow-inner">
                            <Settings className="size-5 text-white/90" />
                        </div>
                        Settings
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col text-white w-full">
                    <TabsList className="relative flex h-14 w-full rounded-[20px] border border-white/[0.05] bg-white/[0.03] p-1.5 shadow-inner">
                        <TabsTrigger
                            value="audio"
                            className="relative flex-1 rounded-2xl text-white/50 transition-all data-[state=active]:text-white sm:h-full bg-transparent overflow-hidden"
                            tabIndex={-1}
                        >
                            {activeTab === "audio" && (
                                <motion.div
                                    layoutId="active-settings-tab"
                                    className="absolute inset-0 z-0 rounded-2xl bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.03)]"
                                    transition={{type: "spring", stiffness: 300, damping: 28}}
                                />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Mic className="size-4" />
                                <span className="text-sm font-medium">Audio</span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="video"
                            className="relative flex-1 rounded-2xl text-white/50 transition-all data-[state=active]:text-white sm:h-full bg-transparent overflow-hidden"
                            tabIndex={-1}
                        >
                            {activeTab === "video" && (
                                <motion.div
                                    layoutId="active-settings-tab"
                                    className="absolute inset-0 z-0 rounded-2xl bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.03)]"
                                    transition={{type: "spring", stiffness: 300, damping: 28}}
                                />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Video className="size-4" />
                                <span className="text-sm font-medium">Video</span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="general"
                            className="relative flex-1 rounded-2xl text-white/50 transition-all data-[state=active]:text-white sm:h-full bg-transparent overflow-hidden"
                            tabIndex={-1}
                        >
                            {activeTab === "general" && (
                                <motion.div
                                    layoutId="active-settings-tab"
                                    className="absolute inset-0 z-0 rounded-2xl bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.03)]"
                                    transition={{type: "spring", stiffness: 300, damping: 28}}
                                />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Monitor className="size-4" />
                                <span className="text-sm font-medium">General</span>
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <motion.div 
                        layout 
                        className="relative mt-8"
                        transition={{type: "spring", stiffness: 300, damping: 30}}
                    >
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                                key={activeTab}
                                initial={{opacity: 0, y: 15, filter: "blur(4px)"}}
                                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                                exit={{opacity: 0, y: -15, filter: "blur(4px)"}}
                                transition={{duration: 0.3, ease: "easeOut"}}
                                className="w-full flex flex-col gap-6"
                            >
                                {activeTab === "audio" && (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            <span className="pl-1 text-sm font-medium text-white/60">Microphone</span>
                                            <div className="rounded-[20px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-2 [&_.lk-active>button]:bg-white/10 [&_.lk-active>button]:font-medium [&_.lk-active>button]:text-white [&_[data-lk-active=true]>button]:bg-white/10 [&_[data-lk-active=true]>button]:font-medium [&_[data-lk-active=true]>button]:text-white [&_button:hover]:bg-white/[0.06] [&_button:hover]:text-white/90 [&_button]:w-full [&_button]:rounded-2xl [&_button]:px-4 [&_button]:py-3.5 [&_button]:text-left [&_button]:text-sm [&_button]:text-zinc-400 [&_button]:transition-all [&_li]:list-none [&>ul]:flex [&>ul]:flex-col [&>ul]:gap-1">
                                                <MediaDeviceSelect kind="audioinput" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-5 rounded-[24px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-[-10px_-10px_30px_4px_rgba(255,255,255,0.01)_inset]">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="flex items-center gap-3 text-sm font-medium text-white/80">
                                                    <div className="flex size-9 items-center justify-center rounded-full bg-white/[0.08] shadow-inner border border-white/5">
                                                        <Volume2 className="size-4 text-white/90" />
                                                    </div>
                                                    Output volume
                                                </span>
                                                <span className="tabular-nums text-sm font-medium text-white/50">{outputVolume[0]}%</span>
                                            </div>
                                            <Slider
                                                value={outputVolume}
                                                onValueChange={setOutputVolume}
                                                max={100}
                                                step={1}
                                                aria-label="Output volume"
                                                className="mt-1 [&_[data-slot=slider-range]]:bg-white/90 [&_[data-slot=slider-thumb]]:border border-white/10 [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-[0_0_15px_rgba(255,255,255,0.4)] [&_[data-slot=slider-thumb]]:focus-visible:ring-white/20 [&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-thumb]]:size-5"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between rounded-[24px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-[-10px_-10px_30px_4px_rgba(255,255,255,0.01)_inset]">
                                            <span className="text-sm font-medium text-white/80">Noise suppression</span>
                                            <Switch
                                                checked={noiseSuppression}
                                                onCheckedChange={setNoiseSuppression}
                                                aria-label="Toggle noise suppression"
                                                className="data-[state=checked]:bg-white data-[state=unchecked]:bg-white/10 [&_[data-slot=switch-thumb]]:data-[state=checked]:bg-zinc-950 [&_[data-slot=switch-thumb]]:data-[state=unchecked]:bg-white/50 border-white/10 shadow-inner"
                                            />
                                        </div>
                                    </>
                                )}

                                {activeTab === "video" && (
                                    <>
                                        <div className="flex flex-col gap-3">
                                            <span className="pl-1 text-sm font-medium text-white/60">Camera</span>
                                            <div className="rounded-[20px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-2 [&_.lk-active>button]:bg-white/10 [&_.lk-active>button]:font-medium [&_.lk-active>button]:text-white [&_[data-lk-active=true]>button]:bg-white/10 [&_[data-lk-active=true]>button]:font-medium [&_[data-lk-active=true]>button]:text-white [&_button:hover]:bg-white/[0.06] [&_button:hover]:text-white/90 [&_button]:w-full [&_button]:rounded-2xl [&_button]:px-4 [&_button]:py-3.5 [&_button]:text-left [&_button]:text-sm [&_button]:text-zinc-400 [&_button]:transition-all [&_li]:list-none [&>ul]:flex [&>ul]:flex-col [&>ul]:gap-1">
                                                <MediaDeviceSelect kind="videoinput" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === "general" && (
                                    <>
                                        <div className="flex items-center justify-between gap-3 rounded-[24px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 shadow-[-10px_-10px_30px_4px_rgba(255,255,255,0.01)_inset]">
                                            <div>
                                                <p className="text-sm font-medium text-white/90">Layout mode</p>
                                                <p className="mt-1.5 text-xs text-white/50 leading-relaxed">Choose how participants<br/>are displayed in the meeting</p>
                                            </div>
                                            <div className="flex rounded-full bg-white/[0.04] p-1.5 border border-white/[0.02] shadow-inner">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onLayoutModeChange("grid")}
                                                    className={`flex h-9 items-center rounded-full px-5 text-xs font-medium transition-all ${layoutMode === "grid" ? "bg-white/[0.12] text-white shadow-md " : "text-white/40 hover:text-white/80"}`}
                                                >
                                                    <LayoutGrid className="mr-1 size-3.5" />
                                                    Grid
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onLayoutModeChange("speaker")}
                                                    className={`flex h-9 items-center rounded-full px-5 text-xs font-medium transition-all ${layoutMode === "speaker" ? "bg-white/[0.12] text-white shadow-md " : "text-white/40  hover:text-white/80"}`}
                                                >
                                                    <User className="mr-1 size-3.5" />
                                                    Speaker
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
