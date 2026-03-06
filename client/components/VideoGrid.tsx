import {ParticipantTile, TrackLoop, useTracks} from "@livekit/components-react";
import {Track} from "livekit-client";

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
        <div className={'grid grid-cols-3 gap-4'}>
            {tracks.map(trackRef=>(
                <div key={trackRef.participant.identity + (trackRef.source??'')}
                    className={'relative rounded-xl overflow-hidden bg-muted aspect-video'}
                >
                    <ParticipantTile trackRef={trackRef} />

                </div>
            ))}
        </div>
    )
}