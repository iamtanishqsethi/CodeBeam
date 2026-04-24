"use client";

import { Camera, Mic, MicOff, VideoOff, Sparkles, User, ChevronDown, Settings2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMeetingStore } from "@/store/meetingStore";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import GlassSurface from "./GlassSurface";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    SlideToUnlock,
    SlideToUnlockHandle,
    SlideToUnlockText,
    SlideToUnlockTrack
} from "@/components/slide-to-unlock/slide-to-unlock";
import {ShimmeringText} from "@/components/shimmering-text/shimmering-text";
import useSound from "use-sound";

interface CustomPreJoinProps {
    onSubmit: (values: {
        username: string;
        videoEnabled: boolean;
        audioEnabled: boolean;
        videoDeviceId: string;
        audioDeviceId: string;
    }) => void;
    userLabel?: string;
}

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2);
    return initials.toUpperCase();
}

export default function CustomPreJoin({ onSubmit, userLabel = "" }: CustomPreJoinProps) {
    const { user } = useUser();
    const mediaPreferences = useMeetingStore(state => state.mediaPreferences);
    const setMediaPreferences = useMeetingStore(state => state.setMediaPreferences);
    const [username, setUsername] = useState(mediaPreferences.username || userLabel || "");
    const videoRef = useRef<HTMLVideoElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [micLevel, setMicLevel] = useState(0);

    const videoDevices = devices.filter(device => device.kind === "videoinput");
    const audioDevices = devices.filter(device => device.kind === "audioinput");

    useEffect(() => {
        if (!navigator.mediaDevices?.enumerateDevices) return;

        const loadDevices = async () => {
            try {
                // Request permissions first to get labels
                await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                    .then(stream => stream.getTracks().forEach(t => t.stop()))
                    .catch(() => {});
                
                const nextDevices = await navigator.mediaDevices.enumerateDevices();
                setDevices(nextDevices);
            } catch (e) {
                console.error("Failed to load devices", e);
            }
        };

        void loadDevices();
        navigator.mediaDevices.addEventListener?.("devicechange", loadDevices);
        return () => navigator.mediaDevices.removeEventListener?.("devicechange", loadDevices);
    }, []);

    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia) return;
        if (!mediaPreferences.videoEnabled && !mediaPreferences.audioEnabled) {
            if (videoRef.current) videoRef.current.srcObject = null;
            setMicLevel(0);
            return;
        }

        let cancelled = false;
        let stream: MediaStream | null = null;
        let frame = 0;
        let audioContext: AudioContext | null = null;

        const startPreview = async () => {
            try {
                const constraints = {
                    video: mediaPreferences.videoEnabled
                        ? {
                            deviceId: mediaPreferences.videoDeviceId
                                ? { exact: mediaPreferences.videoDeviceId }
                                : undefined,
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                        : false,
                    audio: mediaPreferences.audioEnabled
                        ? {
                            deviceId: mediaPreferences.audioDeviceId
                                ? { exact: mediaPreferences.audioDeviceId }
                                : undefined,
                        }
                        : false,
                };
                
                stream = await navigator.mediaDevices.getUserMedia(constraints);

                if (cancelled) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                if (videoRef.current && mediaPreferences.videoEnabled) {
                    videoRef.current.srcObject = stream;
                }

                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack && mediaPreferences.audioEnabled) {
                    audioContext = new AudioContext();
                    const analyser = audioContext.createAnalyser();
                    analyser.fftSize = 128;
                    const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
                    const data = new Uint8Array(analyser.frequencyBinCount);
                    source.connect(analyser);

                    const updateLevel = () => {
                        if (cancelled) return;
                        analyser.getByteFrequencyData(data);
                        const average = data.reduce((sum, value) => sum + value, 0) / data.length;
                        setMicLevel(Math.min(1, average / 80));
                        frame = requestAnimationFrame(updateLevel);
                    };

                    updateLevel();
                }
            } catch (error) {
                console.error("Preview failed:", error);
                setMicLevel(0);
            }
        };

        void startPreview();

        return () => {
            cancelled = true;
            if (frame) cancelAnimationFrame(frame);
            void audioContext?.close();
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [
        mediaPreferences.audioDeviceId,
        mediaPreferences.audioEnabled,
        mediaPreferences.videoDeviceId,
        mediaPreferences.videoEnabled,
    ]);

    const handleJoin = () => {
        onSubmit({
            username: username || "Anonymous",
            videoEnabled: mediaPreferences.videoEnabled,
            audioEnabled: mediaPreferences.audioEnabled,
            videoDeviceId: mediaPreferences.videoDeviceId,
            audioDeviceId: mediaPreferences.audioDeviceId,
        });
    };

    const [play] = useSound("https://assets.chanhdai.com/sounds/ios/unlock.mp3", {
        volume: 0.5,
    })

    return (
        <Card className="w-full max-w-md mx-auto border-white/10 bg-background/20 backdrop-blur-xl shadow-2xl overflow-hidden rounded-[24px]">

            <CardContent className="flex flex-col gap-4 lg:gap-6">
                {/* Preview Area */}
                <div className="relative aspect-video w-full rounded-xl lg:rounded-2xl overflow-hidden border border-white/10 bg-black/40 group shadow-inner">
                    <AnimatePresence mode="wait">
                        {mediaPreferences.videoEnabled ? (
                            <motion.video
                                key="video"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="size-full object-cover mirror"
                            />
                        ) : (
                            <motion.div
                                key="no-video"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="size-full flex flex-col items-center justify-center bg-neutral-900/50 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_44%),linear-gradient(315deg,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_48%)]" />
                                <Avatar className="size-16 lg:size-24 border-2 border-white/10 bg-background/12 backdrop-blur shadow-2xl relative z-10">
                                    {user?.imageUrl && <AvatarImage src={user.imageUrl} alt={username} />}
                                    <AvatarFallback className="bg-transparent text-xl lg:text-2xl font-semibold text-primary-foreground">
                                        {getInitials(username || user?.fullName || "Guest")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-3 lg:bottom-4 left-3 lg:left-4 flex items-center gap-2 rounded-lg bg-black/55 px-2 lg:px-3 py-1 lg:py-1.5 text-[10px] lg:text-xs font-medium text-white backdrop-blur-lg z-10 border border-white/5">
                                    <VideoOff className="size-3 lg:size-3.5" />
                                    Camera off
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {/* Audio Level Indicator */}
                    {mediaPreferences.audioEnabled && (
                        <div className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full bg-black/55 backdrop-blur-lg border border-white/5 z-10">
                            <Mic className="size-3 lg:size-3.5 text-primary" />
                            <div className="flex gap-0.5 items-end h-3">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-primary rounded-full"
                                        animate={{
                                            height: `${Math.max(20, micLevel * (100 - i * 15))}%`
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Device Toggles & Selectors */}
                <div className="flex flex-col gap-3 lg:gap-4">
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                        <GlassSurface borderRadius={999} className="w-full p-0.5" width="100%" height="auto">
                            <label
                                className={cn(
                                    "w-full flex items-center justify-between px-3 lg:px-4 py-1.5 lg:py-2 rounded-full transition-all duration-300 cursor-pointer gap-1",
                                    mediaPreferences.audioEnabled ? " text-primary" : " text-white/40"
                                )}
                            >
                                <div className="flex items-center gap-2 lg:gap-3 ">
                                    {mediaPreferences.audioEnabled ? <Mic className="size-4 lg:size-5" /> : <MicOff className="size-4 lg:size-5" />}
                                    <span className="text-xs lg:text-sm font-bold uppercase tracking-wider">Audio</span>
                                </div>
                                <Switch 
                                    checked={mediaPreferences.audioEnabled}
                                    onCheckedChange={(checked) => setMediaPreferences({ audioEnabled: checked })}
                                />
                            </label>
                        </GlassSurface>

                        <GlassSurface borderRadius={999} className="w-full p-0.5" width="100%" height="auto">
                            <label
                                className={cn(
                                    "w-full flex items-center justify-between px-3 lg:px-4 py-1.5 lg:py-2 rounded-full transition-all duration-300 cursor-pointer gap-1",
                                    mediaPreferences.videoEnabled ? " text-primary" : " text-white/40"
                                )}
                            >
                                <div className="flex items-center gap-2 lg:gap-3">
                                    {mediaPreferences.videoEnabled ? <Camera className="size-4 lg:size-5" /> : <VideoOff className="size-4 lg:size-5" />}
                                    <span className="text-xs lg:text-sm font-bold uppercase tracking-wider">Video</span>
                                </div>
                                <Switch 
                                    checked={mediaPreferences.videoEnabled}
                                    onCheckedChange={(checked) => setMediaPreferences({ videoEnabled: checked })}
                                />
                            </label>
                        </GlassSurface>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:gap-4">


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    disabled={!mediaPreferences.audioEnabled}
                                    className="w-full h-10 lg:h-12 justify-between border-white/10 rounded-full hover:bg-white/10 text-white/70 px-3 lg:px-4 disabled:opacity-20 transition-all active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Mic className="size-3 lg:size-4 shrink-0" />
                                        <span className="truncate text-[10px] lg:text-xs font-medium">
                                            {audioDevices.find(d => d.deviceId === mediaPreferences.audioDeviceId)?.label || "Select Mic"}
                                        </span>
                                    </div>
                                    <ChevronDown className="size-3 lg:size-4 shrink-0 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 bg-neutral-900/90 backdrop-blur-xl border-white/10 rounded-xl">
                                {audioDevices.map(device => (
                                    <DropdownMenuItem 
                                        key={device.deviceId} 
                                        className="text-xs focus:bg-primary/20 focus:text-primary py-2.5 rounded-lg cursor-pointer"
                                        onClick={() => setMediaPreferences({ audioDeviceId: device.deviceId })}
                                    >
                                        {device.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={!mediaPreferences.videoEnabled}
                                    className="w-full h-10 lg:h-12 justify-between border-white/10 rounded-full hover:bg-white/10 text-white/70 px-3 lg:px-4 disabled:opacity-20 transition-all active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Camera className="size-3 lg:size-4 shrink-0" />
                                        <span className="truncate text-[10px] lg:text-xs font-medium">
                                            {videoDevices.find(d => d.deviceId === mediaPreferences.videoDeviceId)?.label || "Select Camera"}
                                        </span>
                                    </div>
                                    <ChevronDown className="size-3 lg:size-4 shrink-0 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 bg-neutral-900/90 backdrop-blur-xl border-white/10 rounded-xl">
                                {videoDevices.map(device => (
                                    <DropdownMenuItem
                                        key={device.deviceId}
                                        className="text-xs focus:bg-primary/20 focus:text-primary py-2.5 rounded-lg cursor-pointer"
                                        onClick={() => setMediaPreferences({ videoDeviceId: device.deviceId })}
                                    >
                                        {device.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Final Join Button */}

                <SlideToUnlock
                    className={'w-full rounded-full'}
                    onUnlock={() => {
                        play()
                        handleJoin()
                    }}
                >
                    <SlideToUnlockTrack >
                        <SlideToUnlockText>
                            {({ isDragging }) => (
                                <ShimmeringText text="Slide to Join" isStopped={isDragging} />
                            )}
                        </SlideToUnlockText>
                        <SlideToUnlockHandle className={'rounded-full'}/>
                    </SlideToUnlockTrack>
                </SlideToUnlock>

            </CardContent>
        </Card>
    );
}
