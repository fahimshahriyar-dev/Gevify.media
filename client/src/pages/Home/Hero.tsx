// Hero.tsx

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/background.webp';
import { Pencil } from 'lucide-react';

const Ai = lazy(() => import('../../components/animations/Ai'));
const AiMobile = lazy(() => import('../../components/animations/Ai_mobile'));

interface HeroProps {
  standalone?: boolean;
  onGoToHomeWork?: () => void;
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  isAdminMode?: boolean;
  onUpdateHero?: (title: string, subtitle: string, videoUrl: string) => Promise<void>;
}

const Hero: React.FC<HeroProps> = ({ 
  title = "Next-Gen Creative Commercial Video Production", 
  subtitle = "For e-commerce brands that refuse to blend in. Custom AI-powered videos designed to build a distinctive brand identity, capture attention, and drive measurable growth.",
  videoUrl = "https://www.youtube.com/watch?v=bSl7z00Hnug",
  isAdminMode = false,
  onUpdateHero
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Remount key to replay animations on navigation
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    setAnimKey(prev => prev + 1);
  }, []);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle);
  const [editVideoUrl, setEditVideoUrl] = useState(videoUrl);
  const [saving, setSaving] = useState(false);

  // Utility to extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
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
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateHero) return;
    setSaving(true);
    try {
      await onUpdateHero(editTitle, editSubtitle, editVideoUrl);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    // h-dvh (dynamic viewport height) instead of h-screen so mobile browser
    // chrome (address bar showing/hiding) doesn't cause layout jumps or clipping.
    // min-h-screen kept as a fallback for browsers without dvh support.
    <div className="relative w-full min-h-screen h-dvh flex flex-col items-center overflow-hidden bg-black">
      {/* Background Image — object-cover keeps it filling the box at any
          aspect ratio; object-position shifts responsively so the subject
          stays in frame on tall narrow (mobile) vs wide (desktop) screens. */}
      <img 
        src={backgroundImage} 
        alt="Background" 
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-right-top pointer-events-none select-none"
      />
      {/* Subtle overlay to keep text legible over the image on any device,
          slightly stronger at the bottom where the CTA/text block sits. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 pointer-events-none" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center w-full h-full">
        {/* Edit Button overlay directly below Admin Mode badge */}
        {isAdminMode && (
          <button
            onClick={() => {
              setEditTitle(title);
              setEditSubtitle(subtitle);
              setEditVideoUrl(videoUrl);
              setIsEditing(true);
            }}
            className="absolute top-24 right-4 sm:top-24 sm:right-6 md:top-20 md:right-10 z-50 p-2 sm:p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
            title="Edit Hero Section"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}

        {/* Hero slide-up animation */}
        <style>{`
          @keyframes hero-slide-up {
            0% {
              opacity: 0;
              transform: translateY(40px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .hero-animate {
            opacity: 0;
            animation: hero-slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .hero-delay-1 { animation-delay: 0s; }
          .hero-delay-2 { animation-delay: 0.15s; }
          .hero-delay-3 { animation-delay: 0.3s; }
          .hero-delay-4 { animation-delay: 0.45s; }
        `}</style>

        {/* ── Text/CTA block — stacked bottom-up with flex-col-reverse ──
            Get Started button -> Subtitle -> Title -> View Intro button (top-most)
            pb-* reserves room above the pinned Ai animation so text doesn't overlap it.
            Scales across 6 breakpoints (mobile -> 2xl) using arbitrary values so
            it tracks the actual size of the Ai animation at each screen width
            instead of hitting Tailwind's default spacing ceiling (pb-96). */}
        <div
          key={animKey}
          className="flex-1 w-full flex flex-col-reverse justify-end lg:justify-start items-center text-center relative group pt-34 sm:pt-28 md:pt-40 lg:pb-[24rem] xl:pb-[26rem] 2xl:pb-[28rem]"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col-reverse items-center text-center px-4 sm:px-6 lg:px-8">
            {/* CTA buttons — mt-8 = gap up to Subtitle */}
            <div className="hero-animate hero-delay-4 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate(isAdminMode ? "/admin/contact" : "/contact")}
                className="px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-semibold text-white text-xs sm:text-sm transition-all duration-200 hover:brightness-110 active:scale-95 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #2094f3ff 0%, #0f46acff 100%)',
                  boxShadow: '0 4px 24px rgba(0, 134, 240, 0.45)',
                }}
              >
                Get started
              </button>
            </div>

            {/* Sub-text — mt-2 = gap up to Title */}
            <p className="hero-animate hero-delay-3 mt-2 text-white/55 text-xs xs:text-sm sm:text-base leading-relaxed max-w-[92vw] sm:max-w-xl md:max-w-2xl">
              {subtitle}
            </p>

            {/* Headline — mt-3 = gap up to View Intro button */}
            <h1
              className="hero-animate hero-delay-2 mt-3 bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent leading-tight open-sans text-[24px] xs:text-[28px] sm:text-[36px] md:text-[40px] lg:text-[40px] xl:text-[56px] font-semibold max-w-[92vw] sm:max-w-xl md:max-w-none"
            >
              {title}
            </h1>

            {/* View Intro Button — top-most */}
            <button
              onClick={() => setIsOpen(true)}
              className="hero-animate hero-delay-1 group flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium text-white/80 border border-white/10 hover:border-[#0086F0]/50 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[#0086F0]/10 cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)' }}
            >
              <svg 
                className="w-3 h-3 text-[#5ACFFE] fill-current group-hover:scale-110 group-hover:translate-x-0.5 transition-all duration-300 flex-shrink-0"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>View Intro</span>
            </button>
          </div>
        </div>

        {/* Mobile AI animation (sm + md) */}
        <div className="flex lg:hidden absolute bottom-0 left-0 right-0 w-full z-0 justify-center pointer-events-none">
          <div className="w-full origin-bottom scale-160 xs:scale-160 sm:scale-160 md:scale-160">
            <Suspense fallback={null}>
              <AiMobile />
            </Suspense>
          </div>
        </div>

        {/* Desktop AI animation (lg+) */}
        <div className="hidden lg:flex absolute bottom-0 left-0 right-0 w-full z-0 justify-center pointer-events-none">
          <div className="w-full origin-bottom scale-[3] xs:scale-[2] sm:scale-[3] md:scale-[3] lg:scale-100 xl:scale-100">
            <Suspense fallback={null}>
              <Ai />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Edit Hero Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Edit Hero Section</h3>
            <form onSubmit={handleSave} className="flex flex-col gap-5 sm:gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Headline</label>
                <textarea
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  rows={2}
                  className="w-full p-3 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm sm:text-base focus:outline-none focus:border-[#0086F0]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sub-text</label>
                <textarea
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  rows={3}
                  className="w-full p-3 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm sm:text-base focus:outline-none focus:border-[#0086F0]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Intro Video URL (YouTube)</label>
                <input
                  type="text"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=bSl7z00Hnug"
                  className="w-full p-3 sm:p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-xs sm:text-sm"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0086F0] hover:bg-[#0073ce] text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Popup Video Player */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
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
            className="modal-animate relative w-full max-w-lg sm:max-w-2xl lg:max-w-4xl bg-neutral-900/90 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-black/60 text-white/70 hover:text-white hover:bg-black/90 transition-all border border-white/20 cursor-pointer shadow-lg"
            >
              ✕
            </button>

            {/* Embedded YouTube Video Container */}
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={getEmbedUrl(videoUrl)}
                title="Intro Video"
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

export default Hero;