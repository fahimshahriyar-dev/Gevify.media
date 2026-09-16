import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import {
  getCloudinaryVideoThumbnail,
  optimizeCloudinaryVideoUrl,
} from "../utils/cloudinary";

interface CloudinaryVideoPlayerProps {
  src: string;
  poster?: string;
  onReady?: () => void;
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const CloudinaryVideoPlayer: React.FC<CloudinaryVideoPlayerProps> = ({
  src,
  poster,
  onReady,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsHiddenTimer, setControlsHiddenTimer] = useState<
    ReturnType<typeof setTimeout> | null
  >(null);
  const [volumeOpen, setVolumeOpen] = useState(false);

  const effectivePoster = poster || getCloudinaryVideoThumbnail(src);

  const clearHideTimer = useCallback(() => {
    if (controlsHiddenTimer) {
      clearTimeout(controlsHiddenTimer);
      setControlsHiddenTimer(null);
    }
  }, [controlsHiddenTimer]);

  const hideControlsSoon = useCallback(() => {
    clearHideTimer();
    setControlsVisible(true);
    const t = setTimeout(() => setControlsVisible(false), 2600);
    setControlsHiddenTimer(t);
  }, [clearHideTimer]);

  useEffect(() => {
    return () => {
      if (controlsHiddenTimer) clearTimeout(controlsHiddenTimer);
    };
  }, [controlsHiddenTimer]);

  // Autoplay once mounted (works in popups after a user gesture).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // Autoplay blocked by the browser — leave paused, show the play button.
    });
  }, [src]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  const handleVideoClick = () => {
    togglePlay();
    hideControlsSoon();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const next = Number(e.target.value);
    v.currentTime = next;
    setCurrentTime(next);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleVolume = (value: number) => {
    const v = videoRef.current;
    if (!v) return;
    setVolume(value);
    v.volume = value;
    v.muted = value === 0;
    setMuted(v.muted);
    if (value > 0) setVolumeOpen(false);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedRatio =
    duration > 0 ? Math.min(100, (buffered / duration) * 100) : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group overflow-hidden"
      onMouseMove={hideControlsSoon}
      onMouseLeave={() => setControlsVisible(true)}
    >
      <video
        ref={videoRef}
        src={optimizeCloudinaryVideoUrl(src)}
        poster={effectivePoster}
        className="w-full h-full object-contain bg-black"
        playsInline
        autoPlay
        onClick={handleVideoClick}
        onCanPlay={() => {
          setBuffering(false);
          onReady?.();
        }}
        onWaiting={() => setBuffering(true)}
        onSeeking={() => setBuffering(true)}
        onSeeked={() => setBuffering(false)}
        onPlay={() => {
          handlePlay();
          setBuffering(false);
          onReady?.();
        }}
        onPause={handlePause}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length > 0) {
            setBuffered(v.buffered.end(v.buffered.length - 1));
          }
        }}
        onEnded={() => {
          setPlaying(false);
          setBuffering(false);
        }}
      />

      {/* Buffering loading spinner */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-[#0086F0] rounded-full animate-spin" />
        </div>
      )}

      {/* Big center play button (paused & not buffering only) */}
      {!playing && !buffering && (
        <button
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
        >
          <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white transition-transform duration-300 hover:scale-110">
            <Play className="w-9 h-9 text-white fill-white ml-1" />
          </span>
        </button>
      )}

      {/* Custom control bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 px-3 pb-2 pt-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Seek bar */}
        <div className="relative h-1.5 w-full rounded-full bg-white/20 cursor-pointer mb-2.5">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-white/30"
            style={{ width: `${bufferedRatio}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-[#0086F0]"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="text-white hover:text-[#5ACFFE] transition-colors cursor-pointer"
          >
            {playing ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white" />
            )}
          </button>

          <span className="text-xs font-medium text-white/90 tabular-nums whitespace-nowrap">
            {formatTime(currentTime)}
            <span className="text-white/50"> / {formatTime(duration)}</span>
          </span>

          <div
            className="relative flex items-center"
            onMouseEnter={() => setVolumeOpen(true)}
            onMouseLeave={() => setVolumeOpen(false)}
          >
            <button
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="text-white hover:text-[#5ACFFE] transition-colors cursor-pointer"
            >
              {muted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            {volumeOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-24 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 p-2.5">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => handleVolume(Number(e.target.value))}
                  aria-label="Volume"
                  className="w-full accent-[#0086F0] cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="flex-1" />

          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="text-white hover:text-[#5ACFFE] transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryVideoPlayer;