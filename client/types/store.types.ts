export interface ChatMessage {
    id?:string;
    text:string;
    userId:string;
    userName?:string;
    timestamp?:number;
}

export interface User{
    id:string;
    email:string;
    firstName:string;
    lastName?:string;
    imageUrl?:string;
}

export interface WaitingRoomUser{
   id:string;
   userId:string;
   user:User;
   status:string;
}

export interface MeetingStore {
    //live kit
    token:string|null
    setToken:(token:string)=>void
    clearToken:()=>void

    //meeting info
    meetingId:string|null
    setMeetingId:(meetingId:string)=>void
    clearMeetingId:()=>void

    //chat
    chatMessages:ChatMessage[]
    setChatMessages:(message:ChatMessage)=>void
    clearMessage:()=>void


    //sidebar
    isChatOpen:boolean
    isParticipantsOpen:boolean
    toggleChat:()=>void
    toggleParticipants:()=>void

}

