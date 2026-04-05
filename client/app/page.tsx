'use client'


import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ArrowRight, Plus, Video} from "lucide-react";

export default function Home() {
  const router=useRouter()

  return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Dashboard</h1>
          <p className="text-muted-foreground mb-10 text-center md:text-left">Create or join a meeting</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Meeting Card */}
            <div className="border rounded-2xl p-6 bg-card shadow-sm flex flex-col gap-4 items-center text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-primary"/>
              </div>
              <h2 className="text-xl font-semibold">New Meeting</h2>
              <p className="text-muted-foreground text-sm">
                Create a new meeting and invite others to join.
              </p>
              <Button onClick={() => router.push('/create')} className="w-full mt-2">
                <Video className="h-4 w-4 mr-2"/>
                Create Meeting
              </Button>
            </div>

            {/* Join Meeting Card */}
            <div className="border rounded-2xl p-6 bg-card shadow-sm flex flex-col gap-4 items-center text-center">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                <ArrowRight className="h-6 w-6"/>
              </div>
              <h2 className="text-xl font-semibold">Join Meeting</h2>
              <p className="text-muted-foreground text-sm">
                Enter a meeting ID to join an existing meeting.
              </p>
              <Button variant="outline" onClick={() => router.push('/join')} className="w-full mt-2">
                <ArrowRight className="h-4 w-4 mr-2"/>
                Join Meeting
              </Button>
            </div>
          </div>
        </div>
      </div>
  );
}
