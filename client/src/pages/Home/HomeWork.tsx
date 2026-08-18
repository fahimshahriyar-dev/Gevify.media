import { useState } from "react";
import { createPortal } from "react-dom";
import Slider from "../../components/animations/Slider";
import { ArrowLeft, ArrowRight, X, Video } from "lucide-react";

interface HomeWorkProps {
  onGoToSolution?: () => void;
  workVideos?: string[];
  isAdminMode?: boolean;
  onUpdateWorkVideos?: (videos: string[]) => void;
}

const CARD_COUNT = 12;

const HomeWork = ({
  onGoToSolution,
  workVideos = [],
  isAdminMode: _isAdminMode,
  onUpdateWorkVideos,
}: HomeWorkProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>([]);

  const openEdit = () => {
    // prefill draft from current workVideos (pad to 12)
    const filled = Array.from(
      { length: CARD_COUNT },
      (_, i) => workVideos[i] || "",
    );
    setDraft(filled);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (onUpdateWorkVideos) {
      await onUpdateWorkVideos(draft);
    }
    setEditOpen(false);
  };

  return (
    <div
      className="w-full h-screen overflow-hidden flex flex-col justify-center items-center relative max-w-full"
      style={{
        background:
          "radial-gradient(circle at 50% 25%, #dbe2ef 0%, #c3cbd9 45%, #a4b0c1 75%, #8391a5 100%)",
      }}
    >
      {/* Hidden trigger — activated by the fixed Edit Work Videos button in Home.tsx */}
      <button
        id="homework-edit-trigger"
        onClick={openEdit}
        className="hidden"
        aria-hidden="true"
      />

      <Slider workVideos={workVideos} />

      {/* Navigation links at bottom corners */}
      <button
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("goto-section", { detail: "hero" }),
          )
        }
        className="absolute bottom-8 left-12 flex items-center gap-2 text-slate-600 hover:text-slate-950 font-semibold transition-colors z-20 cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        <span className="hidden md:inline lg:hidden text-xs font-semibold tracking-widest uppercase">
          Prev
        </span>
        <span className="hidden lg:inline text-xs font-semibold tracking-widest uppercase">
          Previous Page
        </span>
      </button>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 items-center text-slate-700 text-sm tracking-widest pointer-events-none z-20">
        <b className="font-semibold uppercase text-slate-900">Vertical</b>
        <span className="w-1.5 h-1.5 rounded-full bg-[#0086F0] opacity-80"></span>
        <span className="opacity-60 uppercase text-slate-600">Horizontal</span>
      </div>

      <button
        onClick={onGoToSolution}
        className="absolute bottom-8 right-12 flex items-center gap-2 text-slate-600 hover:text-slate-950 font-semibold transition-colors z-20 cursor-pointer group"
      >
        <span className="hidden md:inline lg:hidden text-xs font-semibold tracking-widest uppercase">
          Next
        </span>
        <span className="hidden lg:inline text-xs font-semibold tracking-widest uppercase">
          Next Page
        </span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>

      {/* ── Edit Videos Modal ── */}
      {editOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-[#0086F0]" />
                  <h2 className="text-white font-bold text-lg">
                    Edit Work Videos
                  </h2>
                </div>
                <button
                  onClick={() => setEditOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable inputs */}
              <div className="overflow-y-auto flex-1 p-6 space-y-3">
                {Array.from({ length: CARD_COUNT }, (_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#0086F0]/20 text-[#5ACFFE] text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={draft[i] || ""}
                      onChange={(e) => {
                        const updated = [...draft];
                        updated[i] = e.target.value;
                        setDraft(updated);
                      }}
                      placeholder={`Card ${i + 1} — YouTube URL`}
                      className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#0086F0] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Save Videos
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default HomeWork;
