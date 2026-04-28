# Axon

Axon is a full-stack video collaboration app for engineering-focused meetings. It combines Clerk authentication, LiveKit-powered calls, a host-managed waiting room, and real-time collaboration features over Socket.IO.

## Stack

- Client: Next.js 16, React 19, Tailwind CSS 4, Clerk, LiveKit, Socket.IO client, Zustand
- Server: Express 5, TypeScript, Prisma, Clerk middleware, LiveKit server SDK, Socket.IO
- Database: PostgreSQL
- Infra: Docker Compose for production-style local containers

## Features

- Clerk-based sign-in and sign-up
- Create or join meetings by room ID
- Pre-join device selection for camera and microphone
- Host approval flow for the waiting room
- LiveKit token generation for approved participants
- Real-time meeting state via Socket.IO
- Meeting end flow and empty-room auto-end timeout
- Shared collaboration building blocks for editor and whiteboard experiences

## Project Structure

```text
.
├── client/   # Next.js frontend
├── server/   # Express API, Socket.IO server, Prisma
├── .env.example
└── docker-compose.yml
```

## Prerequisites

- Node.js 22+
- npm
- PostgreSQL
- Clerk app with webhook configured
- LiveKit project

## Environment Variables

Copy `.env.example` to `.env` and fill in real values.

```bash
cp .env.example .env
```

Required values:

- `PORT`: backend port, default `5050`
- `CLIENT_URL`: frontend origin, default `http://localhost:3000`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SIGNING_SECRET`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_URL`
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `NEXT_PUBLIC_LIVEKIT_URL`

Clerk redirect variables are also expected by the client build and are included in `.env.example`.

## Clerk Webhook

The backend expects Clerk user events at:

```text
POST /api/webhooks
```

Configure your Clerk webhook to send at least:

- `user.created`
- `user.updated`

Those events are used to upsert users into the local PostgreSQL database before they participate in meetings.

## Local Development

Install dependencies in both apps:

```bash
cd client && npm install
cd ../server && npm install
```

Apply Prisma migrations from the `server` directory:

```bash
npx prisma migrate deploy
```

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

App URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5050`

## Docker

To run the packaged client and server with Docker Compose:

```bash
docker compose up --build
```

The compose file exposes:

- `3000` for the Next.js client
- `5050` for the Express server

You still need a reachable PostgreSQL database, Clerk credentials, and LiveKit credentials in `.env`.

## API Overview

Authenticated meeting routes are mounted at `/api/meetings`:

- `POST /api/meetings`
- `POST /api/meetings/:meetingId/join`
- `GET /api/meetings/:meetingId/waiting`
- `POST /api/meetings/:meetingId/approve`
- `POST /api/meetings/:meetingId/reject`
- `POST /api/meetings/:meetingId/token`
- `POST /api/meetings/:meetingId/leave`
- `POST /api/meetings/:meetingId/end`
- `GET /api/meetings/:meetingId/participants`

## Main Flows

1. A signed-in host creates a meeting.
2. The host is inserted as an approved participant immediately.
3. Guests request to join with a meeting ID.
4. New guests enter a waiting state until approved by the host.
5. Approved users receive a LiveKit token and enter the room.
6. If everyone leaves, the backend starts a 2-minute empty-room timer before ending the meeting.

## Scripts

Client:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

Server:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run type-check`
- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`

## Notes

- There is currently no meaningful automated test suite in the repository.
- The generated Prisma client is configured under `server/src/generated/prisma`.
- The existing `client/README.md` from `create-next-app` is not the primary project documentation.
