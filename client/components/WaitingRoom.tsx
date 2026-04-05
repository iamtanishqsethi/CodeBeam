'use client'

import { Loader2, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { PreJoin } from "@livekit/components-react";

interface WaitingRoomProps {
    meetingId: string;
}

export default function WaitingRoom({ meetingId }: WaitingRoomProps) {
    const [dots, setDots] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
                {/* Left side: PreJoin (Video Preview) */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold mb-2">Check your audio and video</h2>
                    <div className="rounded-2xl overflow-hidden border bg-card shadow-xl">
                        <PreJoin
                            onSubmit={() => {}}
                            onError={(err) => console.log('error', err)}
                            defaults={{
                                username: '',
                                videoEnabled: true,
                                audioEnabled: true,
                            }}
                        />
                    </div>
                </div>

                {/* Right side: Status / Waiting message */}
                <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-8 w-8 text-primary" />
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-2">
                            Ready to join?
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            You'll be able to join as soon as the host lets you in.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-muted/50 px-6 py-4 rounded-xl border w-full max-w-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                        <span className="font-medium text-foreground">
                            Asking to join{dots}
                        </span>
                    </div>

                    <div className="mt-8 pt-8 border-t w-full max-w-sm">
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Meeting ID
                        </p>
                        <code className="text-lg font-mono bg-muted px-4 py-2 rounded-lg block text-center md:text-left">
                            {meetingId}
                        </code>
                    </div>
                </div>
            </div>
        </div>
    )
}