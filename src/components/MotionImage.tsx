"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useAudio } from "./AudioProvider";

const MotionImageComponent = motion(Image);

export const MotionImage: React.FC = (props) => {
    const { state } = useAudio();

    if (!state.track) return null;

    return (
        <MotionImageComponent
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            {...props}
        />
    );
};
