'use client'

import {useMeeting} from "@/hooks/useMeeting";
import MeetingLobby from "@/components/ui-meet/MeetingLobby";
import MeetingLayout from "@/components/MeetingLayout";
import {use} from "react";
import {ShieldX} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import MeetingEndedScreen from "@/components/MeetingEndedScreen";
import {Spinner} from "@/components/kibo-ui/spinner";
import {motion} from "framer-motion";

export default function MeetingPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params)
    const {status, message} = useMeeting(id)

    return (
        <>
            {status === 'loading' && (
                <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
                    <motion.div
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        className={'flex flex-col items-center justify-center gap-4'}
                    >
                        <Spinner variant={'bars'} size={40} />
                        <div className="text-center">
                            <h2 className="text-2xl font-bold tracking-wide font-(family-name:--font-share-tech) uppercase">Connecting</h2>
                            <p className="text-muted-foreground mt-2 text-sm">Joining your secure session...</p>
                        </div>
                    </motion.div>
                </div>
            )}
            {status === 'waiting' && <MeetingLobby meetingId={id}/>}
            {status === 'joined' && <MeetingLayout meetingId={id}/>}
            {status === 'rejected' && (
                <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
                    <div className="flex size-14 items-center justify-center rounded-lg bg-destructive/10">
                        <ShieldX className="size-7 text-destructive"/>
                    </div>
                    <p className="text-lg font-semibold text-destructive">Your request to join was rejected.</p>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        The host did not approve your request. Try contacting them directly.
                    </p>
                    <Link href="/">
                        <Button variant="outline" className="interactive-lift mt-2">Back to home</Button>
                    </Link>
                </div>
            )}
            {status === 'ended' && <MeetingEndedScreen message={message || "This meeting has ended."} />}
        </>
    )
}
