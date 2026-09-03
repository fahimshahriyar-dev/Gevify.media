import React, { useEffect, useState, useRef } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditModalOverlay from "../components/EditModalOverlay";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { useNavbarRightOffset } from "../hooks/useNavbarRight";

interface Section {
  title: string;
  content: string;
}

const DEFAULT_SECTIONS: Section[] = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using the services provided by Gevify.media, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you must not use our services. These terms apply to all visitors, users, and clients who access or use our platform and services.",
  },
  {
    title: "Services Description",
    content:
      "Gevify.media provides AI-powered commercial video production, creative content creation, social media video production, e-commerce product ad creatives, AI influencer development, and agency growth partnership services. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.",
  },
  {
    title: "Client Obligations",
    content:
      "Clients are responsible for providing accurate and complete information required for project execution. Timely feedback and approvals are expected to ensure project deadlines are met. Any delay in client responses may result in adjusted timelines. Clients must ensure that all content, materials, and assets provided for use in projects do not infringe upon third-party rights.",
  },
  {
    title: "Intellectual Property",
    content:
      "All final deliverables produced by Gevify.media become the property of the client upon full payment of the agreed fees. Gevify.media retains the right to showcase completed work in its portfolio and marketing materials unless otherwise agreed upon in writing. Pre-production concepts, internal tools, and AI models used in the creation process remain the intellectual property of Gevify.media.",
  },
  {
    title: "Payment Terms",
    content:
      "Payment terms are defined in individual project agreements or invoices. Unless otherwise specified, full payment is required before the final delivery of all project materials. Late payments may incur additional fees as outlined in the project agreement. Gevify.media reserves the right to pause or withhold deliverables until payment is received in full.",
  },
  {
    title: "Revisions and Changes",
    content:
      "Each project includes a defined number of revision rounds as specified in the project scope. Additional revisions beyond the agreed scope may incur extra charges. Significant changes to the project brief after work has commenced may be treated as a new project and quoted accordingly. Revision requests should be submitted in a consolidated manner to ensure efficient processing.",
  },
  {
    title: "Confidentiality",
    content:
      "Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of the business relationship. Gevify.media will not disclose client information, project details, or business strategies to any third party without prior written consent. This obligation survives the termination of the business relationship.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Gevify.media shall not be held liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the total amount paid by the client for the specific service giving rise to the claim. We are not responsible for delays or failures in performance resulting from circumstances beyond our reasonable control.",
  },
  {
    title: "Termination",
    content:
      "Either party may terminate the business relationship with written notice as outlined in the project agreement. Upon termination, the client is responsible for payment of all work completed up to the date of termination. Gevify.media reserves the right to terminate services immediately if the client breaches any terms outlined in this agreement.",
  },
  {
    title: "Governing Law",
    content:
      "These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Gevify.media operates. Any disputes arising from these terms shall be resolved through good-faith negotiation before pursuing formal legal remedies.",
  },
  {
    title: "Amendments",
    content:
      "Gevify.media reserves the right to update or modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after any modifications constitutes acceptance of the updated terms. Clients are encouraged to review these terms periodically.",
  },
  {
    title: "Contact Information",
    content:
      "For any questions or concerns regarding these Terms and Conditions, please contact us at aman.gevify@gmail.com or through our official social media channels listed on our website.",
  },
];

const DEFAULT_TITLE = "Terms and Conditions";

interface TermsAndConditionsProps {
  isAdminMode?: boolean;
}

const TermsAndConditions = ({ isAdminMode = false }: TermsAndConditionsProps) => {
  const effectiveAdmin = isAdminMode || Boolean(localStorage.getItem("adminToken"));
  const navbarRight = useNavbarRightOffset(effectiveAdmin);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [editOpen, setEditOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(DEFAULT_TITLE);
  const [draftSections, setDraftSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [saving, setSaving] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("https://api.gevify.media/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.termsAndConditions) {
          if (data.termsAndConditions.title) {
            setTitle(data.termsAndConditions.title);
          }
          if (
            Array.isArray(data.termsAndConditions.sections) &&
            data.termsAndConditions.sections.length
          ) {
            setSections(data.termsAndConditions.sections);
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
  }, [title, sections]);

  const openEdit = () => {
    setDraftTitle(title);
    setDraftSections(JSON.parse(JSON.stringify(sections)));
    setEditOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch(
        "https://api.gevify.media/api/content/terms-and-conditions",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            termsAndConditions: { title: draftTitle, sections: draftSections },
          }),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (data.termsAndConditions) {
        if (data.termsAndConditions.title) {
          setTitle(data.termsAndConditions.title);
        }
        if (
          Array.isArray(data.termsAndConditions.sections) &&
          data.termsAndConditions.sections.length
        ) {
          setSections(data.termsAndConditions.sections);
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

      {effectiveAdmin && (
        <button
          onClick={openEdit}
          className="fixed top-24 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
          style={{ right: navbarRight }}
          title="Edit Terms and Conditions Page"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      <main className="w-full px-3 sm:px-4 pt-32 sm:pt-36 pb-24 relative">
        <div className="w-full max-w-[400px] mx-auto md:max-w-none lg:max-w-[calc(100%-185px)] flex flex-col gap-10">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-5xl font-black mb-4 bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent tracking-tight font-sans text-left"
          >
            {title}
          </h1>

          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-sans text-left -mt-4">
            Last updated: September 1, 2026
          </p>

          <div ref={contentRef} className="flex flex-col gap-6 text-left">
            {sections.map((section, i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 pb-6 border-b border-white/10 last:border-0"
              >
                <h2 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight font-sans text-left">
                  <span className="mr-2 text-[#0086F0]/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <p className="text-zinc-400 text-[11px] sm:text-xs lg:text-sm leading-relaxed font-sans text-left">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer isAdminMode={effectiveAdmin} />

      <EditModalOverlay isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col max-h-[80vh]">
          <h3 className="text-xl font-bold text-white mb-4">
            Edit Terms and Conditions Content
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
                  Sections
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    setDraftSections([...draftSections, { title: "", content: "" }])
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-[#0086F0]/20 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 text-[#5ACFFE] hover:text-white rounded-full text-xs font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Section
                </button>
              </div>

              {draftSections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0086F0]/20 text-[#5ACFFE] text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h5 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      Section {idx + 1}
                    </h5>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftSections(
                          draftSections.filter((_, i) => i !== idx),
                        )
                      }
                      className="ml-auto p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Remove Section"
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
                      value={section.title}
                      onChange={(e) => {
                        const updated = [...draftSections];
                        updated[idx] = {
                          ...updated[idx],
                          title: e.target.value,
                        };
                        setDraftSections(updated);
                      }}
                      className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-zinc-400">
                      Content
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) => {
                        const updated = [...draftSections];
                        updated[idx] = {
                          ...updated[idx],
                          content: e.target.value,
                        };
                        setDraftSections(updated);
                      }}
                      rows={4}
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

export default TermsAndConditions;
