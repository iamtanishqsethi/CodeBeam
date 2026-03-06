'use client'

import {useMeetingStore} from "@/store/meetingStore";
import {useEffect, useRef, useState} from "react";
import {socket} from "@/lib/socket";
import {ChatMessage} from "@/types/store.types";
import {Button} from "@/components/ui/button";
import {Send, X} from "lucide-react";
import {Input} from "@/components/ui/input";

interface ChatPanelProps {
    meetingId: string;
}

export default function ChatPanel({meetingId}: ChatPanelProps ) {
    const messages=useMeetingStore(store=>store.chatMessages)
    const addMessage=useMeetingStore(store=>store.setChatMessages)
    const toggleChat=useMeetingStore(store=>store.toggleChat)

    const [text,setText]=useState('')
    const messageEndRef=useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMessage=(message:ChatMessage)=>{
            addMessage(message)
        }

        socket.on('chat-message',handleMessage)

        return () => {
            socket.off('chat-message',handleMessage)
        };
    }, [addMessage]);



    function sendMessage(e?:React.FormEvent){
        e?.preventDefault()
        if(!text.trim()) return


        const msg:ChatMessage={
            text,
            userId:socket.id??'unknown',
            timestamp:Date.now()
        }

        socket.emit('chat-message',{meetingId,...msg})
        addMessage(msg) //added here to show message immediately
        setText('')
    }

    return(

        <div className={'w-80 border-l bg-background flex flex-col'}>
        {/*Header*/}
            <div className={'flex items-center justify-between px-4 py-3 border-b'}>
                <h3 className={'text-sm font-semibold'}>
                    Chat
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleChat}
                >
                    <X/>
                </Button>

            </div>

        {/*Messages*/}
            <div className={'flex-1 overflow-y-auto p-4 space-y-3'}>
                {messages.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center mt-8">
                        No messages yet. Say hello! 👋
                    </p>
                )}

                {messages.map((m, i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">
                                {m.userName ?? m.userId.slice(0, 8)}
                            </span>
                            <span className="text-xs text-muted-foreground/60">
                                {new Date(m.timestamp??Date.now()).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                            </span>
                        </div>
                        <p className="text-sm bg-muted px-3 py-2 rounded-lg w-fit max-w-[90%]">
                            {m.text}
                        </p>
                    </div>
                ))}
                <div ref={messageEndRef}/>
                {/* Input */}
                <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
                    <Input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!text.trim()}>
                        <Send className="h-4 w-4"/>
                    </Button>
                </form>
            </div>
        </div>

    )
}