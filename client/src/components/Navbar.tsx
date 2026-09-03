import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import {
  Menu,
  X,
  User,
  LogOut,
  Pencil,
  Image as ImageIcon,
} from "lucide-react";
import EditModalOverlay from "./EditModalOverlay";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

interface NavbarProps {
  whiteLogo?: boolean;
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

const Navbar = ({}: NavbarProps) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [logoInput, setLogoInput] = useState(DEFAULT_LOGO);
  const [savingLogo, setSavingLogo] = useState(false);
  const [logoMsg, setLogoMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [brandName, setBrandName] = useState(DEFAULT_FOOTER.brand);
  const [brandInput, setBrandInput] = useState(DEFAULT_FOOTER.brand);
  const [footer, setFooter] = useState<FooterData>(DEFAULT_FOOTER);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const linkClass = (section: string) => {
    const isActive =
      section === "home"
        ? path === "/" || path === "/admin/dashboard"
        : section === "work"
          ? path === "/work" || path === "/admin/work"
          : section === "about"
            ? path === "/about" || path === "/admin/about"
            : section === "solution"
              ? path === "/solution" || path === "/admin/solution"
              : section === "contact"
                ? path === "/contact" || path === "/admin/contact"
                : false;
    return isActive
      ? "text-[10px] sm:text-xs lg:text-sm font-semibold text-[#5ACFFE] transition-colors uppercase tracking-wider cursor-pointer"
      : "text-[10px] sm:text-xs lg:text-sm font-semibold text-white/70 hover:text-white transition-colors uppercase tracking-wider cursor-pointer";
  };

  const mobileLinkClass = (section: string) => {
    const isActive =
      section === "home"
        ? path === "/" || path === "/admin/dashboard"
        : section === "work"
          ? path === "/work" || path === "/admin/work"
          : section === "about"
            ? path === "/about" || path === "/admin/about"
            : section === "solution"
              ? path === "/solution" || path === "/admin/solution"
              : section === "contact"
                ? path === "/contact" || path === "/admin/contact"
                : false;
    return isActive
      ? "text-sm font-semibold text-[#5ACFFE] transition-colors uppercase tracking-wider cursor-pointer text-left w-full py-2.5 px-4 rounded-xl bg-[#0086F0]/15 border border-[#0086F0]/20"
      : "text-sm font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider cursor-pointer text-left w-full py-2.5 px-4 rounded-xl";
  };

  const isAdmin = Boolean(localStorage.getItem("adminToken"));

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const handleLogoClick = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
      return;
    }
    // Full page load so we land directly on the hero section without any scroll
    window.location.href = "/hero";
  };

  // Fetch the current logo + brand from dynamic content
  useEffect(() => {
    fetch("https://api.gevify.media/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logo) setLogoUrl(data.logo);
        if (data && data.footer) {
          setFooter({ ...DEFAULT_FOOTER, ...data.footer });
          if (data.footer.brand) {
            setBrandName(data.footer.brand);
            setBrandInput(data.footer.brand);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAll = async () => {
    if (!logoInput.trim()) {
      setLogoMsg({ type: "error", text: "Logo URL cannot be empty" });
      return;
    }
    setSavingLogo(true);
    setLogoMsg(null);
    const token = localStorage.getItem("adminToken");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const logoRes = await fetch(
        "https://api.gevify.media/api/content/logo",
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ logo: logoInput.trim() }),
        },
      );
      const logoData = await logoRes.json();
      if (!logoRes.ok) {
        throw new Error(logoData.message || "Failed to update logo");
      }
      setLogoUrl(logoData.logo);

      const newBrand = brandInput.trim() || footer.brand;
      const footerRes = await fetch(
        "https://api.gevify.media/api/content/footer",
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ footer: { ...footer, brand: newBrand } }),
        },
      );
      const footerData = await footerRes.json();
      if (!footerRes.ok) {
        throw new Error(footerData.message || "Failed to update brand");
      }
      if (footerData.footer) {
        setFooter({ ...DEFAULT_FOOTER, ...footerData.footer });
        setBrandName(footerData.footer.brand || newBrand);
      } else {
        setBrandName(newBrand);
      }

      setLogoModalOpen(false);
    } catch (err: any) {
      setLogoMsg({ type: "error", text: err.message || "Error updating" });
    } finally {
      setSavingLogo(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
    );
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  const handleNavClick = (section: string) => {
    setMenuOpen(false);
    const token = localStorage.getItem("adminToken");
    if (section === "home") {
      navigate(token ? "/admin/dashboard" : "/");
    } else if (section === "about") {
      navigate(token ? "/admin/about" : "/about");
    } else if (section === "solution") {
      navigate(token ? "/admin/solution" : "/solution");
    } else if (section === "contact") {
      navigate(token ? "/admin/contact" : "/contact");
    } else if (section === "work") {
      navigate(token ? "/admin/work" : "/work");
    }
  };

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-end px-3 sm:px-4 max-w-full">
      {/*
        NOTE: this single div is the navbar that actually renders at every
        breakpoint, including lg — the "Desktop (md+)" block further down
        is unreachable dead markup (it's `hidden` with no `md:flex`/`lg:flex`
        to ever turn it back on), so any size edits made there won't show.

        Glass effect notes:
        - bg-[#01061C]/30 tints the glass with the site's own dark brand
          color (rather than plain white/black) so text stays legible
          whether the fixed navbar is floating over the #01061C section
          or the #BDC6D5 section as the page scrolls.
        - backdrop-blur-2xl + backdrop-saturate-150 gives the frosted
          look while keeping whatever's behind it rich instead of washed
          out — this is what reads as "glass" rather than just "foggy".
        - border-white/15 gives the panel a subtle edge so it reads as
          a distinct object over either background.
        - The two-part shadow: an outer soft drop shadow for depth, plus
          an inset top highlight line that mimics light catching the top
          edge of real glass. box-shadow auto-clips to the border radius,
          so this works even with the sm:rounded-none breakpoint without
          needing overflow-hidden (which would've clipped the mobile
          dropdown menu below).
      */}
      <div
        ref={navRef}
        id="navbar-pill"
        className="relative flex items-center justify-between gap-3 w-full max-w-[400px] mx-auto md:max-w-none lg:max-w-[calc(100%-185px)] bg-[#01061C]/30 backdrop-blur-2xl backdrop-saturate-150 border border-white/15 rounded-2xl sm:rounded-none md:rounded-2xl px-3 py-2 lg:py-2.5 shadow-[0_8px_32px_rgba(1,6,28,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer"
            title="BroEditz"
          >
            <img
              src={optimizeCloudinaryUrl(logoUrl, 160)}
              alt="BroEditz logo"
              className="h-6 sm:h-7 lg:h-5 w-auto object-contain"
              fetchPriority="high"
              width="160"
              height="107"
            />
            <span className="ml-1.5 sm:ml-2 text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap text-white">
              {brandName.split(".")[0]}.
              {brandName.includes(".") && (
                <span className="bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] bg-clip-text text-transparent">
                  {brandName.split(".").slice(1).join(".")}
                </span>
              )}
            </span>
          </button>

          {isAdmin && (
            <button
              onClick={() => {
                setLogoInput(logoUrl);
                setBrandInput(brandName);
                setLogoMsg(null);
                setLogoModalOpen(true);
              }}
              className="p-1.5 rounded-full bg-[#0086F0]/20 border border-[#0086F0]/40 text-[#5ACFFE] hover:bg-[#0086F0] hover:text-white transition-all duration-200 cursor-pointer"
              title="Edit logo"
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Center page links (lg only) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-6 xl:gap-10">
          <button
            onClick={() => handleNavClick("home")}
            className={linkClass("home")}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("work")}
            className={linkClass("work")}
          >
            Work
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className={linkClass("about")}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick("solution")}
            className={linkClass("solution")}
          >
            Solution
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="lg:hidden flex items-center justify-center p-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Right actions on the right (lg only): Contact before Profile/Logout */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => handleNavClick("contact")}
            className="flex items-center px-4 py-1.5 rounded-full border border-[#0086F0]/40 bg-[#0086F0]/10 text-[#5ACFFE] hover:bg-[#0086F0]/20 hover:text-white text-xs xl:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Contact
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin/profile");
                }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0086F0]/40 bg-[#0086F0]/10 text-[#5ACFFE] hover:bg-[#0086F0]/20 hover:text-white text-xs xl:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                title="Admin Profile"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-white text-xs xl:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="absolute top-full mt-2 right-0 w-[min(80vw,280px)] bg-[#01061C]/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/15 rounded-2xl p-2 shadow-[0_8px_32px_rgba(1,6,28,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
            <button
              onClick={() => handleNavClick("home")}
              className={mobileLinkClass("home")}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("work")}
              className={mobileLinkClass("work")}
            >
              Work
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className={mobileLinkClass("about")}
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("solution")}
              className={mobileLinkClass("solution")}
            >
              Solution
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={mobileLinkClass("contact")}
            >
              Contact
            </button>

            {isAdmin && (
              <>
                <div className="my-1.5 h-px bg-white/10" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/admin/profile");
                  }}
                  className="flex items-center gap-3 text-sm font-semibold text-white/80 hover:text-white hover:bg-[#0086F0]/10 transition-colors cursor-pointer text-left w-full py-2.5 px-4 rounded-xl border border-transparent hover:border-[#0086F0]/20"
                >
                  <User className="w-4 h-4 text-[#5ACFFE]" />
                  Admin Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-sm font-semibold text-red-400 hover:text-white hover:bg-red-500/20 transition-colors cursor-pointer text-left w-full py-2.5 px-4 rounded-xl border border-transparent hover:border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Desktop (md+): centered pill with logo absolute left ── */}
      <div className="hidden absolute left-0 pl-8 top-1/2 -translate-y-1/2 items-center gap-1.5">
        <button
          onClick={handleLogoClick}
          className="flex items-center cursor-pointer"
          title="BroEditz"
        >
          <img
            src={optimizeCloudinaryUrl(logoUrl, 160)}
            alt="BroEditz logo"
            className="h-9 w-auto object-contain"
            fetchPriority="high"
            width="160"
            height="107"
          />
          <span className="ml-2 text-xl lg:text-2xl font-bold tracking-tight whitespace-nowrap text-white">
            {brandName.split(".")[0]}.
            {brandName.includes(".") && (
              <span className="bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] bg-clip-text text-transparent">
                {brandName.split(".").slice(1).join(".")}
              </span>
            )}
          </span>
        </button>

        {isAdmin && (
          <button
            onClick={() => {
              setLogoInput(logoUrl);
              setLogoMsg(null);
              setLogoModalOpen(true);
            }}
            className="p-1.5 rounded-full bg-[#0086F0]/20 border border-[#0086F0]/40 text-[#5ACFFE] hover:bg-[#0086F0] hover:text-white transition-all duration-200 cursor-pointer"
            title="Edit logo"
          >
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>

      <nav
        className="hidden items-center justify-center w-auto max-w-full bg-[#06102F]/85 backdrop-blur-md border border-white/10 rounded-full px-8 py-3.5 shadow-xl shadow-black/40"
      >
        {/* Middle Links (desktop) */}
        <div className="flex items-center gap-4 lg:gap-8">
          <button
            onClick={() => handleNavClick("home")}
            className={linkClass("home")}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("work")}
            className={linkClass("work")}
          >
            Work
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className={linkClass("about")}
          >
            About
          </button>
          <button
            onClick={() => handleNavClick("solution")}
            className={linkClass("solution")}
          >
            Solution
          </button>
          <button
            onClick={() => handleNavClick("contact")}
            className={linkClass("contact")}
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Logo edit modal (admin) */}
      <EditModalOverlay
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
      >
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">Update Logo & Brand</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Edit the logo and brand name. They update across the entire site.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5 text-[#5ACFFE]" /> Logo Image
              URL
            </label>
            <input
              type="text"
              value={logoInput}
              onChange={(e) => setLogoInput(e.target.value)}
              placeholder="https://res.cloudinary.com/.../logo.png"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0086F0] transition-colors"
            />
            {logoInput.trim() && (
              <div className="pt-2">
                <img
                  src={logoInput.trim()}
                  alt="Logo preview"
                  className="h-14 w-auto object-contain bg-white/5 border border-white/10 rounded-lg p-2"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
                  }}
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).style.opacity = "1";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-2">
              Brand Name
            </label>
            <input
              type="text"
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              placeholder="Gevify.media"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0086F0] transition-colors"
            />
          </div>

          {logoMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-medium border ${
                logoMsg.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {logoMsg.text}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setLogoModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={savingLogo || !logoInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] hover:brightness-110 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[#0086F0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingLogo ? "Saving..." : "Save Logo & Brand"}
            </button>
          </div>
        </div>
      </EditModalOverlay>
    </header>
  );
};

export default Navbar;