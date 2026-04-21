'use client'

import {useRouter} from 'next/navigation';
import {createMeeting} from '@/services/api';
import {useState} from 'react';
import {useMeetingStore} from '@/store/meetingStore';
import {Video, Sparkles, Layout} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {motion} from 'framer-motion';
import Prism from "@/components/Prism";
import GlassSurface from "@/components/GlassSurface";
import {AnimatedShinyText} from "@/components/ui/animated-shiny-text";
import {cn} from "@/lib/utils";

import {Spinner} from "@/components/kibo-ui/spinner";

import CustomPreJoin from '@/components/CustomPreJoin';
import {FloatingInput} from "@/components/ui/floating-input";
import {toast} from "sonner";

const fadeUp = {
    hidden: {opacity: 0, y: 24},
    show: {opacity: 1, y: 0, transition: {duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const}},
};

export default function CreateMeetingPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setHost = useMeetingStore(state => state.setHost);
    const setMediaPreferences = useMeetingStore(state => state.setMediaPreferences);

    const handlePreJoinSubmit = async (values: {
        username: string;
        videoEnabled: boolean;
        audioEnabled: boolean;
        videoDeviceId: string;
        audioDeviceId: string;
    }) => {
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
        <div className="relative min-h-screen overflow-hidden bg-background">
            <div
                className="pointer-events-none absolute inset-0 z-0 h-screen"
                style={{
                    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                }}
            >
                <Prism
                    animationType="rotate"
                    timeScale={0.5}
                    height={3.5}
                    baseWidth={5.5}
                    scale={3.6}
                    hueShift={0}
                    colorFrequency={1}
                    noise={0}
                    glow={1}
                />
            </div>

            <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
                {isCreating ? (
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        className={'flex flex-col items-center justify-center gap-4'}
                    >
                            <Spinner  variant={'bars'} size={40}  />
                            <div className="text-center">
                                <h2 className="text-2xl font-bold tracking-wide font-(family-name:--font-share-tech) uppercase">Initializing</h2>
                                <p className="text-muted-foreground mt-2 text-sm">Preparing your secure room...</p>
                            </div>

                    </motion.div>
                ) : (
                    <motion.section
                        variants={fadeUp}
                        initial="hidden"
                        animate="show"
                        className="w-full max-w-6xl"
                    >
                        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
                            <div className="flex flex-col gap-8 justify-center">
                                <div className="flex flex-col gap-6">
                                    <motion.div variants={fadeUp}>
                                        <div
                                            className={cn(
                                                "group w-fit rounded-full border border-black/5 bg-neutral-100/50 text-base text-white transition-all ease-in-out dark:border-white/5 dark:bg-neutral-900/50"
                                            )}
                                        >
                                            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-in-out">
                                                <Video size={16} className={'mr-2'}/> Create meeting
                                            </AnimatedShinyText>
                                        </div>
                                    </motion.div>

                                    <div className="flex flex-col gap-4">
                                        <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-(family-name:--font-share-tech) uppercase">
                                            Set up before you go live
                                        </h1>
                                        <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                            Check your camera and microphone, and give the room a title if you want one.
                                        </p>
                                    </div>
                                </div>



                                        <FloatingInput
                                            label={'Meeting Title (Optional)'}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="h-12 bg-background/50 border-white/10 text-lg font-medium rounded-full"
                                        />


                            </div>

                            <div className="flex items-center justify-center w-full max-w-xl mx-auto lg:mx-0">
                                <CustomPreJoin
                                    onSubmit={handlePreJoinSubmit}
                                />
                                {error && toast.error(error)}
                            </div>
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
