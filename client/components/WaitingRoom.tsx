'use client'

import {Loader2, Clock} from "lucide-react";
import {useEffect, useState} from "react";

interface WaitingRoomProps {
    meetingId: string;
}

export default function WaitingRoom({meetingId}: WaitingRoomProps){
    const [dots,setDots]=useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);
    return(

        <div className="h-screen flex flex-col items-center justify-center gap-6 bg-background">
            <div className="flex flex-col items-center gap-4 p-8 rounded-2xl border bg-card shadow-lg max-w-md w-full mx-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-primary"/>
                </div>

                <h2 className="text-xl font-semibold text-foreground">
                    Waiting Room
                </h2>

                <p className="text-muted-foreground text-center">
                    The host has been notified. Please wait for them to let you in{dots}
                </p>

                <Loader2 className="h-6 w-6 animate-spin text-primary mt-2"/>

                <div className="text-xs text-muted-foreground mt-4 px-4 py-2 bg-muted rounded-lg">
                    Meeting ID: <span className="font-mono">{meetingId}</span>
                </div>
            </div>
        </div>

    )

}