'use client'

import {useMeeting} from "@/hooks/useMeeting";
import MeetingLobby from "@/components/ui-meet/MeetingLobby";
import MeetingLayout from "@/components/MeetingLayout";
import {use} from "react";
import {Loader2, PhoneOff, ShieldX} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function MeetingPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params)
    const {status, message} = useMeeting(id)

    return (
        <>
            {status === 'loading' && (
                <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                        <Loader2 className="size-8 animate-spin text-primary"/>
                    </div>
                    <p className="font-medium text-muted-foreground">Joining meeting...</p>
                </div>
            )}
            {status === 'waiting' && <MeetingLobby meetingId={id}/>}
            {status === 'joined' && <MeetingLayout meetingId={id}/>}
            {status === 'rejected' && (
                <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
                        <ShieldX className="size-8 text-destructive"/>
                    </div>
                    <p className="text-lg font-semibold text-destructive">Your request to join was rejected.</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        The host did not approve your request. Try contacting them directly.
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="mt-2 rounded-xl">Back to home</Button>
                    </Link>
                </div>
            )}
            {status === 'ended' && (
                <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
                        <PhoneOff className="size-8 text-muted-foreground"/>
                    </div>
                    <p className="text-lg font-semibold">
                        {message || 'This meeting has ended.'}
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="mt-2 rounded-xl">Back to home</Button>
                    </Link>
                </div>
            )}
        </>
    )
}
