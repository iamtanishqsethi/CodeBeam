import apiClint from "@/lib/api";


export async function createMeeting(title:string){
    const response=await apiClint.post('/meetings/',{title})
    return response.data
}

export async function joinMeeting(meetingId:string){
    const response=await apiClint.post(`/meetings/${meetingId}/join`)
    return response.data
}

export async function getWaitingRoom(meetingId:string){
    const response=await apiClint.get(`/meetings/${meetingId}/waiting`)
    return response.data
}

export async function approveParticipant(meetingId:string,participantId:string){
    const response=await apiClint.post(`/meetings/${meetingId}/approve`,{participantId})
    return response.data
}

export async function rejectParticipant(meetingId:string,participantId:string){
    const response=await apiClint.post(`/meetings/${meetingId}/reject`,{participantId})
    return response.data
}

export async function getLiveKitToken(meetingId:string){
    const response=await apiClint.post(`/meetings/${meetingId}/token`)
    console.log(response)
    return response.data
}

export async function leaveMeeting(meetingId:string){
    const response=await apiClint.post(`/meetings/${meetingId}/leave`)
    return response.data
}

export async function endMeeting(meetingId: string){
    const response = await apiClint.post(`/meetings/${meetingId}/end`)
    return response.data
}

export async function getParticipants(meetingId:string){
    const response=await apiClint.get(`/meetings/${meetingId}/participants`)
    return response.data
}
