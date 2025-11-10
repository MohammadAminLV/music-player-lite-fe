"use client";

import React, { useEffect } from "react";
import { useAudio } from "../AudioProvider";
import MainPlayerLayout from "./MainPlayerLayout";

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
        <MainPlayerLayout />
    );
};