import {useMeetingStore} from "@/store/meetingStore";


//live kit automatically handles token lifecycle
export function useLiveKit() {
    const token = useMeetingStore(state => state.token)
    return {token}
}
