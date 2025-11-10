"use client";

import React, { useCallback } from "react";
import { AnimatePresence, motion, easeOut, easeIn } from "framer-motion";
import { useAudio } from "../AudioProvider";

const compactItem = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: easeOut } },
    exit: { opacity: 0, y: 8, transition: { duration: 0.18, ease: easeIn } }
};

const CompactPlayerControls: React.FC = () => {
    const { state, toggle, previous, next, toggleExpanded } = useAudio();

    const onToggle = useCallback(() => toggle(), [toggle]);
    const onPrev = useCallback(() => void previous(), [previous]);
    const onNext = useCallback(() => void next(), [next]);

    return (
        <div className="flex items-center gap-2">
            <AnimatePresence>
                {!state.expanded && (
                    <motion.div
                        key="compact-controls-group"
                        className="flex items-center gap-2"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={compactItem}
                    >
                        <motion.button
                            onClick={onPrev}
                            aria-label="Previous"
                            className="p-3 rounded-full hover:bg-slate-100 active:scale-95 transition"
                        >
                            ◀︎
                        </motion.button>

                        <motion.button
                            onClick={onToggle}
                            aria-label={state.isPlaying ? "Pause" : "Play"}
                            className="px-4 py-3 rounded-lg bg-black text-white text-sm font-medium shadow cursor-pointer"
                        >
                            {state.isPlaying ? "Pause" : "Play"}
                        </motion.button>

                        <motion.button
                            onClick={onNext}
                            aria-label="Next"
                            className="p-3 rounded-full hover:bg-slate-100 active:scale-95 transition"
                        >
                            ▶︎
                        </motion.button>

                        <motion.button
                            onClick={() => toggleExpanded()}
                            aria-label="Expand"
                            className="p-2 ml-1 rounded-md hover:bg-slate-100 active:scale-95 transition"
                        >
                            ⤢
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CompactPlayerControls;