"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  Settings,
  FastForward,
  Rewind,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { BenPlayerProps, VideoQualitySource } from "./types";
import ProgressBar from "./Controls/ProgressBar";
import VolumeControl from "./Controls/VolumeControl";

const formatTime = (seconds: number): string => {
  if (isNaN(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = m < 10 ? `0${m}` : m;
  const ss = s < 10 ? `0${s}` : s;
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export default function BenPlayer({
  sources,
  poster,
  title = "BenPlayer Stream",
}: BenPlayerProps) {
  const [currentQuality, setCurrentQuality] = useState<VideoQualitySource>(
    sources[0],
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [overlayIndicator, setOverlayIndicator] = useState<
    "forward" | "rewind" | null
  >(null);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingTimeRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);

  const speeds = [0.5, 1, 1.25, 1.5, 1.75, 2];
  const videoStorageKey = `benplayer_resume_${title.replace(/\s+/g, "_")}`;
  const qualityStorageKey = "benplayer_preferred_quality";

  const triggerMobileVibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  useEffect(() => {
    if (sources && sources.length > 0) {
      setVideoError(null);
      setIsMetadataLoaded(false);
      const savedQuality = localStorage.getItem(qualityStorageKey);
      const matchedSource = sources.find((s) => s.label === savedQuality);
      setCurrentQuality(matchedSource || sources[0]);
    }
  }, [sources]);

  useEffect(() => {
    if (videoRef.current) {
      setVideoError(null);
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentQuality.url]);

  useEffect(() => {
    const savedTime = localStorage.getItem(videoStorageKey);
    if (savedTime && videoRef.current) {
      pendingTimeRef.current = parseFloat(savedTime);
    }
  }, [videoStorageKey]);

  useEffect(() => {
    if (typeof document !== "undefined" && document.pictureInPictureEnabled) {
      setIsPiPSupported(true);
    }
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPseudoFullscreen)
        setIsPseudoFullscreen(false);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isPseudoFullscreen]);

  const triggerIndicator = (type: "forward" | "rewind") => {
    if (indicatorTimeoutRef.current) clearTimeout(indicatorTimeoutRef.current);
    setOverlayIndicator(type);
    triggerMobileVibrate();
    indicatorTimeoutRef.current = setTimeout(
      () => setOverlayIndicator(null),
      600,
    );
  };

  const togglePlay = () => {
    if (!videoRef.current || videoError) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current
        .play()
        .catch((err) => console.log("Playback interrupted:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoTouchStart = (e: React.TouchEvent<HTMLVideoElement>) => {
    if (videoError) return;
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const touchX = e.touches[0].clientX - rect.left;

      if (touchX < rect.width / 2) {
        if (videoRef.current)
          videoRef.current.currentTime = Math.max(
            0,
            videoRef.current.currentTime - 10,
          );
        triggerIndicator("rewind");
      } else {
        if (videoRef.current)
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 10,
          );
        triggerIndicator("forward");
      }
    } else {
      if (showControls) {
        togglePlay();
      } else {
        handleMouseMove();
      }
    }
    lastTapRef.current = now;
  };

  const handleQualityChange = (quality: VideoQualitySource) => {
    if (!videoRef.current) return;
    pendingTimeRef.current = videoRef.current.currentTime;
    setIsMetadataLoaded(false);
    setVideoError(null);
    setCurrentQuality(quality);
    localStorage.setItem(qualityStorageKey, quality.label);
    setShowSettings(false);
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setShowSettings(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;

    setCurrentTime(current);
    setDuration(dur);
    if (dur) setProgress((current / dur) * 100);

    localStorage.setItem(videoStorageKey, current.toString());
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {
          setIsPseudoFullscreen(true);
        });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current || !isMetadataLoaded) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP Error: ", err);
    }
  };

  const handleVideoDoubleClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (!videoRef.current || videoError) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10,
      );
      triggerIndicator("rewind");
    } else {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10,
      );
      triggerIndicator("forward");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;
      if (!videoRef.current || videoError) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          videoRef.current.muted = !videoRef.current.muted;
          break;
        case "arrowright":
          e.preventDefault();
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 5,
          );
          triggerIndicator("forward");
          break;
        case "arrowleft":
          e.preventDefault();
          videoRef.current.currentTime = Math.max(
            0,
            videoRef.current.currentTime - 5,
          );
          triggerIndicator("rewind");
          break;
        case "arrowup":
          e.preventDefault();
          videoRef.current.muted = false;
          videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
          break;
        case "arrowdown":
          e.preventDefault();
          videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFullscreen, isPseudoFullscreen, videoError]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettings(false);
      }, 3000);
    }
  };

  const handleLoadedMetadata = () => {
    setIsMetadataLoaded(true);
    if (pendingTimeRef.current !== null && videoRef.current) {
      videoRef.current.currentTime = pendingTimeRef.current;
      pendingTimeRef.current = null;
    }
  };

  const isAnyFullscreen = isFullscreen || isPseudoFullscreen;

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full max-w-5xl mx-auto aspect-video bg-[#050505] border border-[#1a1a1a] select-none transition-all duration-300 ${
        isAnyFullscreen
          ? "fixed inset-0 z-[9999] max-w-none w-screen h-screen rounded-none border-none bg-black"
          : "rounded-xl shadow-[0_0_40px_rgba(255,0,60,0.03)]"
      }`}
    >
      {videoError ? (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-[#070707] text-zinc-400 p-6 z-50 border border-red-950/40 ${isAnyFullscreen ? "" : "rounded-xl"}`}
        >
          <AlertTriangle
            size={36}
            className="text-[#FF003C] drop-shadow-[0_0_8px_rgba(255,0,60,0.4)] mb-2 animate-pulse"
          />
          <p className="text-xs font-semibold text-zinc-200 text-center tracking-wide">
            {videoError}
          </p>
          <p className="text-[10px] text-zinc-500 text-center mt-2 max-w-md leading-relaxed">
            Ensure the format is compatible and the remote video host allows
            framing hooks.
          </p>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={currentQuality.url}
          preload="auto"
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onSeeking={() => setIsBuffering(true)}
          onSeeked={() => setIsBuffering(false)}
          onError={() => {
            setVideoError(
              "Format not supported or connection dropped by server.",
            );
            setIsBuffering(false);
          }}
          onClick={(e) => {
            if (
              !window.matchMedia("(max-width: 768px)").matches &&
              e.detail === 1
            )
              togglePlay();
          }}
          onDoubleClick={handleVideoDoubleClick}
          onTouchStart={handleVideoTouchStart}
          className={`w-full h-full object-contain cursor-pointer ${isAnyFullscreen ? "rounded-none" : "rounded-xl"}`}
          playsInline
        />
      )}

      {isBuffering && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-30 pointer-events-none">
          <div className="w-10 h-10 border-4 border-zinc-950 border-t-[#FF003C] rounded-full animate-spin shadow-[0_0_15px_rgba(255,0,60,0.3)]" />
        </div>
      )}

      {overlayIndicator && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-out fade-out zoom-out-50 duration-500">
          <div className="flex flex-col items-center justify-center bg-black/70 border border-[#FF003C]/20 backdrop-blur-md text-[#FF003C] p-4 rounded-full w-20 h-20 shadow-[0_0_20px_rgba(255,0,60,0.15)]">
            {overlayIndicator === "forward" ? (
              <>
                <FastForward
                  size={24}
                  className="animate-pulse"
                  fill="currentColor"
                />
                <span className="text-[9px] font-black mt-0.5">+10s</span>
              </>
            ) : (
              <>
                <Rewind
                  size={24}
                  className="animate-pulse"
                  fill="currentColor"
                />
                <span className="text-[9px] font-black mt-0.5">-10s</span>
              </>
            )}
          </div>
        </div>
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/50 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none ${
          showControls ? "opacity-100" : "opacity-0"
        } ${isAnyFullscreen ? "rounded-none" : "rounded-xl"}`}
      >
        <div className="flex justify-between items-center pointer-events-auto">
          <h2 className="text-xs font-medium tracking-wide text-zinc-300 truncate max-w-md">
            {title}
          </h2>
          <span className="text-xs font-black uppercase tracking-widest text-[#FF003C] drop-shadow-[0_0_6px_rgba(255,0,60,0.5)]">
            BenPlayer
          </span>
        </div>

        <div className="space-y-4 pointer-events-auto">
          <ProgressBar progress={progress} videoRef={videoRef} />

          <div className="flex items-center justify-between text-zinc-300">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="hover:text-[#FF003C] transition-colors duration-200 p-1.5 bg-zinc-900/60 rounded-lg border border-zinc-800/50"
              >
                {isPlaying ? (
                  <Pause size={16} fill="currentColor" />
                ) : (
                  <Play size={16} fill="currentColor" />
                )}
              </button>
              <VolumeControl videoRef={videoRef} />

              <span className="text-[11px] font-mono text-zinc-400 select-none tracking-wider">
                <span className="text-zinc-200">{formatTime(currentTime)}</span>
                <span className="mx-1 text-zinc-600">/</span>
                {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center space-x-4 relative">
              {isPiPSupported && (
                <button
                  onClick={togglePiP}
                  disabled={!isMetadataLoaded || !!videoError}
                  className={`transition-colors duration-200 ${!isMetadataLoaded || videoError ? "text-zinc-600 cursor-not-allowed" : "hover:text-[#FF003C] text-zinc-300"}`}
                  title={
                    isMetadataLoaded
                      ? "Picture in Picture"
                      : "Loading Metadata..."
                  }
                >
                  <ExternalLink size={16} />
                </button>
              )}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`hover:text-[#FF003C] transition-all duration-200 ${showSettings ? "text-[#FF003C] rotate-45" : ""}`}
              >
                <Settings size={18} />
              </button>

              {showSettings && (
                <div className="absolute bottom-12 right-0 bg-[#0A0A0A]/95 border border-[#262626] rounded-xl p-2 w-44 shadow-2xl z-50 backdrop-blur-md flex flex-col space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold px-2 py-1 border-b border-zinc-900 mb-1">
                      Quality
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-0.5">
                      {sources.map((source) => (
                        <button
                          key={source.label}
                          onClick={() => handleQualityChange(source)}
                          className={`w-full text-left text-xs px-2 py-1 rounded-md transition-colors flex items-center justify-between ${currentQuality.label === source.label ? "bg-[#FF003C]/10 text-[#FF003C] font-semibold" : "hover:bg-zinc-900 text-zinc-400"}`}
                        >
                          {source.label}
                          {currentQuality.label === source.label && (
                            <span className="w-1.5 h-1.5 bg-[#FF003C] rounded-full shadow-[0_0_6px_rgba(255,0,60,0.8)]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold px-2 py-1 border-b border-zinc-900 mb-1">
                      Speed
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-1">
                      {speeds.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`text-center text-[11px] py-1 rounded transition-colors ${playbackSpeed === speed ? "bg-[#FF003C] text-white font-bold" : "bg-zinc-900 hover:bg-zinc-800 text-zinc-400"}`}
                        >
                          {speed === 1 ? "Normal" : `${speed}x`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={toggleFullscreen}
                className="hover:text-[#FF003C] transition-colors duration-200"
              >
                {isAnyFullscreen ? (
                  <Minimize size={18} />
                ) : (
                  <Maximize size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
