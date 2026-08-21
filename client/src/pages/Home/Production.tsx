import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Pencil } from "lucide-react";
import EditModalOverlay from "../../components/EditModalOverlay";
import Wheel from "../../components/animations/Wheel";

const DEFAULT_PRODUCTION = {
  sectionSubtitle: "OUR PRODUCTION ECOSYSTEM",
  title: "One Production Partner, \n Endless Creative Possibilities...",
  description:
    "From strategy and scripting to AI-powered production and cinematic post-production, we combine cutting-edge AI with human creativity to deliver premium commercial videos at scale—without compromising quality.",
  boxes: [
    {
      title: "Creative Strategy",
      subtitle: "We research, analyze & craft\nthe perfect creative direction",
    },
    {
      title: "Script Writing",
      subtitle: "Compelling scripts that capture\nattention and drive action",
    },
    {
      title: "AI Video Generation",
      subtitle: "AI generates stunning visuals\ntailored to your brand",
    },
    {
      title: "Motion Design",
      subtitle: "Dynamic motion graphics that\nbring your story to life",
    },
    {
      title: "Professional Editing",
      subtitle: "Expert editors refine every\nframe for maximum impact",
    },
    {
      title: "Sound Design",
      subtitle:
        "Premium music, sound effects &\nvoiceovers that elevate emotion",
    },
    {
      title: "Color Grading",
      subtitle: "Cinematic color grading for a\npremium, brand-aligned look",
    },
    {
      title: "Final Delivery",
      subtitle:
        "High-quality, ready-to-publish videos\ndelivered on time, every time",
    },
  ],
};

interface ProductionProps {
  production?: typeof DEFAULT_PRODUCTION;
  isAdminMode?: boolean;
  onUpdateProduction?: (production: typeof DEFAULT_PRODUCTION) => Promise<void>;
  active?: boolean;
}

const Production: React.FC<ProductionProps> = ({
  production: productionProp,
  isAdminMode = false,
  onUpdateProduction,
  active = false,
}) => {
  const prodData = {
    ...DEFAULT_PRODUCTION,
    ...(productionProp || {}),
    boxes: productionProp?.boxes?.length
      ? productionProp.boxes
      : DEFAULT_PRODUCTION.boxes,
  };

  const [activeEdit, setActiveEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editSectionSubtitle, setEditSectionSubtitle] = useState(
    prodData.sectionSubtitle,
  );
  const [editTitle, setEditTitle] = useState(prodData.title);
  const [editDescription, setEditDescription] = useState(prodData.description);
  const [editBoxes, setEditBoxes] = useState(prodData.boxes);

  const sectionSubtitleRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    gsap.set([sectionSubtitleRef.current, titleRef.current, descRef.current], {
      x: -50,
      scale: 0.8,
      opacity: 0,
      transformOrigin: "left center",
    });
  }, []);

  useEffect(() => {
    if (!active) {
      gsap.set(
        [sectionSubtitleRef.current, titleRef.current, descRef.current],
        {
          x: -50,
          scale: 0.8,
          opacity: 0,
        },
      );
      return;
    }

    const tl = gsap.timeline();
    tl.to(sectionSubtitleRef.current, {
      x: 0,
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    })
      .to(
        titleRef.current,
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6",
      )
      .to(
        descRef.current,
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6",
      );

    return () => {
      tl.kill();
    };
  }, [active]);

  const openEdit = () => {
    setEditSectionSubtitle(prodData.sectionSubtitle);
    setEditTitle(prodData.title);
    setEditDescription(prodData.description);
    setEditBoxes(JSON.parse(JSON.stringify(prodData.boxes)));
    setActiveEdit(true);
  };
  const closeEdit = () => setActiveEdit(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (onUpdateProduction) {
        await onUpdateProduction({
          sectionSubtitle: editSectionSubtitle,
          title: editTitle,
          description: editDescription,
          boxes: editBoxes,
        });
      }
      closeEdit();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (activeEdit) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeEdit]);

  return (
    <>
      <section
        className="w-full min-h-screen text-slate-900 px-4 sm:px-6 md:px-12 lg:px-20 select-none relative overflow-hidden pt-30 sm:pt-40 lg:pt-50"
        style={{
          background:
            "radial-gradient(circle at 50% 25%, #dbe2ef 0%, #c3cbd9 45%, #a4b0c1 75%, #8391a5 100%)",
        }}
      >
        {isAdminMode && (
          <button
            onClick={openEdit}
            className="absolute top-24 right-6 md:top-20 md:right-10 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
            title="Edit Production Section"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {/*
          Widened from max-w-7xl (1280px) so that, on large screens, the
          70% wheel column actually resolves against real available
          screen width instead of being capped by this container.
          Swap to `max-w-none` (or drop max-w-* entirely) if you want it
          to use the full viewport width edge-to-edge on very large screens.
        */}
        <div className="w-full max-w-[1600px] mx-auto h-auto lg:h-[calc(100vh-270px)] flex flex-col lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-12 relative z-10">
          {/*
            Locked to exactly 30% on lg+ (matching the Wheel's 70%) instead
            of the old 35% / 38% / 45% breakpoint overrides, so the split
            stays a true 30/70 at every large breakpoint. The `calc()`
            accounts for half of the parent's gap-12 (3rem) so the two
            columns fit together without overflow.
            mb-[100px]/mb-[120px] push the animation down below the text
            on sm/md (stacked layout); reset to mb-0 at lg where the
            columns sit side by side instead of stacked.
          */}
          <div className="w-full mb-[100px] md:mb-[160px] lg:mb-0 lg:w-[calc(30%-1.5rem)] flex flex-col items-start text-left gap-4 md:gap-5 px-4 lg:px-0 relative z-20">
            <span
              ref={sectionSubtitleRef}
              className="text-[10px] sm:text-xs md:text-sm lg:text-[11px] xl:text-xs 2xl:text-sm font-semibold tracking-[0.2em] text-[#0086F0] uppercase opacity-0 will-change-transform"
            >
              {prodData.sectionSubtitle}
            </span>
            <h2
              ref={titleRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] opacity-0 will-change-transform"
            >
              {prodData.title.split("\n").map((line, idx) => (
                <React.Fragment key={idx}>
                  {line}
                  {idx < prodData.title.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
            <p
              ref={descRef}
              className="text-xs sm:text-sm md:text-base lg:text-xs xl:text-sm 2xl:text-base text-slate-700 font-normal leading-relaxed max-w-lg mt-1 opacity-0 will-change-transform"
            >
              {prodData.description}
            </p>
          </div>
          <Wheel boxesData={prodData.boxes} />
        </div>
      </section>

      <EditModalOverlay isOpen={activeEdit} onClose={closeEdit}>
        <div className="flex flex-col max-h-[80vh]">
          <h3 className="text-xl font-bold text-white mb-4">
            Edit Production Section
          </h3>

          <form
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-6 max-h-[60vh]"
          >
            <div className="flex flex-col gap-2 p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Section Subtitle
              </label>
              <input
                value={editSectionSubtitle}
                onChange={(e) => setEditSectionSubtitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-2 p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Main Title
              </label>
              <textarea
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-2 p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Process Steps (8 Boxes)
              </h4>
              {editBoxes.map((box, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0086F0]/20 text-[#5ACFFE] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Step {idx + 1}
                    </h5>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-zinc-400">
                      Title
                    </label>
                    <input
                      value={box.title}
                      onChange={(e) => {
                        const updated = [...editBoxes];
                        updated[idx] = {
                          ...updated[idx],
                          title: e.target.value,
                        };
                        setEditBoxes(updated);
                      }}
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-zinc-400">
                      Subtitle (use \n for line break)
                    </label>
                    <textarea
                      value={box.subtitle}
                      onChange={(e) => {
                        const updated = [...editBoxes];
                        updated[idx] = {
                          ...updated[idx],
                          subtitle: e.target.value,
                        };
                        setEditBoxes(updated);
                      }}
                      rows={2}
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
              onClick={closeEdit}
              className="px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </EditModalOverlay>
    </>
  );
};

export default Production;