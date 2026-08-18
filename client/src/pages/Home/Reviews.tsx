import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, Trash2, UserRound } from "lucide-react";
import EditModalOverlay from "../../components/EditModalOverlay";
import { gsap } from "gsap";
import type { Review } from "./Home";

interface ReviewsProps {
  reviews: Review[];
  isAdminMode?: boolean;
  onUpdateReviews?: (reviews: Review[]) => Promise<void>;
  isEditOpen?: boolean;
  onOpenEdit?: () => void;
  onCloseEdit?: () => void;
  modalScrollTop?: number;
  active?: boolean;
  onAnimationComplete?: () => void;
}

const Reviews = ({ 
  reviews = [], 
  isAdminMode = false, 
  onUpdateReviews,
  isEditOpen = false,
  onOpenEdit,
  onCloseEdit,
  modalScrollTop: _modalScrollTop = 0,
  active = false,
  onAnimationComplete
}: ReviewsProps) => {
  const [editReviews, setEditReviews] = useState<Review[]>([]);
  const [saving, setSaving] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Entrance animation: title first, then slider cards appear one by one from the bottom
  useEffect(() => {
    const getCards = () => sliderRef.current?.querySelector(".infinite-track")?.children;

    if (!active) {
      gsap.set(titleRef.current, { y: 40, opacity: 0 });
      const cards = getCards();
      if (cards) gsap.set(cards, { y: 50, opacity: 0 });
      return;
    }

    const cards = getCards();

    const tl = gsap.timeline({
      onComplete: () => {
        onAnimationComplete?.();
      },
    });

    tl.to(titleRef.current, { y: 0, opacity: 1, duration: 0.9, ease: "power2.out" });

    if (cards && cards.length > 0) {
      tl.to(cards, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" }, "-=0.4");
      // Trigger FAQ animation early as soon as the first few cards slide in
      tl.add(() => {
        onAnimationComplete?.();
      }, "-=0.6");
    } else {
      onAnimationComplete?.();
    }

    return () => {
      tl.kill();
    };
  }, [active, reviews, onAnimationComplete]);

  const startEditing = () => {
    setEditReviews(JSON.parse(JSON.stringify(reviews))); // deep copy
    onOpenEdit?.();
  };

  const handleUpdateField = (index: number, field: keyof Review, value: string) => {
    const updated = [...editReviews];
    updated[index] = { ...updated[index], [field]: value };
    setEditReviews(updated);
  };

  const handleAddReview = () => {
    setEditReviews([
      ...editReviews,
      { quote: "", avatar: "", name: "", role: "" }
    ]);
  };

  const handleDeleteReview = (index: number) => {
    const updated = editReviews.filter((_, idx) => idx !== index);
    setEditReviews(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateReviews) return;
    setSaving(true);
    try {
      await onUpdateReviews(editReviews);
      onCloseEdit?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="pt-24 sm:pt-36 lg:pt-55 bg-[#06102F] overflow-hidden relative select-none group">
      {/* Absolute Edit Button directly underneath Admin Mode badge */}
      {isAdminMode && (
        <button
          onClick={startEditing}
          className="absolute top-24 right-6 md:top-20 md:right-10 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
          title="Edit Reviews"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      {/* Faded edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-40 lg:w-64 bg-gradient-to-r from-[#06102F] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-40 lg:w-64 bg-gradient-to-l from-[#06102F] to-transparent z-10 pointer-events-none" />

      <div ref={titleRef} className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16 md:mb-20 text-center relative">
        <h2 className="bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
          Kind words from <span className="bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent">satisfied clients</span>
        </h2>
      </div>

      {/* Infinite slider track */}
      <div ref={sliderRef} className="flex w-max overflow-hidden">
        <div className="flex gap-8 pr-8 infinite-track" style={{ animationDuration: "40s" }}>
          {/* Ensure there is enough content to animate infinitely */}
          {(reviews.length > 0 ? [...reviews, ...reviews, ...reviews] : []).map((review, idx) => (
            <div
              key={idx}
              className="w-[60vw] min-[480px]:w-[340px] sm:w-[460px] md:w-[500px] lg:w-[520px] xl:w-[540px] flex flex-col justify-between p-3 sm:p-8 md:p-10 rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-300 backdrop-blur-lg shadow-2xl shrink-0 hover:bg-white/[0.05] hover:border-[#0086F0]/30 transition-all duration-300"
            >
              <p className="text-[15px] md:text-base leading-relaxed text-zinc-300/90 font-medium mb-8">
                "{review.quote}"
              </p>
              <div className="flex items-center gap-4">
                {review.avatar && review.avatar.trim() !== "" ? (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border border-zinc-700/50"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-zinc-700/50 shrink-0">
                    <UserRound className="w-6 h-6 text-zinc-900" />
                  </div>
                )}
                <div>
                  <h4 className="text-white text-sm font-semibold tracking-wide">{review.name}</h4>
                  <p className="text-zinc-500 text-xs mt-0.5">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Reviews Modal Component */}
      <EditModalOverlay isOpen={isEditOpen} onClose={onCloseEdit || (() => {})}>
        <div className="flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Edit Client Reviews</h3>
            <button
              type="button"
              onClick={handleAddReview}
              className="flex items-center gap-2 px-4 py-2 bg-[#0086F0]/20 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 text-[#5ACFFE] hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Review
            </button>
          </div>

          <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-6 max-h-[55vh]">
            {editReviews.map((review, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex flex-col gap-4 relative">
                <button
                  type="button"
                  onClick={() => handleDeleteReview(idx)}
                  className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Client Name</label>
                    <input
                      type="text"
                      required
                      value={review.name}
                      onChange={(e) => handleUpdateField(idx, "name", e.target.value)}
                      placeholder="Shia M."
                      className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Client Role</label>
                    <input
                      type="text"
                      required
                      value={review.role}
                      onChange={(e) => handleUpdateField(idx, "role", e.target.value)}
                      placeholder="JJ Imports Account Manager"
                      className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Client Quote</label>
                  <textarea
                    required
                    value={review.quote}
                    onChange={(e) => handleUpdateField(idx, "quote", e.target.value)}
                    placeholder="We were very satisfied to work with Aman..."
                    rows={3}
                    className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Avatar Path (Optional)</label>
                  <input
                    type="text"
                    value={review.avatar}
                    onChange={(e) => handleUpdateField(idx, "avatar", e.target.value)}
                    placeholder="Leave empty for default user icon"
                    className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                  />
                </div>
              </div>
            ))}
          </form>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={onCloseEdit}
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
    </section>
  );
};

export default Reviews;
