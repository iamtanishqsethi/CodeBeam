'use client'

import React, {useState} from "react";
import {useAxiosInterceptor} from "@/hooks/useAxiosInterceptor";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {useUser} from "@clerk/nextjs";

interface JoinRoomProps {
    onJoin: (data: { token: string; room: string; username: string }) => void;
}

export default function JoinRoom({ onJoin }: JoinRoomProps) {

    const [roomId,setRoomId]=useState("")
    const [error,setError]=useState<string | null>(null)
    const { user, isLoaded } = useUser()

    const apiClient=useAxiosInterceptor()

    const handleJoin=async (e?: React.FormEvent | React.MouseEvent)=>{
        if (e) e.preventDefault();
        setError(null)


        if(!roomId.trim()){
            setError("Room id is required")
            return
        }
        if(!isLoaded || !user){
            setError("User not logged in")
            return
        }
        try{
            const res=await apiClient.get<string>(`/room/token?roomId=${roomId}`)
            console.log(res.data)
            console.log(user.fullName)
            onJoin({
                token:res.data,
                room:roomId,


                username:user.fullName || "Anonymous"
            })

        }
        catch (e){
            setError("Error joining room")
            console.error(e)
        }
    }


    return(
        <div className={'flex flex-col items-center justify-center min-h-screen max-w-sm mx-auto'}>
            <form onSubmit={handleJoin} className="w-full">
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="fieldgroup-roomId">Room Id</FieldLabel>
                        <Input
                            id="fieldgroup-roomId"
                            type="text"
                            value={roomId}
                            onChange={(e)=>setRoomId(e.target.value)}
                        />
                        <FieldDescription>
                            {error}
                        </FieldDescription>
                    </Field>
                    <Field orientation="horizontal">
                        <Button type="submit">
                            Join
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>

    )
}
