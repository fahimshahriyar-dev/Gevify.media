import React, { useState, useEffect } from "react";
import Reviews from "./Reviews";
import Faq from "./Faq";
import type { Review, FaqItem } from "./Home";

type EditPanel = "reviews" | "faqs" | null;

interface ReviewsSectionProps {
  reviews?: Review[];
  faqs?: FaqItem[];
  isAdminMode?: boolean;
  onUpdateReviews?: (reviews: Review[]) => Promise<void>;
  onUpdateFaqs?: (faqs: FaqItem[]) => Promise<void>;
  active?: boolean;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews = [],
  faqs = [],
  isAdminMode = false,
  onUpdateReviews,
  onUpdateFaqs,
  active = false
}) => {
  const [activeEdit, setActiveEdit] = useState<EditPanel>(null);
  const [faqActive, setFaqActive] = useState(false);

  const openEdit = (panel: EditPanel) => setActiveEdit(panel);
  const closeEdit = () => setActiveEdit(null);

  // Reset FAQ activation whenever the section becomes inactive
  useEffect(() => {
    if (!active) setFaqActive(false);
  }, [active]);

  useEffect(() => {
    const container = document.getElementById("reviews-section");
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

  return (
    <div className="bg-gradient-to-b from-[#06102F] to-black relative">
      <Reviews
        reviews={reviews}
        isAdminMode={isAdminMode}
        onUpdateReviews={onUpdateReviews}
        isEditOpen={activeEdit === "reviews"}
        onOpenEdit={() => openEdit("reviews")}
        onCloseEdit={closeEdit}
        active={active}
        onAnimationComplete={() => setFaqActive(true)}
      />
      <Faq
        faqs={faqs}
        isAdminMode={isAdminMode}
        onUpdateFaqs={onUpdateFaqs}
        isEditOpen={activeEdit === "faqs"}
        onOpenEdit={() => openEdit("faqs")}
        onCloseEdit={closeEdit}
        active={active && faqActive}
      />
    </div>
  );
};

export default ReviewsSection;
