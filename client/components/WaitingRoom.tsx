"use client";

import {Camera, Clock, Loader2, Mic, User, VideoOff} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useMeetingStore} from "@/store/meetingStore";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useUser} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";

interface WaitingRoomProps {
    meetingId: string;
}

export default function WaitingRoom({meetingId}: WaitingRoomProps) {
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
        <div className="min-h-screen bg-background px-6 py-10">
            <div className="mx-auto grid min-h-[calc(100svh-5rem)] w-full max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-center">
                <section className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium uppercase text-muted-foreground">Waiting room</p>
                        <h1 className="text-3xl font-bold tracking-tight">Check your setup</h1>
                        <p className="max-w-2xl text-muted-foreground">
                            The host will let you in from here.
                        </p>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-lg border bg-tile shadow-lg">
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
                                <Avatar className="size-24 border border-border/40 bg-background/12">
                                    {user?.imageUrl && <AvatarImage src={user.imageUrl} />}
                                    <AvatarFallback className="bg-transparent text-2xl font-semibold text-primary-foreground">
                                        {user?.firstName ? user.firstName.slice(0, 2).toUpperCase() : "CB"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-muted-overlay px-3 py-1 text-sm font-medium text-primary-foreground backdrop-blur">
                                    <VideoOff />
                                    Camera off
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className="flex flex-col gap-5 rounded-lg border bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Clock />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Ready when the host is</h2>
                            <p className="text-sm text-muted-foreground">Your request is already in the queue.</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="flex items-center justify-between gap-4 rounded-lg border p-3">
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
                            <SelectTrigger className="w-full">
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

                        <label className="flex items-center justify-between gap-4 rounded-lg border p-3">
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
                            <SelectTrigger className="w-full">
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

                        <div className="flex items-end gap-1 rounded-lg border p-3" aria-label="Microphone level">
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
                        className="interactive-lift h-12"
                    >
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                        Waiting for host
                    </Button>

                    <div className="flex flex-col gap-2 border-t pt-4">
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User />
                            Meeting ID
                        </p>
                        <code className="block rounded-lg bg-muted px-4 py-3 text-sm font-medium tracking-[0.2em]">
                            {meetingId}
                        </code>
                    </div>
                </section>
            </div>
        </div>
    );
}
