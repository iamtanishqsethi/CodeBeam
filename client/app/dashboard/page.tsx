'use client'

import {useState} from "react";
import VideoRoom from "@/components/VideoRoom";
import JoinRoom from "@/components/JoinRoom";

interface Session {
    token: string;
    room: string;
    username: string;
}

export default function Dashboard() {

    const [session, setSession] = useState<Session | null>(null);
    return session ? (
        <VideoRoom token={session.token} onLeave={() => setSession(null)} />
    ) : (
        <JoinRoom onJoin={setSession} />
    );
}
