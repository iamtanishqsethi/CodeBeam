'use client'

import { PreJoin, LocalUserChoices } from '@livekit/components-react';
import { useRouter } from 'next/navigation';
import { createMeeting } from '@/services/api';
import { useState } from 'react';
import { useMeetingStore } from '@/store/meetingStore';
import { Loader2 } from 'lucide-react';

export default function CreateMeetingPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setHost = useMeetingStore(state => state.setHost);

  const handlePreJoinSubmit = async (values: LocalUserChoices) => {
    setIsCreating(true);
    setError(null);
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Setup your meeting</h1>
        {isCreating ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Creating meeting...</p>
          </div>
        ) : (
          <div className="border rounded-2xl p-8 bg-card shadow-lg flex flex-col gap-6">
             <div className="max-w-md mx-auto w-full">
                <label className="text-sm font-medium mb-2 block">Meeting Title (optional)</label>
                <input 
                    type="text" 
                    placeholder="Enter meeting title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border bg-background"
                />
             </div>
             <PreJoin
                onSubmit={handlePreJoinSubmit}
                onError={(err) => console.log('error', err)}
                defaults={{
                    username: '',
                    videoEnabled: true,
                    audioEnabled: true,
                }}
            />
            {error && <p className="text-destructive text-center mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
