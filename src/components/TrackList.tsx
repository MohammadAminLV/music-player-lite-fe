"use client";

import React, { Suspense, useEffect } from "react";
import { useAudio } from "./AudioProvider";
import { TrackCard } from "./TrackCard";
import useTracks from "../queries/useTracks";

export const TrackList: React.FC = () => {
    const { setPlaylist } = useAudio();

    const { data, isLoading } = useTracks();

    useEffect(() => {
        if (data) setPlaylist(data); 
    }, [data, setPlaylist]);

    if(isLoading) {
        return (
            <div>Loading tracks…</div>
        )
    }
    
    return (
        <div className="grid xl:grid-cols-2 gap-3">
            {data?.map((track, index) => (
                <TrackCard key={track.url} track={track} index={index} />
            ))}
        </div>
    );
};

export const TrackListWithSuspense: React.FC = () => (
    <Suspense fallback={<div>Loading tracks…</div>}>
        <TrackList />
    </Suspense>
);
