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
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import CardSwap, { Card } from "@/components/CardSwap";
import { MonitorPlay, PenTool, Code2 } from "lucide-react";


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


            {/* Hero Video Dialog */}
            <section className="relative px-4 pb-16 sm:px-6 sm:pb-20 flex justify-center mt-8 z-10">
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
                    <div className="w-full max-w-5xl mx-auto">
                        <HeroVideoDialog
                            animationStyle="from-center"
                            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                            thumbnailAlt="Hero Video"
                            className="w-full"
                        />
                    </div>
                </AnimatedContent>
            </section>

            {/* Features Section */}
            <section className="relative w-full overflow-hidden border-t bg-background/50 py-24 sm:py-32">
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
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="flex flex-col gap-6 z-10">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground font-(family-name:--font-share-tech) uppercase">
                                    Everything you need to build <span className="text-primary">together</span>
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    Axon combines high-fidelity video calling with powerful collaborative tools. 
                                    Whether you're pair programming, brainstorming on a whiteboard, or just catching up, 
                                    we provide a seamless experience to keep your team aligned.
                                </p>
                                
                                {/* Mobile-only Rich List */}
                                <div className="flex lg:hidden flex-col gap-6 mt-6 w-full max-w-xl">
                                    <div className="p-4 px-6 flex items-center gap-6 w-full justify-start rounded-[24px] border border-white/10 bg-neutral-900/80 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300 shadow-2xl">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-800/50 text-neutral-300 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                            <MonitorPlay size={28} />
                                        </div>
                                        <div className="flex flex-col text-left">
                                             <h4 className="text-xl font-bold text-foreground font-(family-name:--font-share-tech) uppercase tracking-wide">HD Video & Audio</h4>
                                             <span className="text-base text-muted-foreground mt-0.5">Ultra-low latency WebRTC connections</span>
                                        </div>
                                    </div>

                                    <div className="p-4 px-6 flex items-center gap-6 w-full justify-start rounded-[24px] border border-white/10 bg-neutral-900/80 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300 shadow-2xl">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-800/50 text-neutral-300 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                            <PenTool size={28} />
                                        </div>
                                        <div className="flex flex-col text-left">
                                             <h4 className="text-xl font-bold text-foreground font-(family-name:--font-share-tech) uppercase tracking-wide">Shared Whiteboard</h4>
                                             <span className="text-base text-muted-foreground mt-0.5">Real-time Excalidraw integration</span>
                                        </div>
                                    </div>

                                    <div className="p-4 px-6 flex items-center gap-6 w-full justify-start rounded-[24px] border border-white/10 bg-neutral-900/80 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300 shadow-2xl">
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-800/50 text-neutral-300 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                            <Code2 size={28} />
                                        </div>
                                        <div className="flex flex-col text-left">
                                             <h4 className="text-xl font-bold text-foreground font-(family-name:--font-share-tech) uppercase tracking-wide">Live Code Editor</h4>
                                             <span className="text-base text-muted-foreground mt-0.5">Write and execute code collaboratively</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop-only Simple List */}
                                <div className="hidden lg:flex flex-col gap-5 mt-6 w-full max-w-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-300 border border-white/5">
                                            <MonitorPlay size={24} />
                                        </div>
                                        <span className="text-lg font-medium text-foreground">Ultra-low latency video & audio</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-300 border border-white/5">
                                            <PenTool size={24} />
                                        </div>
                                        <span className="text-lg font-medium text-foreground">Real-time Excalidraw whiteboard</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-800/50 text-neutral-300 border border-white/5">
                                            <Code2 size={24} />
                                        </div>
                                        <span className="text-lg font-medium text-foreground">Shared code editor with execution</span>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop-only CardSwap Stack */}
                            <div className="hidden lg:flex relative h-[500px] w-full justify-end">
                                <div className="relative w-full max-w-[450px] h-[400px]">
                                    <CardSwap
                                        cardDistance={45}
                                        verticalDistance={60}
                                        delay={4000}
                                        pauseOnHover={true}
                                        width={400}
                                        height={320}
                                    >
                                        <Card className="flex flex-col justify-between p-10 items-start text-left bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl h-full w-full">
                                            <div className="rounded-full bg-neutral-800/50 w-16 h-16 flex items-center justify-center text-neutral-300 mb-6 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                                <MonitorPlay size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold text-white mb-3 font-(family-name:--font-share-tech) uppercase tracking-wider">HD Video</h3>
                                                <p className="text-neutral-300 text-base leading-relaxed">Crystal clear, ultra-low latency video calls powered by LiveKit's robust WebRTC infrastructure.</p>
                                            </div>
                                        </Card>
                                        <Card className="flex flex-col justify-between p-10 items-start text-left bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl h-full w-full">
                                            <div className="rounded-full bg-neutral-800/50 w-16 h-16 flex items-center justify-center text-neutral-300 mb-6 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                                <PenTool size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold text-white mb-3 font-(family-name:--font-share-tech) uppercase tracking-wider">Whiteboard</h3>
                                                <p className="text-neutral-300 text-base leading-relaxed">Brainstorm together seamlessly with a fully integrated real-time Excalidraw canvas.</p>
                                            </div>
                                        </Card>
                                        <Card className="flex flex-col justify-between p-10 items-start text-left bg-neutral-900/80 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] rounded-3xl h-full w-full">
                                            <div className="rounded-full bg-neutral-800/50 w-16 h-16 flex items-center justify-center text-neutral-300 mb-6 border border-white/5 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                                <Code2 size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold text-white mb-3 font-(family-name:--font-share-tech) uppercase tracking-wider">Code Editor</h3>
                                                <p className="text-neutral-300 text-base leading-relaxed">Write, share, and execute code in real-time with your peers. Synchronized perfectly.</p>
                                            </div>
                                        </Card>
                                    </CardSwap>
                                </div>
                            </div>
                        </div>
                    </div>
                </AnimatedContent>
            </section>

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
