import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import Navbar from "../../components/Navbar";
import Hero from "./Hero";
import HomeWork from "./HomeWork";
import OurSolution from "./OurSolution";
import Production from "./Production";
import ReviewsSection from "./ReviewsSection";
import Footer from "../../components/Footer";
import { gsap } from "gsap";

interface HomeProps {
  isAdminMode?: boolean;
}

export interface Review {
  _id?: string;
  quote: string;
  avatar: string;
  name: string;
  role: string;
}

export interface FaqItem {
  _id?: string;
  question: string;
  answer: string;
}

export interface SolutionCard {
  _id?: string;
  title: string;
  subtitle: string;
  image?: string;
}

export interface BrandsData {
  row1: string[];
  row2: string[];
}

export interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    videoUrl?: string;
  };
  solutionTitle: string;
  solutionCards?: SolutionCard[];
  brands?: BrandsData;
  reviews: Review[];
  faqs: FaqItem[];
  workVideos?: string[];
  production?: {
    sectionSubtitle: string;
    title: string;
    description: string;
    boxes: { title: string; subtitle: string }[];
  };
}

const Home = ({ isAdminMode = false }: HomeProps) => {
  const [activeSection, setActiveSection] = useState<
    "hero" | "about" | "solution" | "production" | "reviews"
  >("hero");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAnimatingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const productionRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Validate admin token if in admin mode
  useEffect(() => {
    if (isAdminMode) {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/signin");
      }
    }
  }, [isAdminMode, navigate]);

  // Fetch dynamic content
  const fetchContent = async () => {
    try {
      const response = await fetch("https://api.gavify.media/api/content");
      if (!response.ok) {
        throw new Error("Failed to load website content");
      }
      const data = await response.json();
      setContent(data);
    } catch (err: any) {
      setError(err.message || "An error occurred fetching content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleUpdateHero = async (
    title: string,
    subtitle: string,
    videoUrl?: string,
  ) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch("https://api.gavify.media/api/content/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, subtitle, videoUrl }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        throw new Error("Failed to update hero");
      }
      const updated = await response.json();
      setContent(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateWorkVideos = async (workVideos: string[]) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        "https://api.gavify.media/api/content/work-videos",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ workVideos }),
        },
      );
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        throw new Error("Failed to update work videos");
      }
      const updated = await response.json();
      setContent(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateSolution = async (
    solutionTitle: string,
    solutionCards?: SolutionCard[],
  ) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        "https://api.gavify.media/api/content/solution",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ solutionTitle, solutionCards }),
        },
      );
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        throw new Error("Failed to update solution section");
      }
      const updated = await response.json();
      setContent(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateSolutionTitle = async (solutionTitle: string) => {
    await handleUpdateSolution(solutionTitle, content?.solutionCards);
  };

  const handleUpdateReviews = async (reviews: Review[]) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        "https://api.gavify.media/api/content/reviews",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reviews }),
        },
      );
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        throw new Error("Failed to update reviews");
      }
      const updated = await response.json();
      setContent(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateFaqs = async (faqs: FaqItem[]) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch("https://api.gavify.media/api/content/faqs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ faqs }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        throw new Error("Failed to update FAQs");
      }
      const updated = await response.json();
      setContent(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateBrands = async (brands: BrandsData) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch("https://api.gavify.media/api/content/brands", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ brands }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        throw new Error("Failed to update brands");
      }
      const updated = await response.json();
      setContent(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateProduction = async (
    production: HomepageContent["production"],
  ) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        "https://api.gavify.media/api/content/production",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ production }),
        },
      );
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/signin");
          return;
        }
        throw new Error("Failed to update production section");
      }
      const updated = await response.json();
      setContent(updated);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  const transitionToAbout = () => {
    if (isAnimatingRef.current || activeSection === "about") return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    gsap.to(aboutRef.current, {
      y: "-100%",
      duration: 1.8,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimatingRef.current = false;
        setActiveSection("about");
        setIsTransitioning(false);
      },
    });
  };

  const transitionToHero = () => {
    if (isAnimatingRef.current || activeSection === "hero") return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    gsap.to(aboutRef.current, {
      y: "0%",
      duration: 1.8,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimatingRef.current = false;
        setActiveSection("hero");
        setIsTransitioning(false);
      },
    });
  };

  const transitionToSolution = () => {
    if (isAnimatingRef.current || activeSection === "solution") return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    if (activeSection === "production") {
      if (solutionRef.current) solutionRef.current.scrollTop = 0;
      gsap.to(productionRef.current, {
        y: "0%",
        duration: 1.8,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
          setActiveSection("solution");
          setIsTransitioning(false);
        },
      });
    } else {
      gsap.to(solutionRef.current, {
        y: "-100%",
        duration: 1.8,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
          setActiveSection("solution");
          setIsTransitioning(false);
        },
      });
    }
  };

  const transitionToWork = () => {
    if (isAnimatingRef.current || activeSection === "about") return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    gsap.to(solutionRef.current, {
      y: "0%",
      duration: 1.8,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimatingRef.current = false;
        setActiveSection("about");
        setIsTransitioning(false);
      },
    });
  };

  const transitionToProduction = () => {
    if (isAnimatingRef.current || activeSection === "production") return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    if (activeSection === "reviews") {
      gsap.to(reviewsRef.current, {
        yPercent: 0,
        y: 0,
        duration: 1.8,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
          setActiveSection("production");
          setIsTransitioning(false);
        },
      });
    } else {
      gsap.to(productionRef.current, {
        y: "-100%",
        duration: 1.8,
        ease: "power3.inOut",
        onComplete: () => {
          isAnimatingRef.current = false;
          setActiveSection("production");
          setIsTransitioning(false);
        },
      });
    }
  };

  const transitionToReviews = () => {
    if (isAnimatingRef.current || activeSection === "reviews") return;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    gsap.to(reviewsRef.current, {
      yPercent: -100,
      y: 0,
      duration: 1.8,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimatingRef.current = false;
        setActiveSection("reviews");
        setIsTransitioning(false);
      },
    });
  };

  useEffect(() => {
    const targetSection = (location.state as { section?: string })?.section;
    if (targetSection === "homework") {
      transitionToAbout();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loading]);

  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) return;

      if (e.deltaY > 15) {
        if (activeSection === "hero") {
          transitionToAbout();
        } else if (activeSection === "about") {
          transitionToSolution();
        } else if (activeSection === "solution") {
          if (solutionRef.current) {
            const { scrollTop, clientHeight, scrollHeight } =
              solutionRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 15) {
              transitionToProduction();
            }
          }
        } else if (activeSection === "production") {
          transitionToReviews();
        }
      } else if (e.deltaY < -15) {
        if (activeSection === "about") {
          transitionToHero();
        } else if (activeSection === "solution") {
          if (solutionRef.current && solutionRef.current.scrollTop <= 5) {
            transitionToWork();
          }
        } else if (activeSection === "production") {
          transitionToSolution();
        } else if (activeSection === "reviews") {
          if (reviewsRef.current && reviewsRef.current.scrollTop <= 5) {
            transitionToProduction();
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;

      if (diffY > 50) {
        if (activeSection === "hero") {
          transitionToAbout();
        } else if (activeSection === "about") {
          transitionToSolution();
        } else if (activeSection === "solution") {
          if (solutionRef.current) {
            const { scrollTop, clientHeight, scrollHeight } =
              solutionRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 15) {
              transitionToProduction();
            }
          }
        } else if (activeSection === "production") {
          transitionToReviews();
        }
      } else if (diffY < -50) {
        if (activeSection === "about") {
          transitionToHero();
        } else if (activeSection === "solution") {
          if (solutionRef.current && solutionRef.current.scrollTop <= 5) {
            transitionToWork();
          }
        } else if (activeSection === "production") {
          transitionToSolution();
        } else if (activeSection === "reviews") {
          if (reviewsRef.current && reviewsRef.current.scrollTop <= 5) {
            transitionToProduction();
          }
        }
      }
    }; 

    const container = containerRef.current;
    const solContainer = solutionRef.current;
    const revContainer = reviewsRef.current;

    const targets = [
      container,
      solContainer,
      revContainer,
    ].filter(Boolean) as HTMLElement[];

    targets.forEach((t) => {
      t.addEventListener("wheel", handleWheel, { passive: true });
      t.addEventListener("touchstart", handleTouchStart, { passive: true });
      t.addEventListener("touchend", handleTouchEnd, { passive: true });
    });

    return () => {
      targets.forEach((t) => {
        t.removeEventListener("wheel", handleWheel);
        t.removeEventListener("touchstart", handleTouchStart);
        t.removeEventListener("touchend", handleTouchEnd);
      });
    };
  }, [activeSection, loading]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "homework") transitionToAbout();
      if (detail === "hero") transitionToHero();
    };
    window.addEventListener("goto-section", handler);
    return () => window.removeEventListener("goto-section", handler);
  }, [activeSection, loading]);


  const heroTitle = content?.hero?.title || "";
  const heroSubtitle = content?.hero?.subtitle || "";
  const heroVideoUrl =
    content?.hero?.videoUrl || "https://www.youtube.com/watch?v=bSl7z00Hnug";
  const solTitle = content?.solutionTitle || "";
  const revs = content?.reviews || [];
  const fqs = content?.faqs || [];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden"
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="relative h-12 w-12 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-2 border-[#0086F0]/20"></div>
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-[#0086F0]"></div>
            </div>
            <p className="text-sm text-[#5ACFFE]/80 tracking-widest uppercase font-medium">Loading...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {!loading && (error || !content) && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#0086F0]/10 border border-[#0086F0]/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-[#5ACFFE] text-xl font-bold">!</span>
            </div>
            <p className="text-[#5ACFFE] mb-5 text-sm">
              {error || "Error loading page contents"}
            </p>
            <button
              onClick={fetchContent}
              className="px-5 py-2 bg-[#0086F0] hover:bg-[#0073ce] transition-colors rounded text-sm font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {isAdminMode && (
        <div className="fixed top-6 right-6 md:right-10 z-[100] flex flex-col items-end gap-2">
          {/* Admin Profile button + Logout */}
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

          {/* Edit Work Videos — only on homework section when active and not scrolling/transitioning */}
          {activeSection === "about" && !isTransitioning && (
            <button
              onClick={() => {
                const el = document.getElementById("homework-edit-trigger");
                if (el) el.click();
              }}
              className="mt-14 md:mt-0 p-2.5 bg-[#06102F]/90 hover:bg-[#0086F0]/80 border border-[#0086F0]/50 hover:border-[#0086F0] text-[#5ACFFE] hover:text-white rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:shadow-[#0086F0]/30 backdrop-blur-md"
              title="Edit Featured Work Section"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <Navbar whiteLogo={activeSection === "hero"} />

      {/* Hero */}
      <div id="hero-section" className="w-full h-full">
        <Hero
          standalone={false}
          onGoToHomeWork={transitionToAbout}
          title={heroTitle}
          subtitle={heroSubtitle}
          videoUrl={heroVideoUrl}
          isAdminMode={isAdminMode}
          onUpdateHero={handleUpdateHero}
        />
      </div>

      {/* HomeWork — slides up over Hero */}
      <div
        ref={aboutRef}
        id="about-section"
        className="absolute top-full left-0 w-full h-full z-20 overflow-hidden"
        style={{ transform: "translate3d(0px, 0px, 0px)" }}
      >
        <HomeWork
          onGoToSolution={transitionToSolution}
          workVideos={content?.workVideos || []}
          isAdminMode={isAdminMode}
          onUpdateWorkVideos={handleUpdateWorkVideos}
        />

        {/* OurSolution — slides up from below HomeWork */}
        <div
          ref={solutionRef}
          id="solution-section"
          className="absolute top-full left-0 w-full h-full z-30 overflow-y-auto overflow-x-hidden scrollbar-none"
          style={{ transform: "translate3d(0px, 0px, 0px)" }}
        >
          <OurSolution
            active={activeSection === "solution"}
            solutionTitle={solTitle}
            solutionCards={content?.solutionCards}
            brands={content?.brands}
            isAdminMode={isAdminMode}
            onUpdateSolutionTitle={handleUpdateSolutionTitle}
            onUpdateSolution={handleUpdateSolution}
            onUpdateBrands={handleUpdateBrands}
          />
        </div>

        {/* Production — slides up from below OurSolution */}
        <div
          ref={productionRef}
          id="production-section"
          className="absolute top-full left-0 w-full h-full z-40 overflow-y-auto overflow-x-hidden scrollbar-none outline-none"
          style={{ transform: "translate3d(0px, 0px, 0px)" }}
        >
          <Production
            production={content?.production}
            isAdminMode={isAdminMode}
            onUpdateProduction={handleUpdateProduction}
            active={activeSection === "production"}
          />
        </div>

        {/* Reviews Section — slides up from below Production */}
        <div
          ref={reviewsRef}
          id="reviews-section"
          className="absolute top-full left-0 w-full h-full z-50 overflow-y-auto overflow-x-hidden scrollbar-none outline-none"
          style={{
            transform: "translate3d(0px, 0px, 0px)",
            outline: "none",
            border: "none",
            boxShadow: "none",
          }}
        >
          <ReviewsSection
            reviews={revs}
            faqs={fqs}
            isAdminMode={isAdminMode}
            onUpdateReviews={handleUpdateReviews}
            onUpdateFaqs={handleUpdateFaqs}
            active={activeSection === "reviews"}
          />
          <Footer isAdminMode={isAdminMode} />
        </div>
      </div>
    </div>
  );
};

export default Home;
