// Ai.tsx

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Layers,
  Clapperboard,
  Zap,
  Brain,
  StickyNote,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";

interface BoxIcon {
  id: string;
  Icon: typeof Layers;
  svgX: number;
  svgY: number;
  size: number;
}

const BOXES: BoxIcon[] = [
  { id: "top-left", Icon: Layers, svgX: 253, svgY: 40, size: 36 },
  { id: "mid-left", Icon: Clapperboard, svgX: 142.5, svgY: 209.5, size: 28 },
  { id: "bottom-left", Icon: Zap, svgX: 253, svgY: 340, size: 36 },
  { id: "top-right", Icon: Brain, svgX: 1667, svgY: 40, size: 36 },
  { id: "mid-right", Icon: StickyNote, svgX: 1777.5, svgY: 209.5, size: 28 },
  {
    id: "bottom-right",
    Icon: ChartNoAxesColumnIncreasing,
    svgX: 1667,
    svgY: 340,
    size: 36,
  },
];

const SVG_VIEWBOX = { width: 1919, height: 497 };

const Ai = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
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
    "M1015 110C1227.35 110 1374.59 110 1474.75 110L1544.87 40H1627",
    "M905 110C684.673 110 550.428 110 446.5 110L376.5 40H293",
    "M905 126C684.673 126 700.928 126 597 126L513 210H173",
    "M905 142C684.673 142 713.746 142 609.818 142L412 340H293",
    "M905 158C684.673 158 727.928 158 624 158L394 432H0",
    "M936 189V457",
    "M952 189V457",
    "M968 189V457",
    "M984 189V457",
    "M1015 126C1227 126 1223 126 1323 126L1407 210H1747",
    "M1015 142C1227 142 1210 142 1310 142L1508 340H1627",
    "M1015 158C1227 158 1196 158 1296 158L1526 432H1919",
  ];

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      const svgEl = containerRef.current.querySelector("svg");
      if (svgEl) {
        const rect = svgEl.getBoundingClientRect();
        const s = rect.width / SVG_VIEWBOX.width;
        setScale(s);
        setOffsetTop(
          rect.top - containerRef.current.getBoundingClientRect().top,
        );
        setOffsetLeft(
          rect.left - containerRef.current.getBoundingClientRect().left,
        );
      }
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

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
        }, 1300);
      }

      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== id));
      }, 2000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative" ref={containerRef}>
      <style>{`
        @keyframes pulse-flow {
          0% { stroke-dashoffset: 80; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: -1200; opacity: 0; }
        }
        .animate-pulse-flow {
          stroke-dasharray: 80 1200;
          animation: pulse-flow 2s linear forwards;
        }
      `}</style>
      <svg
        width="1919"
        height="477"
        viewBox="0 -20 1919 477"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ overflow: "visible" }}
      >
        {/* Background Chipset Paths */}
        <path
          d="M1015 110C1227.35 110 1374.59 110 1474.75 110L1544.87 40H1627"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M446.5 110C550.428 110 684.673 110 905 110L446.5 110ZM446.5 110L376.5 40L293 40"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M597 126C700.928 126 684.673 126 905 126L597 126ZM597 126L513 210L173 210"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M609.818 142C713.746 142 684.673 142 905 142L609.818 142ZM609.818 142L412 340L293 340"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M624 158C727.928 158 684.673 158 905 158L624 158ZM624 158L394 432L0 432"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M936 457C936 246.866 936 288.12 936 189V457Z"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M952 457C952 246.866 952 288.12 952 189V457Z"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M968 457C968 246.866 968 288.12 968 189V457Z"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M984 457C984 246.866 984 288.12 984 189V457Z"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M1015 126C1227 126 1223 126 1323 126L1407 210H1747"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M1015 142C1227 142 1210 142 1310 142L1508 340H1627"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        <path
          d="M1015 158C1227 158 1196 158 1296 158L1526 432H1919"
          stroke="#232d42"
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        {/* Terminals & Connector boxes */}
        <path
          d="M293 36H301C303.209 36 305 37.7909 305 40V40C305 42.2091 303.209 44 301 44H293V36Z"
          fill="#334155"
        />
        {glowingBoxes["top-left"] && (
          <rect
            x="213.5"
            y="0.5"
            width="79"
            height="79"
            rx="15.5"
            fill="none"
            stroke="#556999"
            strokeWidth="3"
            filter="url(#clean-glow)"
          />
        )}
        <rect
          x="213.5"
          y="0.5"
          width="79"
          height="79"
          rx="15.5"
          fill="#111622"
          stroke={glowingBoxes["top-left"] ? "#556999" : "#334155"}
          style={{ transition: "all 0.3s ease" }}
        />

        <path
          d="M173 206H181C183.209 206 185 207.791 185 210V210C185 212.209 183.209 214 181 214H173V206Z"
          fill="#334155"
        />
        {glowingBoxes["mid-left"] && (
          <rect
            x="112.5"
            y="179.5"
            width="60"
            height="60"
            rx="10.5"
            fill="none"
            stroke="#556999"
            strokeWidth="3"
            filter="url(#clean-glow)"
          />
        )}
        <rect
          x="112.5"
          y="179.5"
          width="60"
          height="60"
          rx="10.5"
          fill="#111622"
          stroke={glowingBoxes["mid-left"] ? "#556999" : "#334155"}
          style={{ transition: "all 0.3s ease" }}
        />

        <path
          d="M293 336H301C303.209 336 305 337.791 305 340V340C305 342.209 303.209 344 301 344H293V336Z"
          fill="#334155"
        />
        {glowingBoxes["bottom-left"] && (
          <rect
            x="213.5"
            y="300.5"
            width="79"
            height="79"
            rx="15.5"
            fill="none"
            stroke="#556999"
            strokeWidth="3"
            filter="url(#clean-glow)"
          />
        )}
        <rect
          x="213.5"
          y="300.5"
          width="79"
          height="79"
          rx="15.5"
          fill="#111622"
          stroke={glowingBoxes["bottom-left"] ? "#556999" : "#334155"}
          style={{ transition: "all 0.3s ease" }}
        />

        <path
          d="M1627 344H1619C1616.79 344 1615 342.209 1615 340V340C1615 337.791 1616.79 336 1619 336H1627V344Z"
          fill="#334155"
        />
        {glowingBoxes["bottom-right"] && (
          <rect
            x="1627.5"
            y="300.5"
            width="79"
            height="79"
            rx="15.5"
            fill="none"
            stroke="#556999"
            strokeWidth="3"
            filter="url(#clean-glow)"
          />
        )}
        <rect
          x="1627.5"
          y="300.5"
          width="79"
          height="79"
          rx="15.5"
          fill="#111622"
          stroke={glowingBoxes["bottom-right"] ? "#556999" : "#334155"}
          style={{ transition: "all 0.3s ease" }}
        />

        <path
          d="M1747 214H1739C1736.79 214 1735 212.209 1735 210V210C1735 207.791 1736.79 206 1739 206H1747V214Z"
          fill="#334155"
        />
        {glowingBoxes["mid-right"] && (
          <rect
            x="1747.5"
            y="179.5"
            width="60"
            height="60"
            rx="10.5"
            fill="none"
            stroke="#556999"
            strokeWidth="3"
            filter="url(#clean-glow)"
          />
        )}
        <rect
          x="1747.5"
          y="179.5"
          width="60"
          height="60"
          rx="10.5"
          fill="#111622"
          stroke={glowingBoxes["mid-right"] ? "#556999" : "#334155"}
          style={{ transition: "all 0.3s ease" }}
        />

        <path
          d="M1627 44H1619C1616.79 44 1615 42.2091 1615 40V40C1615 37.7909 1616.79 36 1619 36H1627V44Z"
          fill="#334155"
        />
        {glowingBoxes["top-right"] && (
          <rect
            x="1627.5"
            y="0.5"
            width="79"
            height="79"
            rx="15.5"
            fill="none"
            stroke="#556999"
            strokeWidth="3"
            filter="url(#clean-glow)"
          />
        )}
        <rect
          x="1627.5"
          y="0.5"
          width="79"
          height="79"
          rx="15.5"
          fill="#111622"
          stroke={glowingBoxes["top-right"] ? "#556999" : "#334155"}
          style={{ transition: "all 0.3s ease" }}
        />

        <path
          d="M1015 154H1023C1025.21 154 1027 155.791 1027 158V158C1027 160.209 1025.21 162 1023 162H1015V154Z"
          fill="#334155"
        />
        <path
          d="M1015 122H1023C1025.21 122 1027 123.791 1027 126V126C1027 128.209 1025.21 130 1023 130H1015V122Z"
          fill="#334155"
        />
        <path
          d="M1015 106H1023C1025.21 106 1027 107.791 1027 110V110C1027 112.209 1025.21 114 1023 114H1015V106Z"
          fill="#334155"
        />
        <path
          d="M905 114H897C894.791 114 893 112.209 893 110V110C893 107.791 894.791 106 897 106H905V114Z"
          fill="#334155"
        />
        <path
          d="M905 130H897C894.791 130 893 128.209 893 126V126C893 123.791 894.791 122 897 122H905V130Z"
          fill="#334155"
        />
        <path
          d="M905 146H897C894.791 146 893 144.209 893 142V142C893 139.791 894.791 138 897 138H905V146Z"
          fill="#334155"
        />
        <path
          d="M905 162H897C894.791 162 893 160.209 893 158V158C893 155.791 894.791 154 897 154H905V162Z"
          fill="#334155"
        />
        <path
          d="M940 189V197C940 199.209 938.209 201 936 201V201C933.791 201 932 199.209 932 197V189H940Z"
          fill="#334155"
        />
        <path
          d="M956 189V197C956 199.209 954.209 201 952 201V201C949.791 201 948 199.209 948 197V189H956Z"
          fill="#334155"
        />
        <path
          d="M972 189V197C972 199.209 970.209 201 968 201V201C965.791 201 964 199.209 964 197V189H972Z"
          fill="#334155"
        />
        <rect
          x="906.5"
          y="80.5"
          width="107"
          height="107"
          rx="20.5"
          fill="#111622"
          stroke="#334155"
        />
        <text
          x={906.5 + 107 / 2}
          y={80.5 + 107 / 2}
          dominantBaseline="central"
          textAnchor="middle"
          fill="url(#silver-gradient)"
          fontSize="26"
          fontWeight="bold"
          style={{ fontFamily: "sans-serif" }}
        >
          AI
        </text>
        <path
          d="M988 189V197C988 199.209 986.209 201 984 201V201C981.791 201 980 199.209 980 197V189H988Z"
          fill="#334155"
        />
        <path
          d="M1015 138H1023C1025.21 138 1027 139.791 1027 142V142C1027 144.209 1025.21 146 1023 146H1015V138Z"
          fill="#334155"
        />

        {pulses.map((pulse) => (
          <path
            key={pulse.id}
            d={outwardPaths[pulse.pathIndex]}
            stroke="#556999"
            strokeWidth="4.5"
            fill="none"
            filter="url(#clean-glow)"
            className="animate-pulse-flow"
          />
        ))}

        <defs>
          <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E2E8F0" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <filter
            id="clean-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
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

      {BOXES.map(({ id, Icon, svgX, svgY, size }) => {
        const isGlowing = glowingBoxes[id];
        const left = offsetLeft + svgX * scale - size / 2;
        const top = offsetTop + (svgY + 20) * scale - size / 2;
        return (
          <div
            key={id}
            className={`absolute pointer-events-none transition-all duration-300 hidden lg:block lg:scale-[0.8] xl:scale-100 ${isGlowing ? "icon-glow" : ""}`}
            style={{ left, top, width: size, height: size }}
          >
            <Icon
              size={size}
              stroke={isGlowing ? "#556999" : "#E2E8F0"}
              strokeWidth={1.5}
              className="transition-all duration-300"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Ai;
