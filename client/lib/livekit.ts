import {Room} from "livekit-client";

export function createRoom(){
    const room=new Room()

    async function connect(token:string){
        await room.connect(
            process.env.NEXT_PUBLIC_LIVEKIT_URL!,
            token,
        )

        await room.localParticipant.enableCameraAndMicrophone()
    }

    async function disconnect(){
        await room.disconnect()
    }

    return{room,connect,disconnect}
}