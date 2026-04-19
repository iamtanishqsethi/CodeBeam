'use client'

import {LocalUserChoices, PreJoin} from '@livekit/components-react';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useMeetingStore} from '@/store/meetingStore';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {motion} from 'framer-motion';

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
        <div className="app-shell">
            <div className="interface-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[28rem]" />

            <div className="section-shell relative flex min-h-[calc(100svh-7rem)] items-center justify-center">
                {!showPreJoin ? (
                    <motion.section
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.4}}
                        className="surface-panel w-full max-w-3xl p-5 sm:p-8"
                    >
                        <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
                            <div className="rounded-lg border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                Join meeting
                            </div>

                            <div className="flex flex-col gap-3">
                                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Enter the room code</h1>
                                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                                    Paste the meeting ID from the host, then continue to camera and microphone setup.
                                </p>
                            </div>
                            <div className="surface-panel-muted w-full p-5">
                                <Input
                                    placeholder="Enter meeting ID"
                                    value={meetingId}
                                    onChange={(e) => setMeetingId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                    className="h-11 text-center text-base"
                                />
                                <Button
                                    onClick={handleJoin}
                                    className="interactive-lift mt-4 h-11 w-full shadow-sm shadow-primary/20"
                                    disabled={!meetingId.trim()}
                                >
                                    <ArrowRight data-icon="inline-end" />
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
                        className="prejoin-shell surface-panel w-full p-4 sm:p-6 lg:p-8"
                    >
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
                            <div className="flex flex-col gap-5">
                                <div className="w-fit rounded-lg border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                    Join meeting
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Check your setup</h1>
                                    <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Confirm your camera, microphone, and display name before entering the meeting.
                                    </p>
                                </div>
                                <div className="surface-panel-muted p-5">
                                    <p className="text-sm font-medium text-foreground">Meeting ID</p>
                                    <code className="mt-3 block rounded-lg bg-muted px-4 py-3 text-sm font-medium tracking-[0.2em] text-foreground">
                                        {meetingId.trim()}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setShowPreJoin(false)}
                                        className="interactive-lift mt-4 h-11 w-full justify-center border bg-background/70"
                                    >
                                        <ArrowLeft data-icon="inline-start" />
                                        Back to meeting ID
                                    </Button>
                                </div>
                            </div>

                            <div className="surface-panel-muted p-4 sm:p-5">
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
