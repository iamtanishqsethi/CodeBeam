'use client'

import {LocalUserChoices, PreJoin} from '@livekit/components-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useMeetingStore} from '@/store/meetingStore';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {motion} from 'framer-motion';
import GradientText from "@/components/reactbits/GradientText";

export default function JoinMeetingPage() {
    const router = useRouter();
    const [meetingId, setMeetingId] = useState('');
    const [showPreJoin, setShowPreJoin] = useState(false);
    const mediaPreferences = useMeetingStore(state => state.mediaPreferences);
    const setMediaPreferences = useMeetingStore(state => state.setMediaPreferences);

    const handleJoin = () => {
        if (!meetingId.trim()) return;
        setShowPreJoin(true);
    };

    const handlePreJoinSubmit = (values: LocalUserChoices) => {
        setMediaPreferences(values);
        router.push(`/meeting/${meetingId.trim()}`);
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background px-6 py-10 pt-20">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-[30%] right-1/4 h-[40rem] w-[50rem] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.16_320_/_0.08),transparent_60%)]" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
                {!showPreJoin ? (
                    <motion.section
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4}}
                        className="w-full max-w-3xl rounded-2xl border border-white/[0.08] bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
                    >
                        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
                            <GradientText
                                colors={["#7c3aed", "#c084fc", "#f472b6", "#7c3aed"]}
                                animationSpeed={6}
                                showBorder
                                className="px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                            >
                                Join meeting
                            </GradientText>

                            <div className="space-y-3">
                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Enter the room code</h1>
                                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                                    Paste the meeting ID from the host, then continue to camera and microphone setup.
                                </p>
                            </div>
                            <div className="w-full rounded-xl border border-white/[0.08] bg-background/70 p-5 shadow-sm backdrop-blur">
                                <Input
                                    placeholder="Enter meeting ID"
                                    value={meetingId}
                                    onChange={(e) => setMeetingId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                    className="h-12 text-center text-base sm:text-lg"
                                />
                                <Button
                                    onClick={handleJoin}
                                    className="mt-4 h-11 w-full gap-2 rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.97]"
                                    disabled={!meetingId.trim()}
                                >
                                    <ArrowRight />
                                    Continue to device check
                                </Button>
                            </div>
                        </div>
                    </motion.section>
                ) : (
                    <motion.section
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4}}
                        className="prejoin-shell w-full rounded-2xl border border-white/[0.08] bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10"
                    >
                        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
                            <div className="space-y-5">
                                <GradientText
                                    colors={["#7c3aed", "#c084fc", "#f472b6", "#7c3aed"]}
                                    animationSpeed={6}
                                    showBorder
                                    className="px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                                >
                                    Join meeting
                                </GradientText>

                                <div className="space-y-3">
                                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Check your setup</h1>
                                    <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Confirm your camera, microphone, and display name before entering the meeting.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-white/[0.08] bg-background/70 p-5 shadow-sm backdrop-blur">
                                    <p className="text-sm font-medium text-foreground">Meeting ID</p>
                                    <code className="mt-3 block rounded-xl bg-muted px-4 py-3 text-sm font-medium tracking-[0.2em] text-foreground">
                                        {meetingId.trim()}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowPreJoin(false)}
                                        className="mt-4 h-11 w-full justify-center gap-2 rounded-xl border border-white/[0.08] bg-background/70"
                                    >
                                        <ArrowLeft />
                                        Back to meeting ID
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/[0.08] bg-background/55 p-4 shadow-sm backdrop-blur sm:p-6">
                                <PreJoin
                                    className="lk-prejoin prejoin-widget--hide-username"
                                    data-lk-theme="default"
                                    onSubmit={handlePreJoinSubmit}
                                    onError={(err) => console.log('error', err)}
                                    onValidate={() => true}
                                    userLabel=""
                                    defaults={{
                                        username: mediaPreferences.username,
                                        videoEnabled: mediaPreferences.videoEnabled,
                                        audioEnabled: mediaPreferences.audioEnabled,
                                        audioDeviceId: mediaPreferences.audioDeviceId,
                                        videoDeviceId: mediaPreferences.videoDeviceId,
                                    }}
                                />
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
