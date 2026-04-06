import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware} from '@clerk/express'
import meetingRoutes from "./routes/meeting.routes.js";
import webhookService from "./services/webhook.service.js";
import  http from "http";
import {Server} from "socket.io";
import registerMeetingSocket from "./sockets/meeting.socket.js";

dotenv.config()

const port = process.env.PORT || 5050;
const app = express();

const clientUrl=process.env.CLIENT_URL||"http://localhost:3000"


app.use(cors(
    {
        origin:[clientUrl],
        credentials:true
    }
));

// Webhook route MUST be placed BEFORE express.json() middleware
app.use('/api/webhooks', webhookService)

app.use(express.json());

// Global clerkMiddleware for all subsequent routes
app.use(clerkMiddleware());

app.use("/api/meetings", meetingRoutes)

const server=http.createServer(app)

export const io=new Server(server,{
    cors:{
        origin:clientUrl,
    }
})

registerMeetingSocket(io)

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
