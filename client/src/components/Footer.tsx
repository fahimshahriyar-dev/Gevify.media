import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditModalOverlay from "./EditModalOverlay";
import PhoneNumberInput, {
  isValidWhatsAppNumber,
} from "./PhoneNumberInput";
import { Pencil, Image as ImageIcon } from "lucide-react";
import footerBg from "../assets/images/footer_bg.jpg";

interface FooterProps {
  isAdminMode?: boolean;
}

const DEFAULT_LOGO =
  "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786910291/logo_o11gn5.png";

interface FooterData {
  brand: string;
  description: string;
  email: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  youtube: string;
}

const DEFAULT_FOOTER: FooterData = {
  brand: "Gevify.media",
  description:
    "Where creativity meets intelligent production. Gevify.media crafts premium AI-powered commercial videos that elevate brands, inspire audiences, and deliver real business impact.",
  email: "aman.gevify@gmail.com",
  whatsapp: "https://wa.me/8801893257647",
  facebook: "https://www.facebook.com/Gevify.Media",
  instagram: "https://www.instagram.com/gevifymedia",
  youtube: "https://www.youtube.com/@gevifymedia",
};

const Footer = ({ isAdminMode = false }: FooterProps) => {
  const [footer, setFooter] = useState<FooterData>(DEFAULT_FOOTER);
  const [logo, setLogo] = useState(DEFAULT_LOGO);
  const [draftLogo, setDraftLogo] = useState(DEFAULT_LOGO);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState<FooterData>(DEFAULT_FOOTER);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    videoCount: "",
    videoType: "",
    budget: "",
    contact: "",
  });

  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email">(
    "email",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Load dynamic footer content
  useEffect(() => {
    fetch("https://api.gevify.media/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data.logo) setLogo(data.logo);
        if (data.footer) {
          setFooter({
            brand: data.footer.brand || DEFAULT_FOOTER.brand,
            description: data.footer.description || DEFAULT_FOOTER.description,
            email: data.footer.email || DEFAULT_FOOTER.email,
            whatsapp: data.footer.whatsapp || DEFAULT_FOOTER.whatsapp,
            facebook: data.footer.facebook || DEFAULT_FOOTER.facebook,
            instagram: data.footer.instagram || DEFAULT_FOOTER.instagram,
            youtube: data.footer.youtube || DEFAULT_FOOTER.youtube,
          });
        }
      })
      .catch(console.error);
  }, []);

  const openEdit = () => {
    setDraft(footer);
    setDraftLogo(logo);
    setEditOpen(true);
  };

  const updateDraft = (field: keyof FooterData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("https://api.gevify.media/api/content/footer", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ footer: draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (data.footer) {
        setFooter({
          brand: data.footer.brand || draft.brand,
          description: data.footer.description || draft.description,
          email: data.footer.email || draft.email,
          whatsapp: data.footer.whatsapp || draft.whatsapp,
          facebook: data.footer.facebook || draft.facebook,
          instagram: data.footer.instagram || draft.instagram,
          youtube: data.footer.youtube || draft.youtube,
        });
      }

      if (draftLogo.trim()) {
        const logoRes = await fetch("https://api.gevify.media/api/content/logo", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ logo: draftLogo.trim() }),
        });
        if (!logoRes.ok) throw new Error("Failed to save logo");
        const logoData = await logoRes.json();
        if (logoData.logo) setLogo(logoData.logo);
      }

      setEditOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.videoCount ||
      !formData.videoType ||
      !formData.budget ||
      !contactMethod ||
      !formData.contact
    ) {
      setSubmitError("Please fill out all fields.");
      return;
    }
    if (
      contactMethod === "whatsapp" &&
      !isValidWhatsAppNumber(formData.contact)
    ) {
      setSubmitError("Please enter a valid WhatsApp number.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const response = await fetch("https://api.gevify.media/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          contactMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        videoCount: "",
        videoType: "",
        budget: "",
        contact: "",
      });
      setContactMethod("email");
    } catch (err: any) {
      setSubmitError(err.message || "Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer
      className="relative text-white overflow-hidden bg-cover bg-center lg:bg-top border-t-0 border-none"
      style={{
        backgroundImage: `url(${footerBg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        borderTop: "none",
        border: "none",
      }}
    >
      {/* Background dark overlay */}
      <div className="absolute inset-0 bg-black/85" />

      {/* Edit Footer Button */}
      {isAdminMode && (
        <button
          onClick={openEdit}
          className="absolute top-6 right-6 z-20 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
          title="Edit Footer"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      {/* Main Footer Container */}
      <div className="relative z-10 max-w-[1770px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-12">
        {/* ── TOP SECTION — 3-Column Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 pb-12 md:pb-16 border-b border-white/10">
          {/* LEFT — Title & Subtitle */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Brand logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-bold tracking-tight">
                {footer.brand.split(".")[0]}.
                {footer.brand.includes(".") && (
                  <span className="bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] bg-clip-text text-transparent">
                    {footer.brand.split(".").slice(1).join(".")}
                  </span>
                )}
              </span>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              {footer.description}
            </p>
          </div>

          {/* CENTER — Navigation Links */}
          <div className="flex justify-start md:justify-center">
            <div className="space-y-4">
              <h4 className="text-[15px] font-semibold text-white tracking-wider uppercase">
                Quick Links
              </h4>
              <div className="flex flex-col gap-2.5 text-[13.5px] text-zinc-400">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Link
                    to="/about"
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    About
                  </Link>
                  <span className="text-zinc-700">|</span>
                  <Link
                    to="/work"
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    Work
                  </Link>
                  <span className="text-zinc-700">|</span>
                  <Link
                    to="/contact"
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Link
                    to="#"
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    Terms and Conditions
                  </Link>
                  <span className="text-zinc-700">|</span>
                  <Link
                    to="#"
                    className="hover:text-orange-500 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Email & Social Media */}
          <div className="flex flex-col items-start md:items-end space-y-6">
            {/* Email */}
            <div className="space-y-2 min-w-0">
              <h4 className="text-[15px] font-semibold text-white tracking-wider uppercase md:text-right">
                Get in Touch
              </h4>
              <a
                href={`mailto:${footer.email}`}
                className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-colors duration-200 text-sm break-all"
              >
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="min-w-0 break-all">{footer.email}</span>
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href={footer.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 text-zinc-400 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href={footer.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 text-zinc-400 hover:text-white"
              >
                <svg
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a
                href={footer.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 text-zinc-400 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href={footer.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 text-zinc-400 hover:text-white"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.556A3.003 3.003 0 00.5 6.163C0 8.03 0 12 0 12s0 3.97.5 5.837a3.003 3.003 0 002.11 2.107C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.556a3.003 3.003 0 002.11-2.107C24 15.97 24 12 24 12s0-3.97-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── MIDDLE SECTION — Contact Form Side-by-Side ── */}
        <div className="py-14 border-b border-white/10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-10">
              {/* Field 1 — Name */}
              <div className="space-y-3">
                <label className="text-sm sm:text-base font-medium text-white block">
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
                <label className="text-sm sm:text-base font-medium text-white block">
                  How many videos do you need?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your answer here..."
                  value={formData.videoCount}
                  onChange={(e) =>
                    handleInputChange("videoCount", e.target.value)
                  }
                  className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
                />
              </div>

              {/* Field 3 — Video Type */}
              <div className="space-y-3">
                <label className="text-sm sm:text-base font-medium text-white block">
                  What kind of video do you need?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Your answer here..."
                  value={formData.videoType}
                  onChange={(e) =>
                    handleInputChange("videoType", e.target.value)
                  }
                  className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
                />
              </div>

              {/* Field 4 — Budget */}
              <div className="space-y-3">
                <label className="text-sm sm:text-base font-medium text-white block">
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

              {/* Field 5 — Contact Method & Details */}
              <div className="space-y-3">
                <label className="text-sm sm:text-base font-medium text-white flex items-center gap-1.5 flex-wrap">
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
                    onChange={(v) =>
                      handleInputChange("contact", v ?? "")
                    }
                    placeholder="Enter your WhatsApp number..."
                  />
                ) : (
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={formData.contact}
                    onChange={(e) =>
                      handleInputChange("contact", e.target.value)
                    }
                    className="w-full bg-transparent border-b border-zinc-700 focus:border-[#0086F0] outline-none text-sm text-zinc-300 placeholder-zinc-600 pb-3 transition-colors duration-300"
                  />
                )}
              </div>

              {/* Slot 6 — Submit Button */}
              <div className="flex flex-col justify-end pt-4 md:pt-0">
                {submitError && (
                  <p className="text-xs font-semibold text-red-500 mb-2">
                    {submitError}
                  </p>
                )}
                {submitSuccess && (
                  <p className="text-xs font-semibold text-green-400 mb-2">
                    Your application has been submitted successfully!
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full text-white font-semibold text-sm tracking-wide hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #2094f3ff 0%, #0f46acff 100%)",
                    boxShadow: "0 4px 24px rgba(0, 134, 240, 0.45)",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── BOTTOM SECTION — Credits ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 text-[12.5px] text-zinc-500">
          <div className="space-y-1.5 text-center md:text-left leading-relaxed">
            <p>© All Rights Reserved | {footer.brand} 2026 | Designed & Developed by Fahim Shahriyar Mugdho</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModalOverlay isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white">Edit Footer Content</h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Logo URL
              </label>
              <input
                type="text"
                value={draftLogo}
                onChange={(e) => setDraftLogo(e.target.value)}
                placeholder="https://res.cloudinary.com/.../logo.png"
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Brand Name
              </label>
              <input
                type="text"
                value={draft.brand}
                onChange={(e) => updateDraft("brand", e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={draft.description}
                onChange={(e) => updateDraft("description", e.target.value)}
                rows={4}
                className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm leading-relaxed resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="text"
                  value={draft.email}
                  onChange={(e) => updateDraft("email", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  WhatsApp URL
                </label>
                <input
                  type="text"
                  value={draft.whatsapp}
                  onChange={(e) => updateDraft("whatsapp", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Facebook URL
                </label>
                <input
                  type="text"
                  value={draft.facebook}
                  onChange={(e) => updateDraft("facebook", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={draft.instagram}
                  onChange={(e) => updateDraft("instagram", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={draft.youtube}
                  onChange={(e) => updateDraft("youtube", e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-[#0086F0] text-sm font-medium"
                />
              </div>
            </div>
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
    </footer>
  );
};

export default Footer;
