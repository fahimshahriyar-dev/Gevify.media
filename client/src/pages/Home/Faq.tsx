import { useEffect, useRef, useState } from "react";
import { ChevronDown, Pencil, Plus, Trash2 } from "lucide-react";
import EditModalOverlay from "../../components/EditModalOverlay";
import { gsap } from "gsap";
import type { FaqItem } from "./Home";

interface FaqProps {
  faqs: FaqItem[];
  isAdminMode?: boolean;
  onUpdateFaqs?: (faqs: FaqItem[]) => Promise<void>;
  isEditOpen?: boolean;
  onOpenEdit?: () => void;
  onCloseEdit?: () => void;
  modalScrollTop?: number;
  active?: boolean;
}

const Faq = ({
  faqs = [],
  isAdminMode = false,
  onUpdateFaqs,
  isEditOpen = false,
  onOpenEdit,
  onCloseEdit,
  modalScrollTop: _modalScrollTop = 0,
  active = false,
}: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Edit State
  const [editFaqs, setEditFaqs] = useState<FaqItem[]>([]);
  const [saving, setSaving] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Entrance animation: title first, then FAQ items appear one by one from the bottom
  useEffect(() => {
    if (!active) {
      gsap.set(titleRef.current, { y: 40, opacity: 0 });
      if (listRef.current)
        gsap.set(listRef.current.children, { y: 50, opacity: 0 });
      return;
    }

    const tl = gsap.timeline();
    tl.to(titleRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
    });
    if (listRef.current && listRef.current.children.length > 0) {
      tl.to(
        listRef.current.children,
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power2.out" },
        "-=0.4",
      );
    }

    return () => {
      tl.kill();
    };
  }, [active, faqs]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const startEditing = () => {
    setEditFaqs(JSON.parse(JSON.stringify(faqs))); // deep copy
    onOpenEdit?.();
  };

  const handleUpdateField = (
    index: number,
    field: keyof FaqItem,
    value: string,
  ) => {
    const updated = [...editFaqs];
    updated[index] = { ...updated[index], [field]: value };
    setEditFaqs(updated);
  };

  const handleAddFaq = () => {
    setEditFaqs([...editFaqs, { question: "", answer: "" }]);
  };

  const handleDeleteFaq = (index: number) => {
    const updated = editFaqs.filter((_, idx) => idx !== index);
    setEditFaqs(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateFaqs) return;
    setSaving(true);
    try {
      await onUpdateFaqs(editFaqs);
      onCloseEdit?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-[#06102F] to-black relative group">
      {/* Absolute Edit Button directly underneath Admin Mode badge */}
      {isAdminMode && (
        <button
          onClick={startEditing}
          className="absolute top-24 right-6 md:top-20 md:right-10 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
          title="Edit FAQ"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
        <div
          ref={titleRef}
          className="flex justify-center items-center mb-10 sm:mb-16 relative"
        >
          <h2 className="text-center text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent tracking-tight px-4 leading-tight">
            Frequently asked questions
          </h2>
        </div>

        <div ref={listRef} className="w-full flex flex-col gap-3">
          {faqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-lg shadow-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-[#0086F0]/30 ${
                  isOpen ? "bg-white/[0.05] border-[#0086F0]/30" : ""
                }`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center gap-5 px-7 py-5 text-left text-white select-none cursor-pointer"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-zinc-300" : ""
                    }`}
                  />
                  <span className="text-[15px] md:text-base font-semibold tracking-wide">
                    {item.question}
                  </span>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[300px]" : "max-h-0"
                  }`}
                >
                  <p className="px-5 sm:px-7 pb-6 text-sm md:text-[15px] leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit FAQs Modal Component */}
      <EditModalOverlay isOpen={isEditOpen} onClose={onCloseEdit || (() => {})}>
        <div className="flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              Edit Frequently Asked Questions
            </h3>
            <button
              type="button"
              onClick={handleAddFaq}
              className="flex items-center gap-2 px-4 py-2 bg-[#0086F0]/20 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 text-[#5ACFFE] hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>

          <form
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2 mb-6 max-h-[55vh]"
          >
            {editFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex flex-col gap-4 relative"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(idx)}
                  className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors cursor-pointer"
                  title="Delete FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Question
                  </label>
                  <input
                    type="text"
                    required
                    value={faq.question}
                    onChange={(e) =>
                      handleUpdateField(idx, "question", e.target.value)
                    }
                    placeholder="What types of videos do you create?"
                    className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Answer
                  </label>
                  <textarea
                    required
                    value={faq.answer}
                    onChange={(e) =>
                      handleUpdateField(idx, "answer", e.target.value)
                    }
                    placeholder="We are an all-in-one next-generation video production agency..."
                    rows={3}
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

export default Faq;
