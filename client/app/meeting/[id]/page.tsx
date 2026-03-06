'use client'

import {useMeeting} from "@/hooks/useMeeting";
import WaitingRoom from "@/components/WaitingRoom";
import MeetingLayout from "@/components/MeetingLayout";
import {use} from "react";
import {Loader2} from "lucide-react";

export default function MeetingPage({params}: { params: Promise<{ id: string }>}) {
    const {id}=use(params)
    const {status}=useMeeting(id)

    if (status === 'loading') {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground font-medium">Joining meeting...</p>
            </div>
        )
    }

    if(status==='waiting'){
        return <WaitingRoom meetingId={id}/>
    }
    if(status==='joined'){
        return <MeetingLayout meetingId={id}/>
    }


    if (status === 'rejected') {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-destructive font-medium text-lg">Your request to join was rejected.</p>
            </div>
        )
    }

    return null

}
