'use client'

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ArrowRight, Plus, Shield, Users, Video, Zap} from "lucide-react";
import {motion} from "framer-motion";
import ShinyText from "@/components/reactbits/ShinyText";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import Prism from "@/components/Prism";
import {AnimatedShinyText} from "@/components/ui/animated-shiny-text";
import {LayersIcon} from "@/components/ui/layers";
import {cn} from "@/lib/utils";
import {InteractiveHoverButton} from "@/components/ui/interactive-hover-button";
import {PlusIcon} from "@/components/ui/plus";
import GlassSurface from "@/components/GlassSurface";
import FeaturesSectionDemo from "@/components/features-section-demo-2";
import {TextHoverEffect} from "@/components/ui/text-hover-effect";

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
        <div className="relative min-h-screen overflow-hidden bg-background ">
            <motion.section
                variants={stagger}
                initial="hidden"
                animate="show"
                className="relative flex min-h-[calc(100svh)] flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-20 text-center sm:px-6">
                <div
                    className="pointer-events-none absolute inset-0 z-0"
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

                <div className="section-shell relative z-10 flex flex-col items-center justify-center gap-6">
                    <motion.div variants={fadeUp}>
                        <div
                            className={cn(
                                "group rounded-full border border-black/5 bg-neutral-100/50 text-base text-white transition-all ease-in-out hover:cursor-pointer hover:bg-neutral-200/50 dark:border-white/5 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50"
                            )}
                        >
                        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-in-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                            <LayersIcon size={20} className={'mr-1'}/>   Production video rooms
                        </AnimatedShinyText>
                        </div>

                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        className="text-balance max-w-5xl text-4xl tracking-wide sm:text-5xl md:text-7xl font-extrabold font-(family-name:--font-share-tech) uppercase"
                    >
                        Start focused calls that stay quiet, clear, and fast
                    </motion.h1>

                    <motion.p variants={fadeUp} className="max-w-2xl text-base leading-7 text-muted-foreground font-bold">
                        CodeBeam keeps the first screen in the meeting, with fast room creation, guest-friendly joining, chat, reactions, screen sharing, and host approval.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 pt-2">

                            <Button

                                onClick={() => router.push("/create")}
                                className="relative z-10  rounded-full shadow-sm shadow-primary/20 cursor-pointer transition ease-in-out"
                            >
                                <PlusIcon size={20} />
                                New Meeting
                            </Button>
                        <InteractiveHoverButton
                            className={' py-3'}
                            onClick={() => router.push("/join")}>
                            Join Meeting
                        </InteractiveHoverButton>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-80px"}}
                className="section-shell relative px-4 pb-20 sm:px-6 pt-12"
            >
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Features that empower your team
                    </h2>
                    <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                        Everything you need for seamless collaboration, and more tools on the way.
                    </p>
                </div>
                <FeaturesSectionDemo />
            </motion.section>



            <footer className="relative border-t bg-background/50 backdrop-blur-sm pt-12 pb-8 px-4 sm:px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="h-40 w-full max-w-2xl mx-auto">
                            <TextHoverEffect text="CodeBeam" className="w-full h-full" />
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} CodeBeam. Built with Next.js and LiveKit.
                            </p>
                            <p className="text-sm font-medium text-muted-foreground">
                                Made by{" "}
                                <a 
                                    href="https://iamtanishqsethi.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-foreground hover:text-primary transition-all underline-offset-4 hover:underline decoration-primary/50 font-bold"
                                >
                                    Tanishq Sethi
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
