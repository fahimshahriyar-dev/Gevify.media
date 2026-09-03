import React, { useEffect, useState, useRef } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditModalOverlay from "../components/EditModalOverlay";
import { Pencil } from "lucide-react";
import { gsap } from "gsap";
import { useNavbarRightOffset } from "../hooks/useNavbarRight";

const DEFAULT_TITLE = "About Our Company";
const DEFAULT_TEXT = `BroEditz is a premium video production studio powered by AI — built at the intersection of cinematic storytelling, cutting-edge technology, and strategic brand thinking.

We combine AI-driven workflows with elite human creativity to produce content that rivals big-studio quality, delivered faster and at a fraction of the traditional cost.

From e-commerce ads to social media content, AI influencer videos to full brand films, BroEditz is the production partner that thinks like a creative director and executes like a machine.

Our mission is simple: to make world-class video production accessible to every brand, regardless of size or budget. Whether you are a growing e-commerce store, an established national brand, or a busy agency, we become an extension of your creative team — scaling your output without ever diluting your message.

We believe the future of video is hybrid. Cutting-edge AI handles the heavy lifting of iteration, speed, and scale, while skilled human editors, strategists, and directors shape every frame with taste, emotion, and intent. The result is content that feels crafted, not generated.

From immersive brand films and high-converting ad creatives to always-on social content, we cover the full spectrum of modern video. Each project starts with strategy, is shaped by story, and is finished with cinematic post-production — colour, sound, and motion that elevate the final product.

Speed matters. Traditional production pipelines can take weeks or months. Our AI-accelerated process compresses timelines dramatically, letting brands react to trends, launch campaigns, and test creative faster than ever before — without compromising the polish your audience expects.

As your partner, we do not just deliver videos; we deliver outcomes. Clear communication, transparent workflows, and a relentless focus on performance ensure every project is aligned with your goals and built to move real-world results.`;

interface AboutProps {
  isAdminMode?: boolean;
}

const About = ({ isAdminMode = false }: AboutProps) => {
  const effectiveAdmin = isAdminMode || Boolean(localStorage.getItem("adminToken"));
  const navbarRight = useNavbarRightOffset(effectiveAdmin);
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
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    );
    tl.fromTo(
      contentRef.current?.children || [],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.5",
    );
  }, [text, title]);

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
      const res = await fetch(
        "https://api.gevify.media/api/content/about",
        {
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
        },
      );
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
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-gradient-to-b from-[#06102F] to-black text-white"
    >
      <Navbar />

      {/* Admin bar + Edit button */}
      {effectiveAdmin && (
        <>
          <button
            onClick={openEdit}
            className="fixed top-24 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
            style={{ right: navbarRight }}
            title="Edit About Page"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Content */}
      <main className="w-full px-3 sm:px-4 pt-32 sm:pt-36 pb-24 relative">
        <div className="w-full max-w-[400px] mx-auto md:max-w-none lg:max-w-[calc(100%-185px)] flex flex-col gap-6">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent tracking-tight font-sans text-left"
        >
          {title}
        </h1>

        <div ref={contentRef} className="flex flex-col gap-6 text-left">
          {text.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-zinc-300 text-base sm:text-lg lg:text-xl leading-relaxed font-sans text-left"
            >
              {para}
            </p>
          ))}
        </div>
        </div>
      </main>

      <Footer isAdminMode={effectiveAdmin} />

      {/* Edit Modal */}
      <EditModalOverlay isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Edit About Content</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Title
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Paragraphs
              </label>
              <p className="text-[11px] text-zinc-500">
                Separate paragraphs with a blank line.
              </p>
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
