"use client";

import React, { useRef, useState, useEffect } from "react";

interface ProgressBarProps {
  progress: number;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function ProgressBar({ progress, videoRef }: ProgressBarProps) {
  const clickTrackRef = useRef<HTMLDivElement>(null);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleProgress = () => {
      if (video.buffered && video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBufferedProgress((bufferedEnd / video.duration) * 100);
      }
    };

    video.addEventListener("progress", handleProgress);
    video.addEventListener("loadedmetadata", handleProgress);

    return () => {
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("loadedmetadata", handleProgress);
    };
  }, [videoRef]);

  const getPercentageFromEvent = (clientX: number): number => {
    if (!clickTrackRef.current) return 0;
    const rect = clickTrackRef.current.getBoundingClientRect();
    const posX = clientX - rect.left;
    return Math.max(0, Math.min(1, posX / rect.width));
  };

  const handleSeek = (clientX: number) => {
    if (!videoRef.current) return;
    const percentage = getPercentageFromEvent(clientX);
    const duration = videoRef.current.duration;
    if (duration && !isNaN(duration) && isFinite(duration)) {
      videoRef.current.currentTime = percentage * duration;
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    handleSeek(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    handleSeek(e.touches[0].clientX);
  };

  return (
    <div
      ref={clickTrackRef}
      onClick={(e) => handleSeek(e.clientX)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        isDraggingRef.current = false;
      }}
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
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#FF003C] rounded-full scale-100 md:scale-0 md:group-hover/track:scale-100 transition-transform duration-150" />
      </div>
    </div>
  );
}
