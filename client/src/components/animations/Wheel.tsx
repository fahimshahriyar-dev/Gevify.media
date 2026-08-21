import React, { useEffect, useRef, useMemo, useState } from "react";
import { gsap } from "gsap";
import {
  Lightbulb,
  BookText,
  Video,
  Layers,
  Scissors,
  AudioLines,
  Blend,
  Send,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

const CENTER = { x: 1006, y: 227 };
const OUTER_RADIUS = 196; // must match the outer <circle r="196">
const BOX_COUNT = 8;
const BOX_WIDTH = 58;
const BOX_HEIGHT = 59;
const STEP = 360 / BOX_COUNT; // 45deg between boxes

const RING_CENTER = { x: 1005.5, y: 226.5 };
const RING_RADIUS = 54;
const CENTER_ICON_SIZE = 52;

const POPUP_WIDTH = 230;
const POPUP_HEIGHT = 74;

const POPUP_OPEN_DURATION = 0.3;
const PATH2_START_PAUSE = 0.15;

const STOP_PALETTES: string[][] = [
  ["#5ACFFE", "#82E0FF", "#0086F0", "#33B3FF"],
  ["#0086F0", "#0070CE", "#5ACFFE", "#00A3FF"],
  ["#004F99", "#003A70", "#002447", "#001D38"],
  ["#0070CE", "#005599", "#003A70", "#002447"],
];

const BOX_ICONS: LucideIcon[] = [
  Lightbulb,
  BookText,
  Video,
  Layers,
  Scissors,
  AudioLines,
  Blend,
  Send,
];

interface WheelProps {
  boxesData: { title: string; subtitle: string }[];
}

const Wheel: React.FC<WheelProps> = ({ boxesData }) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsiveScale = useMemo(() => {
    if (windowWidth < 640) return 2.6;
    if (windowWidth < 768) return 2.2;
    if (windowWidth < 1024) return 1.8;
    return 1.0;
  }, [windowWidth]);

  const BOX_DATA = useMemo(
    () =>
      boxesData.map((b, i) => ({
        icon: BOX_ICONS[i] || Lightbulb,
        title: b.title,
        subtitleLines: b.subtitle.split("\n") as [string, string],
      })),
    [boxesData],
  );

  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const wheelGroupRef = useRef<SVGGElement>(null);
  const boxCounterRefs = useRef<(SVGGElement | null)[]>([]);
  const boxRectRefs = useRef<(SVGRectElement | null)[]>([]);
  const boxGlowRefs = useRef<(SVGRectElement | null)[]>([]);
  const boxIconRefs = useRef<(SVGSVGElement | null)[]>([]);
  const boxPopupRefs = useRef<(SVGGElement | null)[]>([]);
  const gradientStopRefs = useRef<(SVGStopElement | null)[]>([]);
  const litIndexRef = useRef<number | null>(null);
  const singlePopupRef = useRef<SVGGElement>(null);

  const boxes = useMemo(() => {
    return Array.from({ length: BOX_COUNT }, (_, i) => {
      const angleDeg = -90 + i * STEP;
      const angleRad = (angleDeg * Math.PI) / 180;
      const cx = CENTER.x + OUTER_RADIUS * Math.cos(angleRad);
      const cy = CENTER.y + OUTER_RADIUS * Math.sin(angleRad);
      return {
        cx,
        cy,
        x: cx - BOX_WIDTH / 2,
        y: cy - BOX_HEIGHT / 2,
      };
    });
  }, []);

  useEffect(() => {
    const path1 = path1Ref.current;
    const path2 = path2Ref.current;
    const wheel = wheelGroupRef.current;
    if (!path1 || !path2 || !wheel) return;

    const len1 = path1.getTotalLength();
    const pulseLen1 = Math.min(180, len1 * 0.25);

    const len2 = path2.getTotalLength();
    const pulseLen2 = Math.min(180, len2 * 0.25);

    const ctx = gsap.context(() => {
      gsap.set(wheel, { svgOrigin: `${CENTER.x} ${CENTER.y}` });

      boxCounterRefs.current.forEach((box, i) => {
        if (!box) return;
        gsap.set(box, { svgOrigin: `${boxes[i].cx} ${boxes[i].cy}` });
      });

      gsap.set(boxPopupRefs.current, { opacity: 0, scale: 0.85 });

      gsap.set(singlePopupRef.current, {
        opacity: 0,
        scale: 0.85,
        transformOrigin: "50% 100%",
      });

      gradientStopRefs.current.forEach((stop, i) => {
        if (!stop) return;
        const palette =
          STOP_PALETTES[i] ?? STOP_PALETTES[STOP_PALETTES.length - 1];

        const driftToNextColor = () => {
          const nextColor = gsap.utils.random(palette);
          gsap.to(stop, {
            attr: { "stop-color": nextColor },
            duration: gsap.utils.random(2, 4),
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 1.5),
            onComplete: driftToNextColor,
          });
        };

        driftToNextColor();
      });

      const closeCurrentPopup = () => {
        const idx = litIndexRef.current;
        if (idx === null) return;
        const rect = boxRectRefs.current[idx];
        const glow = boxGlowRefs.current[idx];
        const icon = boxIconRefs.current[idx];
        if (!rect || !glow) return;

        gsap.to(rect, {
          attr: { stroke: "#D9D9D9" },
          duration: 0.5,
          ease: "power2.inOut",
        });
        gsap.to(glow, { opacity: 0, duration: 0.5, ease: "power2.inOut" });
        gsap.to(icon, {
          attr: { stroke: "#9CA3AF" },
          duration: 0.5,
          ease: "power2.inOut",
        });
        gsap.to(singlePopupRef.current, {
          opacity: 0,
          scale: 0.85,
          duration: 0.5,
          ease: "power2.inOut",
        });

        litIndexRef.current = null;
      };

      const openPopupAtTop = () => {
        const currentRotation = gsap.getProperty(wheel, "rotation") as number;
        const steps = Math.round(currentRotation / STEP);
        const idx = (((0 - steps) % BOX_COUNT) + BOX_COUNT) % BOX_COUNT;
        const rect = boxRectRefs.current[idx];
        const glow = boxGlowRefs.current[idx];
        const icon = boxIconRefs.current[idx];
        if (!rect || !glow) return;

        litIndexRef.current = idx;

        gsap.to(rect, {
          attr: { stroke: "#0086F0" },
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.to(glow, { opacity: 1, duration: 0.35, ease: "power2.out" });
        gsap.to(icon, {
          attr: { stroke: "#0086F0" },
          duration: 0.35,
          ease: "power2.out",
        });

        // Update single top popup text
        const titleEl = document.getElementById("wheel-popup-title");
        const sub1El = document.getElementById("wheel-popup-sub1");
        const sub2El = document.getElementById("wheel-popup-sub2");
        if (titleEl && sub1El && sub2El) {
          titleEl.textContent = BOX_DATA[idx].title;
          sub1El.textContent = BOX_DATA[idx].subtitleLines[0] || "";
          sub2El.textContent = BOX_DATA[idx].subtitleLines[1] || "";
        }

        gsap.to(singlePopupRef.current, {
          opacity: 1,
          scale: 1,
          duration: POPUP_OPEN_DURATION,
          ease: "back.out(1.6)",
        });
      };

      const tl = gsap.timeline({ repeat: -1, repeatRefresh: true });

      openPopupAtTop();

      tl.set(path1, {
        strokeDasharray: `${pulseLen1} ${len1}`,
        strokeDashoffset: pulseLen1,
        opacity: 1,
      })
        .set(path2, {
          strokeDasharray: `${pulseLen2} ${len2}`,
          strokeDashoffset: pulseLen2,
          opacity: 1,
        })
        .to(path1, {
          strokeDashoffset: -len1,
          duration: 1.4,
          ease: "power1.inOut",
        })
        .addLabel("rotateStep")
        .call(closeCurrentPopup, [], "rotateStep-=0.3")
        .to(
          wheel,
          {
            rotation: `+=${STEP}`,
            duration: 0.55,
            ease: "power2.inOut",
          },
          "rotateStep",
        )
        .to(
          boxCounterRefs.current,
          {
            rotation: `-=${STEP}`,
            duration: 0.55,
            ease: "power2.inOut",
          },
          "rotateStep",
        )
        .call(openPopupAtTop, [], "rotateStep+=0.55")
        .to(
          path2,
          {
            strokeDashoffset: -len2,
            duration: 1.4,
            ease: "power1.inOut",
          },
          `rotateStep+=${0.55 + POPUP_OPEN_DURATION + PATH2_START_PAUSE}`,
        );
    });

    return () => ctx.revert();
  }, [boxes]);

  /*
  const handleBoxMouseEnter = (i: number) => {
    // Glow the hovered box
    const rect = boxRectRefs.current[i];
    const glow = boxGlowRefs.current[i];
    const icon = boxIconRefs.current[i];
    if (rect && glow && icon) {
      gsap.to(rect, {
        attr: { stroke: "#0086F0" },
        duration: 0.3,
        overwrite: "auto",
      });
      gsap.to(glow, { opacity: 1, duration: 0.3, overwrite: "auto" });
      gsap.to(icon, {
        attr: { stroke: "#0086F0" },
        duration: 0.3,
        overwrite: "auto",
      });
    }

    // Show popup instantly — no animation
    const popup = boxPopupRefs.current[i];
    if (popup) {
      gsap.killTweensOf(popup);
      gsap.set(popup, { opacity: 1, scale: 1 });
    }
  };
  */

  /*
  const handleBoxMouseLeave = (i: number) => {
    if (i === 0) return;

    // Restore hovered box to neutral if it's not the active top one
    if (i !== litIndexRef.current) {
      const rect = boxRectRefs.current[i];
      const glow = boxGlowRefs.current[i];
      const icon = boxIconRefs.current[i];
      if (rect && glow && icon) {
        gsap.to(rect, {
          attr: { stroke: "#D9D9D9" },
          duration: 0.3,
          overwrite: "auto",
        });
        gsap.to(glow, { opacity: 0, duration: 0.3, overwrite: "auto" });
        gsap.to(icon, {
          attr: { stroke: "#9CA3AF" },
          duration: 0.3,
          overwrite: "auto",
        });
      }

      // Kill any in-progress tween and hide popup instantly
      const popup = boxPopupRefs.current[i];
      if (popup) {
        gsap.killTweensOf(popup);
        gsap.set(popup, { opacity: 0, scale: 0.85 });
      }
    }
  };
  */

  return (
    // Takes full width on mobile/tablet; locks to 70% (minus half the
    // parent's gap-12) on lg+ so it matches the 30% text column exactly.
    <div className="w-full lg:w-[calc(70%-1.5rem)] flex items-center justify-center relative">
      <svg
        viewBox="0 0 1495 494"
        className="w-full h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="orange-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodColor="#0086F0" floodOpacity="1" result="glowColor" />
            <feComposite
              in="glowColor"
              in2="SourceAlpha"
              operator="in"
              result="coloredAlpha"
            />
            <feGaussianBlur in="coloredAlpha" stdDeviation="5" result="blur1" />
            <feGaussianBlur
              in="coloredAlpha"
              stdDeviation="11"
              result="blur2"
            />
            <feGaussianBlur
              in="coloredAlpha"
              stdDeviation="20"
              result="blur3"
            />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="popup-shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="userSpaceOnUse"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="#000000"
              floodOpacity="0.18"
            />
          </filter>

          <linearGradient
            id="centerRingGradient"
            gradientUnits="userSpaceOnUse"
            x1={RING_CENTER.x - RING_RADIUS}
            y1={RING_CENTER.y - RING_RADIUS}
            x2={RING_CENTER.x + RING_RADIUS}
            y2={RING_CENTER.y + RING_RADIUS}
          >
            <stop
              ref={(el) => {
                gradientStopRefs.current[0] = el;
              }}
              offset="0%"
              stopColor="#5ACFFE"
            />
            <stop
              ref={(el) => {
                gradientStopRefs.current[1] = el;
              }}
              offset="45%"
              stopColor="#0086F0"
            />
            <stop
              ref={(el) => {
                gradientStopRefs.current[2] = el;
              }}
              offset="80%"
              stopColor="#004F99"
            />
            <stop
              ref={(el) => {
                gradientStopRefs.current[3] = el;
              }}
              offset="100%"
              stopColor="#D9D9D9"
            />
          </linearGradient>

          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5ACFFE" />
            <stop offset="100%" stopColor="#0086F0" />
          </linearGradient>

          <filter
            id="ring-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="userSpaceOnUse"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r={OUTER_RADIUS}
          stroke="#FFFFFF"
          strokeWidth="2"
        />
        <circle cx="1006" cy="227" r="138" stroke="#FFFFFF" strokeWidth="2" />

        <circle
          cx={RING_CENTER.x}
          cy={RING_CENTER.y}
          r={RING_RADIUS}
          fill="none"
          stroke="url(#centerRingGradient)"
          strokeWidth="10"
          filter="url(#ring-glow)"
        />

        <circle cx="1005.5" cy="226.5" r="50.5" fill="transparent" />

        <g
          transform={`translate(${RING_CENTER.x - CENTER_ICON_SIZE / 2}, ${
            RING_CENTER.y - CENTER_ICON_SIZE / 2
          })`}
        >
          <BrainCircuit
            size={CENTER_ICON_SIZE}
            color="#0086F0"
            strokeWidth={1.5}
          />
        </g>

        <path
          d="M0 489.433C0 491.594 1.75198 493.345 3.91315 493.345C6.07433 493.345 7.82631 491.594 7.82631 489.433C7.82631 487.272 6.07433 485.52 3.91315 485.52C1.75198 485.52 0 487.272 0 489.433ZM758.174 231.968L765.511 235.47V227L758.174 230.501V231.968ZM3.91315 490.166H192.892V488.699H3.91315V490.166ZM311.02 372.07V348.598H309.553V372.07H311.02ZM427.681 231.968H758.907V230.501H427.681V231.968ZM311.02 348.598C311.02 284.185 363.251 231.968 427.681 231.968V230.501C362.441 230.501 309.553 283.375 309.553 348.598H311.02ZM192.892 490.166C258.133 490.166 311.02 437.293 311.02 372.07H309.553C309.553 436.483 257.321 488.699 192.892 488.699V490.166Z"
          fill="#FFFFFF"
        />

        <path
          d="M1495 332.906C1495 335.167 1493.17 337 1490.91 337C1488.65 337 1486.82 335.167 1486.82 332.906C1486.82 330.645 1488.65 328.812 1490.91 328.812C1493.17 328.812 1495 330.645 1495 332.906ZM1254.67 226.2L1247 229.864V221L1254.67 224.665V226.2ZM1490.91 333.673H1415.39V332.138H1490.91V333.673ZM1308.01 226.2H1253.9V224.665H1308.01V226.2ZM1360.94 279.169C1360.94 249.915 1337.24 226.2 1308.01 226.2V224.665C1338.09 224.665 1362.47 249.067 1362.47 279.169H1360.94ZM1415.39 333.673C1385.32 333.673 1360.94 309.271 1360.94 279.169H1362.47C1362.47 308.423 1386.16 332.138 1415.39 332.138V333.673Z"
          fill="#FFFFFF"
        />

        <path
          ref={path1Ref}
          d="M3.91315 489.433H192.892C258.133 489.433 311.02 436.483 311.02 372.07V348.598C311.02 284.185 363.251 231.968 427.681 231.968H758.907"
          fill="none"
          stroke="#0086F0"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#orange-glow)"
        />

        <path
          ref={path2Ref}
          d="M1253.9 225.433H1308.01C1337.24 225.433 1360.94 249.169 1360.94 279.169C1360.94 309.271 1385.32 333.673 1415.39 333.673H1490.91"
          fill="none"
          stroke="#0086F0"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#orange-glow)"
        />

        <g ref={wheelGroupRef}>
          {boxes.map((pos, i) => {
            const { icon: Icon } = BOX_DATA[i];
            const iconSize = 26;

            // Directional popup positioning
            /*
            const sideGap = 14;
            const cardW = POPUP_WIDTH;
            const cardH = 40;

            // Right side: indices 0–3 | Bottom: index 4 | Left: indices 5–7
            const direction: "right" | "left" | "bottom" =
              i === 4 ? "bottom" : i >= 5 ? "left" : "right";

            let sidePopupX: number;
            let sidePopupY: number;
            let scaleOriginX: number;
            let scaleOriginY: number;

            if (direction === "right") {
              sidePopupX = pos.x + BOX_WIDTH + sideGap;
              sidePopupY = pos.cy - cardH / 2;
              scaleOriginX = sidePopupX; // left edge of card
              scaleOriginY = pos.cy;
            } else if (direction === "left") {
              sidePopupX = pos.x - sideGap - cardW;
              sidePopupY = pos.cy - cardH / 2;
              scaleOriginX = sidePopupX + cardW; // right edge of card
              scaleOriginY = pos.cy;
            } else {
              // bottom
              sidePopupX = pos.cx - cardW / 2;
              sidePopupY = pos.y + BOX_HEIGHT + sideGap;
              scaleOriginX = pos.cx;
              scaleOriginY = sidePopupY; // top edge of card
            }
            */

            return (
              <g
                key={i}
                ref={(el) => {
                  boxCounterRefs.current[i] = el;
                }}
                className="cursor-default"
                /*
                onMouseEnter={() => handleBoxMouseEnter(i)}
                onMouseLeave={() => handleBoxMouseLeave(i)}
                */
              >
                <rect
                  ref={(el) => {
                    boxGlowRefs.current[i] = el;
                  }}
                  x={pos.x}
                  y={pos.y}
                  width={BOX_WIDTH}
                  height={BOX_HEIGHT}
                  rx="9"
                  fill="none"
                  stroke="#0086F0"
                  strokeWidth="3"
                  filter="url(#orange-glow)"
                  opacity="0"
                />
                <rect
                  ref={(el) => {
                    boxRectRefs.current[i] = el;
                  }}
                  x={pos.x}
                  y={pos.y}
                  width={BOX_WIDTH}
                  height={BOX_HEIGHT}
                  rx="9"
                  fill="#F3F4F6"
                  stroke="#D9D9D9"
                  strokeWidth="1.5"
                />

                <g
                  transform={`translate(${pos.cx - iconSize / 2}, ${
                    pos.cy - iconSize / 2
                  })`}
                >
                  <Icon
                    ref={(el: SVGSVGElement | null) => {
                      boxIconRefs.current[i] = el;
                    }}
                    size={iconSize}
                    color="#9CA3AF"
                    strokeWidth={1.75}
                  />
                </g>

                {/* Directional popup — title only, no arrow */}
                {/*
                <g
                  transform={`translate(${scaleOriginX}, ${scaleOriginY}) scale(${responsiveScale}) translate(${-scaleOriginX}, ${-scaleOriginY})`}
                >
                  <g
                    ref={(el) => {
                      boxPopupRefs.current[i] = el;
                    }}
                    opacity="0"
                    style={{
                      transformOrigin: `${scaleOriginX}px ${scaleOriginY}px`,
                    }}
                  >
                    <rect
                      x={sidePopupX}
                      y={sidePopupY}
                      width={cardW}
                      height={cardH}
                      rx="8"
                      fill="#FFFFFF"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                      filter="url(#popup-shadow)"
                    />
                    <text
                      x={sidePopupX + cardW / 2}
                      y={sidePopupY + cardH / 2 + 6}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="700"
                      fill="#111827"
                    >
                      {title}
                    </text>
                  </g>
                </g>
                */}
              </g>
            );
          })}
        </g>

        {/* Single Static Popup — shown above the active box during auto-rotation */}
        <g
          transform={`translate(1006, -6.5) scale(${responsiveScale}) translate(-1006, 6.5)`}
        >
          <g
            ref={singlePopupRef}
            opacity="0"
            style={{ transformOrigin: "50% 100%" }}
          >
            <rect
              x="891"
              y="-88.5"
              width={POPUP_WIDTH}
              height={POPUP_HEIGHT}
              rx="10"
              fill="#FFFFFF"
              stroke="#E5E7EB"
              strokeWidth="1"
              filter="url(#popup-shadow)"
            />
            <polygon
              points="999,-14.5 1013,-14.5 1006,-6.5"
              fill="#FFFFFF"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <text
              id="wheel-popup-title"
              x="1006"
              y="-63.5"
              textAnchor="middle"
              fontSize="17.5"
              fontWeight="700"
              fill="#111827"
            >
              Creative Strategy
            </text>
            <text
              id="wheel-popup-sub1"
              x="1006"
              y="-43.5"
              textAnchor="middle"
              fontSize="13.5"
              fill="#6B7280"
            >
              We research, analyze &amp; craft
            </text>
            <text
              id="wheel-popup-sub2"
              x="1006"
              y="-28.5"
              textAnchor="middle"
              fontSize="13.5"
              fill="#6B7280"
            >
              the perfect creative direction
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Wheel;