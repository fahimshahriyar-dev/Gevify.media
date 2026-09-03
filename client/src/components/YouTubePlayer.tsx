import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";

interface YouTubePlayerProps {
  videoId: string;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
            onError?: () => void;
          };
        },
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (v: number) => void;
  getVolume: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy?: () => void;
}

const YTState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

let apiReadyPromise: Promise<void> | null = null;

function ensureYouTubeApi(): Promise<void> {
  if (apiReadyPromise) return apiReadyPromise;
  if (window.YT?.Player) {
    apiReadyPromise = Promise.resolve();
    return apiReadyPromise;
  }
  apiReadyPromise = new Promise((resolve) => {
    const prev = (window as Window).onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  });
  return apiReadyPromise;
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [iframeId] = useState(
    () => `yt-player-${Math.random().toString(36).slice(2)}`,
  );

  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsHiddenTimer, setControlsHiddenTimer] = useState<
    ReturnType<typeof setTimeout> | null
  >(null);
  const [volumeOpen, setVolumeOpen] = useState(false);

  const clearHideTimer = useCallback(() => {
    if (controlsHiddenTimer) {
      clearTimeout(controlsHiddenTimer);
      setControlsHiddenTimer(null);
    }
  }, [controlsHiddenTimer]);

  const hideControlsSoon = useCallback(() => {
    clearHideTimer();
    setControlsVisible(true);
    const t = setTimeout(() => {
      // Hide only while playing
      setControlsVisible((prev) => prev && false);
    }, 2600);
    setControlsHiddenTimer(t);
  }, [clearHideTimer]);

  useEffect(() => {
    return () => {
      if (controlsHiddenTimer) clearTimeout(controlsHiddenTimer);
    };
  }, [controlsHiddenTimer]);

  useEffect(() => {
    if (!videoId) return;
    let cancelled = false;
    let progressInterval: ReturnType<typeof setInterval> | null = null;

    ensureYouTubeApi().then(() => {
      if (cancelled) return;

      new window.YT!.Player(iframeId, {
        videoId,
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          iv_load_policy: 3,
          showinfo: 0,
        },
        events: {
          onReady: (e) => {
            playerRef.current = e.target;
            setDuration(e.target.getDuration() || 0);
            setMuted(e.target.isMuted());
            setVolume(e.target.isMuted() ? 0 : e.target.getVolume() / 100);
            e.target.playVideo();
            progressInterval = setInterval(() => {
              const p = playerRef.current;
              if (!p) return;
              setCurrentTime(p.getCurrentTime() || 0);
              const d = p.getDuration() || 0;
              if (d) setDuration(d);
            }, 250);
          },
          onStateChange: (e) => {
            if (e.data === YTState.PLAYING) {
              setPlaying(true);
              setBuffering(false);
            } else if (e.data === YTState.PAUSED) {
              setPlaying(false);
              setBuffering(false);
            } else if (e.data === YTState.BUFFERING) {
              setBuffering(true);
            } else if (e.data === YTState.ENDED) {
              setPlaying(false);
              setBuffering(false);
            }
          },
          onError: () => {
            setBuffering(false);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (progressInterval) clearInterval(progressInterval);
      if (playerRef.current?.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          /* ignore */
        }
      }
      playerRef.current = null;
    };
  }, [videoId, iframeId]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const state = p.getPlayerState();
    if (state === YTState.PLAYING) {
      p.pauseVideo();
    } else {
      p.playVideo();
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const p = playerRef.current;
    if (!p) return;
    const next = Number(e.target.value);
    p.seekTo(next, true);
    setCurrentTime(next);
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  };

  const handleVolume = (value: number) => {
    const p = playerRef.current;
    if (!p) return;
    setVolume(value);
    if (value === 0) {
      p.mute();
      setMuted(true);
    } else {
      p.unMute();
      setMuted(false);
      p.setVolume(value * 100);
    }
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
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black group overflow-hidden"
      onMouseMove={hideControlsSoon}
      onMouseLeave={() => setControlsVisible(true)}
    >
      <div
        id={iframeId}
        className="w-full h-full"
        style={{ pointerEvents: "auto" }}
      />

      {/* Buffering spinner */}
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Big center play button (paused/ended only) */}
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

export default YouTubePlayer;