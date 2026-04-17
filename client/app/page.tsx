'use client'

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ArrowRight, Plus, Shield, Users, Video, Zap} from "lucide-react";
import {motion} from "framer-motion";
import GradientText from "@/components/reactbits/GradientText";
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
            {/* Ambient glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-[35%] left-1/2 h-[60rem] w-[80rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.55_0.22_270_/_0.12),transparent_60%)]" />
                <div className="absolute -bottom-[30%] right-0 h-[50rem] w-[60rem] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.16_320_/_0.08),transparent_55%)]" />
            </div>

            {/* Hero */}
            <motion.section
                variants={stagger}
                initial="hidden"
                animate="show"
                className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pb-20 pt-24 text-center"
            >
                <motion.div variants={fadeUp}>
                    <GradientText
                        colors={["#7c3aed", "#c084fc", "#f472b6", "#7c3aed"]}
                        animationSpeed={6}
                        showBorder
                        className="px-4 py-1.5 text-sm font-semibold"
                    >
                        ✨ Video meetings, reimagined
                    </GradientText>
                </motion.div>

                <motion.h1
                    variants={fadeUp}
                    className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                >
                    Where teams{" "}
                    <ShinyText
                        text="connect"
                        speed={3}
                        color="oklch(0.68 0.20 270)"
                        shineColor="#e0cbff"
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                    />{" "}
                    and build
                </motion.h1>

                <motion.p variants={fadeUp} className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                    Focused video rooms for dev teams. No distractions. No clutter. Just seamless calls with real-time chat, screen sharing, and host controls.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                        size="lg"
                        onClick={() => router.push("/create")}
                        className="gap-2 rounded-full px-7 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                        <Plus />
                        New Meeting
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => router.push("/join")}
                        className="gap-2 rounded-full border-white/[0.1] px-7 transition-all hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                        <ArrowRight />
                        Join Meeting
                    </Button>
                </motion.div>
            </motion.section>

            {/* Features */}
            <motion.section
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-80px"}}
                className="relative mx-auto grid max-w-5xl gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3"
            >
                {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div key={feature.title} variants={fadeUp}>
                            <SpotlightCard
                                className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-card/80 p-7 shadow-xl backdrop-blur-xl"
                                spotlightColor="rgba(124, 58, 237, 0.15)"
                            >
                                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                                    <Icon className="size-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                            </SpotlightCard>
                        </motion.div>
                    );
                })}
            </motion.section>

            {/* Bottom CTA */}
            <motion.section
                initial={{opacity: 0, y: 24}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5}}
                className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 pb-24 text-center"
            >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Zap className="size-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Start your meeting in seconds</h2>
                <p className="text-muted-foreground">No downloads. No signups for guests. Just share the link.</p>
                <Button
                    size="lg"
                    onClick={() => router.push("/create")}
                    className="gap-2 rounded-full px-8 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                    <Video />
                    Create Meeting
                </Button>
            </motion.section>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-8 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} CodeBeam. Built with Next.js, LiveKit, and ❤️</p>
            </footer>
        </div>
    );
}
