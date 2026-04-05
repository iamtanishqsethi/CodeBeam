import {useMeetingStore} from "@/store/meetingStore";
import {useEffect, useState} from "react";
import {getLiveKitToken, joinMeeting} from "@/services/api";
import {connectSocket, disconnectSocket, socket} from "@/lib/socket";
import {useUser} from "@clerk/nextjs";
import {AxiosError} from "axios";

type MeetingPageStatus = "loading" | "waiting" | "joined" | "rejected" | "ended";

export function useMeeting(meetingId: string) {
    const setToken = useMeetingStore(state => state.setToken);
    const clearToken = useMeetingStore(state => state.clearToken);
    const setMeetingId = useMeetingStore(state => state.setMeetingId);
    const setHost = useMeetingStore(state => state.setHost);
    const {user} = useUser();

    const [status, setStatus] = useState<MeetingPageStatus>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!user) return;

        connectSocket(user.id);

        let isMounted = true;
        let currentParticipantId: string | null = null;

        async function init() {
            try {
                const data = await joinMeeting(meetingId);
                if (!isMounted) return;

                setMeetingId(meetingId);
                setHost(Boolean(data.isHost));
                currentParticipantId = data.participantId ?? null;
                socket.emit("join-meeting", {meetingId});

                if (data.status === "WAITING") {
                    setStatus("waiting");
                    return;
                }

                if (data.status === "APPROVED") {
                    const {token} = await getLiveKitToken(meetingId);
                    if (!isMounted) return;

                    setToken(token);
                    setStatus("joined");
                    return;
                }

                if (data.status === "REJECTED") {
                    setStatus("rejected");
                }
            } catch (e) {
                console.error("Error Joining meeting !", e);
                if (!isMounted) return;

                const error = e as AxiosError<{message?: string}>;
                if (error.response?.status === 410) {
                    clearToken();
                    setHost(false);
                    setStatus("ended");
                    setMessage(error.response.data?.message || "This meeting has already ended.");
                }
            }
        }

        void init();

        const handleApproved = async (data: {participantId?: string}) => {
            try {
                if (currentParticipantId && data.participantId && data.participantId !== currentParticipantId) {
                    return;
                }

                const {token} = await getLiveKitToken(meetingId);
                if (!isMounted) return;

                setToken(token);
                setStatus("joined");
            } catch (e) {
                console.error("Error getting token after approval ", e);
            }
        };

        const handleRejected = (data: {participantId?: string}) => {
            if (currentParticipantId && data.participantId && data.participantId !== currentParticipantId) {
                return;
            }

            setStatus("rejected");
        };

        const handleMeetingEnded = () => {
            if (!isMounted) return;

            clearToken();
            setHost(false);
            setStatus("ended");
            setMessage("This meeting has already ended.");
        };

        socket.on("participant-approved", handleApproved);
        socket.on("participant-rejected", handleRejected);
        socket.on("meeting-ended", handleMeetingEnded);

        return () => {
            isMounted = false;
            socket.off("participant-approved", handleApproved);
            socket.off("participant-rejected", handleRejected);
            socket.off("meeting-ended", handleMeetingEnded);
            disconnectSocket();
        };
    }, [clearToken, meetingId, setHost, setMeetingId, setToken, user]);

    return {status, message};
}
