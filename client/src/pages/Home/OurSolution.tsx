import React, { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import EditModalOverlay from "../../components/EditModalOverlay";
import { gsap } from "gsap";
import type { SolutionCard, BrandsData } from "./Home";
import background2 from "../../assets/images/background_2.png";

type EditPanel = "title" | "brands" | null;

interface OurSolutionProps {
  active?: boolean;
  solutionTitle?: string;
  solutionCards?: SolutionCard[];
  brands?: BrandsData;
  isAdminMode?: boolean;
  onUpdateSolutionTitle?: (solutionTitle: string) => Promise<void>;
  onUpdateSolution?: (
    solutionTitle: string,
    solutionCards: SolutionCard[],
  ) => Promise<void>;
  onUpdateBrands?: (brands: BrandsData) => Promise<void>;
}

const DEFAULT_CARDS: SolutionCard[] = [
  {
    title: "E-Commerce \n product Ad Creative",
    subtitle:
      "High-performance video creatives for Amazon, Shopify, Walmart, TikTok Shop, and other commerce platforms designed to increase visibility, engagement, and conversions.",
    image: "/src/assets/images/card_1.png",
  },
  {
    title: "AI Influencer Systems \n for Brands",
    subtitle:
      "Custom AI influencers developed exclusively for your brand, delivering consistent content, scalable campaigns, and a recognizable digital presence.",
    image: "/src/assets/images/card_2.png",
  },
  {
    title: "Social Video \n Production",
    subtitle:
      "Strategic short-form and long-form video content created to maximize reach, engagement, and brand awareness across today's most influential platforms.",
    image: "/src/assets/images/card_3.png",
  },
  {
    title: "Commercial Content \n Production",
    subtitle:
      "Premium promotional videos for service businesses, restaurants, hospitality brands, real estate firms, healthcare providers, and corporate organizations seeking to elevate their market presence.",
    image: "/src/assets/images/card_4.png",
  },
  {
    title: "Agency Growth \n Partnership",
    subtitle:
      "Helping agencies scale creative delivery without the overhead. From Amazon and e-commerce consultancies to digital marketing and social media agencies, trusted white-label production enables partners to increase capacity, improve profitability, and focus on client growth while every relationship remains fully protected.",
    image: "/src/assets/images/card_5.png",
  },
];

const DEFAULT_BRANDS: BrandsData = {
  row1: [
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658892/file_000000003b488206955f5002bdb0571e_olotb9.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658885/file_00000000bbcc8208b4a76f3c67bff8a6_rme2a8.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658884/file_000000008ae48207b368b4980b6849a5_v9gdep.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000680482119e054be332f78751_l24png.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000a6a08206a6537380f4c52611_qo47bt.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000f690820d9306646037ba83ef_lxdkxz.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000cb4881fa9c6b6b92cb70b0ab_semryx.png",
  ],
  row2: [
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000cb04820cb12bc3bc0069f275-removebg-preview_yx8506.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_000000000bb881fa8b5e70653b8f79ac_vqd63t.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000d8d881fa9b5284b9a8addd85_bs5ino.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000c4b481faa4238ab9503f8315_qle1tb.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658879/cosmetisse_white_transparent_clean_xouary.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000db1881fa9a3bc75ef18be3a2_mt2ccx.png",
    "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658879/file_00000000cf4c81fab78e6005983a3d57_ckt61z.png",
  ],
};

const OurSolution = ({
  active,
  solutionTitle = "Unleash Your AI \n application's full potential",
  solutionCards,
  brands,
  isAdminMode = false,
  onUpdateSolutionTitle,
  onUpdateSolution,
  onUpdateBrands,
}: OurSolutionProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Shared exclusive edit panel — only one can be open at a time
  const [activeEdit, setActiveEdit] = useState<EditPanel>(null);
  const [editTitle, setEditTitle] = useState(solutionTitle);
  const [editCards, setEditCards] = useState<SolutionCard[]>([]);
  const [editBrands, setEditBrands] = useState<BrandsData>(DEFAULT_BRANDS);
  const [activeBrandRow, setActiveBrandRow] = useState<"row1" | "row2">("row1");
  const [saving, setSaving] = useState(false);

  // Entrance animation: title first from bottom, then cards one by one from bottom
  useEffect(() => {
    const cards = cardsContainerRef.current?.querySelectorAll(".solution-card");

    if (!active) {
      gsap.set(titleRef.current, { y: 50, opacity: 0 });
      if (cards) gsap.set(cards, { y: 60, opacity: 0 });
      return;
    }

    const tl = gsap.timeline();
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    });
    if (cards && cards.length > 0) {
      tl.to(
        cards,
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power2.out" },
        "-=0.4",
      );
    }

    return () => {
      tl.kill();
    };
  }, [active, solutionTitle, solutionCards]);

  const openEdit = (panel: EditPanel) => {
    setActiveEdit(panel);
  };
  const closeEdit = () => setActiveEdit(null);

  const startEditingSolution = () => {
    setEditTitle(solutionTitle);
    const initialCards =
      solutionCards && solutionCards.length === 5
        ? JSON.parse(JSON.stringify(solutionCards))
        : JSON.parse(JSON.stringify(DEFAULT_CARDS));
    setEditCards(initialCards);
    openEdit("title");
  };

  const startEditingBrands = () => {
    const current =
      brands && (brands.row1?.length > 0 || brands.row2?.length > 0)
        ? JSON.parse(JSON.stringify(brands))
        : JSON.parse(JSON.stringify(DEFAULT_BRANDS));
    setEditBrands(current);
    openEdit("brands");
  };

  // Disable scroll when modal is open
  useEffect(() => {
    const container = document.getElementById("solution-section");
    if (activeEdit) {
      document.body.style.overflow = "hidden";
      if (container) container.style.overflowY = "hidden";
    } else {
      document.body.style.overflow = "";
      if (container) container.style.overflowY = "auto";
    }
    return () => {
      document.body.style.overflow = "";
      if (container) container.style.overflowY = "auto";
    };
  }, [activeEdit]);

  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (onUpdateSolution) {
        await onUpdateSolution(editTitle, editCards);
      } else if (onUpdateSolutionTitle) {
        await onUpdateSolutionTitle(editTitle);
      }
      closeEdit();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBrands = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateBrands) return;
    setSaving(true);
    try {
      await onUpdateBrands(editBrands);
      closeEdit();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const currentCards =
    solutionCards && solutionCards.length === 5 ? solutionCards : DEFAULT_CARDS;
  const row1Cards = currentCards.slice(0, 3);
  const row2Cards = currentCards.slice(3, 5);

  const row1Configs = [
    {
      width: "lg:w-[40%]",
      image: "/src/assets/images/card_1.png",
      textMaxW: "max-w-[240px] sm:max-w-[280px] md:max-w-[320px]",
    },
    {
      width: "lg:w-[25%]",
      image: "/src/assets/images/card_2.png",
      textMaxW: "max-w-[200px] sm:max-w-[240px]",
    },
    {
      width: "lg:w-[25%]",
      image: "/src/assets/images/card_3.png",
      textMaxW: "max-w-[200px] sm:max-w-[240px]",
    },
  ];

  const row2Configs = [
    {
      width: "lg:w-[55%]",
      image: "/src/assets/images/card_4.png",
      textMaxW: "max-w-[300px] sm:max-w-[360px] md:max-w-[420px]",
    },
    {
      width: "lg:w-[35%]",
      image: "/src/assets/images/card_5.png",
      textMaxW: "max-w-[240px] sm:max-w-[280px] md:max-w-[320px]",
    },
  ];

  const activeRow1 =
    brands?.row1 && brands.row1.length > 0 ? brands.row1 : DEFAULT_BRANDS.row1;
  const activeRow2 =
    brands?.row2 && brands.row2.length > 0 ? brands.row2 : DEFAULT_BRANDS.row2;

  return (
    <div ref={rootRef} className="relative">
      {/* Title Edit icon - Directly underneath Admin Mode badge box */}
      {isAdminMode && (
        <button
          onClick={startEditingSolution}
          className="absolute top-24 right-6 md:top-20 md:right-10 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
          title="Edit Solution Section & Cards"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      <section className="pt-30 sm:pt-40 lg:pt-55 relative group">
        {/* Background image — pinned top-0 to bottom-0 inside section 1 */}
        <img
          src={background2}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none -z-10"
          draggable={false}
        />
        <h1
          ref={titleRef}
          className="bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl m-auto text-center px-4 max-w-5xl font-semibold"
        >
          {solutionTitle.split("\n").map((line, idx) => (
            <React.Fragment key={idx}>
              {line}
              {idx < solutionTitle.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </h1>

        <div
          ref={cardsContainerRef}
          className="w-full mt-10 sm:mt-16 lg:mt-20 flex flex-col gap-4 px-4 sm:px-6 lg:px-8"
        >
          {/* Row 1 Cards */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center">
            {row1Cards.map((card, i) => (
              <div
                key={`row1-card-${i}`}
                className={`solution-card w-full ${row1Configs[i].width} h-[300px] sm:h-[380px] lg:h-[450px] rounded-2xl sm:rounded-3xl lg:rounded-4xl p-6 sm:p-8 lg:p-10 flex flex-col justify-start text-left overflow-hidden relative`}
              >
                {/* Silver Gradient Border Overlay */}
                <div
                  className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
                  style={{
                    padding: "1px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e2e8f0 35%, #94a3b8 70%, #475569 100%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <img
                  src={card.image || row1Configs[i].image}
                  alt={card.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-center select-none"
                  draggable={false}
                />
                <div className="relative z-10 flex flex-col justify-start">
                  <h3 className="card-text text-white text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                    {card.title.split("\n").map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < card.title.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h3>
                  <p
                    className={`card-text text-zinc-400 text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed ${row1Configs[i].textMaxW} max-w-full`}
                  >
                    {card.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 Cards */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center">
            {row2Cards.map((card, i) => (
              <div
                key={`row2-card-${i}`}
                className={`solution-card w-full ${row2Configs[i].width} h-[300px] sm:h-[380px] lg:h-[450px] rounded-2xl sm:rounded-3xl lg:rounded-4xl p-6 sm:p-8 lg:p-10 flex flex-col justify-start text-left overflow-hidden relative`}
              >
                {/* Silver Gradient Border Overlay */}
                <div
                  className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
                  style={{
                    padding: "1px",
                    background:
                      "linear-gradient(135deg, #ffffff 0%, #e2e8f0 35%, #94a3b8 70%, #475569 100%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
                <img
                  src={card.image || row2Configs[i].image}
                  alt={card.title}
                  loading="lazy"
                  className={
                    i === 1
                      ? "absolute inset-0 w-full h-full object-cover object-right select-none"
                      : "absolute inset-0 w-full h-full object-cover object-center select-none"
                  }
                  draggable={false}
                />
                <div className="relative z-10 flex flex-col justify-start">
                  <h3 className="card-text text-white text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                    {card.title.split("\n").map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < card.title.split("\n").length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h3>
                  <p
                    className={`card-text text-zinc-400 text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed ${row2Configs[i].textMaxW} max-w-full`}
                  >
                    {card.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite slider section (Section 2 - Brands) */}
      <section className="pt-20 sm:pt-30 lg:pt-40 pb-16 sm:pb-24 lg:pb-30 bg-black overflow-hidden relative flex flex-col gap-6 select-none group">
        {/* Brands Edit icon */}
        {isAdminMode && (
          <button
            onClick={startEditingBrands}
            className="absolute top-24 right-6 md:top-20 md:right-10 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
            title="Edit Brands"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        {/* Faded edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 lg:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {/* Row 1: Right to Left */}
        <div className="flex w-max overflow-hidden">
          <div className="flex gap-10 pr-10 items-center infinite-track">
            {(activeRow1.length > 0
              ? [
                  ...activeRow1,
                  ...activeRow1,
                  ...activeRow1,
                  ...activeRow1,
                  ...activeRow1,
                  ...activeRow1,
                  ...activeRow1,
                  ...activeRow1,
                ]
              : []
            ).map((item, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex items-center justify-center h-20 w-40 md:w-52 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={item}
                  alt="Brand Logo"
                  className="max-h-16 max-w-full object-contain filter brightness-0 invert opacity-75 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex w-max overflow-hidden">
          <div
            className="flex gap-10 pr-10 items-center infinite-track"
            style={{ animationDirection: "reverse" }}
          >
            {(activeRow2.length > 0
              ? [
                  ...activeRow2,
                  ...activeRow2,
                  ...activeRow2,
                  ...activeRow2,
                  ...activeRow2,
                  ...activeRow2,
                  ...activeRow2,
                  ...activeRow2,
                ]
              : []
            ).map((item, idx) => (
              <div
                key={`row2-${idx}`}
                className="flex items-center justify-center h-20 w-40 md:w-52 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={item}
                  alt="Brand Logo"
                  className="max-h-16 max-w-full object-contain filter brightness-0 invert opacity-75 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Solution Section & 5 Cards Modal Component */}
      <EditModalOverlay isOpen={activeEdit === "title"} onClose={closeEdit}>
        <div className="flex flex-col max-h-[80vh]">
          <h3 className="text-xl font-bold text-white mb-4">
            Edit Solution Section & Cards
          </h3>

          <form
            onSubmit={handleSaveSolution}
            className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-6 max-h-[60vh]"
          >
            {/* Main Section Title */}
            <div className="flex flex-col gap-2 p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Main Section Title
              </label>
              <textarea
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>

            {/* 5 Cards Header */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Solution Cards (5 Cards)
              </h4>

              {editCards.map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0086F0]/20 text-[#5ACFFE] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Card {idx + 1}
                    </h5>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-zinc-400">
                      Card Title
                    </label>
                    <textarea
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...editCards];
                        updated[idx] = {
                          ...updated[idx],
                          title: e.target.value,
                        };
                        setEditCards(updated);
                      }}
                      rows={2}
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-zinc-400">
                      Card Subtitle / Description
                    </label>
                    <textarea
                      value={card.subtitle}
                      onChange={(e) => {
                        const updated = [...editCards];
                        updated[idx] = {
                          ...updated[idx],
                          subtitle: e.target.value,
                        };
                        setEditCards(updated);
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
              onClick={closeEdit}
              className="px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSaveSolution}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </EditModalOverlay>

      {/* Edit Brands Modal Component */}
      <EditModalOverlay isOpen={activeEdit === "brands"} onClose={closeEdit}>
        <div className="flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Edit Brand Logos</h3>
            <button
              type="button"
              onClick={() => {
                const updated = { ...editBrands };
                const targetRow = activeBrandRow === "row1" ? "row1" : "row2";
                updated[targetRow] = [...(updated[targetRow] || []), ""];
                setEditBrands(updated);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#0086F0]/20 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 text-[#5ACFFE] hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Logo (
              {activeBrandRow === "row1" ? "Row 1" : "Row 2"})
            </button>
          </div>

          {/* Row Switcher Tabs */}
          <div className="flex gap-2 mb-4 border-b border-zinc-800 pb-3">
            <button
              type="button"
              onClick={() => setActiveBrandRow("row1")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeBrandRow === "row1"
                  ? "bg-[#0086F0]/20 border border-[#0086F0]/50 text-[#5ACFFE]"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Row 1 Logos ({editBrands.row1?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveBrandRow("row2")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeBrandRow === "row2"
                  ? "bg-[#0086F0]/20 border border-[#0086F0]/50 text-[#5ACFFE]"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              Row 2 Logos ({editBrands.row2?.length || 0})
            </button>
          </div>

          <form
            onSubmit={handleSaveBrands}
            className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 mb-6 max-h-[55vh]"
          >
            {(editBrands[activeBrandRow] || []).map((brandName, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800"
              >
                <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => {
                    const updated = { ...editBrands };
                    const list = [...(updated[activeBrandRow] || [])];
                    list[idx] = e.target.value;
                    updated[activeBrandRow] = list;
                    setEditBrands(updated);
                  }}
                  placeholder="https://res.cloudinary.com/.../logo.png"
                  className="flex-1 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...editBrands };
                    const list = (updated[activeBrandRow] || []).filter(
                      (_, i) => i !== idx,
                    );
                    updated[activeBrandRow] = list;
                    setEditBrands(updated);
                  }}
                  className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
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
              onClick={handleSaveBrands}
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </EditModalOverlay>
    </div>
  );
};

export default OurSolution;
