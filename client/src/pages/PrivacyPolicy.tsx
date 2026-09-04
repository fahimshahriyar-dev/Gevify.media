import React, { useEffect, useState, useRef } from "react";
import { API_BASE } from "../config";

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
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us, such as your name, email address, WhatsApp number, video production requirements, budget details, and any other information you choose to provide through our contact forms or during project discussions. We also automatically collect certain technical data including your IP address, browser type, device information, and browsing behavior on our website.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information we collect to respond to your inquiries, provide and improve our services, communicate with you about projects and updates, process transactions, send marketing communications with your consent, analyze website usage to enhance user experience, and comply with legal obligations.",
  },
  {
    title: "Information Sharing",
    content:
      "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided those parties agree to keep this information confidential. We may also disclose your information when required by law or to protect our rights and safety.",
  },
  {
    title: "Cookies and Tracking",
    content:
      "Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us understand how you use our site. You can control cookie preferences through your browser settings. Disabling cookies may affect certain functionalities of our website.",
  },
  {
    title: "Data Security",
    content:
      "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. While we strive to protect your data, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Project-related data is retained for the duration of the business relationship and for a reasonable period afterward to address any ongoing obligations.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, update, or delete your personal information at any time. You may also opt out of receiving marketing communications from us by following the unsubscribe instructions in our emails or contacting us directly. To exercise any of these rights, please reach out to us at aman.gevify@gmail.com.",
  },
  {
    title: "Third-Party Links",
    content:
      "Our website may contain links to third-party websites, including our social media profiles on Facebook, Instagram, YouTube, and WhatsApp. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.",
  },
  {
    title: "AI-Generated Content",
    content:
      "Gevify.media utilizes artificial intelligence technologies in content production. While we ensure all AI-generated content adheres to our quality standards, clients should be aware that AI tools may be employed in the creative process. Specific details about AI usage in individual projects are discussed during project planning and agreement phases.",
  },
  {
    title: "Children's Privacy",
    content:
      "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without verification of parental consent, we will take steps to delete that information promptly.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your information.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at aman.gevify@gmail.com or reach out through our official social media channels listed on our website.",
  },
];

const DEFAULT_TITLE = "Privacy Policy";

interface PrivacyPolicyProps {
  isAdminMode?: boolean;
}

const PrivacyPolicy = ({ isAdminMode = false }: PrivacyPolicyProps) => {
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
    fetch(`${API_BASE}/api/content`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.privacyPolicy) {
          if (data.privacyPolicy.title) {
            setTitle(data.privacyPolicy.title);
          }
          if (
            Array.isArray(data.privacyPolicy.sections) &&
            data.privacyPolicy.sections.length
          ) {
            setSections(data.privacyPolicy.sections);
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
        `${API_BASE}/api/content/privacy-policy`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            privacyPolicy: { title: draftTitle, sections: draftSections },
          }),
        },
      );
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (data.privacyPolicy) {
        if (data.privacyPolicy.title) {
          setTitle(data.privacyPolicy.title);
        }
        if (
          Array.isArray(data.privacyPolicy.sections) &&
          data.privacyPolicy.sections.length
        ) {
          setSections(data.privacyPolicy.sections);
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
          title="Edit Privacy Policy Page"
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
            Edit Privacy Policy Content
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

export default PrivacyPolicy;
