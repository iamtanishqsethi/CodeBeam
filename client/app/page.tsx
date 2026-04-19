'use client'

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ArrowRight, Plus, Shield, Users, Video, Zap} from "lucide-react";
import {motion} from "framer-motion";
import ShinyText from "@/components/reactbits/ShinyText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

const features = [
    {
        icon: Video,
        title: "HD Video Calls",
        description: "Crystal-clear video powered by LiveKit with adaptive bitrate and noise cancellation.",
    },
    {
        icon: Users,
        title: "Real-time Collaboration",
        description: "Chat, react, and share screens — all in a single, fluid interface.",
    },
    {
        icon: Shield,
        title: "Secure by Default",
        description: "End-to-end encrypted rooms with waiting room approval and host controls.",
    },
];

const stagger = {
    hidden: {},
    show: {transition: {staggerChildren: 0.12}},
};

const fadeUp = {
    hidden: {opacity: 0, y: 24},
    show: {opacity: 1, y: 0, transition: {duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const}},
};

export default function Home() {
    const router = useRouter()

    return (
        <div className="relative min-h-screen overflow-hidden bg-background pt-16">
            <div className="interface-grid-bg pointer-events-none absolute inset-x-0 top-0 h-[28rem]" />

            <motion.section
                variants={stagger}
                initial="hidden"
                animate="show"
                className="section-shell relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-6 px-4 pb-20 pt-16 text-center sm:px-6"
            >
                <motion.div variants={fadeUp}>
                    <div className="rounded-lg border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
                        Production video rooms
                    </div>
                </motion.div>

                <motion.h1
                    variants={fadeUp}
                    className="text-balance max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
                >
                    Start focused calls that stay{" "}
                    <ShinyText
                        text="quiet, clear, and fast"
                        speed={4}
                        color="var(--foreground)"
                        shineColor="var(--primary)"
                        className="font-semibold tracking-tight"
                    />
                </motion.h1>

                <motion.p variants={fadeUp} className="max-w-2xl text-base leading-7 text-muted-foreground">
                    CodeBeam keeps the first screen in the meeting, with fast room creation, guest-friendly joining, chat, reactions, screen sharing, and host approval.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                        size="lg"
                        onClick={() => router.push("/create")}
                        className="interactive-lift px-6 shadow-sm shadow-primary/20"
                    >
                        <Plus data-icon="inline-start" />
                        New Meeting
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => router.push("/join")}
                        className="interactive-lift px-6"
                    >
                        <ArrowRight data-icon="inline-end" />
                        Join Meeting
                    </Button>
                </motion.div>
            </motion.section>

            <motion.section
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-80px"}}
                className="section-shell relative grid gap-4 px-4 pb-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-3"
            >
                {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div key={feature.title} variants={fadeUp}>
                            <SpotlightCard
                                className="surface-panel interactive-lift flex min-h-52 flex-col gap-4 p-5"
                                spotlightColor="color-mix(in oklch, var(--primary) 16%, transparent)"
                            >
                                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                                    <Icon className="text-primary" />
                                </div>
                                <h3 className="text-base font-semibold">{feature.title}</h3>
                                <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                            </SpotlightCard>
                        </motion.div>
                    );
                })}
            </motion.section>

            <motion.section
                initial={{opacity: 0, y: 24}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5}}
                className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 pb-20 text-center sm:px-6"
            >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="text-primary" />
                </div>
                <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">Start your meeting in seconds</h2>
                <p className="text-muted-foreground">No downloads. No signups for guests. Just share the link.</p>
                <Button
                    size="lg"
                    onClick={() => router.push("/create")}
                    className="interactive-lift px-7 shadow-sm shadow-primary/20"
                >
                    <Video data-icon="inline-start" />
                    Create Meeting
                </Button>
            </motion.section>

            <footer className="border-t py-8 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} CodeBeam. Built with Next.js and LiveKit.</p>
            </footer>
        </div>
    );
}
