import {create} from 'zustand'
import { MeetingStore} from "@/types/store.types";

const defaultMediaPreferences = {
    username: "CodeBeam",
    audioEnabled: true,
    videoEnabled: true,
    audioDeviceId: "",
    videoDeviceId: "",
};

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

    //prejoin
    mediaPreferences: defaultMediaPreferences,
    setMediaPreferences:(preferences)=>set((state)=>({
        mediaPreferences:{
            ...state.mediaPreferences,
            ...preferences,
        }
    })),
    resetMediaPreferences:()=>set({mediaPreferences: defaultMediaPreferences}),

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
