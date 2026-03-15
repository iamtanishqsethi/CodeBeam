'use client'
import {ControlBar, DisconnectButton, TrackToggle} from "@livekit/components-react";
import {useMeetingStore} from "@/store/meetingStore";
import {Track} from "livekit-client";
import {Button} from "@/components/ui/button";
import {MessageCircle, PhoneOff, Users} from "lucide-react";
interface ControlsProps {
    meetingId: string;
    onLeave: () => void;
}


export default function Controls({meetingId,onLeave}: ControlsProps ) {

    const toggleChat=useMeetingStore(store=>store.toggleChat)
    const toggleParticipants=useMeetingStore(store=>store.toggleParticipants)
    const isChatOpen=useMeetingStore(store=>store.isChatOpen)
    const isParticipantsOpen=useMeetingStore(store=>store.isParticipantsOpen)

    return(
        <div className="flex items-center justify-center gap-2 p-1">
            {/*mic toggle */}
                <TrackToggle
                    source={Track.Source.Microphone}
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors data-[lk-muted=true]:bg-destructive data-[lk-muted=true]:text-destructive-foreground"
                />
            {/*    Camera toggle*/}
                <TrackToggle
                    source={Track.Source.Camera}
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors data-[lk-muted=true]:bg-destructive data-[lk-muted=true]:text-destructive-foreground"
                />
            {/*    screen share toggle*/}
                <TrackToggle
                    source={Track.Source.ScreenShare}
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors "
                />
                {/* Participants toggle */}
                <Button
                    variant={isChatOpen?'secondary':"ghost"}
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={toggleChat}
                >
                    <MessageCircle className="h-4 w-4"/>
                </Button>
                <Button
                    variant={isParticipantsOpen ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-full h-10 w-10"
                    onClick={toggleParticipants}
                >
                    <Users className="h-4 w-4"/>
                </Button>
                {/* Leave */}
                <DisconnectButton
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                    <PhoneOff className="h-4 w-4"/>
                </DisconnectButton>

            </div>
    )
}