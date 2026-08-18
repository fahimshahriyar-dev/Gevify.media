import Content from "../models/Content.js";

const DEFAULT_CONTENT = {
  key: "homepage",
  logo: "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786910291/logo_o11gn5.png",
  hero: {
    title: "Next-Gen Creative Commercial Video Production",
    subtitle: "For e-commerce brands that refuse to blend in. Custom AI-powered videos designed to build a distinctive brand identity, capture attention, and drive measurable growth.",
    videoUrl: "https://www.youtube.com/watch?v=bSl7z00Hnug"
  },
  solutionTitle: "Unleash Your AI \n application's full potential",
  solutionCards: [
    {
      title: "E-Commerce \n product Ad Creative",
      subtitle: "High-performance video creatives for Amazon, Shopify, Walmart, TikTok Shop, and other commerce platforms designed to increase visibility, engagement, and conversions.",
      image: "/src/assets/images/card_1.png"
    },
    {
      title: "AI Influencer Systems \n for Brands",
      subtitle: "Custom AI influencers developed exclusively for your brand, delivering consistent content, scalable campaigns, and a recognizable digital presence.",
      image: "/src/assets/images/card_2.png"
    },
    {
      title: "Social Video \n Production",
      subtitle: "Strategic short-form and long-form video content created to maximize reach, engagement, and brand awareness across today's most influential platforms.",
      image: "/src/assets/images/card_3.png"
    },
    {
      title: "Commercial Content \n Production",
      subtitle: "Premium promotional videos for service businesses, restaurants, hospitality brands, real estate firms, healthcare providers, and corporate organizations seeking to elevate their market presence.",
      image: "/src/assets/images/card_4.png"
    },
    {
      title: "Agency Growth \n Partnership",
      subtitle: "Helping agencies scale creative delivery without the overhead. From Amazon and e-commerce consultancies to digital marketing and social media agencies, trusted white-label production enables partners to increase capacity, improve profitability, and focus on client growth while every relationship remains fully protected.",
      image: "/src/assets/images/card_5.png"
    }
  ],
  reviews: [
    {
      quote: "We were very satisfied to work with Aman on our video projects. Communication was clear and the delivered product was adjusted to perfection based on our comments. Highly recommended for all your AI video needs.",
      avatar: "/src/assets/images/card_1.png",
      name: "Shia M.",
      role: "JJ Imports Account Manager"
    },
    {
      quote: "It's been a pleasure work with Aman, really talented, hard working and skilled.",
      avatar: "/src/assets/images/card_2.png",
      name: "Adria Acevit",
      role: "Nutrition CEO"
    },
    {
      quote: "Great content and quick to make my suggested changes",
      avatar: "/src/assets/images/card_3.png",
      name: "John Salek",
      role: "TACH Connectable Luggage Owner"
    },
    {
      quote: "We're very grateful for how our Amazon PPC video ad has turned out as it showcases the main points in a clear way. Our experience was very positive as any concerns were addressed and revised. Thank you!",
      avatar: "/src/assets/images/card_4.png",
      name: "Stephanie Yeager",
      role: "Thermic Innovations LLC Marketing Manager"
    },
    {
      quote: "They did an amazing job creating content, perfectly capturing the essence of what we asked for and refining the result until it was perfect.",
      avatar: "/src/assets/images/card_5.png",
      name: "Alvaro",
      role: "MULTISIA CEO"
    }
  ],
  faqs: [
    {
      question: "What types of videos do you create?",
      answer: "We are an all-in-one next-generation video production agency helping modern brands scale content creation without the limitations of traditional production. From e-commerce ad creatives and product promo videos to AI influencer content, social media campaigns, and commercial productions, we deliver high-performance video solutions designed to drive growth."
    },
    {
      question: "What do you need to get started?",
      answer: "Most projects can begin with your product images, brand guidelines, website link, product information, or creative brief. Our team handles the production process from there."
    },
    {
      question: "How long does production take?",
      answer: "Turnaround times vary depending on the project scope, but most video projects are delivered within 2–4 business days. Larger campaigns and custom productions may require additional time."
    },
    {
      question: "Do you offer white-label services for agencies?",
      answer: "Yes. We serve as a trusted white-label production partner for e-commerce consultancies, marketing agencies, and social media agencies. Your clients remain your clients—we never engage with them directly without authorization. Every partnership is handled with complete confidentiality and relationship protection."
    },
    {
      question: "Who owns the final content?",
      answer: "Upon final payment, you receive full usage rights to the approved deliverables for your brand, marketing campaigns, and business operations. We retain the right to showcase completed work in our portfolio, case studies, marketing materials, and promotional activities unless otherwise agreed in writing prior to project commencement."
    },
    {
      question: "Do you offer revisions?",
      answer: "Yes. We include revision rounds to ensure the final content aligns with your brand, goals, and expectations."
    }
  ],
  workVideos: [
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug",
    "https://www.youtube.com/watch?v=bSl7z00Hnug"
  ],
  about: {
    title: "About BroEditz",
    subtitle: "AI-Powered Video Production for Modern Brands",
    description: "BroEditz is a next-generation creative video production agency that combines cutting-edge AI technology with human creativity. We help e-commerce brands, agencies, and businesses scale their video content production without compromising on quality. From AI-powered ad creatives to cinematic commercial productions, our team delivers high-performance video solutions designed to capture attention, build brand identity, and drive measurable growth."
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Have a project in mind? Let's talk about how we can help bring your vision to life.",
    company: "Gevify.media",
    email: "contact@gevify.media",
    whatsapp: "https://wa.me/8801893257647",
    facebook: "https://www.facebook.com/Gevify.Media",
    instagram: "https://www.instagram.com/gevifymedia",
    youtube: "https://www.youtube.com/@gevifymedia"
  },
  workPage: {
    title: "Our Work",
    videos: [
      "https://www.youtube.com/watch?v=bSl7z00Hnug",
      "https://www.youtube.com/watch?v=bSl7z00Hnug",
      "https://www.youtube.com/watch?v=bSl7z00Hnug",
      "https://www.youtube.com/watch?v=bSl7z00Hnug",
      "https://www.youtube.com/watch?v=bSl7z00Hnug",
      "https://www.youtube.com/watch?v=bSl7z00Hnug",
      "https://www.youtube.com/watch?v=bSl7z00Hnug",
      "https://www.youtube.com/watch?v=bSl7z00Hnug"
    ]
  },
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
      { title: "Delivery", subtitle: "Final export & handoff" }
    ]
  },
  brands: {
    row1: [
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658892/file_000000003b488206955f5002bdb0571e_olotb9.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658885/file_00000000bbcc8208b4a76f3c67bff8a6_rme2a8.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658884/file_000000008ae48207b368b4980b6849a5_v9gdep.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000680482119e054be332f78751_l24png.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000a6a08206a6537380f4c52611_qo47bt.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658883/file_00000000f690820d9306646037ba83ef_lxdkxz.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000cb4881fa9c6b6b92cb70b0ab_semryx.png"
    ],
    row2: [
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000cb04820cb12bc3bc0069f275-removebg-preview_yx8506.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_000000000bb881fa8b5e70653b8f79ac_vqd63t.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000d8d881fa9b5284b9a8addd85_bs5ino.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000c4b481faa4238ab9503f8315_qle1tb.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658879/cosmetisse_white_transparent_clean_xouary.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658880/file_00000000db1881fa9a3bc75ef18be3a2_mt2ccx.png",
      "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786658879/file_00000000cf4c81fab78e6005983a3d57_ckt61z.png"
    ]
  },
  footer: {
    brand: "Gevify.media",
    description: "Where creativity meets intelligent production. Gevify.media crafts premium AI-powered commercial videos that elevate brands, inspire audiences, and deliver real business impact.",
    email: "aman.gevify@gmail.com",
    whatsapp: "https://wa.me/8801893257647",
    facebook: "https://www.facebook.com/Gevify.Media",
    instagram: "https://www.instagram.com/gevifymedia",
    youtube: "https://www.youtube.com/@gevifymedia"
  }
};

// ... rest of file until end:

export const updateWorkVideos = async (req, res) => {
  const { workVideos } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.workVideos = workVideos;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating work videos" });
  }
};

export const getContent = async (req, res) => {
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
      await content.save();
    } else {
      // Auto-migrate if the database holds the old text-based brands
      if (content.brands && content.brands.row1 && content.brands.row1.includes("Duke Product Line")) {
        content.brands = DEFAULT_CONTENT.brands;
        await content.save();
      }
      // Auto-migrate logo for older content documents
      if (!content.logo) {
        content.logo = DEFAULT_CONTENT.logo;
        await content.save();
      }
    }
    res.json(content);
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ message: "Server error retrieving content" });
  }
};

export const updateLogo = async (req, res) => {
  const { logo } = req.body;
  try {
    if (!logo || !logo.trim()) {
      return res.status(400).json({ message: "Logo URL cannot be empty" });
    }
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.logo = logo.trim();
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating logo" });
  }
};

export const updateHero = async (req, res) => {
  const { title, subtitle, videoUrl } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.hero.title = title;
    content.hero.subtitle = subtitle;
    if (videoUrl !== undefined) {
      content.hero.videoUrl = videoUrl;
    }
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating hero" });
  }
};

export const updateSolution = async (req, res) => {
  const { solutionTitle, solutionCards } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    if (solutionTitle !== undefined) content.solutionTitle = solutionTitle;
    if (solutionCards !== undefined) content.solutionCards = solutionCards;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating solution section" });
  }
};

export const updateSolutionTitle = updateSolution;

export const updateReviews = async (req, res) => {
  const { reviews } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.reviews = reviews;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating reviews" });
  }
};

export const updateFaqs = async (req, res) => {
  const { faqs } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.faqs = faqs;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating faqs" });
  }
};

export const updateProduction = async (req, res) => {
  const { production } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.production = production;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating production section" });
  }
};

export const updateBrands = async (req, res) => {
  const { brands } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.brands = brands;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating brands" });
  }
};

export const updateAbout = async (req, res) => {
  const { about } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.about = about;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating about section" });
  }
};

export const updateContact = async (req, res) => {
  const { contact } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.contact = contact;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating contact section" });
  }
};

export const updateWorkPage = async (req, res) => {
  const { workPage } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.workPage = workPage;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating work page" });
  }
};

export const updateFooter = async (req, res) => {
  const { footer } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.footer = footer;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating footer" });
  }
};
