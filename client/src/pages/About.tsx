import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditModalOverlay from "../components/EditModalOverlay";
import { Pencil } from "lucide-react";
import { gsap } from "gsap";

const DEFAULT_TITLE = "About Our Company";
const DEFAULT_TEXT = `BroEditz is a premium video production studio powered by AI — built at the intersection of cinematic storytelling, cutting-edge technology, and strategic brand thinking.

We combine AI-driven workflows with elite human creativity to produce content that rivals big-studio quality, delivered faster and at a fraction of the traditional cost.

From e-commerce ads to social media content, AI influencer videos to full brand films, BroEditz is the production partner that thinks like a creative director and executes like a machine.`;

interface AboutProps {
  isAdminMode?: boolean;
}

const About = ({ isAdminMode = false }: AboutProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [text, setText] = useState(DEFAULT_TEXT);
  const [editOpen, setEditOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(DEFAULT_TITLE);
  const [draftText, setDraftText] = useState(DEFAULT_TEXT);
  const [saving, setSaving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://api.gevify.media/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.about) {
          if (data.about.title) setTitle(data.about.title);
          if (data.about.description) setText(data.about.description);
        }
      })
      .catch(console.error);
  }, []);

  // GSAP animation for revealing content from bottom to top
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    tl.fromTo(
      contentRef.current?.children || [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.5"
    );
  }, [text, title]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const openEdit = () => {
    setDraftTitle(title);
    setDraftText(text);
    setEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("https://api.gevify.media/api/content/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          about: {
            title: draftTitle,
            description: draftText,
          },
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (data.about) {
        if (data.about.title) setTitle(data.about.title);
        if (data.about.description) setText(data.about.description);
      }
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-gradient-to-b from-[#06102F] to-black text-white">
      <Navbar />

      {/* Admin bar + Edit button */}
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
            title="Edit About Page"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 sm:pt-48 pb-24 flex flex-col gap-6 relative">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent tracking-tight font-sans"
        >
          {title}
        </h1>

        <div ref={contentRef} className="flex flex-col gap-6">
          {text.split("\n\n").map((para, i) => (
            <p key={i} className="text-zinc-300 text-base sm:text-lg lg:text-xl leading-relaxed font-sans">
              {para}
            </p>
          ))}
        </div>
      </main>

      <Footer isAdminMode={isAdminMode} />

      {/* Edit Modal */}
      <EditModalOverlay isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Edit About Content</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Title</label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Paragraphs</label>
              <p className="text-[11px] text-zinc-500">Separate paragraphs with a blank line.</p>
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                rows={10}
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm leading-relaxed resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </EditModalOverlay>
    </div>
  );
};

export default About;
