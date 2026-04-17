'use client'

import {LocalUserChoices, PreJoin} from '@livekit/components-react';
import {useRouter} from 'next/navigation';
import {createMeeting} from '@/services/api';
import {useState} from 'react';
import {useMeetingStore} from '@/store/meetingStore';
import {Loader2, Video} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {motion} from 'framer-motion';
import GradientText from "@/components/reactbits/GradientText";

export default function CreateMeetingPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setHost = useMeetingStore(state => state.setHost);
    const mediaPreferences = useMeetingStore(state => state.mediaPreferences);
    const setMediaPreferences = useMeetingStore(state => state.setMediaPreferences);

    const handlePreJoinSubmit = async (values: LocalUserChoices) => {
        setIsCreating(true);
        setError(null);
        setMediaPreferences(values);
        try {
            const meeting = await createMeeting(title || 'Untitled Meeting');
            setHost(true);
            router.push(`/meeting/${meeting.id}`);
        } catch (e) {
            console.error(e);
            setError('Failed to create meeting');
            setIsCreating(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background px-6 py-10 pt-20">
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-[30%] left-1/4 h-[40rem] w-[50rem] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.22_270_/_0.08),transparent_60%)]" />
            </div>

            <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
                {isCreating ? (
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.08] bg-card/80 px-10 py-14 shadow-2xl backdrop-blur-xl"
                    >
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium">Creating meeting...</p>
                    </motion.div>
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
                                    Create meeting
                                </GradientText>

                                <div className="space-y-3">
                                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        Set up before you go live
                                    </h1>
                                    <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Pick a display name, check your camera and microphone, and give the room a title if you want one.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-white/[0.08] bg-background/70 p-5 shadow-sm backdrop-blur">
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        Meeting title
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Untitled Meeting"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-12 rounded-xl border-white/[0.08] bg-background"
                                    />
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Leave this empty if you want the room to start with a default title.
                                    </p>
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
                                {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
