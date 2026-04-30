'use client'

import {useRouter} from "next/navigation";
import dynamic from "next/dynamic";
import {motion} from "framer-motion";
import {AnimatedShinyText} from "@/components/ui/animated-shiny-text";
import {LayersIcon} from "@/components/ui/layers";
import {cn} from "@/lib/utils";
import SplitButton from "@/components/ui/split-button";
import AnimatedContent from "@/components/AnimatedContent";
import { WordRotate } from "@/components/ui/word-rotate";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const FeatureSection = dynamic(
    () => import("@/components/feature-section").then((mod) => mod.FeatureSection),
    {
        ssr: false,
        loading: () => <div className="min-h-[520px]" aria-hidden="true" />,
    },
);

const TextHoverEffect = dynamic(
    () => import("@/components/ui/text-hover-effect").then((mod) => mod.TextHoverEffect),
    {
        ssr: false,
        loading: () => <div className="h-full w-full" aria-hidden="true" />,
    },
);

export default function Home() {
    const router = useRouter()

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">

            {/* Hero */}
            <section className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center sm:px-6 overflow-hidden">
                {/* Flickering grid background */}
                <div className="pointer-events-none absolute inset-0 z-0">
                    <FlickeringGrid
                        className="absolute inset-0 z-0 h-full w-full [mask-image:radial-gradient(ellipse_at_center,white_30%,transparent_80%)]"
                        squareSize={4}
                        gridGap={6}
                        color="#ffffff"
                        maxOpacity={0.4}
                        flickerChance={0.1}
                    />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={false}
                        duration={0.8}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0.1}
                        delay={0.2}
                    >
                        <div
                            className={cn(
                                "group rounded-full border border-black/5 bg-neutral-100/50 text-base text-white transition-all ease-in-out hover:cursor-pointer hover:bg-neutral-200/50 dark:border-white/5 dark:bg-neutral-900/50 dark:hover:bg-neutral-800/50"
                            )}
                        >
                            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-in-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                                <LayersIcon size={20} className={'mr-1'} /> Production video rooms
                            </AnimatedShinyText>
                        </div>
                    </AnimatedContent>

                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={false}
                        duration={0.8}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0.1}
                        delay={0.4}
                    >
                        <h1 className="flex flex-col items-center justify-center text-balance max-w-5xl text-4xl tracking-wide sm:text-5xl md:text-7xl font-extrabold font-(family-name:--font-share-tech) uppercase">
                            <span>Video collaboration for</span>
                            <WordRotate className="text-primary" words={["Pair Programming", "Remote Teams", "Whiteboarding", "Brainstorming"]} />
                        </h1>
                    </AnimatedContent>

                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={false}
                        duration={0.8}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0.1}
                        delay={0.6}
                    >
                        <p className="hidden sm:block text-balance max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
                            Experience seamless video collaboration with ultra-low latency and real-time shared tools effortlessly!
                        </p>
                    </AnimatedContent>

                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={false}
                        duration={0.8}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0.1}
                        delay={0.8}
                    >
                        <SplitButton
                            label="Get Started"
                            actions={[
                                { label: 'New Meeting', onClick: () => router.push('/create') },
                                { label: 'Join Meeting', onClick: () => router.push('/join') },
                            ]}
                        />
                    </AnimatedContent>
                </div>
            </section>

            {/* Features */}
            <motion.section
                id="features"
                initial="hidden"
                whileInView="show"
                viewport={{once: true, margin: "-80px"}}
                className="section-shell relative px-4 pb-16 pt-4 sm:px-6 sm:pb-20"
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

            {/* Footer */}
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
