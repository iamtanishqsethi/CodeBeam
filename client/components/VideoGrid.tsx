"use client";

import {useTracks} from "@livekit/components-react";
import {Track} from "livekit-client";
import MeetingParticipantTile, {getMeetingTrackId} from "@/components/MeetingParticipantTile";

export default function VideoGrid() {

    const tracks=useTracks(
        [
            {source:Track.Source.Camera,withPlaceholder:true},
            {source:Track.Source.ScreenShare,withPlaceholder:true},
        ],
        {
            onlySubscribed:false
        }
    )

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map(trackRef=>(
                <div key={getMeetingTrackId(trackRef)} className="aspect-video min-h-40">
                    <MeetingParticipantTile trackRef={trackRef} />
                </div>
            ))}
        </div>
    )
}
