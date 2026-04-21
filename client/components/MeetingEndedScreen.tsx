"use client"

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Home, PhoneOff} from "lucide-react";
import {Button} from "@/components/ui/button";
import GlassSurface from "@/components/GlassSurface";

interface MeetingEndedScreenProps {
    message?: string;
    redirectAfterSeconds?: number;
}

export default function MeetingEndedScreen({
    message = "This meeting has ended.",
    redirectAfterSeconds = 8,
}: MeetingEndedScreenProps) {
    const router = useRouter();
    const [secondsLeft, setSecondsLeft] = useState(redirectAfterSeconds);

    useEffect(() => {
        setSecondsLeft(redirectAfterSeconds);
    }, [redirectAfterSeconds]);

    useEffect(() => {
        if (secondsLeft <= 0) {
            router.replace("/");
            return;
        }

        const timerId = window.setTimeout(() => {
            setSecondsLeft((current) => Math.max(current - 1, 0));
        }, 1000);

        return () => window.clearTimeout(timerId);
    }, [redirectAfterSeconds, router, secondsLeft]);

    const progress = useMemo(() => {
        if (redirectAfterSeconds <= 0) {
            return 100;
        }

        return ((redirectAfterSeconds - secondsLeft) / redirectAfterSeconds) * 100;
    }, [redirectAfterSeconds, secondsLeft]);

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20">
            <div className="pointer-events-none absolute inset-0 z-0 h-screen">
                <div className="absolute inset-0 bg-[radial_gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black" />
            </div>
            
            <section className="relative flex w-full max-w-lg flex-col items-center gap-10 p-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <GlassSurface
                        borderRadius={999}
                        width={72}
                        height={72}
                        backgroundOpacity={0.15}
                        blur={30}
                        className="border border-white/5"
                        contentClassName="flex items-center justify-center"
                    >
                        <PhoneOff className="size-8 text-white/60" />
                    </GlassSurface>
                    
                    <div className="flex flex-col gap-3">
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            Meeting ended
                        </h1>
                        <p className="text-sm text-white/50">
                            {message} You will return home automatically.
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div
                            className="flex size-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5"
                            style={{
                                background: `conic-gradient(rgba(255,255,255,0.2) ${progress}%, transparent ${progress}% 100%)`,
                            }}
                            aria-hidden="true"
                        >
                            <div className="flex size-12 items-center justify-center rounded-full bg-zinc-950 text-lg font-bold text-white">
                                {secondsLeft}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium text-white/80">Redirecting to home</p>
                            <p className="text-xs text-white/40">
                                {secondsLeft === 1 ? "1 second left" : `${secondsLeft} seconds left`}
                            </p>
                        </div>
                    </div>

                    <Button asChild className="w-full h-12 rounded-xl bg-white text-black hover:bg-white/90">
                        <Link href="/">
                            <Home size={18} className="mr-2" />
                            Go now
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}