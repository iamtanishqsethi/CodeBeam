'use client'

import { LocalUserChoices, PreJoin } from '@livekit/components-react';
import { useRouter } from 'next/navigation';
import { createMeeting } from '@/services/api';
import { useState } from 'react';
import { useMeetingStore } from '@/store/meetingStore';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CreateMeetingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setHost = useMeetingStore(state => state.setHost);
  const mediaPreferences = useMeetingStore(state => state.mediaPreferences);
  const setMediaPreferences = useMeetingStore(state => state.setMediaPreferences);

  const handlePreJoinSubmit = async (values: LocalUserChoices) => {
    setIsCreating(true);
    setError(null);
    setMediaPreferences(values);
    try {
      const meeting = await createMeeting(title || 'Untitled Meeting');
      setHost(true);
      router.push(`/meeting/${meeting.id}`);
    } catch (e) {
      console.error(e);
      setError('Failed to create meeting');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        {isCreating ? (
          <div className="flex flex-col items-center gap-4 rounded-[2rem] border border-border/70 bg-card/95 px-10 py-14 shadow-xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Creating meeting...</p>
          </div>
        ) : (
          <section className="prejoin-shell w-full rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-2xl sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
              <div className="space-y-5">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Create meeting
                </p>
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Set up before you go live
                  </h1>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                    Pick a display name, check your camera and microphone, and give the room a title if you want one.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/70 p-5 shadow-sm backdrop-blur">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Meeting title
                  </label>
                  <Input
                    type="text"
                    placeholder="Untitled Meeting"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-12 rounded-xl border-border/70 bg-background"
                  />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Leave this empty if you want the room to start with a default title.
                  </p>
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
                {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
