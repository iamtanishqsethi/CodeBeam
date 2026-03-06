'use client'

import VideoGrid from "./VideoGrid";

export default function LayoutManager() {
    return (
        <div className="flex-1 p-4 overflow-hidden bg-background">
            <VideoGrid/>
        </div>
    );
}