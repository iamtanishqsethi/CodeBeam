'use client'
import { DisconnectButton, MediaDeviceSelect, TrackToggle} from "@livekit/components-react";
import {useMeetingStore} from "@/store/meetingStore";
import {Track} from "livekit-client";
import {Button} from "@/components/ui/button";
import { ChevronDown, ChevronUp, LogOut, MessageCircle, PhoneOff, Users} from "lucide-react";
import {useState} from "react";
interface ControlsProps {
    onLeave: () => void;
    onEndMeeting: () => void;
}


export default function Controls({onLeave, onEndMeeting}: ControlsProps ) {

    const toggleChat=useMeetingStore(store=>store.toggleChat)
    const toggleParticipants=useMeetingStore(store=>store.toggleParticipants)
    const isChatOpen=useMeetingStore(store=>store.isChatOpen)
    const isParticipantsOpen=useMeetingStore(store=>store.isParticipantsOpen)
    const isHost = useMeetingStore(store => store.isHost)
    const [isAudioDeviceSelectOpen,setIsAudioDeviceSelectOpen]=useState(false)
    const [isVideoDeviceSelectOpen,setIsVideoDeviceSelectOpen]=useState(false)



    return(
        <div className="  flex items-center justify-center gap-2 p-1">
            {/*mic toggle */}

            <div className={'flex items-center justify-center relative '}>
                { isAudioDeviceSelectOpen && <MediaDeviceSelect
                    className={'absolute bg-background z-30 bottom-12 border-2 rounded-2xl'}
                    kind="audioinput" />
                }
                <TrackToggle
                    source={Track.Source.Microphone}
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors data-[lk-muted=true]:bg-destructive data-[lk-muted=true]:text-destructive-foreground"
                />
                <Button
                    variant={'ghost'}
                    onClick={()=> {
                        setIsAudioDeviceSelectOpen(!isAudioDeviceSelectOpen)
                        setIsVideoDeviceSelectOpen(false)
                    }}
                >
                    {isAudioDeviceSelectOpen ? <ChevronDown/>: <ChevronUp/>}
                </Button>

            </div>


            {/*    Camera toggle*/}
            <div className={'flex items-center justify-center relative '}>
                { isVideoDeviceSelectOpen && <MediaDeviceSelect
                    className={'absolute bg-background z-30 bottom-12 border-2 rounded-2xl'}
                    kind="videoinput" />
                }
                <TrackToggle
                    source={Track.Source.Camera}
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors data-[lk-muted=true]:bg-destructive data-[lk-muted=true]:text-destructive-foreground"
                />
                <Button
                    variant={'ghost'}
                    onClick={()=> {
                        setIsVideoDeviceSelectOpen(!isVideoDeviceSelectOpen)
                        setIsAudioDeviceSelectOpen(false)
                    }}
                >
                    {isVideoDeviceSelectOpen ? <ChevronDown/>: <ChevronUp/>}
                </Button>
            </div>

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
                    onClick={onLeave}
                    className="rounded-full h-10 w-10 flex items-center justify-center bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                    <PhoneOff className="h-4 w-4"/>
                </DisconnectButton>
                {isHost && (
                    <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full h-10 w-10"
                        onClick={onEndMeeting}
                        title="End meeting for everyone"
                    >
                        <LogOut className="h-4 w-4"/>
                    </Button>
                )}

            </div>
    )
}
