"use client";

import React, { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { Button } from "./Button";
import { MotionImage } from "./MotionImage";

export const PlayerBar: React.FC = () => {
    const { state, toggle, previous, next, toggleExpanded, setExpanded } = useAudio();

    const onToggle = useCallback(() => toggle(), [toggle]);
    const onPrev = useCallback(() => void previous(), [previous]);
    const onNext = useCallback(() => void next(), [next]);

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

    const compactItem = {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
        exit: { opacity: 0, y: 8, transition: { duration: 0.18, ease: "easeIn" } }
    };

    const drawerVariants = {
        hidden: { y: "100%" },
        visible: { y: 0, transition: { stiffness: 100, damping: 20, type: "spring" } },
        exit: { y: "100%", transition: { duration: 0.28, ease: "easeInOut" } }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.35 } },
        exit: { opacity: 0, transition: { duration: 0.28 } }
    };

    return (
        <>
            <div
                className="fixed left-0 right-0 bottom-0 z-50 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center gap-4 px-4 py-3"
                style={{ height: 84 }}
                role="region"
                aria-label="Compact music player"
            >
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

                <div className="flex items-center gap-2">
                    <AnimatePresence>
                        {!state.expanded && (
                            <>
                                <motion.button
                                    key="prev"
                                    onClick={onPrev}
                                    aria-label="Previous"
                                    className="p-3 rounded-full hover:bg-slate-100 active:scale-95 transition"
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={compactItem}
                                >
                                    ◀︎
                                </motion.button>

                                <motion.button
                                    key="play"
                                    onClick={onToggle}
                                    aria-label={state.isPlaying ? "Pause" : "Play"}
                                    className="px-4 py-3 rounded-lg bg-black text-white text-sm font-medium shadow cursor-pointer"
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={compactItem}
                                >
                                    {state.isPlaying ? "Pause" : "Play"}
                                </motion.button>

                                <motion.button
                                    key="next"
                                    onClick={onNext}
                                    aria-label="Next"
                                    className="p-3 rounded-full hover:bg-slate-100 active:scale-95 transition"
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={compactItem}
                                >
                                    ▶︎
                                </motion.button>

                                <motion.button
                                    key="expand"
                                    onClick={() => toggleExpanded()}
                                    aria-label="Expand"
                                    className="p-2 ml-1 rounded-md hover:bg-slate-100 active:scale-95 transition"
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={compactItem}
                                >
                                    ⤢
                                </motion.button>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Overlay + Drawer — use AnimatePresence so it mounts only when needed */}
            <AnimatePresence>
                {state.expanded && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/70 z-40"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={overlayVariants}
                            onClick={() => setExpanded(false)}
                        />

                        {/* Drawer */}
                        <motion.div
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
                                                <h2 className="text-2xl font-semibold">{state.track.title}</h2>
                                                <p className="text-slate-900 mt-1">
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
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
