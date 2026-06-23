"use client";

import React, { useRef, useState, useEffect } from "react";

interface ProgressBarProps {
  progress: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function ProgressBar({ progress, videoRef }: ProgressBarProps) {
  const clickTrackRef = useRef<HTMLDivElement>(null);
  const [bufferedProgress, setBufferedProgress] = useState(0); // نسبة الـ Buffer المسبق (الخط الرمادي)

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleProgress = () => {
      if (video.buffered && video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;

        setBufferedProgress((bufferedEnd / duration) * 100);
      }
    };

    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadedmetadata", handleProgress);

    return () => {
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadedmetadata", handleProgress);
    };
  }, [videoRef]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !clickTrackRef.current) return;

    const rect = clickTrackRef.current.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const width = rect.width;

    if (width === 0) return;

    const percentage = clickPositionX / width;
    const duration = videoRef.current.duration;

    if (duration && !isNaN(duration) && isFinite(duration)) {
      videoRef.current.currentTime = percentage * duration;
    }
  };

  return (
    <div
      ref={clickTrackRef}
      onClick={handleSeek}
      className="relative w-full h-1 group/track bg-zinc-800/60 cursor-pointer rounded-full transition-all duration-200 hover:h-1.5"
    >
      <div
        style={{ width: `${bufferedProgress}%` }}
        className="absolute top-0 left-0 h-full bg-zinc-600/40 rounded-full transition-all duration-300"
      />

      <div
        style={{ width: `${progress}%` }}
        className="absolute top-0 left-0 h-full bg-[#FF003C] rounded-full shadow-[0_0_10px_rgba(255,0,60,0.8)] relative transition-all duration-75"
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#FF003C] rounded-full scale-0 group-hover/track:scale-100 transition-transform duration-150" />
      </div>
    </div>
  );
}
