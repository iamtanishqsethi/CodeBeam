'use client'

import { PreJoin, LocalUserChoices } from '@livekit/components-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function JoinMeetingPage() {
  const router = useRouter();
  const [meetingId, setMeetingId] = useState('');
  const [showPreJoin, setShowPreJoin] = useState(false);

  const handleJoin = () => {
    if (!meetingId.trim()) return;
    setShowPreJoin(true);
  };

  const handlePreJoinSubmit = (values: LocalUserChoices) => {
    // Navigate to the meeting page
    router.push(`/meeting/${meetingId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {!showPreJoin ? (
          <div className="max-w-md mx-auto border rounded-2xl p-8 bg-card shadow-lg flex flex-col gap-6 items-center text-center">
            <h1 className="text-2xl font-bold">Join a Meeting</h1>
            <p className="text-muted-foreground text-sm">
              Enter the meeting ID provided by the host to join.
            </p>
            <Input
              placeholder="Enter meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              className="text-center text-lg"
            />
            <Button onClick={handleJoin} className="w-full" disabled={!meetingId.trim()}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Check Meeting
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-bold text-center">Ready to join?</h1>
            <div className="border rounded-2xl p-8 bg-card shadow-lg">
                <PreJoin
                    onSubmit={handlePreJoinSubmit}
                    onError={(err) => console.log('error', err)}
                    defaults={{
                        username: '',
                        videoEnabled: true,
                        audioEnabled: true,
                    }}
                />
                <Button 
                    variant="ghost" 
                    onClick={() => setShowPreJoin(false)} 
                    className="mt-4 w-full"
                >
                    Back to meeting ID
                </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
