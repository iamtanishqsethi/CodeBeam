"use client";

import {MediaDeviceSelect} from "@livekit/components-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {Mic, Monitor, Settings, Video, Volume2} from "lucide-react";
import {useState} from "react";

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg bg-background/95 backdrop-blur-2xl sm:rounded-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings />
                        Settings
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="audio" className="mt-2">
                    <TabsList className="w-full">
                        <TabsTrigger value="audio" className="flex-1 gap-1.5">
                            <Mic />
                            Audio
                        </TabsTrigger>
                        <TabsTrigger value="video" className="flex-1 gap-1.5">
                            <Video />
                            Video
                        </TabsTrigger>
                        <TabsTrigger value="general" className="flex-1 gap-1.5">
                            <Monitor />
                            General
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="audio" className="mt-4">
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-medium text-muted-foreground">Microphone</span>
                                <MediaDeviceSelect
                                    kind="audioinput"
                                    className="rounded-lg border bg-muted/50 px-3 py-2.5 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <Volume2 />
                                        Output volume
                                    </span>
                                    <span className="tabular-nums">{outputVolume[0]}%</span>
                                </div>
                                <Slider
                                    value={outputVolume}
                                    onValueChange={setOutputVolume}
                                    max={100}
                                    step={1}
                                    aria-label="Output volume"
                                />
                            </div>

                            <label className="control-row text-sm">
                                Noise suppression
                                <Switch
                                    checked={noiseSuppression}
                                    onCheckedChange={setNoiseSuppression}
                                    aria-label="Toggle noise suppression"
                                />
                            </label>
                        </div>
                    </TabsContent>

                    <TabsContent value="video" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <span className="text-xs font-medium text-muted-foreground">Camera</span>
                                <MediaDeviceSelect
                                    kind="videoinput"
                                    className="rounded-lg border bg-muted/50 px-3 py-2.5 text-sm"
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="general" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium">Layout mode</p>
                                    <p className="text-xs text-muted-foreground">Choose how participants are displayed</p>
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
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
