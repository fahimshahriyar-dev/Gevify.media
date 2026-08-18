// Ai_mobile.tsx

import { useEffect, useState } from "react";
import { Layers, Clapperboard, Zap, Brain, StickyNote, ChartNoAxesColumnIncreasing } from "lucide-react";

interface BoxIcon {
  id: string;
  Icon: typeof Layers;
  cx: number;
  cy: number;
  size: number;
}

// Box centers taken directly from the rects in the mobile SVG (same coordinate
// space as the <svg> below), so icons are placed as nested <svg> elements
// inline with the artwork instead of an HTML overlay — no scale/offset math,
// so they can never drift out of their boxes.
const BOXES: BoxIcon[] = [
  { id: "top-left", Icon: Layers, cx: 303, cy: 28, size: 25 },
  { id: "mid-left", Icon: Clapperboard, cx: 270, cy: 198, size: 23 },
  { id: "bottom-left", Icon: Zap, cx: 281, cy: 328, size: 25 },
  { id: "top-right", Icon: Brain, cx: 805.4, cy: 28, size: 25 },
  { id: "mid-right", Icon: StickyNote, cx: 837.8, cy: 198, size: 23 },
  { id: "bottom-right", Icon: ChartNoAxesColumnIncreasing, cx: 827.4, cy: 328, size: 25 },
];

// Light travel timing — the light animates over 8s and its head reaches the
// box at the very end of the travel, so we trigger the box glow at
// GLOW_DELAY_MS (just before the pulse fades) the instant the light arrives.
const GLOW_DELAY_MS = 7200;
const PULSE_LIFETIME_MS = 8300;

const AiMobile = () => {
  const [pulses, setPulses] = useState<{ id: number; pathIndex: number }[]>([]);
  const [glowingBoxes, setGlowingBoxes] = useState<{ [key: string]: boolean }>({
    "top-left": false,
    "mid-left": false,
    "bottom-left": false,
    "top-right": false,
    "mid-right": false,
    "bottom-right": false,
  });

  const pathToBoxMap: { [key: number]: string } = {
    0: "top-right",
    1: "top-left",
    2: "mid-left",
    3: "bottom-left",
    9: "mid-right",
    10: "bottom-right",
  };

  const outwardPaths = [
    "M609 98C664.516 98 703.01 98 729.196 98L747.527 28H769", // 0 -> top-right
    "M499 98C441.398 98 406.301 98 379.131 98L360.83 28H339", // 1 -> top-left
    "M498.5 114C429.571 114 430.872 114 398.358 114L371.046 198H304", // 2 -> mid-left
    "M499 130C433.298 130 441.968 130 410.976 130L351.986 328H316.5", // 3 -> bottom-left
    "M499 146C434.549 146 447.202 146 416.801 146L349.52 392H0", // 4 -> far-left edge
    "M530 177V445", // 5 vertical
    "M546 177V445", // 6 vertical
    "M562 177V445", // 7 vertical
    "M578 177V445", // 8 vertical
    "M609 114C677.929 114 676.628 114 709.142 114L736.454 198H803.5", // 9 -> mid-right
    "M609 130C675.163 130 669.858 130 701.067 130L762.861 328H791.5", // 10 -> bottom-right
    "M609 146C671.081 146 662.003 146 691.287 146L758.639 392H1086", // 11 -> far-right edge
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const pathIndex = Math.floor(Math.random() * outwardPaths.length);
      const id = Date.now() + Math.random();

      setPulses((prev) => [...prev, { id, pathIndex }]);

      const targetBox = pathToBoxMap[pathIndex];
      if (targetBox) {
        setTimeout(() => {
          setGlowingBoxes((prev) => ({ ...prev, [targetBox]: true }));
          setTimeout(() => {
            setGlowingBoxes((prev) => ({ ...prev, [targetBox]: false }));
          }, 600);
        }, GLOW_DELAY_MS); // fires right as the light reaches the box
      }

      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== id));
      }, PULSE_LIFETIME_MS);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative">
      <style>{`
        @keyframes pulse-flow {
          0% { stroke-dashoffset: 80; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: -1200; opacity: 0; }
        }
        .animate-pulse-flow {
          stroke-dasharray: 80 1200;
          animation: pulse-flow 8s linear forwards;
        }
      `}</style>
      <svg
        width="1086"
        height="465"
        viewBox="0 -20 1086 465"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        {/* Background Chipset Paths */}
        <path d="M609 98C664.516 98 703.01 98 729.196 98L747.527 28H769" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M379.131 98C406.301 98 441.398 98 499 98L379.131 98ZM379.131 98L360.83 28L339 28" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M410.976 130C441.968 130 433.298 130 499 130L410.976 130ZM410.976 130L351.986 328L316.5 328" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M416.801 146C447.202 146 434.549 146 499 146L416.801 146ZM416.801 146L349.52 392L-2.98023e-07 392" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M530 445C530 234.866 530 276.12 530 177V445Z" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M546 445C546 234.866 546 276.12 546 177V445Z" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M562 445C562 234.866 562 276.12 562 177V445Z" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M578 445C578 234.866 578 276.12 578 177V445Z" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M609 114C677.929 114 676.628 114 709.142 114L736.454 198H803.5" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M498.5 114C429.571 114 430.872 114 398.358 114L371.046 198H304" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M609 130C675.163 130 669.858 130 701.067 130L762.861 328H791.5" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />
        <path d="M609 146C671.081 146 662.003 146 691.287 146L758.639 392H1086" stroke="#232d42" strokeWidth="2" strokeOpacity="0.8" />

        {/* Terminals & Connector boxes */}
        <path d="M295.003 195.133H301.561C303.372 195.133 304.84 196.601 304.84 198.411V198.411C304.84 200.222 303.372 201.69 301.561 201.69H295.003V195.133Z" fill="#334155" />
        {glowingBoxes["mid-left"] && <rect x="245.5" y="173.5" width="49.0033" height="49.0033" rx="7.5" fill="none" stroke="#556999" strokeWidth="3" filter="url(#clean-glow-mobile)" />}
        <rect x="245.5" y="173.5" width="49.0033" height="49.0033" rx="7.5" fill="#111622" stroke={glowingBoxes["mid-left"] ? "#556999" : "#334155"} style={{ transition: "all 0.3s ease" }} />

        <path d="M309 325.2H314.6C316.146 325.2 317.4 326.454 317.4 328V328C317.4 329.546 316.146 330.8 314.6 330.8H309V325.2Z" fill="#334155" />
        {glowingBoxes["bottom-left"] && <rect x="253.5" y="300.5" width="55" height="55" rx="7.5" fill="none" stroke="#556999" strokeWidth="3" filter="url(#clean-glow-mobile)" />}
        <rect x="253.5" y="300.5" width="55" height="55" rx="7.5" fill="#111622" stroke={glowingBoxes["bottom-left"] ? "#556999" : "#334155"} style={{ transition: "all 0.3s ease" }} />

        <path d="M331 25.2H336.6C338.146 25.2 339.4 26.4536 339.4 28V28C339.4 29.5463 338.146 30.8 336.6 30.8H331V25.2Z" fill="#334155" />
        {glowingBoxes["top-left"] && <rect x="275.5" y="0.5" width="55" height="55" rx="7.5" fill="none" stroke="#556999" strokeWidth="3" filter="url(#clean-glow-mobile)" />}
        <rect x="275.5" y="0.5" width="55" height="55" rx="7.5" fill="#111622" stroke={glowingBoxes["top-left"] ? "#556999" : "#334155"} style={{ transition: "all 0.3s ease" }} />

        <path d="M799.4 330.8H793.8C792.254 330.8 791 329.546 791 328V328C791 326.454 792.254 325.2 793.8 325.2H799.4V330.8Z" fill="#334155" />
        {glowingBoxes["bottom-right"] && <rect x="799.9" y="300.5" width="55" height="55" rx="7.5" fill="none" stroke="#556999" strokeWidth="3" filter="url(#clean-glow-mobile)" />}
        <rect x="799.9" y="300.5" width="55" height="55" rx="7.5" fill="#111622" stroke={glowingBoxes["bottom-right"] ? "#556999" : "#334155"} style={{ transition: "all 0.3s ease" }} />

        <path d="M777.4 30.8H771.8C770.254 30.8 769 29.5464 769 28V28C769 26.4537 770.254 25.2 771.8 25.2H777.4V30.8Z" fill="#334155" />
        {glowingBoxes["top-right"] && <rect x="777.9" y="0.5" width="55" height="55" rx="7.5" fill="none" stroke="#556999" strokeWidth="3" filter="url(#clean-glow-mobile)" />}
        <rect x="777.9" y="0.5" width="55" height="55" rx="7.5" fill="#111622" stroke={glowingBoxes["top-right"] ? "#556999" : "#334155"} style={{ transition: "all 0.3s ease" }} />

        <path d="M812.836 201.688H806.279C804.468 201.688 803 200.221 803 198.41V198.41C803 196.599 804.468 195.131 806.279 195.131H812.836V201.688Z" fill="#334155" />
        {glowingBoxes["mid-right"] && <rect x="813.336" y="173.5" width="49" height="49" rx="7.5" fill="none" stroke="#556999" strokeWidth="3" filter="url(#clean-glow-mobile)" />}
        <rect x="813.336" y="173.5" width="49" height="49" rx="7.5" fill="#111622" stroke={glowingBoxes["mid-right"] ? "#556999" : "#334155"} style={{ transition: "all 0.3s ease" }} />

        {/* AI center box connector nubs */}
        <path d="M608 142H616C618.209 142 620 143.791 620 146V146C620 148.209 618.209 150 616 150H608V142Z" fill="#334155" />
        <path d="M608 110H616C618.209 110 620 111.791 620 114V114C620 116.209 618.209 118 616 118H608V110Z" fill="#334155" />
        <path d="M608 94H616C618.209 94 620 95.7909 620 98V98C620 100.209 618.209 102 616 102H608V94Z" fill="#334155" />
        <path d="M500 102H492C489.791 102 488 100.209 488 98V98C488 95.7909 489.791 94 492 94H500V102Z" fill="#334155" />
        <path d="M500 118H492C489.791 118 488 116.209 488 114V114C488 111.791 489.791 110 492 110H500V118Z" fill="#334155" />
        <path d="M500 134H492C489.791 134 488 132.209 488 130V130C488 127.791 489.791 126 492 126H500V134Z" fill="#334155" />
        <path d="M500 150H492C489.791 150 488 148.209 488 146V146C488 143.791 489.791 142 492 142H500V150Z" fill="#334155" />
        <path d="M534 176V184C534 186.209 532.209 188 530 188V188C527.791 188 526 186.209 526 184V176H534Z" fill="#334155" />
        <path d="M550 176V184C550 186.209 548.209 188 546 188V188C543.791 188 542 186.209 542 184V176H550Z" fill="#334155" />
        <path d="M566 176V184C566 186.209 564.209 188 562 188V188C559.791 188 558 186.209 558 184V176H566Z" fill="#334155" />
        <rect x="500.5" y="68.5" width="107" height="107" rx="20.5" fill="#111622" stroke="#334155" />
        <text x={500.5 + 107 / 2} y={68.5 + 107 / 2} dominantBaseline="central" textAnchor="middle" fill="url(#silver-gradient-mobile)" fontSize="26" fontWeight="bold" style={{ fontFamily: "sans-serif" }}>AI</text>
        <path d="M582 176V184C582 186.209 580.209 188 578 188V188C575.791 188 574 186.209 574 184V176H582Z" fill="#334155" />
        <path d="M608 126H616C618.209 126 620 127.791 620 130V130C620 132.209 618.209 134 616 134H608V126Z" fill="#334155" />

        {pulses.map((pulse) => (
          <path key={pulse.id} d={outwardPaths[pulse.pathIndex]} stroke="#556999" strokeWidth="4.5" fill="none" filter="url(#clean-glow-mobile)" className="animate-pulse-flow" />
        ))}

        {/* Icons — nested <svg> placed directly in the artwork's own
            coordinate space (viewBox units), anchored to each box's center.
            This keeps them pixel-locked to their boxes at every screen size,
            since there's no separate scale/offset conversion to drift. */}
        {BOXES.map(({ id, Icon, cx, cy, size }) => {
          const isGlowing = glowingBoxes[id];
          return (
            <g
              key={id}
              transform={`translate(${cx - size / 2}, ${cy - size / 2})`}
              className={`transition-all duration-300 ${isGlowing ? "icon-glow" : ""}`}
            >
              <Icon size={size} stroke={isGlowing ? "#556999" : "#E2E8F0"} strokeWidth={1.5} />
            </g>
          );
        })}

        <defs>
          <linearGradient id="silver-gradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E2E8F0" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <filter id="clean-glow-mobile" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur stdDeviation="5" result="blur1" />
            <feGaussianBlur stdDeviation="10" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default AiMobile;