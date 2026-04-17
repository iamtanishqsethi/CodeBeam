"use client";

import {Camera, Clock, Loader2, Mic, MicOff, User, VideoOff} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useMeetingStore} from "@/store/meetingStore";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useUser} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {motion} from "framer-motion";
import {cn} from "@/lib/utils";

interface MeetingLobbyProps {
    meetingId: string;
}

export default function MeetingLobby({meetingId}: MeetingLobbyProps) {
    const {user} = useUser();
    const mediaPreferences = useMeetingStore(state => state.mediaPreferences);
    const setMediaPreferences = useMeetingStore(state => state.setMediaPreferences);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [micLevel, setMicLevel] = useState(0);

    const videoDevices = devices.filter(device => device.kind === "videoinput");
    const audioDevices = devices.filter(device => device.kind === "audioinput");

    useEffect(() => {
        if (!navigator.mediaDevices?.enumerateDevices) return;

        const loadDevices = async () => {
            const nextDevices = await navigator.mediaDevices.enumerateDevices();
            setDevices(nextDevices);
        };

        void loadDevices();
        navigator.mediaDevices.addEventListener?.("devicechange", loadDevices);
        return () => navigator.mediaDevices.removeEventListener?.("devicechange", loadDevices);
    }, []);

    useEffect(() => {
        if (!navigator.mediaDevices?.getUserMedia) return;
        if (!mediaPreferences.videoEnabled && !mediaPreferences.audioEnabled) {
            if (videoRef.current) videoRef.current.srcObject = null;
            queueMicrotask(() => setMicLevel(0));
            return;
        }

        let cancelled = false;
        let stream: MediaStream | null = null;
        let frame = 0;
        let audioContext: AudioContext | null = null;

        const startPreview = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: mediaPreferences.videoEnabled
                        ? {
                            deviceId: mediaPreferences.videoDeviceId
                                ? {exact: mediaPreferences.videoDeviceId}
                                : undefined,
                        }
                        : false,
                    audio: mediaPreferences.audioEnabled
                        ? {
                            deviceId: mediaPreferences.audioDeviceId
                                ? {exact: mediaPreferences.audioDeviceId}
                                : undefined,
                        }
                        : false,
                });

                if (cancelled) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack) {
                    audioContext = new AudioContext();
                    const analyser = audioContext.createAnalyser();
                    analyser.fftSize = 128;
                    const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
                    const data = new Uint8Array(analyser.frequencyBinCount);
                    source.connect(analyser);

                    const updateLevel = () => {
                        analyser.getByteFrequencyData(data);
                        const average = data.reduce((sum, value) => sum + value, 0) / data.length;
                        setMicLevel(Math.min(1, average / 90));
                        frame = requestAnimationFrame(updateLevel);
                    };

                    updateLevel();
                }
            } catch (error) {
                console.error(error);
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

    return (
        <div className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-10">
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, ease: "easeOut"}}
                className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-center"
            >
                {/* Left: Video preview */}
                <motion.section
                    initial={{opacity: 0, x: -20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.4, delay: 0.1}}
                    className="flex flex-col gap-5"
                >
                    <div className="flex flex-col gap-2">
                        <Badge variant="outline" className="w-fit border-primary/30 bg-primary/10 text-primary">
                            Waiting room
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight">Check your setup</h1>
                        <p className="max-w-2xl text-muted-foreground">
                            The host will let you in from here.
                        </p>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-tile shadow-2xl">
                        {mediaPreferences.videoEnabled ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="size-full object-cover"
                            />
                        ) : (
                            <div className="flex size-full items-center justify-center">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_40%),radial-gradient(circle_at_70%_70%,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_45%)]" />
                                <Avatar className="size-28 border-2 border-white/10 bg-background/12">
                                    {user?.imageUrl && <AvatarImage src={user.imageUrl} />}
                                    <AvatarFallback className="bg-transparent text-3xl font-semibold text-primary-foreground">
                                        {user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : "CB"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-lg">
                                    <VideoOff />
                                    Camera off
                                </div>
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* Right: Controls panel */}
                <motion.section
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.4, delay: 0.2}}
                    className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-card/80 p-5 shadow-2xl backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Clock />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Ready when the host is</h2>
                            <p className="text-sm text-muted-foreground">Your request is already in the queue.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Camera toggle */}
                        <label className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] p-3 transition-colors hover:bg-muted/30">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <Camera />
                                Camera
                            </span>
                            <Switch
                                checked={mediaPreferences.videoEnabled}
                                onCheckedChange={checked => setMediaPreferences({videoEnabled: checked})}
                                aria-label="Toggle camera"
                            />
                        </label>

                        <Select
                            value={mediaPreferences.videoDeviceId || "default"}
                            onValueChange={value => setMediaPreferences({videoDeviceId: value === "default" ? "" : value})}
                            disabled={!mediaPreferences.videoEnabled}
                        >
                            <SelectTrigger className="w-full rounded-xl border-white/[0.08]">
                                <SelectValue placeholder="Camera device" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="default">Default camera</SelectItem>
                                    {videoDevices.filter(device => device.deviceId).map((device, index) => (
                                        <SelectItem key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Camera ${index + 1}`}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Mic toggle */}
                        <label className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] p-3 transition-colors hover:bg-muted/30">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <Mic />
                                Microphone
                            </span>
                            <Switch
                                checked={mediaPreferences.audioEnabled}
                                onCheckedChange={checked => setMediaPreferences({audioEnabled: checked})}
                                aria-label="Toggle microphone"
                            />
                        </label>

                        <Select
                            value={mediaPreferences.audioDeviceId || "default"}
                            onValueChange={value => setMediaPreferences({audioDeviceId: value === "default" ? "" : value})}
                            disabled={!mediaPreferences.audioEnabled}
                        >
                            <SelectTrigger className="w-full rounded-xl border-white/[0.08]">
                                <SelectValue placeholder="Microphone device" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="default">Default microphone</SelectItem>
                                    {audioDevices.filter(device => device.deviceId).map((device, index) => (
                                        <SelectItem key={device.deviceId} value={device.deviceId}>
                                            {device.label || `Microphone ${index + 1}`}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {/* Mic level meter */}
                        <div className="flex items-end gap-1 rounded-xl border border-white/[0.08] p-3" aria-label="Microphone level">
                            {[0, 1, 2, 3, 4, 5].map(index => (
                                <span
                                    key={index}
                                    className="meter-bar h-8 flex-1 rounded-full bg-primary"
                                    style={{
                                        transform: `scaleY(${Math.max(0.12, micLevel * (0.45 + index * 0.12))})`,
                                        animationDelay: `${index * 70}ms`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        type="button"
                        size="lg"
                        disabled
                        className="h-12 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.97]"
                    >
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                        Waiting for host
                    </Button>

                    <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-4">
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User />
                            Meeting ID
                        </p>
                        <code className="block rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium tracking-[0.2em]">
                            {meetingId}
                        </code>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
}
