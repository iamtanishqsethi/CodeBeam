import {useMeetingStore} from "@/store/meetingStore";
import {useEffect, useState} from "react";
import {getLiveKitToken, joinMeeting} from "@/services/api";
import {connectSocket, disconnectSocket, socket} from "@/lib/socket";
import {useUser} from "@clerk/nextjs";

export function useMeeting(meetingId:string) {
    const setToken=useMeetingStore(state=>state.setToken)
    const setMeetingId = useMeetingStore(state => state.setMeetingId)
    const {user}=useUser()

    const [status,setStatus]=useState<"loading"|"waiting"|"joined"|"rejected">("loading")

    useEffect(()=>{

        if(!user) return
        connectSocket(user.id)

        async function init(){
            try{
                const data=await joinMeeting(meetingId)
                setMeetingId(meetingId)

                if(data.status==="WAITING"){
                    setStatus("waiting")
                    socket.emit("join-waiting-room", {meetingId})
                }

                if(data.status==="APPROVED"){
                    const {token}=await getLiveKitToken(meetingId)
                    setToken(token)
                    setStatus("joined")
                    // Host/Approved user also joins the room to hear waiting room events
                    // but it will also give notification when a user approved in meet that "new user in waiting room" ? -> server side fix
                    socket.emit("join-waiting-room", {meetingId})
                }
                if (data.status === "REJECTED") {
                    setStatus("rejected")
                }
            }
            catch (e){
                console.error("Error Joining meeting !",e)
            }
        }

        init()

        const handleApproved=async ()=>{
            try{
                const {token}=await getLiveKitToken(meetingId)
                console.log(token)
                setToken(token)
                setStatus("joined")

            }
            catch (e){
                console.error("Error getting token after approval ",e)
            }
        }

        const handleRejected=()=>{
            setStatus("rejected")
        }

        socket.on('participant-approved',handleApproved)
        socket.on('participant-rejected',handleRejected)


        return ()=>{
            socket.off('participant-approved',handleApproved)
            socket.off('participant-rejected',handleRejected)
            disconnectSocket()
        }
    },[meetingId,user])


    return {status}
}