import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EditModalOverlay from "../components/EditModalOverlay";
import PhoneNumberInput, {
  isValidWhatsAppNumber,
} from "../components/PhoneNumberInput";
import { Mail, Pencil } from "lucide-react";
import { gsap } from "gsap";
import contactBg from "../assets/images/contact_bg.png";

interface ContactProps {
  isAdminMode?: boolean;
}

interface ContactData {
  title: string;
  company: string;
  email: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  youtube: string;
}

const DEFAULT_LOGO =
  "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786910291/logo_o11gn5.png";

const DEFAULT_CONTACT: ContactData = {
  title: "Ready When You Are",
  company: "Gevify.media",
  email: "aman.gevify@gmail.com",
  facebook: "https://www.facebook.com/Gevify.Media",
  instagram: "https://www.instagram.com/gevifymedia",
  whatsapp: "https://wa.me/8801893257647",
  youtube: "https://www.youtube.com/@gevifymedia",
};

const Contact: React.FC<ContactProps> = ({ isAdminMode = false }) => {
  const navigate = useNavigate();
  const [contact, setContact] = useState<ContactData>(DEFAULT_CONTACT);
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<ContactData>(DEFAULT_CONTACT);
  const [draftLogo, setDraftLogo] = useState(DEFAULT_LOGO);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [contactMethod, setContactMethod] = useState<
    "whatsapp" | "email"
  >("email");
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for entrance animation targets
  const brandRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const defaultTitleWidth = useRef<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    videoCount: "",
    videoType: "",
    budget: "",
    contact: "",
  });

  // Load dynamic contact content
  useEffect(() => {
    fetch("http://localhost:5000/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.logo) {
          setLogo(data.logo);
        }
        if (data.contact) {
          setContact({
            title: data.contact.title || DEFAULT_CONTACT.title,
            company: data.contact.company || DEFAULT_CONTACT.company,
            email: data.contact.email || DEFAULT_CONTACT.email,
            facebook: data.contact.facebook || DEFAULT_CONTACT.facebook,
            instagram: data.contact.instagram || DEFAULT_CONTACT.instagram,
            whatsapp: data.contact.whatsapp || DEFAULT_CONTACT.whatsapp,
            youtube: data.contact.youtube || DEFAULT_CONTACT.youtube,
          });
        }
      })
      .catch(console.error);
  }, []);

  // Entrance animation: text elements rise from the bottom, scroll button fades in
  useEffect(() => {
    const fromBottom = [
      brandRef.current,
      contactRef.current,
      titleRef.current,
      copyrightRef.current,
    ].filter(Boolean) as HTMLElement[];

    const tl = gsap.timeline({ delay: 0 });
    fromBottom.forEach((el, i) => {
      tl.fromTo(
        el,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power1.out",
          delay: i * 0.02,
        },
      );
    });
    if (scrollRef.current) {
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" },
        "-=0.1",
      );
    }
  }, []);

  // Scale the whole stack (Div 1 + Div 2 + Div 3) proportionally to the title width
  useLayoutEffect(() => {
    const el = titleRef.current;
    const stack = stackRef.current;
    if (!el || !stack) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const textWidth = range.getBoundingClientRect().width;
    if (defaultTitleWidth.current === null) {
      defaultTitleWidth.current = textWidth;
    }
    const scale = Math.max(
      0.5,
      Math.min(1, textWidth / defaultTitleWidth.current),
    );
    stack.style.transform = `scale(${scale})`;
  }, [contact.title]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const openEdit = () => {
    setDraft(contact);
    setDraftLogo(logo);
    setSaveError(null);
    setEditOpen(true);
  };

  const updateDraft = (field: keyof ContactData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/content/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contact: draft }),
      });
      if (!res.ok) {
        throw new Error(res.status === 401 ? "Session expired. Please log in again." : "Save failed");
      }
      const data = await res.json();
      if (data.contact) {
        setContact({
          title: data.contact.title || draft.title,
          company: data.contact.company || draft.company,
          email: data.contact.email || draft.email,
          facebook: data.contact.facebook || draft.facebook,
          instagram: data.contact.instagram || draft.instagram,
          whatsapp: data.contact.whatsapp || draft.whatsapp,
          youtube: data.contact.youtube || draft.youtube,
        });
      }
      setEditOpen(false);

      // Save the logo separately so a logo failure doesn't block the main save
      if (draftLogo.trim() && draftLogo.trim() !== logo) {
        try {
          const logoRes = await fetch("http://localhost:5000/api/content/logo", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ logo: draftLogo.trim() }),
          });
          if (logoRes.ok) {
            const logoData = await logoRes.json();
            if (logoData.logo) setLogo(logoData.logo);
          }
        } catch (err) {
          console.error(err);
        }
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Listen for wheel events to toggle sections
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Debounce to prevent rapid toggling
      if (scrollTimeout.current) return;

      // Don't toggle sections while the country dropdown is open
      if (document.querySelector(".flag-dropdown.open")) return;

      if (e.deltaY > 0 && !showForm) {
        // Scroll down → show form
        setShowForm(true);
      } else if (e.deltaY < 0 && showForm) {
        // Scroll up → show title
        setShowForm(false);
      }

      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null;
      }, 600);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [showForm]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    if (!formData.name || !formData.videoCount || !formData.videoType || !formData.budget || !contactMethod || !formData.contact) {
      setSubmitError("Please fill out all fields.");
      return;
    }
    if (contactMethod === "whatsapp" && !isValidWhatsAppNumber(formData.contact)) {
      setSubmitError("Please enter a valid WhatsApp number.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          contactMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      setSubmitSuccess(true);
      setFormData({ name: "", videoCount: "", videoType: "", budget: "", contact: "" });
      setContactMethod("email");
    } catch (err: any) {
      setSubmitError(err.message || "Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#06102F] overflow-hidden select-none text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${contactBg})` }}
      />
      <Navbar />

      {/* Admin bar + Edit button */}
      {isAdminMode && (
        <>
          <div className="fixed top-6 right-6 md:right-10 z-[100] flex flex-col items-end gap-2">
            <div className="hidden md:flex items-center gap-3 bg-[#06102F]/90 backdrop-blur-md border border-[#0086F0]/40 rounded-full px-5 py-3 shadow-xl shadow-black/40">
              <button
                onClick={() => navigate("/admin/profile")}
                className="flex items-center gap-2 text-xs font-bold text-[#5ACFFE] uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#0086F0] animate-ping" />
                Admin Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-[#0086F0]/25 rounded-full px-3 py-1 transition-all cursor-pointer border border-transparent hover:border-[#0086F0]/30"
              >
                Logout
              </button>
            </div>
          </div>
          <button
            onClick={openEdit}
            className="fixed top-24 right-6 md:top-20 md:right-10 z-50 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
            title="Edit Contact Page"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — Title Section (visible by default)
          ═══════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-10 w-full mx-auto px-4 sm:px-10 lg:px-16 lg:max-w-[1400px] pointer-events-none flex flex-col justify-center"
        style={{
          opacity: showForm ? 0 : 1,
          transform: showForm ? "translateY(-60px)" : "translateY(0)",
          transition:
            "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: showForm ? "none" : "auto",
        }}
      >
        {/* Scalable stack: Div 1 + Div 2 + Div 3 */}
        <div
          ref={stackRef}
          className="flex flex-col"
          style={{ transformOrigin: "center center" }}
        >
          {/* Div 1: Brand Logo + Name (left) & Contact Info (right) */}
          <div className="flex items-end justify-between w-full pointer-events-auto">
          {/* Left: Brand Logo & Name */}
          <div ref={brandRef} className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <img
              src={logo}
              alt={contact.company}
              className="h-8 sm:h-9 w-auto object-contain shrink-0"
            />
            <span className="text-lg sm:text-xl font-bold tracking-tight truncate">
              {contact.company.split(".")[0]}.<span className="text-[#5ACFFE]">{contact.company.includes(".") ? contact.company.split(".")[1] : ""}</span>
            </span>
          </div>

          {/* Right: Email & Social Links */}
          <div ref={contactRef} className="flex flex-col items-end gap-2 text-right min-w-0">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-zinc-400">
              <span>For queries:</span>
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm sm:text-base font-semibold text-white hover:text-[#5ACFFE] transition-colors break-all"
            >
              {contact.email}
            </a>
            <div className="flex items-center gap-3 sm:gap-4 mt-1">
              <a
                href={contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                title="Facebook"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                title="Instagram"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 fill-none stroke-current"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                </svg>
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                title="WhatsApp"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={contact.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                title="YouTube"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.556A3.003 3.003 0 00.5 6.163C0 8.03 0 12 0 12s0 3.97.5 5.837a3.003 3.003 0 002.11 2.107C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.556a3.003 3.003 0 002.11-2.107C24 15.97 24 12 24 12s0-3.97-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Div 2: Main Title */}
        <h1
          ref={titleRef}
          className="text-[11vw] sm:text-[100px] lg:text-[140px] font-bold tracking-tighter bg-gradient-to-b from-[#333] to-[#c0c0c0] bg-clip-text text-transparent leading-none text-center pointer-events-auto whitespace-nowrap pb-[0.15em]"
        >
          {contact.title}
        </h1>

        {/* Div 3: All Rights (left) */}
        <p ref={copyrightRef} className="text-xs sm:text-sm text-zinc-500 font-medium text-left pointer-events-auto">
          © All Rights Reserved |{" "}
          <span className="text-zinc-300 font-semibold">{contact.company}</span> 2026 | Designed & Developed by Fahim Shahriyar Mugdho
        </p>
        </div>

        {/* Scroll Down Indicator — Bottom Center */}
        <div ref={scrollRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto lg:bottom-16">
          <span className="text-xs text-zinc-500 tracking-[0.2em] uppercase font-medium">
            Scroll Down
          </span>
          <svg
            className="w-5 h-5 text-zinc-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            style={{
              animation: "contact-bounce 1.8s ease-in-out infinite",
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Bounce animation keyframes */}
        <style>{`
          @keyframes contact-bounce {
            0%, 100% { transform: translateY(0); opacity: 0.5; }
            50% { transform: translateY(8px); opacity: 1; }
          }
        `}</style>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — Contact Form (revealed on scroll down)
          ═══════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 z-10 overflow-y-auto"
        style={{
          opacity: showForm ? 1 : 0,
          transform: showForm ? "translateY(0)" : "translateY(60px)",
          transition:
            "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: showForm ? "auto" : "none",
        }}
      >
        <div className="min-h-full flex items-center justify-center py-24 sm:py-28">
          <div className="w-full max-w-[700px] px-5 sm:px-10 space-y-8 sm:space-y-10">
            {/* Field 1 — Name */}
            <div className="space-y-3">
              <label className="text-base sm:text-lg font-medium text-white">
                What's your name? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your answer here..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
              />
            </div>

            {/* Field 2 — Video Count */}
            <div className="space-y-3">
              <label className="text-base sm:text-lg font-medium text-white">
                How many videos do you need?{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your answer here..."
                value={formData.videoCount}
                onChange={(e) => handleInputChange("videoCount", e.target.value)}
                className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
              />
            </div>

            {/* Field 3 — Video Type */}
            <div className="space-y-3">
              <label className="text-base sm:text-lg font-medium text-white">
                What kind of video do you need?{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your answer here..."
                value={formData.videoType}
                onChange={(e) => handleInputChange("videoType", e.target.value)}
                className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
              />
            </div>

            {/* Field 4 — Budget */}
            <div className="space-y-3">
              <label className="text-base sm:text-lg font-medium text-white">
                What is your budget? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Your answer here..."
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
              />
            </div>

            {/* Field 5 — Contact Method */}
            <div className="space-y-3">
              <label className="text-base sm:text-lg font-medium text-white flex items-center gap-1.5 flex-wrap">
                <span>Enter your</span>
                <button
                  type="button"
                  onClick={() => setContactMethod("email")}
                  className={`transition-colors duration-200 cursor-pointer outline-none ${
                    contactMethod === "email"
                      ? "text-[#5ACFFE] font-semibold underline underline-offset-4 decoration-[#5ACFFE]"
                      : "text-zinc-500 hover:text-zinc-300 font-normal"
                  }`}
                >
                  Email
                </button>
                <span className="text-zinc-500 font-normal">or</span>
                <button
                  type="button"
                  onClick={() => setContactMethod("whatsapp")}
                  className={`transition-colors duration-200 cursor-pointer outline-none ${
                    contactMethod === "whatsapp"
                      ? "text-green-500 font-semibold underline underline-offset-4 decoration-green-500"
                      : "text-zinc-500 hover:text-zinc-300 font-normal"
                  }`}
                >
                  WhatsApp
                </button>
                <span className="text-red-500">*</span>
              </label>

              {contactMethod === "whatsapp" ? (
                <PhoneNumberInput
                  value={formData.contact}
                  onChange={(v) => handleInputChange("contact", v ?? "")}
                  placeholder="Enter your WhatsApp number..."
                />
              ) : (
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
                />
              )}
            </div>

            {/* Error / Success feedback messages */}
            {submitError && (
              <p className="text-sm font-semibold text-red-500">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-sm font-semibold text-green-400">
                Your application has been submitted successfully!
              </p>
            )}

            {/* Submit Button */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] text-white font-semibold text-sm tracking-wide hover:shadow-[0_0_25px_rgba(0,134,240,0.4)] hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModalOverlay isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Edit Contact Content</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Logo URL</label>
                <input
                  type="text"
                  value={draftLogo}
                  onChange={(e) => setDraftLogo(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../logo.png"
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Title</label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => updateDraft("title", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={draft.company}
                  onChange={(e) => updateDraft("company", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                <input
                  type="text"
                  value={draft.email}
                  onChange={(e) => updateDraft("email", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">WhatsApp URL</label>
                <input
                  type="text"
                  value={draft.whatsapp}
                  onChange={(e) => updateDraft("whatsapp", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Facebook URL</label>
                <input
                  type="text"
                  value={draft.facebook}
                  onChange={(e) => updateDraft("facebook", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Instagram URL</label>
                <input
                  type="text"
                  value={draft.instagram}
                  onChange={(e) => updateDraft("instagram", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">YouTube URL</label>
                <input
                  type="text"
                  value={draft.youtube}
                  onChange={(e) => updateDraft("youtube", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
            </div>
            {saveError && (
              <p className="text-sm text-red-400 font-medium">{saveError}</p>
            )}
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

export default Contact;
