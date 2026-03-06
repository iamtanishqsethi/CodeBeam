'use client'


import {Button} from "@/components/ui/button";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {createMeeting} from "@/services/api";
import {ArrowRight, Loader2, Plus, Video} from "lucide-react";
import {Input} from "@/components/ui/input";

export default function Home() {
  const [meetingId,setMeetingId]=useState('')
  const [title,setTitle]=useState('')
  const [isCreating,setIsCreating]=useState(false)
  const [error,setError]=useState<string | null>(null)
  const router=useRouter()

  const handleCreate=async ()=>{
    setError(null)
    setIsCreating(true)
    try{
      const meeting=await createMeeting(title||'Untitled Meeting')
      router.push(`/meeting/${meeting.id}`)
    }
    catch (e){
      setError("Error creating meeting")
      console.error(e)
    }
    finally {
      setIsCreating(false)
    }
  }

  const handleJoin = () => {
    if (!meetingId.trim()) {
      setError('Please enter a meeting ID');
      return;
    }
    router.push(`/meeting/${meetingId.trim()}`);
  };
  return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-10">Create or join a meeting</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Meeting Card */}
            <div className="border rounded-2xl p-6 bg-card shadow-sm flex flex-col gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary"/>
              </div>
              <h2 className="text-xl font-semibold">New Meeting</h2>
              <p className="text-muted-foreground text-sm">
                Create a new meeting and invite others to join.
              </p>
              <Input
                  placeholder="Meeting title (optional)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
              />
              <Button onClick={handleCreate} disabled={isCreating} className="w-full">
                {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                ) : (
                    <Video className="h-4 w-4 mr-2"/>
                )}
                Create Meeting
              </Button>
            </div>

            {/* Join Meeting Card */}
            <div className="border rounded-2xl p-6 bg-card shadow-sm flex flex-col gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <ArrowRight className="h-6 w-6"/>
              </div>
              <h2 className="text-xl font-semibold">Join Meeting</h2>
              <p className="text-muted-foreground text-sm">
                Enter a meeting ID to join an existing meeting.
              </p>
              <Input
                  placeholder="Enter meeting ID"
                  value={meetingId}
                  onChange={e => setMeetingId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
              <Button variant="outline" onClick={handleJoin} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2"/>
                Join Meeting
              </Button>
            </div>
          </div>

          {error && (
              <p className="text-destructive text-sm mt-4 text-center">{error}</p>
          )}
        </div>
      </div>
  );
}
