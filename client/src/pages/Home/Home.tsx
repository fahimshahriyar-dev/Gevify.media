import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import { lazy, Suspense } from "react";
import Navbar from "../../components/Navbar";
import Hero from "./Hero";
import Footer from "../../components/Footer";

const HomeWork = lazy(() => import("./HomeWork"));
const OurSolution = lazy(() => import("./OurSolution"));
const Production = lazy(() => import("./Production"));
const ReviewsSection = lazy(() => import("./ReviewsSection"));
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

// ─── Default content (mirrors backend DEFAULT_CONTENT) ─────────────────────
// The page renders immediately using this, then silently updates once the
// API response arrives (stale-while-revalidate). This eliminates the 7s LCP
// delay caused by a cold MongoDB Atlas connection.
const DEFAULT_CONTENT: HomepageContent = {
  hero: {
    title: "Next-Gen Creative Commercial Video Production",
    subtitle: "For e-commerce brands that refuse to blend in. Custom AI-powered videos designed to build a distinctive brand identity, capture attention, and drive measurable growth.",
    videoUrl: "https://www.youtube.com/watch?v=bSl7z00Hnug",
  },
  solutionTitle: "Unleash Your AI \n application's full potential",
  solutionCards: [
    { title: "E-Commerce \n product Ad Creative", subtitle: "High-performance video creatives for Amazon, Shopify, Walmart, TikTok Shop, and other commerce platforms designed to increase visibility, engagement, and conversions.", image: "/src/assets/images/card_1.webp" },
    { title: "AI Influencer Systems \n for Brands", subtitle: "Custom AI influencers developed exclusively for your brand, delivering consistent content, scalable campaigns, and a recognizable digital presence.", image: "/src/assets/images/card_2.webp" },
    { title: "Social Video \n Production", subtitle: "Strategic short-form and long-form video content created to maximize reach, engagement, and brand awareness across today's most influential platforms.", image: "/src/assets/images/card_3.webp" },
    { title: "Commercial Content \n Production", subtitle: "Premium promotional videos for service businesses, restaurants, hospitality brands, real estate firms, healthcare providers, and corporate organizations seeking to elevate their market presence.", image: "/src/assets/images/card_4.webp" },
    { title: "Agency Growth \n Partnership", subtitle: "Helping agencies scale creative delivery without the overhead. From Amazon and e-commerce consultancies to digital marketing and social media agencies, trusted white-label production enables partners to increase capacity, improve profitability, and focus on client growth while every relationship remains fully protected.", image: "/src/assets/images/card_5.webp" },
  ],
  reviews: [
    { quote: "We were very satisfied to work with Aman on our video projects. Communication was clear and the delivered product was adjusted to perfection based on our comments. Highly recommended for all your AI video needs.", avatar: "/src/assets/images/card_1.webp", name: "Shia M.", role: "JJ Imports Account Manager" },
    { quote: "It's been a pleasure work with Aman, really talented, hard working and skilled.", avatar: "/src/assets/images/card_2.webp", name: "Adria Acevit", role: "Nutrition CEO" },
    { quote: "Great content and quick to make my suggested changes", avatar: "/src/assets/images/card_3.webp", name: "John Salek", role: "TACH Connectable Luggage Owner" },
    { quote: "We're very grateful for how our Amazon PPC video ad has turned out as it showcases the main points in a clear way. Our experience was very positive as any concerns were addressed and revised. Thank you!", avatar: "/src/assets/images/card_4.webp", name: "Stephanie Yeager", role: "Thermic Innovations LLC Marketing Manager" },
    { quote: "They did an amazing job creating content, perfectly capturing the essence of what we asked for and refining the result until it was perfect.", avatar: "/src/assets/images/card_5.webp", name: "Alvaro", role: "MULTISIA CEO" },
  ],
  faqs: [
    { question: "What types of videos do you create?", answer: "We are an all-in-one next-generation video production agency helping modern brands scale content creation without the limitations of traditional production. From e-commerce ad creatives and product promo videos to AI influencer content, social media campaigns, and commercial productions, we deliver high-performance video solutions designed to drive growth." },
    { question: "What do you need to get started?", answer: "Most projects can begin with your product images, brand guidelines, website link, product information, or creative brief. Our team handles the production process from there." },
    { question: "How long does production take?", answer: "Turnaround times vary depending on the project scope, but most video projects are delivered within 2–4 business days. Larger campaigns and custom productions may require additional time." },
    { question: "Do you offer white-label services for agencies?", answer: "Yes. We serve as a trusted white-label production partner for e-commerce consultancies, marketing agencies, and social media agencies. Your clients remain your clients—we never engage with them directly without authorization. Every partnership is handled with complete confidentiality and relationship protection." },
    { question: "Who owns the final content?", answer: "Upon final payment, you receive full usage rights to the approved deliverables for your brand, marketing campaigns, and business operations. We retain the right to showcase completed work in our portfolio, case studies, marketing materials, and promotional activities unless otherwise agreed in writing prior to project commencement." },
    { question: "Do you offer revisions?", answer: "Yes. We include revision rounds to ensure the final content aligns with your brand, goals, and expectations." },
  ],
  workVideos: Array(12).fill("https://www.youtube.com/watch?v=bSl7z00Hnug"),
  production: {
    sectionSubtitle: "OUR PRODUCTION ECOSYSTEM",
    title: "One Production Partner, \n Endless Creative Possibilities...",
    description: "From strategy and scripting to AI-powered production and cinematic post-production, we combine cutting-edge AI with human creativity to deliver premium commercial videos at scale—without compromising quality.",
    boxes: [
      { title: "Pre-Production", subtitle: "Scripting, storyboarding & planning" },
      { title: "AI Scripting", subtitle: "AI-powered script generation" },
      { title: "Filming", subtitle: "On-site & studio production" },
      { title: "Post-Production", subtitle: "Editing, color grading, VFX" },
      { title: "Motion Graphics", subtitle: "2D/3D animation & titles" },
      { title: "Sound Design", subtitle: "Audio mixing & SFX" },
      { title: "Quality Check", subtitle: "Review & revision process" },
      { title: "Delivery", subtitle: "Final export & handoff" },
    ],
  },
  brands: {
    row1: [
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658892/file_000000003b488206955f5002bdb0571e_olotb9.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658885/file_00000000bbcc8208b4a76f3c67bff8a6_rme2a8.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658884/file_000000008ae48207b368b4980b6849a5_v9gdep.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000680482119e054be332f78751_l24png.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000a6a08206a6537380f4c52611_qo47bt.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000f690820d9306646037ba83ef_lxdkxz.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000cb4881fa9c6b6b92cb70b0ab_semryx.png",
    ],
    row2: [
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000cb04820cb12bc3bc0069f275-removebg-preview_yx8506.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_000000000bb881fa8b5e70653b8f79ac_vqd63t.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000d8d881fa9b5284b9a8addd85_bs5ino.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000c4b481faa4238ab9503f8315_qle1tb.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658879/cosmetisse_white_transparent_clean_xouary.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000db1881fa9a3bc75ef18be3a2_mt2ccx.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658879/file_00000000cf4c81fab78e6005983a3d57_ckt61z.png",
    ],
  },
};

const Home = ({ isAdminMode = false }: HomeProps) => {
  const [activeSection, setActiveSection] = useState<
    "hero" | "about" | "solution" | "production" | "reviews"
  >("hero");
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Initialize with DEFAULT_CONTENT so the page renders immediately (stale-while-revalidate).
  // The API fetch runs in the background and updates state when it resolves.
  const [content, setContent] = useState<HomepageContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // true when viewport is ≥ 1024 px (Tailwind "lg" breakpoint)
  const [isLg, setIsLg] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : true,
  );

  const isAnimatingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const productionRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Mobile layout: refs + inView states for scroll-triggered entry animations
  const mobileOurSolutionRef = useRef<HTMLDivElement>(null);
  const mobileProductionRef = useRef<HTMLDivElement>(null);
  const mobileReviewsRef = useRef<HTMLDivElement>(null);
  const [mobileOurSolutionActive, setMobileOurSolutionActive] = useState(false);
  const [mobileProductionActive, setMobileProductionActive] = useState(false);
  const [mobileReviewsActive, setMobileReviewsActive] = useState(false);

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
      const response = await fetch("http://localhost:5000/api/content");
      if (!response.ok) {
        throw new Error("Failed to load website content");
      }
      const data = await response.json();
      // Silently update content in the background (stale-while-revalidate)
      setContent(data);
      setError("");
    } catch (err: any) {
      // Don't block the UI on API errors — default content is already showing
      console.warn("Could not fetch latest content from API:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Keep isLg in sync with live viewport resizes
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // On sm/md: fire each section's entry animation when it scrolls into view
  useEffect(() => {
    if (isLg || loading) return;

    const observers: IntersectionObserver[] = [];

    const watch = (
      el: HTMLDivElement | null,
      activate: (v: boolean) => void,
    ) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            activate(true);
            obs.unobserve(el); // trigger once, keep it active
          }
        },
        { threshold: 0.15 },
      );
      obs.observe(el);
      observers.push(obs);
    };

    watch(mobileOurSolutionRef.current, setMobileOurSolutionActive);
    watch(mobileProductionRef.current, setMobileProductionActive);
    watch(mobileReviewsRef.current, setMobileReviewsActive);

    return () => observers.forEach((o) => o.disconnect());
  }, [isLg, loading]);

  const handleUpdateHero = async (
    title: string,
    subtitle: string,
    videoUrl?: string,
  ) => {
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(
        "http://localhost:5000/api/content/hero",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, subtitle, videoUrl }),
        },
      );
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
        "http://localhost:5000/api/content/work-videos",
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
        "http://localhost:5000/api/content/solution",
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
        "http://localhost:5000/api/content/reviews",
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
      const response = await fetch(
        "http://localhost:5000/api/content/faqs",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ faqs }),
        },
      );
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
      const response = await fetch(
        "http://localhost:5000/api/content/brands",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ brands }),
        },
      );
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
        "http://localhost:5000/api/content/production",
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
    if (!isLg) return;
    const targetSection = (location.state as { section?: string })?.section;
    if (targetSection === "homework") {
      transitionToAbout();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loading, isLg]);

  useEffect(() => {
    // Scroll animation only on lg+ devices
    if (!isLg) return;

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

    const targets = [container, solContainer, revContainer].filter(
      Boolean,
    ) as HTMLElement[];

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
  }, [activeSection, loading, isLg]);

  useEffect(() => {
    if (!isLg) return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "homework") transitionToAbout();
      if (detail === "hero") transitionToHero();
    };
    window.addEventListener("goto-section", handler);
    return () => window.removeEventListener("goto-section", handler);
  }, [activeSection, loading, isLg]);

  const heroTitle = content?.hero?.title || "";
  const heroSubtitle = content?.hero?.subtitle || "";
  const heroVideoUrl =
    content?.hero?.videoUrl || "https://www.youtube.com/watch?v=bSl7z00Hnug";
  const solTitle = content?.solutionTitle || "";
  const revs = content?.reviews || [];
  const fqs = content?.faqs || [];

  // ─── Mobile / tablet layout (sm + md, < 1024 px) ────────────────────────
  if (!isLg) {
    return (
      <div className="w-full bg-[#0a0a0a] overflow-x-hidden">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
            <div className="text-center">
              <div className="relative h-12 w-12 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-[#0086F0]/20"></div>
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-transparent border-t-[#0086F0]"></div>
              </div>
              <p className="text-sm text-[#5ACFFE]/80 tracking-widest uppercase font-medium">
                Loading...
              </p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {!loading && (error || !content) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
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
          <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 bg-[#06102F]/90 backdrop-blur-md border border-[#0086F0]/40 rounded-full px-4 py-2.5 shadow-xl shadow-black/40">
              <button
                onClick={() => navigate("/admin/profile")}
                className="flex items-center gap-2 text-xs font-bold text-[#5ACFFE] uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#0086F0] animate-ping" />
                Admin
              </button>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-[#0086F0]/25 rounded-full px-3 py-1 transition-all cursor-pointer border border-transparent hover:border-[#0086F0]/30"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        <Navbar whiteLogo />

        {/* Sections flow naturally — no animation */}
        <Hero
          standalone={false}
          title={heroTitle}
          subtitle={heroSubtitle}
          videoUrl={heroVideoUrl}
          isAdminMode={isAdminMode}
          onUpdateHero={handleUpdateHero}
        />
        <Suspense fallback={null}>
          <HomeWork
            workVideos={content?.workVideos || []}
            isAdminMode={isAdminMode}
            onUpdateWorkVideos={handleUpdateWorkVideos}
          />
        </Suspense>
        <div ref={mobileOurSolutionRef}>
          <Suspense fallback={null}>
            <OurSolution
              active={mobileOurSolutionActive}
              solutionTitle={solTitle}
              solutionCards={content?.solutionCards}
              brands={content?.brands}
              isAdminMode={isAdminMode}
              onUpdateSolutionTitle={handleUpdateSolutionTitle}
              onUpdateSolution={handleUpdateSolution}
              onUpdateBrands={handleUpdateBrands}
            />
          </Suspense>
        </div>
        <div ref={mobileProductionRef}>
          <Suspense fallback={null}>
            <Production
              production={content?.production}
              isAdminMode={isAdminMode}
              onUpdateProduction={handleUpdateProduction}
              active={mobileProductionActive}
            />
          </Suspense>
        </div>
        <div ref={mobileReviewsRef}>
          <Suspense fallback={null}>
            <ReviewsSection
              reviews={revs}
              faqs={fqs}
              isAdminMode={isAdminMode}
              onUpdateReviews={handleUpdateReviews}
              onUpdateFaqs={handleUpdateFaqs}
              active={mobileReviewsActive}
            />
          </Suspense>
        </div>
        <Footer isAdminMode={isAdminMode} />
      </div>
    );
  }

  // ─── Desktop layout (lg+): full-page scroll animation ────────────────────
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
            <p className="text-sm text-[#5ACFFE]/80 tracking-widest uppercase font-medium">
              Loading...
            </p>
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
        <Suspense fallback={null}>
          <HomeWork
            onGoToSolution={transitionToSolution}
            workVideos={content?.workVideos || []}
            isAdminMode={isAdminMode}
            onUpdateWorkVideos={handleUpdateWorkVideos}
          />
        </Suspense>

        {/* OurSolution — slides up from below HomeWork */}
        <div
          ref={solutionRef}
          id="solution-section"
          className="absolute top-full left-0 w-full h-full z-30 overflow-y-auto overflow-x-hidden scrollbar-none"
          style={{ transform: "translate3d(0px, 0px, 0px)" }}
        >
          <Suspense fallback={null}>
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
          </Suspense>
        </div>

        {/* Production — slides up from below OurSolution */}
        <div
          ref={productionRef}
          id="production-section"
          className="absolute top-full left-0 w-full h-full z-40 overflow-y-auto overflow-x-hidden scrollbar-none outline-none"
          style={{ transform: "translate3d(0px, 0px, 0px)" }}
        >
          <Suspense fallback={null}>
            <Production
              production={content?.production}
              isAdminMode={isAdminMode}
              onUpdateProduction={handleUpdateProduction}
              active={activeSection === "production"}
            />
          </Suspense>
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
          <Suspense fallback={null}>
            <ReviewsSection
              reviews={revs}
              faqs={fqs}
              isAdminMode={isAdminMode}
              onUpdateReviews={handleUpdateReviews}
              onUpdateFaqs={handleUpdateFaqs}
              active={activeSection === "reviews"}
            />
          </Suspense>
          <Footer isAdminMode={isAdminMode} />
        </div>
      </div>
    </div>
  );
};

export default Home;
