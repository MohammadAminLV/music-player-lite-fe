"use client";

import React from "react";
import dynamic from "next/dynamic";
import CompactMetadata from "./CompactMetadata";
import Controls from "./Controls";

const ExpandedPlayer = dynamic(() => import("./Expanded").then((mod) => mod.ExpandedPlayer), {
    ssr: false,
    loading: () => null
});

const MainPlayerLayout: React.FC = () => {
    return (
        <>
            <div
                className="fixed left-0 right-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center gap-4 px-4 py-3"
                style={{ height: 84 }}
                role="region"
                aria-label="Compact music player"
            >
                <CompactMetadata />
                <Controls />
            </div>
            <ExpandedPlayer />
        </>
    );
};

export default MainPlayerLayout;