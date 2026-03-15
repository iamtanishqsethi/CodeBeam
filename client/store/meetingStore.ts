import {create} from 'zustand'
import { MeetingStore} from "@/types/store.types";



export const useMeetingStore = create<MeetingStore>((set)=>({
    //live kit
    token:null,
    setToken:(token)=>set({token}),
    clearToken:()=>set({token:null}),

    //meeting info
    meetingId:null,
    setMeetingId:(id)=>set({meetingId:id}),
    clearMeetingId:()=>set({meetingId:null}),
    isHost:false,
    setHost:(v)=>set({isHost:v}),

    //chat
    chatMessages:[],
    setChatMessages:(message)=>set((state)=>({chatMessages:[...state.chatMessages,message]})),
    clearMessage:()=>set({chatMessages:[]}),

    //sidebar visibility
    isChatOpen:false,
    isParticipantsOpen:false,
    toggleChat:()=>set((state)=>({isChatOpen:!state.isChatOpen})),
    toggleParticipants:()=>set((state)=>({isParticipantsOpen:!state.isParticipantsOpen}))
}))