import { lazy, Suspense } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CssSlider = lazy(() => import("../../components/animations/CssSlider"));

interface HomeWorkProps {
  onGoToSolution?: () => void;
  workVideos?: string[];
}

const HomeWork = ({
  onGoToSolution,
  workVideos = [],
}: HomeWorkProps) => {
  return (
    <div
      className="w-full h-mobile-screen overflow-hidden flex flex-col justify-center items-center relative max-w-full"
      style={{
        background:
          "radial-gradient(circle at 50% 25%, #dbe2ef 0%, #c3cbd9 45%, #a4b0c1 75%, #8391a5 100%)",
      }}
    >
      <style>{`
        @keyframes nudge-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-5px); }
        }
        @keyframes nudge-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-nudge-left { animation: nudge-left 1.4s ease-in-out infinite; }
        .animate-nudge-right { animation: nudge-right 1.4s ease-in-out infinite; }
      `}</style>

      <Suspense fallback={null}>
        <CssSlider workVideos={workVideos} />
      </Suspense>

      {/* Navigation links at bottom corners - hidden on sm & md, visible on lg */}
      <button
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("goto-section", { detail: "hero" }),
          )
        }
        className="absolute bottom-8 left-12 hidden lg:flex items-center gap-2 text-slate-600 hover:text-slate-950 font-semibold transition-colors z-20 cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 animate-nudge-left" />
        <span className="hidden lg:inline text-sm font-semibold tracking-widest uppercase">
          Previous Page
        </span>
      </button>

      <button
        onClick={onGoToSolution}
        className="absolute bottom-8 right-12 hidden lg:flex items-center gap-2 text-slate-600 hover:text-slate-950 font-semibold transition-colors z-20 cursor-pointer group"
      >
        <span className="hidden lg:inline text-sm font-semibold tracking-widest uppercase">
          Next Page
        </span>
        <ArrowRight className="w-5 h-5 animate-nudge-right" />
      </button>
    </div>
  );
};

export default HomeWork;
