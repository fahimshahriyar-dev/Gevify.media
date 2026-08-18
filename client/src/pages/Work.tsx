import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditModalOverlay from "../components/EditModalOverlay";
import { Play, Pencil, Plus, Trash2 } from "lucide-react";
import { gsap } from "gsap";

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  if (url.includes("youtu.be/")) return url.split("youtu.be/")[1]?.split("?")[0] || null;
  if (url.includes("watch?v=")) return url.split("watch?v=")[1]?.split("&")[0] || null;
  if (url.includes("embed/")) return url.split("embed/")[1]?.split("?")[0] || null;
  return null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

function getEmbedUrl(url: string): string {
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
}

interface WorkProps {
  isAdminMode?: boolean;
}

const PAGE_SIZE = 12;

const Work = ({ isAdminMode = false }: WorkProps) => {
  const navigate = useNavigate();
  const [workTitle, setWorkTitle] = useState("Our Work");
  const [workVideos, setWorkVideos] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeEdit, setActiveEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editVideos, setEditVideos] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [gridAnimating, setGridAnimating] = useState(true);

  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(workVideos.length / PAGE_SIZE));
  const pageStart = currentPage * PAGE_SIZE;
  const pageVideos = workVideos.slice(pageStart, pageStart + PAGE_SIZE);

  const fetchWorkPage = () => {
    fetch("http://localhost:5000/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.workPage) {
          setWorkTitle(data.workPage.title || "Our Work");
          setWorkVideos(data.workPage.videos || []);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchWorkPage();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [workVideos.length]);

  // Prevent flash by setting initial hidden states layout-synced
  useLayoutEffect(() => {
    setGridAnimating(true);
    if (titleRef.current) {
      gsap.set(titleRef.current.children, { y: 50, opacity: 0 });
    }
    if (gridRef.current) {
      gsap.set(gridRef.current.children, { y: 60, opacity: 0 });
    }
    if (paginationRef.current) {
      gsap.set(paginationRef.current, { y: 30, opacity: 0 });
    }
  }, [currentPage, workTitle, workVideos]);

  // GSAP animation for Work page content (bottom to top)
  useEffect(() => {
    if (!titleRef.current || workVideos.length === 0) return;

    const tl = gsap.timeline();

    // 1. Title and Vertical/Horizontal buttons
    tl.to(
      titleRef.current.children,
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" }
    );

    // 2. Video cards rise smoothly from just below, starting right as the title appears
    if (gridRef.current && pageVideos.length > 0) {
      tl.to(
        gridRef.current.children,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power4.out",
          onComplete: () => setGridAnimating(false),
        },
        "<0.2"
      );
    }

    // 3. Pagination bar
    if (totalPages > 1 && paginationRef.current) {
      tl.to(
        paginationRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      );
    }
  }, [currentPage, workTitle, workVideos]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const openEdit = () => {
    setEditTitle(workTitle);
    setEditVideos([...workVideos]);
    setActiveEdit(true);
  };
  const closeEdit = () => setActiveEdit(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/content/work-page", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ workPage: { title: editTitle, videos: editVideos } })
      });
      if (!res.ok) throw new Error("Failed to update work page");
      const data = await res.json();
      if (data.workPage) {
        setWorkTitle(data.workPage.title || "Our Work");
        setWorkVideos(data.workPage.videos || []);
      }
      closeEdit();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#06102F] to-black text-white select-none overflow-x-hidden max-w-full">
      <Navbar />

      {isAdminMode && (
        <>
          <div className="fixed top-6 right-6 md:right-10 z-[100] flex flex-col items-end gap-2">
            <div className="hidden md:flex items-center gap-3 bg-[#06102F]/90 backdrop-blur-md border border-[#0086F0]/40 rounded-full px-5 py-3 shadow-xl shadow-black/40">
              <button
                onClick={() => navigate("/admin/profile")}
                className="flex items-center gap-2 text-xs font-bold text-[#5ACFFE] uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#0086F0] animate-ping" />
                Admin Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-[#0086F0]/25 rounded-full px-3 py-1 transition-all cursor-pointer border border-transparent hover:border-[#0086F0]/30"
              >
                Logout
              </button>
            </div>
          </div>
          <button
            onClick={openEdit}
            className="fixed top-24 right-6 md:top-20 md:right-10 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
            title="Edit Work Page"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </>
      )}

      <div className="min-h-screen flex flex-col pt-28 sm:pt-32 md:pt-40 pb-8 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div ref={titleRef} className="text-center mb-6 sm:mb-10 shrink-0">
          <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent tracking-tight font-sans px-2 opacity-0">
            {workTitle}
          </h1>
          <p className="text-sm md:text-base text-zinc-500 font-medium tracking-widest uppercase mt-4 opacity-0">
            Vertical &bull; Horizontal
          </p>
        </div>

        {/* Outer overflow-hidden wrapper clips cards as they rise from below */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className={`w-full h-full ${gridAnimating ? "overflow-hidden" : "overflow-y-auto scrollbar-thin pr-1"}`}>
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-4">
            {workVideos.length > 0 && pageVideos.map((url, i) => {
              const globalIdx = pageStart + i;
              const thumb = getYouTubeThumbnail(url);
              return (
                <button
                  key={globalIdx}
                  onClick={() => { setActiveIndex(globalIdx); setIsPopupOpen(true); }}
                  className="group relative aspect-video rounded-2xl overflow-hidden bg-zinc-900/50 border border-white/10 hover:border-[#0086F0]/50 transition-all duration-300 cursor-pointer opacity-0"
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={`Work ${globalIdx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm font-medium">
                      No Thumbnail
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] flex items-center justify-center shadow-lg shadow-[#0086F0]/30 transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div ref={paginationRef} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4 shrink-0">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 sm:px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold cursor-pointer"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  i === currentPage
                    ? "bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] text-white shadow-lg shadow-[#0086F0]/30"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 sm:px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-semibold cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Footer isAdminMode={isAdminMode} />

      <EditModalOverlay isOpen={activeEdit} onClose={closeEdit}>
        <div className="flex flex-col max-h-[80vh]">
          <h3 className="text-xl font-bold text-white mb-4">Edit Work Page</h3>
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-6 max-h-[60vh]">
            <div className="flex flex-col gap-2 p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Page Title</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Video Links</h4>
                <button
                  type="button"
                  onClick={() => setEditVideos([...editVideos, ""])}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0086F0]/20 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 text-[#5ACFFE] hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Video
                </button>
              </div>
              {editVideos.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    value={url}
                    onChange={(e) => {
                      const updated = [...editVideos];
                      updated[idx] = e.target.value;
                      setEditVideos(updated);
                    }}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setEditVideos(editVideos.filter((_, i) => i !== idx))}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </form>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
            <button type="button" onClick={closeEdit} className="px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </EditModalOverlay>

      {isPopupOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
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
            className="modal-animate relative w-full max-w-5xl bg-neutral-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/90 transition-all border border-white/20 cursor-pointer shadow-lg"
            >
              ✕
            </button>
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={getEmbedUrl(workVideos[activeIndex] || "")}
                title={`Work Video ${activeIndex + 1}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Work;
