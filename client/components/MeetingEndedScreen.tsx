"use client"

import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Home, PhoneOff} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

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
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-20 text-center sm:px-6">
            <div className="interface-grid-bg pointer-events-none absolute inset-x-0 top-0 h-full" />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-border" />
            <section className="surface-panel relative flex w-full max-w-3xl flex-col items-center gap-8 p-6 sm:p-10">
                <Badge variant="outline" className="rounded-md px-3 py-1">
                    Session complete
                </Badge>

                <div className="flex flex-col items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-lg border bg-muted">
                        <PhoneOff className="size-8 text-muted-foreground" />
                    </div>
                    <div className="flex max-w-2xl flex-col items-center gap-3">
                        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                            Meeting ended
                        </h1>
                        <p className="text-balance text-base leading-7 text-muted-foreground">
                            {message} You will return home automatically.
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-col items-center justify-between gap-5 border-t pt-6 sm:flex-row sm:text-left">
                    <div className="flex items-center gap-4">
                        <div
                            className="flex size-16 shrink-0 items-center justify-center rounded-full border bg-background"
                            style={{
                                background: `conic-gradient(var(--primary) ${progress}%, var(--muted) ${progress}% 100%)`,
                            }}
                            aria-hidden="true"
                        >
                            <div className="flex size-12 items-center justify-center rounded-full bg-background text-lg font-semibold">
                                {secondsLeft}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-medium">Redirecting to home</p>
                            <p className="text-sm text-muted-foreground">
                                {secondsLeft === 1 ? "1 second left" : `${secondsLeft} seconds left`}
                            </p>
                        </div>
                    </div>

                    <Button asChild className="interactive-lift w-full sm:w-auto">
                        <Link href="/">
                            <Home data-icon="inline-start" />
                            Go now
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}
