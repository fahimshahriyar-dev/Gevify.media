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

interface NavbarProps {
  whiteLogo?: boolean;
}

const DEFAULT_LOGO =
  "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786910291/logo_o11gn5.png";

const Navbar = ({}: NavbarProps) => {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [logoInput, setLogoInput] = useState(DEFAULT_LOGO);
  const [savingLogo, setSavingLogo] = useState(false);
  const [logoMsg, setLogoMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
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
            : section === "contact"
              ? path === "/contact" || path === "/admin/contact"
              : false;
    return isActive
      ? "text-[10px] sm:text-xs font-semibold text-[#5ACFFE] transition-colors uppercase tracking-wider cursor-pointer"
      : "text-[10px] sm:text-xs font-semibold text-white/70 hover:text-white transition-colors uppercase tracking-wider cursor-pointer";
  };

  const mobileLinkClass = (section: string) => {
    const isActive =
      section === "home"
        ? path === "/" || path === "/admin/dashboard"
        : section === "work"
          ? path === "/work" || path === "/admin/work"
          : section === "about"
            ? path === "/about" || path === "/admin/about"
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

  // Fetch the current logo from dynamic content
  useEffect(() => {
    fetch("http://localhost:5000/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.logo) setLogoUrl(data.logo);
      })
      .catch(() => {});
  }, []);

  const handleSaveLogo = async () => {
    if (!logoInput.trim()) return;
    setSavingLogo(true);
    setLogoMsg(null);
    const token = localStorage.getItem("adminToken");
    try {
      const res = await fetch("http://localhost:5000/api/content/logo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ logo: logoInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update logo");
      }
      setLogoUrl(data.logo);
      setLogoModalOpen(false);
    } catch (err: any) {
      setLogoMsg({ type: "error", text: err.message || "Error updating logo" });
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
    } else if (section === "contact") {
      navigate(token ? "/admin/contact" : "/contact");
    } else if (section === "work") {
      navigate(token ? "/admin/work" : "/work");
    }
  };

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-end md:justify-center px-3 sm:px-4 max-w-full">
      {/* Logo - left side */}
      <div className="absolute left-3 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center cursor-pointer"
          title="BroEditz"
        >
          <img
            src={logoUrl}
            alt="BroEditz logo"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain"
          />
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
        ref={navRef}
        className="flex items-center justify-center w-auto max-w-full bg-[#06102F]/85 backdrop-blur-md border border-white/10 rounded-full px-2 sm:px-5 md:px-8 py-2 sm:py-2.5 md:py-3.5 shadow-xl shadow-black/40"
      >
        {/* Mobile hamburger toggle */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Middle Links (desktop) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
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
            onClick={() => handleNavClick("contact")}
            className={linkClass("contact")}
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full mt-2 right-0 w-[min(80vw,280px)] bg-[#06102F]/95 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl">
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
      {/* Logo edit modal (admin) */}
      <EditModalOverlay
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
      >
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white">Update Logo</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Paste the image URL of the new logo. It updates across the entire
              site.
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
              onClick={handleSaveLogo}
              disabled={savingLogo || !logoInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0086F0] to-[#5ACFFE] hover:brightness-110 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[#0086F0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingLogo ? "Saving..." : "Save Logo"}
            </button>
          </div>
        </div>
      </EditModalOverlay>
    </header>
  );
};

export default Navbar;
