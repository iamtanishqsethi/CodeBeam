-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('HOST', 'MEMBER');

-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('WAITING', 'APPROVED', 'REJECTED', 'LEFT');

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "status" "MeetingStatus" NOT NULL DEFAULT 'ACTIVE',
    "hostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL,
    "status" "ParticipantStatus" NOT NULL,
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Meeting_hostId_idx" ON "Meeting"("hostId");

-- CreateIndex
CREATE INDEX "Participant_meetingId_idx" ON "Participant"("meetingId");

-- CreateIndex
CREATE INDEX "Participant_userId_idx" ON "Participant"("userId");

-- CreateIndex
CREATE INDEX "Participant_meetingId_status_idx" ON "Participant"("meetingId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_meetingId_userId_key" ON "Participant"("meetingId", "userId");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
