"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence, easeInOut, spring } from "framer-motion";
import { useAudio } from "../AudioProvider";
import { Button } from "../Button";
import { MotionImage } from "../MotionImage";

const drawerVariants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { stiffness: 100, damping: 20, type: spring } },
    exit: { y: "100%", transition: { duration: 0.28, ease: easeInOut } }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35 } },
    exit: { opacity: 0, transition: { duration: 0.28 } }
};

export const ExpandedPlayer: React.FC = () => {
    const { state, toggle, previous, next, setExpanded } = useAudio();

    const onToggle = useCallback(() => toggle(), [toggle]);
    const onPrev = useCallback(() => void previous(), [previous]);
    const onNext = useCallback(() => void next(), [next]);

    if (!state.expanded || !state.track) {
        return null;
    }

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="expanded-backdrop"
                className="fixed inset-0 bg-black/70 z-40"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={overlayVariants}
                onClick={() => setExpanded(false)}
            />

            {/* Drawer */}
            <motion.div
                key="expanded-drawer"
                className="fixed left-0 right-0 bottom-0 z-50 flex items-end justify-center"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={drawerVariants}
                style={{ pointerEvents: "auto" }}
                aria-modal="true"
                role="dialog"
            >
                <motion.div
                    className="relative w-full bg-gray-100 text-slate-900 rounded-t-2xl shadow-2xl p-6 relative"
                    initial={{ translateY: 12 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 12 }}
                    transition={{ duration: 0.32 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setExpanded(false)}
                        className="p-2 ml-2 text-xl text-slate-900 hover:text-slate-300 top-4 right-4 absolute"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    <div className="mx-auto max-w-[95vw] flex flex-col items-center gap-6">
                        <MotionImage
                            layoutId="poster-img"
                            src={state.track.poster}
                            width={640}
                            height={640}
                            alt="poster"
                            className="rounded-lg object-cover shadow-2xl"
                            style={{
                                width: "min(90vw, 640px)",
                                height: "min(90vw, 640px)"
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: 0.08, duration: 0.32 } }}
                            exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
                            className="w-full px-4"
                        >
                            <div className="flex flex-col items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-center">{state.track.title}</h2>
                                    <p className="text-slate-900 mt-1 text-center">
                                        {state.track.artist} {state.track.album ? `— ${state.track.album}` : ""}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={onPrev}
                                        className="p-3 rounded-full bg-white/8 hover:bg-white/12 active:scale-95"
                                        aria-label="Previous"
                                    >
                                        ◀︎
                                    </button>

                                    <Button
                                        onClick={onToggle}
                                        aria-label={state.isPlaying ? "Pause" : "Play"}
                                    >
                                        {state.isPlaying ? "Pause" : "Play"}
                                    </Button>

                                    <button
                                        onClick={onNext}
                                        className="p-3 rounded-full bg-white/8 hover:bg-white/12 active:scale-95"
                                        aria-label="Next"
                                    >
                                        ▶︎
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};