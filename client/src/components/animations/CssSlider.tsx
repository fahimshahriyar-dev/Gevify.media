import React, { useEffect, useRef, useState, useCallback } from "react";
import CloudinaryVideoPlayer from "../CloudinaryVideoPlayer";
import YouTubePlayer from "../YouTubePlayer";
import {
  isCloudinaryVideoUrl,
  getCloudinaryVideoThumbnail,
} from "../../utils/cloudinary";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

/**
 * Drop-in replacement for the Three.js/WebGL Slider.
 * Calibrated to match Slider.tsx in box size, perspective, spacing,
 * scroll speed, velocity inertia, hover play-button overlay, and interaction behavior.
 * Built entirely with hardware-accelerated CSS 3D transforms + rAF
 * to eliminate WebGL startup and shader-compilation overhead on mobile devices.
 */

const fallbackImages = [
  "https://picsum.photos/id/10/512/320",
  "https://picsum.photos/id/12/512/320",
  "https://picsum.photos/id/15/512/320",
  "https://picsum.photos/id/29/512/320",
  "https://picsum.photos/id/48/512/320",
  "https://picsum.photos/id/60/512/320",
  "https://picsum.photos/id/102/512/320",
  "https://picsum.photos/id/122/512/320",
  "https://picsum.photos/id/133/512/320",
  "https://picsum.photos/id/160/512/320",
  "https://picsum.photos/id/180/512/320",
  "https://picsum.photos/id/201/512/320",
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtu.be/"))
    return url.split("youtu.be/")[1]?.split("?")[0] || null;
  if (url.includes("watch?v="))
    return url.split("watch?v=")[1]?.split("&")[0] || null;
  if (url.includes("embed/"))
    return url.split("embed/")[1]?.split("?")[0] || null;
  return null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

interface SliderProps {
  workVideos?: string[];
}

const COUNT = 12;
const ANGULAR_SPACING = 0.75;
const AUTO_SPEED = 0.006;

const seedOffsets = [
  0.9, -0.3, 0.15, -0.05, 0.55, -0.75, 0.3, -0.5, 0.7, -0.2, 0.4, -0.6,
];
const seedTilt = [
  0.12, -0.08, 0.03, -0.15, 0.1, -0.05, 0.14, -0.1, 0.06, -0.12, 0.08, -0.09,
];

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

/**
 * Responsive group factor matching Slider.tsx
 */
const getSizeFactor = (w: number) => {
  if (w < 640) return 0.92;
  if (w < 768) return 1.05;
  if (w < 1024) return 1.02;
  return 1;
};

/**
 * Mathematically compute equivalent CSS 3D perspective and pixel dimensions
 * from Three.js PerspectiveCamera(45, w/h, 0.1, 100) at camera.position (0, 0, 11)
 * and PlaneGeometry(2.9, 1.8).
 */
const computeLayout = (w: number, h: number) => {
  const f = getSizeFactor(w);
  const pxPerUnit = (h / 2) / (11 * Math.tan((45 / 2) * (Math.PI / 180)));
  const perspective = 11 * pxPerUnit; // approx h * 1.20710678
  const baseWidth = 2.9 * pxPerUnit * f;
  const baseHeight = 1.8 * pxPerUnit * f;
  const radius = 4.4 * pxPerUnit * f;
  const heightFactor = 1.7 * pxPerUnit * f;
  const seedScale = 0.18 * pxPerUnit * f;

  return {
    perspective,
    baseWidth,
    baseHeight,
    radius,
    heightFactor,
    seedScale,
  };
};

const CssSlider: React.FC<SliderProps> = ({ workVideos = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayDivRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layoutRef = useRef(computeLayout(1200, 800));

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(-1);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  // Notify parent page so it can hide overlapping UI while popup is open
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("video-popup-change", {
        detail: { open: isPopupOpen },
      }),
    );
  }, [isPopupOpen]);

  // Close modal on Escape key
  useEffect(() => {
    if (!isPopupOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPopupOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPopupOpen]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0] || "";
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0] || "";
    } else {
      videoId = url;
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  const imageUrls = Array.from({ length: COUNT }, (_, i) => {
    const videoUrl = workVideos[i];
    let thumb = null;
    if (videoUrl) {
      thumb = isCloudinaryVideoUrl(videoUrl)
        ? getCloudinaryVideoThumbnail(videoUrl, 320)
        : getYouTubeThumbnail(videoUrl);
    }
    return thumb || fallbackImages[i % fallbackImages.length];
  });

  const openCard = useCallback((index: number) => {
    setIsVideoLoading(true);
    setActiveCardIndex(index);
    setIsPopupOpen(true);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Update layout dimensions and CSS variables based on container size
    const updateLayout = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight || 500;
      const layout = computeLayout(w, h);
      layoutRef.current = layout;

      container.style.perspective = `${layout.perspective}px`;
      container.style.setProperty("--card-w", `${layout.baseWidth}px`);
      container.style.setProperty("--card-h", `${layout.baseHeight}px`);
    };

    updateLayout();

    const resizeObserver = new ResizeObserver(() => {
      updateLayout();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", updateLayout);

    // Scroll, drag, and velocity state matching Slider.tsx
    const state = {
      offset: 0,
      velocity: 0,
      auto: 0,
      targetAuto: -AUTO_SPEED,
      isInitialEase: true,
      startTime: performance.now(),
    };

    let dragging = false;
    let lastY = 0;
    let dragDistance = 0;
    let hoveredCardIndex = -1;

    function applyDelta(delta: number) {
      state.isInitialEase = false;
      if (delta < 0) {
        state.targetAuto = -AUTO_SPEED;
        state.auto = -AUTO_SPEED;
      } else if (delta > 0) {
        state.targetAuto = AUTO_SPEED;
        state.auto = AUTO_SPEED;
      }

      const clamped = clamp(delta, -30, 30);
      state.velocity += clamped * 0.0008;
    }

    /**
     * Compute exact screen-space projection of card `i` matching Slider.tsx
     */
    function getCardScreenRect(i: number) {
      const w = container?.clientWidth || window.innerWidth;
      const h = container?.clientHeight || window.innerHeight || 500;
      const layout = layoutRef.current;

      const totalSpacing = COUNT * ANGULAR_SPACING;
      let localAngle = i * ANGULAR_SPACING - state.offset;
      localAngle =
        ((((localAngle + totalSpacing / 2) % totalSpacing) + totalSpacing) %
          totalSpacing) -
        totalSpacing / 2;

      const orbitX = Math.sin(localAngle) * layout.radius;
      const orbitZ = (Math.cos(localAngle) - 1.0) * layout.radius;
      const orbitY =
        localAngle * layout.heightFactor - seedOffsets[i] * layout.seedScale;

      const absAngle = Math.abs(localAngle);
      let focus = 0;
      if (absAngle > ANGULAR_SPACING * 1.15) {
        focus = clamp(
          (absAngle - ANGULAR_SPACING * 1.15) / (ANGULAR_SPACING * 1.8),
          0,
          1,
        );
      }

      const projScale =
        layout.perspective / Math.max(1, layout.perspective - orbitZ);
      const cardScale = 1.25 - focus * 0.28;

      const cx = w / 2 + orbitX * projScale;
      const cy = h / 2 + orbitY * projScale;
      const sw = layout.baseWidth * cardScale * projScale;
      const sh = layout.baseHeight * cardScale * projScale;

      return { cx, cy, sw, sh, focus, orbitZ };
    }

    /**
     * Keep overlay play button perfectly aligned to the hovered card every frame (like Slider.tsx syncOverlay)
     */
    function syncOverlay() {
      const div = overlayDivRef.current;
      if (!div) return;
      if (hoveredCardIndex === -1) {
        div.style.opacity = "0";
        return;
      }
      const cardRect = getCardScreenRect(hoveredCardIndex);
      if (!cardRect || cardRect.focus >= 0.4) {
        div.style.opacity = "0";
        return;
      }
      div.style.left = `${cardRect.cx}px`;
      div.style.top = `${cardRect.cy}px`;
      div.style.width = `${cardRect.sw}px`;
      div.style.height = `${cardRect.sh}px`;
      div.style.opacity = "1";
    }

    // Stop propagation so section navigation in Home.tsx is not accidentally triggered
    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();
      applyDelta(-e.deltaY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.stopPropagation();
    };

    function findHoveredCard(clientX: number, clientY: number) {
      const rect = container?.getBoundingClientRect();
      if (!rect) return -1;
      const mx = clientX - rect.left;
      const my = clientY - rect.top;

      let bestIndex = -1;
      let bestZ = -Infinity;

      for (let i = 0; i < COUNT; i++) {
        const cardRect = getCardScreenRect(i);
        if (!cardRect || cardRect.focus >= 0.4) continue;

        const { cx, cy, sw, sh, orbitZ } = cardRect;
        if (
          mx >= cx - sw / 2 &&
          mx <= cx + sw / 2 &&
          my >= cy - sh / 2 &&
          my <= cy + sh / 2
        ) {
          if (orbitZ > bestZ) {
            bestZ = orbitZ;
            bestIndex = i;
          }
        }
      }

      return bestIndex;
    }

    const handlePointerDown = (e: PointerEvent) => {
      dragging = true;
      lastY = e.clientY;
      dragDistance = 0;

      const hitIdx = findHoveredCard(e.clientX, e.clientY);
      if (hitIdx !== -1) {
        hoveredCardIndex = hitIdx;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dy = e.clientY - lastY;
      lastY = e.clientY;
      dragDistance += Math.abs(dy);
      applyDelta(-dy * 1.2);
    };

    const handlePointerUp = () => {
      dragging = false;
      // If pointer wasn't dragged significantly, treat as a click on hovered card (identical to Slider.tsx)
      if (dragDistance < 6 && hoveredCardIndex !== -1) {
        openCard(hoveredCardIndex);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const newIdx = findHoveredCard(e.clientX, e.clientY);

      if (newIdx !== hoveredCardIndex) {
        // Un-shrink previous card
        if (hoveredCardIndex !== -1 && cardRefs.current[hoveredCardIndex]) {
          const inner = cardRefs.current[hoveredCardIndex]
            ?.firstElementChild as HTMLElement | null;
          if (inner) {
            inner.style.transform = "scale(1)";
            inner.style.filter = "brightness(1)";
          }
        }
        hoveredCardIndex = newIdx;
        if (newIdx !== -1 && cardRefs.current[newIdx]) {
          const inner = cardRefs.current[newIdx]
            ?.firstElementChild as HTMLElement | null;
          if (inner) {
            inner.style.transform = "scale(0.93)";
            inner.style.filter = "brightness(0.5)";
          }
          container.style.cursor = "pointer";
        } else {
          container.style.cursor = "default";
        }
      }
    };

    const handleMouseLeave = () => {
      if (hoveredCardIndex !== -1 && cardRefs.current[hoveredCardIndex]) {
        const inner = cardRefs.current[hoveredCardIndex]
          ?.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.transform = "scale(1)";
          inner.style.filter = "brightness(1)";
        }
      }
      hoveredCardIndex = -1;
      if (container) container.style.cursor = "default";
      if (overlayDivRef.current) overlayDivRef.current.style.opacity = "0";
    };

    const handleContextMenu = (e: Event) => e.preventDefault();

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("contextmenu", handleContextMenu);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    let rafId: number;
    const tick = () => {
      const elapsed = performance.now() - state.startTime;
      if (state.isInitialEase && elapsed < 1500) {
        const progress = Math.min(1, elapsed / 1500);
        const easeOut = 1 - (1 - progress) * (1 - progress);
        state.auto = -AUTO_SPEED * easeOut;
      }

      state.offset += state.velocity + state.auto;
      state.velocity *= 0.9;

      const totalSpacing = COUNT * ANGULAR_SPACING;
      const { radius, heightFactor, seedScale } = layoutRef.current;

      for (let i = 0; i < COUNT; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        let localAngle = i * ANGULAR_SPACING - state.offset;
        localAngle =
          ((((localAngle + totalSpacing / 2) % totalSpacing) + totalSpacing) %
            totalSpacing) -
          totalSpacing / 2;

        const orbitX = Math.sin(localAngle) * radius;
        const orbitZ = (Math.cos(localAngle) - 1.0) * radius;
        const orbitY = localAngle * heightFactor - seedOffsets[i] * seedScale;

        const absAngle = Math.abs(localAngle);
        let focus = 0;
        if (absAngle > ANGULAR_SPACING * 1.15) {
          focus = clamp(
            (absAngle - ANGULAR_SPACING * 1.15) / (ANGULAR_SPACING * 1.8),
            0,
            1,
          );
        }

        const scale = 1.25 - focus * 0.28;
        const rotZDeg = (-seedTilt[i] * (0.2 + focus * 0.3) * 180) / Math.PI;
        const blurPx = focus * 3.5;
        const grayPct = focus * 75;
        const zIndex = Math.round(
          (1.0 - absAngle / (ANGULAR_SPACING * 2.5)) * 100,
        );

        el.style.transform = `translate3d(${orbitX}px, ${orbitY}px, ${orbitZ}px) rotateZ(${rotZDeg}deg) scale(${scale})`;
        el.style.filter =
          focus > 0.01 ? `blur(${blurPx}px) grayscale(${grayPct}%)` : "none";
        el.style.zIndex = String(zIndex);
      }

      // Sync floating play-button overlay every frame to track moving cards
      syncOverlay();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("contextmenu", handleContextMenu);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [openCard]);

  return (
    <div className="absolute inset-0 w-full h-full bg-transparent flex flex-col items-center justify-center z-10">
      <div
        ref={containerRef}
        className="relative w-full h-full touch-none overflow-hidden"
        style={{ perspectiveOrigin: "50% 50%" }}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {imageUrls.map((src, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => openCard(i)}
              className="absolute will-change-transform cursor-pointer"
              style={{
                top: "50%",
                left: "50%",
                width: "var(--card-w, 320px)",
                height: "var(--card-h, 198px)",
                marginTop: "calc(var(--card-h, 198px) * -0.5)",
                marginLeft: "calc(var(--card-w, 320px) * -0.5)",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                transition: "filter 0.15s ease",
              }}
            >
              {/* Inner card container: smoothly scales down and darkens on hover */}
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 transition-all duration-300 ease-out">
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Floating Play Button Overlay: moves to hovered card and matches Slider.tsx */}
        <div
          ref={overlayDivRef}
          className="pointer-events-none absolute z-20 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            width: "0px",
            height: "0px",
            opacity: 0,
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.28s ease",
            willChange: "top, left, width, height, opacity",
          }}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-lg">
            <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-1" />
          </div>
        </div>
      </div>

      {/* Video Popup Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setIsPopupOpen(false)}
        >
          <style>{`
            @keyframes modal-enter {
              0% { opacity: 0; transform: scale(0.75); }
              60% { opacity: 1; transform: scale(1.03); }
              100% { opacity: 1; transform: scale(1); }
            }
            .modal-animate {
              animation: modal-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}</style>

          <div
            className="flex flex-col items-center gap-4 w-full max-w-5xl md:flex-row md:items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Arrow — side (md+ only) */}
            <button
              onClick={() => {
                setIsVideoLoading(true);
                setActiveCardIndex((prev) => (prev - 1 + COUNT) % COUNT);
              }}
              className="hidden md:flex shrink-0 w-12 h-12 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all border border-white/10 cursor-pointer shadow-2xl backdrop-blur-sm"
              title="Previous Video"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Modal */}
            <div className="modal-animate relative w-full flex-1 min-w-0 bg-neutral-900/90 border border-white/10 rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/90 transition-all border border-white/20 cursor-pointer shadow-lg"
              >
                ✕
              </button>

              <div className="aspect-video w-full bg-black relative">
                {isVideoLoading && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-[#0086F0] rounded-full animate-spin" />
                  </div>
                )}
                {(() => {
                  const videoUrl =
                    workVideos[activeCardIndex] ||
                    "https://www.youtube.com/watch?v=bSl7z00Hnug";
                  if (isCloudinaryVideoUrl(videoUrl)) {
                    return (
                      <CloudinaryVideoPlayer
                        key={activeCardIndex + ":" + videoUrl}
                        src={videoUrl}
                        poster={getCloudinaryVideoThumbnail(videoUrl)}
                        onReady={() => setIsVideoLoading(false)}
                      />
                    );
                  }
                  const ytId = extractYouTubeId(videoUrl);
                  if (ytId) {
                    return (
                      <YouTubePlayer
                        key={activeCardIndex + ":" + videoUrl}
                        videoId={ytId}
                        onReady={() => setIsVideoLoading(false)}
                      />
                    );
                  }
                  return (
                    <iframe
                      key={activeCardIndex}
                      src={getEmbedUrl(videoUrl)}
                      title={`Work Video ${activeCardIndex + 1}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      onLoad={() => setIsVideoLoading(false)}
                    />
                  );
                })()}
              </div>
            </div>

            {/* Right Arrow — side (md+ only) */}
            <button
              onClick={() => {
                setIsVideoLoading(true);
                setActiveCardIndex((prev) => (prev + 1) % COUNT);
              }}
              className="hidden md:flex shrink-0 w-12 h-12 items-center justify-center rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all border border-white/10 cursor-pointer shadow-2xl backdrop-blur-sm"
              title="Next Video"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Next / Previous buttons — bottom of video (sm only) */}
            <div className="flex items-center justify-between w-full gap-4 md:hidden">
              <button
                onClick={() => {
                  setIsVideoLoading(true);
                  setActiveCardIndex((prev) => (prev - 1 + COUNT) % COUNT);
                }}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all border border-white/10 text-sm font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => {
                  setIsVideoLoading(true);
                  setActiveCardIndex((prev) => (prev + 1) % COUNT);
                }}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all border border-white/10 text-sm font-semibold cursor-pointer"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CssSlider;