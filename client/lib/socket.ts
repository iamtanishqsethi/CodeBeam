import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

export function connectSocket(userId:string){
    socket.auth={userId}
    socket.connect()
}

export function disconnectSocket(){
    socket.disconnect()
}