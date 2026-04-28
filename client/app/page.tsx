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
import { FeatureSection } from "@/components/feature-section";
import {TextHoverEffect} from "@/components/ui/text-hover-effect";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import SplitButton from "@/components/ui/split-button";
import { useLenis } from 'lenis/react';
import { useScroll, useTransform } from 'framer-motion';

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
    const { scrollY } = useScroll();
    const backgroundY = useTransform(scrollY, [0, 1000], [0, 400]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            <motion.div
                className="pointer-events-none absolute inset-0 z-0 h-screen"
                style={{
                    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    y: backgroundY,
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
            </motion.div>

            <div className="relative ">
                <MacbookScroll
                    title={
                        <div className="flex flex-col items-center justify-center gap-6 px-4 sm:px-0">
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

                            <h1 className="text-balance max-w-5xl text-4xl tracking-wide sm:text-5xl md:text-7xl font-extrabold font-(family-name:--font-share-tech) uppercase">
                                Start focused calls that stay quiet, clear, and fast
                            </h1>
                            <SplitButton
                                label="Get Started"
                                actions={[
                                    { label: 'New Meeting', onClick: () => router.push('/create') },
                                    { label: 'Join Meeting', onClick: () => router.push('/join') },

                                ]}
                            />
                        </div>
                    }
                    src={`/linear.webp`}
                    showGradient={false}
                />
            </div>

            <div className="h-[10vh] sm:h-[40vh] md:h-[80vh] lg:h-[120vh]" />

            <motion.section
                id="features"
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-80px"}}
                className="section-shell relative px-4 pb-20 sm:px-6"
            >
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Features that empower your team
                    </h2>
                    <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                        Everything you need for seamless collaboration, and more tools on the way.
                    </p>
                </div>
                <FeatureSection />
            </motion.section>



            <footer className="relative border-t bg-background/50 backdrop-blur-sm pt-12 pb-8 px-4 sm:px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="h-40 w-full max-w-2xl mx-auto">
                            <TextHoverEffect text="Axon" className="w-full h-full" />
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} Axon. Built with Next.js and LiveKit.
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
