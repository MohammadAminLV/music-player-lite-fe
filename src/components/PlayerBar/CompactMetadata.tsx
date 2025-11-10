"use client";

import React from "react";
import { AnimatePresence, motion, easeOut, easeIn } from "framer-motion";
import { useAudio } from "../AudioProvider";
import { MotionImage } from "../MotionImage";

const compactItem = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: easeOut } },
    exit: { opacity: 0, y: 8, transition: { duration: 0.18, ease: easeIn } }
};

const CompactMetadata: React.FC = () => {
    const { state } = useAudio();

    if (!state.track) return null;

    return (
        <>
            <MotionImage
                layoutId="poster-img"
                width={640}
                height={640}
                src={state.track.poster}
                alt="poster"
                className="w-14 h-14 object-cover rounded-md flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                    {!state.expanded && (
                        <motion.div
                            key="compact-meta"
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={compactItem}
                            className="min-w-0"
                        >
                            <div className="font-semibold truncate text-sm">{state.track.title}</div>
                            <div className="text-slate-500 text-xs truncate">{state.track.artist}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default CompactMetadata;