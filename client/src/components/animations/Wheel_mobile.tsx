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

const CENTER = { x: 633, y: 227 };
const OUTER_RADIUS = 196; // must match the outer <circle r="196">
const BOX_COUNT = 8;
const BOX_WIDTH = 58;
const BOX_HEIGHT = 59;
const STEP = 360 / BOX_COUNT; // 45deg between boxes

const RING_CENTER = { x: 632.5, y: 226.5 };
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

// Shorter mobile connector paths (animated flow paths)
const PATH1_D =
  "M2.00895 443.386H99.0275C132.521 443.386 159.673 399.911 159.673 346.283V326.982C159.673 274.02 186.487 231.085 219.564 231.085H389.61";
const PATH2_D =
  "M878.621 224.665H914.839C934.404 224.665 950.264 249 950.264 279.169C950.264 309.271 966.583 333.673 986.715 333.673H1037.26";

// Static (white) connector shapes including arrowheads
const STATIC_PATH1_D =
  "M0 442.783C0 444.56 0.899435 446 2.00895 446C3.11846 446 4.01789 444.56 4.01789 442.783C4.01789 441.006 3.11846 439.566 2.00895 439.566C0.899435 439.566 0 441.006 0 442.783ZM389.233 231.085L393 233.964V227L389.233 229.879V231.085ZM2.00895 443.386H99.0275V442.18H2.00895V443.386ZM159.673 346.283V326.982H158.919V346.283H159.673ZM219.564 231.085H389.61V229.879H219.564V231.085ZM159.673 326.982C159.673 274.02 186.487 231.085 219.564 231.085V229.879C186.071 229.879 158.919 273.354 158.919 326.982H159.673ZM99.0275 443.386C132.521 443.386 159.673 399.911 159.673 346.283H158.919C158.919 399.246 132.104 442.18 99.0275 442.18V443.386Z";
const STATIC_PATH2_D =
  "M1040 332.906C1040 335.167 1038.77 337 1037.26 337C1035.75 337 1034.52 335.167 1034.52 332.906C1034.52 330.645 1035.75 328.812 1037.26 328.812C1038.77 328.812 1040 330.645 1040 332.906ZM879.134 226.2L874 229.864V221L879.134 224.665V226.2ZM1037.26 333.673H986.715V332.138H1037.26V333.673ZM914.839 226.2H878.621V224.665H914.839V226.2ZM950.264 279.169C950.264 249.915 934.404 226.2 914.839 226.2V224.665C934.971 224.665 951.29 249.067 951.29 279.169H950.264ZM986.715 333.673C966.583 333.673 950.264 309.271 950.264 279.169H951.29C951.29 308.423 967.151 332.138 986.715 332.138V333.673Z";

interface WheelProps {
  boxesData: { title: string; subtitle: string }[];
}

const WheelMobile: React.FC<WheelProps> = ({ boxesData }) => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const responsiveScale = useMemo(() => {
    if (windowWidth < 640) return 2.2;
    if (windowWidth < 768) return 1.9;
    return 1.6;
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
        const titleEl = document.getElementById("wm-wheel-popup-title");
        const sub1El = document.getElementById("wm-wheel-popup-sub1");
        const sub2El = document.getElementById("wm-wheel-popup-sub2");
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

  return (
    <div className="w-full flex items-center justify-center relative">
      <svg
        viewBox="0 0 1040 453"
        className="w-full h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="wm-orange-glow"
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
            id="wm-popup-shadow"
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
            id="wm-centerRingGradient"
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

          <linearGradient id="wm-glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5ACFFE" />
            <stop offset="100%" stopColor="#0086F0" />
          </linearGradient>

          <filter
            id="wm-ring-glow"
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
        <circle cx="633" cy="227" r="138" stroke="#FFFFFF" strokeWidth="2" />

        <circle
          cx={RING_CENTER.x}
          cy={RING_CENTER.y}
          r={RING_RADIUS}
          fill="none"
          stroke="url(#wm-centerRingGradient)"
          strokeWidth="10"
          filter="url(#wm-ring-glow)"
        />

        <circle cx="632.5" cy="226.5" r="50.5" fill="transparent" />

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

        <path d={STATIC_PATH1_D} fill="#FFFFFF" />

        <path d={STATIC_PATH2_D} fill="#FFFFFF" />

        <path
          ref={path1Ref}
          d={PATH1_D}
          fill="none"
          stroke="#0086F0"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#wm-orange-glow)"
        />

        <path
          ref={path2Ref}
          d={PATH2_D}
          fill="none"
          stroke="#0086F0"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#wm-orange-glow)"
        />

        <g ref={wheelGroupRef}>
          {boxes.map((pos, i) => {
            const { icon: Icon } = BOX_DATA[i];
            const iconSize = 26;

            return (
              <g
                key={i}
                ref={(el) => {
                  boxCounterRefs.current[i] = el;
                }}
                className="cursor-default"
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
                  filter="url(#wm-orange-glow)"
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
              </g>
            );
          })}
        </g>

        {/* Single Static Popup — shown above the active box during auto-rotation */}
        <g
          transform={`translate(633, -6.5) scale(${responsiveScale}) translate(-633, 6.5)`}
        >
          <g
            ref={singlePopupRef}
            opacity="0"
            style={{ transformOrigin: "50% 100%" }}
          >
            <rect
              x="518"
              y="-88.5"
              width={POPUP_WIDTH}
              height={POPUP_HEIGHT}
              rx="10"
              fill="#FFFFFF"
              stroke="#E5E7EB"
              strokeWidth="1"
              filter="url(#wm-popup-shadow)"
            />
            <polygon
              points="626,-14.5 640,-14.5 633,-6.5"
              fill="#FFFFFF"
              stroke="#E5E7EB"
              strokeWidth="1"
            />
            <text
              id="wm-wheel-popup-title"
              x="633"
              y="-63.5"
              textAnchor="middle"
              fontSize="17.5"
              fontWeight="700"
              fill="#111827"
            >
              Creative Strategy
            </text>
            <text
              id="wm-wheel-popup-sub1"
              x="633"
              y="-43.5"
              textAnchor="middle"
              fontSize="13.5"
              fill="#6B7280"
            >
              We research, analyze &amp; craft
            </text>
            <text
              id="wm-wheel-popup-sub2"
              x="633"
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

export default WheelMobile;
