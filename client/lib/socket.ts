import { io } from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!,{
    transports:['websocket'],
    autoConnect:false,
});

export function connectSocket(userId:string){
    socket.auth={userId}
    socket.connect()
}

export function disconnectSocket(){
    socket.disconnect()
}