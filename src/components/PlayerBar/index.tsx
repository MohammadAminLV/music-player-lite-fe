"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useAudio } from "../AudioProvider";
import CompactMetadata from "./CompactMetadata";
import Controls from "./Controls";
import MainLayout from "./MainLayout";

const ExpandedPlayer = dynamic(() => import("./Expanded").then((mod) => mod.ExpandedPlayer), {
    ssr: false,
    loading: () => null
});

export const PlayerBar: React.FC = () => {
    const { state } = useAudio();

    useEffect(() => {
        if (state.expanded) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [state.expanded]);

    if (!state.track) {
        return (
            <div className="fixed left-0 right-0 bottom-0 h-[84px] bg-white/90 backdrop-blur z-50 flex items-center justify-center">
                <div className="text-sm text-slate-600">No track playing</div>
            </div>
        );
    }

    {/* This component can be lazy-loaded, but I thought lazy-loading it has negative effect on user experiece */}
    return (
        <MainLayout />
    );
};