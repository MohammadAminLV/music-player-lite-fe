"use client";

import { motion, MotionProps } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { useAudio } from "./AudioProvider";

const MotionImageComponent = motion<ImageProps>(Image);

type MotionImageProps = ImageProps & MotionProps;

export const MotionImage: React.FC<MotionImageProps> = (props) => {
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
