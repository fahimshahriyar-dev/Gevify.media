import React, { useEffect, useState, useRef } from "react";
import { API_BASE } from "../config";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditModalOverlay from "../components/EditModalOverlay";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { useNavbarRightOffset } from "../hooks/useNavbarRight";

interface SolutionItem {
  title: string;
  subtitle: string;
}

const DEFAULT_ITEMS: SolutionItem[] = [
  {
    title: "E-Commerce Product Ad Creative",
    subtitle:
      "High-performance video creatives for Amazon, Shopify, Walmart, TikTok Shop, and other commerce platforms designed to increase visibility, engagement, and conversions.",
  },
  {
    title: "AI Influencer Systems for Brands",
    subtitle:
      "Custom AI influencers developed exclusively for your brand, delivering consistent content, scalable campaigns, and a recognizable digital presence.",
  },
  {
    title: "Social Video Production",
    subtitle:
      "Strategic short-form and long-form video content created to maximize reach, engagement, and brand awareness across today's most influential platforms.",
  },
  {
    title: "Commercial Content Production",
    subtitle:
      "Premium promotional videos for service businesses, restaurants, hospitality brands, real estate firms, healthcare providers, and corporate organizations seeking to elevate their market presence.",
  },
  {
    title: "Agency Growth Partnership",
    subtitle:
      "Helping agencies scale creative delivery without the overhead. From Amazon and e-commerce consultancies to digital marketing and social media agencies, trusted white-label production enables partners to increase capacity, improve profitability, and focus on client growth.",
  },
];

const DEFAULT_TITLE = "Unleash Your Brand's Full Potential";

interface SolutionProps {
  isAdminMode?: boolean;
}

const Solution = ({ isAdminMode = false }: SolutionProps) => {
  const navbarRight = useNavbarRightOffset(isAdminMode);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [items, setItems] = useState<SolutionItem[]>(DEFAULT_ITEMS);
  const [editOpen, setEditOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(DEFAULT_TITLE);
  const [draftItems, setDraftItems] = useState<SolutionItem[]>(DEFAULT_ITEMS);
  const [saving, setSaving] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.solution) {
          if (data.solution.title) setTitle(data.solution.title);
          if (Array.isArray(data.solution.items) && data.solution.items.length) {
            setItems(data.solution.items);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    );
    contentRef.current &&
      tl.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        "-=0.5",
      );
  }, [title, items]);

  const openEdit = () => {
    setDraftTitle(title);
    setDraftItems(JSON.parse(JSON.stringify(items)));
    setEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(
        `${API_BASE}/api/content/solution-page`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            solution: { title: draftTitle, items: draftItems },
          }),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (data.solution) {
        if (data.solution.title) setTitle(data.solution.title);
        if (
          Array.isArray(data.solution.items) &&
          data.solution.items.length
        ) {
          setItems(data.solution.items);
        }
      }
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#06102F] to-black text-white">
      <Navbar />

      {isAdminMode && (
        <>
          <button
            onClick={openEdit}
            className="fixed top-24 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
            style={{ right: navbarRight }}
            title="Edit Solution Page"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </>
      )}

      <main className="w-full px-3 sm:px-4 pt-32 sm:pt-36 pb-24 relative">
        <div className="w-full max-w-[400px] mx-auto md:max-w-none lg:max-w-[calc(100%-185px)] flex flex-col gap-10">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-6xl font-black mb-4 bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent tracking-tight font-sans text-left"
        >
          {title}
        </h1>

        <div ref={contentRef} className="flex flex-col gap-8 text-left">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 pb-8 border-b border-white/10 last:border-0"
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-sans text-left">
                <span className="mr-3 text-[#0086F0]/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.title}
              </h2>
              <p className="text-zinc-300 text-base sm:text-lg lg:text-xl leading-relaxed font-sans text-left">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
        </div>
      </main>

      <Footer isAdminMode={isAdminMode} />

      <EditModalOverlay isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col max-h-[80vh]">
          <h3 className="text-xl font-bold text-white mb-4">
            Edit Solution Content
          </h3>
          <form
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-6 max-h-[60vh]"
          >
            <div className="flex flex-col gap-2 p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
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

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Items
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setDraftItems([...draftItems, { title: "", subtitle: "" }])
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-[#0086F0]/20 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 text-[#5ACFFE] hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Item
                </button>
              </div>

              {draftItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0086F0]/20 text-[#5ACFFE] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Item {idx + 1}
                    </h5>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftItems(
                          draftItems.filter((_, i) => i !== idx),
                        )
                      }
                      className="ml-auto p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-zinc-400">
                      Title
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...draftItems];
                        updated[idx] = {
                          ...updated[idx],
                          title: e.target.value,
                        };
                        setDraftItems(updated);
                      }}
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-zinc-400">
                      Subtitle / Description
                    </label>
                    <textarea
                      value={item.subtitle}
                      onChange={(e) => {
                        const updated = [...draftItems];
                        updated[idx] = {
                          ...updated[idx],
                          subtitle: e.target.value,
                        };
                        setDraftItems(updated);
                      }}
                      rows={3}
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </form>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
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
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </EditModalOverlay>
    </div>
  );
};

export default Solution;