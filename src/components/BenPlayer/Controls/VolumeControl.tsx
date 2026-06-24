"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Volume1 } from "lucide-react";

interface VolumeControlProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export default function VolumeControl({ videoRef }: VolumeControlProps) {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted || video.volume === 0);
    };

    video.addEventListener("volumechange", handleVolumeChange);
    return () => video.removeEventListener("volumechange", handleVolumeChange);
  }, [videoRef]);

  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      videoRef.current.muted = value === 0;
    }
  };

  const handleVolumeClick = (e: React.MouseEvent) => {
    if (window.matchMedia("(max-width: 768px)").matches && !isMobileExpanded) {
      e.preventDefault();
      setIsMobileExpanded(true);
      return;
    }

    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    if (!videoRef.current.muted && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.5;
    }
  };

  const handleMouseLeave = () => {
    setIsMobileExpanded(false);
  };

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className="flex items-center space-x-2 group/volume"
    >
      <button
        onClick={handleVolumeClick}
        className="hover:text-[#FF003C] transition-colors duration-200"
      >
        {isMuted ? (
          <VolumeX size={18} className="text-[#FF003C]" />
        ) : volume < 0.5 ? (
          <Volume1 size={18} />
        ) : (
          <Volume2 size={18} />
        )}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={isMuted ? 0 : volume}
        onChange={onSliderChange}
        className={`h-1 accent-[#FF003C] bg-zinc-700 rounded-lg appearance-none cursor-pointer transition-all duration-300 origin-left ${
          isMobileExpanded
            ? "w-16 opacity-100 pointer-events-auto"
            : "w-0 opacity-0 pointer-events-none md:group-hover/volume:w-16 md:group-hover/volume:opacity-100 md:group-hover/volume:pointer-events-auto"
        }`}
      />
    </div>
  );
}
