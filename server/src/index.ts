import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware} from '@clerk/express'
import meetingRoutes from "@/routes/meeting.routes.js";
import webhookService from "@/services/webhook.service.js";
import  http from "http";
import {Server} from "socket.io";
import registerMeetingSocket from "@/sockets/meeting.socket.js";

dotenv.config()

const port = process.env.PORT || 5051;
const app = express();



app.use(cors(
    {
        origin:['http://localhost:3000'],
        credentials:true
    }
));

// Webhook route MUST be placed BEFORE express.json() middleware
app.post('/api/webhooks', webhookService)

app.use(express.json());

// Global clerkMiddleware for all subsequent routes
app.use(clerkMiddleware());

app.use("/api/meetings", meetingRoutes)

const server=http.createServer(app)

export const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
    }
})

registerMeetingSocket(io)

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
