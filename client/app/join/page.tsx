'use client'

import { LocalUserChoices, PreJoin } from '@livekit/components-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMeetingStore } from '@/store/meetingStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function JoinMeetingPage() {
  const router = useRouter();
  const [meetingId, setMeetingId] = useState('');
  const [showPreJoin, setShowPreJoin] = useState(false);
  const mediaPreferences = useMeetingStore(state => state.mediaPreferences);
  const setMediaPreferences = useMeetingStore(state => state.setMediaPreferences);

  const handleJoin = () => {
    if (!meetingId.trim()) return;
    setShowPreJoin(true);
  };

  const handlePreJoinSubmit = (values: LocalUserChoices) => {
    setMediaPreferences(values);
    router.push(`/meeting/${meetingId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        {!showPreJoin ? (
          <section className="prejoin-shell w-full max-w-3xl rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-2xl sm:p-8">
            <div className="mx-auto flex max-w-xl flex-col items-center gap-6 text-center">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Join meeting
              </p>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Enter the room code</h1>
                <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                  Paste the meeting ID from the host, then continue to camera and microphone setup.
                </p>
              </div>
              <div className="w-full rounded-[1.5rem] border border-border/70 bg-background/70 p-5 shadow-sm backdrop-blur">
                <Input
                  placeholder="Enter meeting ID"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  className="h-12 text-center text-base sm:text-lg"
                />
                <Button onClick={handleJoin} className="mt-4 h-11 w-full" disabled={!meetingId.trim()}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to device check
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <section className="prejoin-shell w-full rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-2xl sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
              <div className="space-y-5">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Join meeting
                </p>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Check your setup</h1>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Confirm your camera, microphone, and display name before entering the meeting.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 shadow-sm backdrop-blur">
                  <p className="text-sm font-medium text-foreground">Meeting ID</p>
                  <code className="mt-3 block rounded-xl bg-muted px-4 py-3 text-sm font-medium tracking-[0.2em] text-foreground">
                    {meetingId.trim()}
                  </code>
                  <Button
                    variant="ghost"
                    onClick={() => setShowPreJoin(false)}
                    className="mt-4 h-11 w-full justify-center rounded-xl border border-border/70 bg-background/70"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to meeting ID
                  </Button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border/70 bg-background/55 p-4 shadow-sm backdrop-blur sm:p-6">
                <PreJoin
                  className="lk-prejoin prejoin-widget--hide-username"
                  data-lk-theme="default"
                  onSubmit={handlePreJoinSubmit}
                  onError={(err) => console.log('error', err)}
                  onValidate={() => true}
                  userLabel=""
                  defaults={{
                    username: mediaPreferences.username,
                    videoEnabled: mediaPreferences.videoEnabled,
                    audioEnabled: mediaPreferences.audioEnabled,
                    audioDeviceId: mediaPreferences.audioDeviceId,
                    videoDeviceId: mediaPreferences.videoDeviceId,
                  }}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
