"use client";

import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from "react";
import { Track } from "../types";

type State = {
    playlist: Track[];
    track: Track | null;
    index: number | null;
    isPlaying: boolean;
    expanded: boolean;
};

type Action =
    | { type: "SET_PLAYLIST"; playlist: Track[] }
    | { type: "SET_TRACK"; track: Track; index: number }
    | { type: "PLAY" }
    | { type: "PAUSE" }
    | { type: "TOGGLE_EXPANDED" }
    | { type: "SET_EXPANDED"; expanded: boolean };

const initialState: State = {
    playlist: [],
    track: null,
    index: null,
    isPlaying: false,
    expanded: false
};

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_PLAYLIST":
            return { ...state, playlist: action.playlist };
        case "SET_TRACK":
            return { ...state, track: action.track, index: action.index, isPlaying: true };
        case "PLAY":
            return { ...state, isPlaying: true };
        case "PAUSE":
            return { ...state, isPlaying: false };
        case "TOGGLE_EXPANDED":
            return { ...state, expanded: !state.expanded };
        case "SET_EXPANDED":
            return { ...state, expanded: action.expanded };
        default:
            return state;
    }
}

type AudioContextValue = {
    state: State;
    setPlaylist: (tracks: Track[]) => void;
    setTrack: (track: Track, index: number) => void;
    play: () => void;
    pause: () => void;
    toggle: () => void;
    next: () => void;
    previous: () => void;
    seekTo: (seconds: number) => void;
    toggleExpanded: () => void;
    setExpanded: (v: boolean) => void;
};

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export const useAudio = (): AudioContextValue => {
    const ctx = useContext(AudioContext);
    if (!ctx) throw new Error("useAudio must be used within AudioProvider");
    return ctx;
};

export const AudioProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const originalTitleRef = useRef(typeof document !== "undefined" ? document.title : "");

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.preload = "metadata";
        }
        const audio = audioRef.current;
        const onEnded = () => handleNext();
        audio.addEventListener("ended", onEnded);
        return () => audio.removeEventListener("ended", onEnded);
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (state.track) {
            if (audio.src !== state.track.url) audio.src = state.track.url;
            state.isPlaying ? audio.play().catch(() => { }) : audio.pause();

            // Media Session
            try {
                if ("mediaSession" in navigator && state.track) {
                    (navigator as any).mediaSession.metadata = new (window as any).MediaMetadata({
                        title: state.track.title,
                        artist: state.track.artist,
                        album: state.track.album ?? "",
                        artwork: [{ src: state.track.poster, sizes: "512x512", type: "image/jpeg" }]
                    });

                    navigator.mediaSession.setActionHandler("play", () => dispatch({ type: "PLAY" }));
                    navigator.mediaSession.setActionHandler("pause", () => dispatch({ type: "PAUSE" }));
                    navigator.mediaSession.setActionHandler("previoustrack", handlePrevious);
                    navigator.mediaSession.setActionHandler("nexttrack", handleNext);
                }
            } catch { }
        } else {
            audio.pause();
            audio.src = "";
            try {
                if ("mediaSession" in navigator) (navigator as any).mediaSession.metadata = null;
            } catch { }
        }
    }, [state.track, state.isPlaying]);

    // Update tab title
    useEffect(() => {
        if (!state.track) {
            document.title = originalTitleRef.current;
            return;
        }
        const prefix = state.isPlaying ? "▶ " : "";
        document.title = `${prefix}${state.track.title} — ${state.track.artist}`;
    }, [state.track, state.isPlaying]);

    const setPlaylist = useCallback((playlist: Track[]) => dispatch({ type: "SET_PLAYLIST", playlist }), []);
    const setTrack = useCallback((track: Track, index: number) => dispatch({ type: "SET_TRACK", track, index }), []);
    const play = useCallback(() => dispatch({ type: "PLAY" }), []);
    const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
    const toggle = useCallback(() => (state.isPlaying ? pause() : play()), [state.isPlaying, play, pause]);
    const toggleExpanded = useCallback(() => dispatch({ type: "TOGGLE_EXPANDED" }), []);
    const setExpanded = useCallback((v: boolean) => dispatch({ type: "SET_EXPANDED", expanded: v }), []);
    const seekTo = useCallback((seconds: number) => { audioRef.current && (audioRef.current.currentTime = seconds); }, []);

    const wrapIndex = useCallback((i: number) => state.playlist.length ? (i + state.playlist.length) % state.playlist.length : 0, [state.playlist.length]);

    const handleNext = useCallback(() => {
        if (state.index == null || state.playlist.length === 0) return;
        const nextIdx = wrapIndex(state.index + 1);
        setTrack(state.playlist[nextIdx], nextIdx);
    }, [state.index, state.playlist, wrapIndex, setTrack]);

    const handlePrevious = useCallback(() => {
        if (state.index == null || state.playlist.length === 0) return;
        const prevIdx = wrapIndex(state.index - 1);
        setTrack(state.playlist[prevIdx], prevIdx);
    }, [state.index, state.playlist, wrapIndex, setTrack]);

    const value = React.useMemo(() => ({
        state,
        setPlaylist,
        setTrack,
        play,
        pause,
        toggle,
        next: handleNext,
        previous: handlePrevious,
        seekTo,
        toggleExpanded,
        setExpanded
    }), [state, setPlaylist, setTrack, play, pause, toggle, handleNext, handlePrevious, seekTo, toggleExpanded, setExpanded]);

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};
