'use client'

import {LocalUserChoices, PreJoin} from '@livekit/components-react';
import {useRouter} from 'next/navigation';
import {createMeeting} from '@/services/api';
import {useState} from 'react';
import {useMeetingStore} from '@/store/meetingStore';
import {Loader2} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {motion} from 'framer-motion';

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
        <div className="app-shell">
            <div className="interface-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[28rem]" />

            <div className="section-shell relative flex min-h-[calc(100svh-7rem)] items-center justify-center">
                {isCreating ? (
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        className="surface-panel flex flex-col items-center gap-4 px-10 py-14"
                    >
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium">Creating meeting...</p>
                    </motion.div>
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
                                    Create meeting
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Set up before you go live
                                    </h1>
                                    <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                                        Pick a display name, check your camera and microphone, and give the room a title if you want one.
                                    </p>
                                </div>
                                <div className="surface-panel-muted p-5">
                                    <label className="mb-2 block text-sm font-medium text-foreground">
                                        Meeting title
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="Untitled Meeting"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="h-11 bg-background"
                                    />
                                    <p className="mt-3 text-sm text-muted-foreground">
                                        Leave this empty if you want the room to start with a default title.
                                    </p>
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
                                {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
