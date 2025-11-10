"use client";

import React, { memo, useCallback } from "react";
import { useAudio } from "./AudioProvider";
import { Track } from "../types";
import { Button } from "./Button";
import Image from "next/image";

type Props = {
    track: Track;
    index: number;
};

const TrackCardInner: React.FC<Props> = ({ track, index }) => {
    const { setTrack, state } = useAudio();

    const onPlay = useCallback(() => {
        setTrack(track, index);
    }, [setTrack, track, index]);

    const isCurrent = state.index === index;

    return (
        <article
            className="bg-white rounded-lg p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            aria-label={`${track.title} by ${track.artist}`}
        >
            <Image
                src={track.poster}
                width={640}
                height={640}
                alt={`${track.title} poster`}
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                loading="lazy"
            />

            <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{track.title}</div>
                <div className="text-slate-500 text-sm truncate">
                    {track.artist}{track.album ? ` — ${track.album}` : ""}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    onClick={onPlay}
                    aria-pressed={isCurrent}
                >
                    {isCurrent && state.isPlaying ? "Playing" : "Play"}
                </Button>
            </div>
        </article>
    );
};

export const TrackCard = memo(TrackCardInner);
