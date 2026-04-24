import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

export default function registerEditorSocket(io: Server) {
  // Initialize YSocketIO
  const ysocketio = new YSocketIO(io);
  
  // Initialize the socket
  ysocketio.initialize();

  return ysocketio;
}
