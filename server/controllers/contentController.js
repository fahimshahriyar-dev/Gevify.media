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
    description: "BroEditz is a next-generation creative video production agency that combines cutting-edge AI technology with human creativity. We help e-commerce brands, agencies, and businesses scale their video content production without compromising on quality. From AI-powered ad creatives to cinematic commercial productions, our team delivers high-performance video solutions designed to capture attention, build brand identity, and drive measurable growth.\n\nOur mission is simple: to make world-class video production accessible to every brand, regardless of size or budget. Whether you are a growing e-commerce store, an established national brand, or a busy agency, we become an extension of your creative team, scaling your output without ever diluting your message.\n\nWe believe the future of video is hybrid. Cutting-edge AI handles the heavy lifting of iteration, speed, and scale, while skilled human editors, strategists, and directors shape every frame with taste, emotion, and intent. The result is content that feels crafted, not generated.\n\nFrom immersive brand films and high-converting ad creatives to always-on social content, we cover the full spectrum of modern video. Each project starts with strategy, is shaped by story, and is finished with cinematic post-production, colour, sound, and motion that elevate the final product.\n\nSpeed matters. Traditional production pipelines can take weeks or months. Our AI-accelerated process compresses timelines dramatically, letting brands react to trends, launch campaigns, and test creative faster than ever before without compromising the polish your audience expects.\n\nAs your partner, we do not just deliver videos; we deliver outcomes. Clear communication, transparent workflows, and a relentless focus on performance ensure every project is aligned with your goals and built to move real-world results."
  },
  solution: {
    title: "Unleash Your Brand's Full Potential",
    items: [
      {
        title: "E-Commerce Product Ad Creative",
        subtitle: "High-performance video creatives for Amazon, Shopify, Walmart, TikTok Shop, and other commerce platforms designed to increase visibility, engagement, and conversions."
      },
      {
        title: "AI Influencer Systems for Brands",
        subtitle: "Custom AI influencers developed exclusively for your brand, delivering consistent content, scalable campaigns, and a recognizable digital presence."
      },
      {
        title: "Social Video Production",
        subtitle: "Strategic short-form and long-form video content created to maximize reach, engagement, and brand awareness across today's most influential platforms."
      },
      {
        title: "Commercial Content Production",
        subtitle: "Premium promotional videos for service businesses, restaurants, hospitality brands, real estate firms, healthcare providers, and corporate organizations seeking to elevate their market presence."
      },
      {
        title: "Agency Growth Partnership",
        subtitle: "Helping agencies scale creative delivery without the overhead. From Amazon and e-commerce consultancies to digital marketing and social media agencies, trusted white-label production enables partners to increase capacity, improve profitability, and focus on client growth."
      }
    ]
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
  },
  termsAndConditions: {
    title: "Terms and Conditions",
    sections: [
      {
        title: "Acceptance of Terms",
        content: "By accessing or using the services provided by Gevify.media, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, you must not use our services. These terms apply to all visitors, users, and clients who access or use our platform and services."
      },
      {
        title: "Services Description",
        content: "Gevify.media provides AI-powered commercial video production, creative content creation, social media video production, e-commerce product ad creatives, AI influencer development, and agency growth partnership services. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice."
      },
      {
        title: "Client Obligations",
        content: "Clients are responsible for providing accurate and complete information required for project execution. Timely feedback and approvals are expected to ensure project deadlines are met. Any delay in client responses may result in adjusted timelines. Clients must ensure that all content, materials, and assets provided for use in projects do not infringe upon third-party rights."
      },
      {
        title: "Intellectual Property",
        content: "All final deliverables produced by Gevify.media become the property of the client upon full payment of the agreed fees. Gevify.media retains the right to showcase completed work in its portfolio and marketing materials unless otherwise agreed upon in writing. Pre-production concepts, internal tools, and AI models used in the creation process remain the intellectual property of Gevify.media."
      },
      {
        title: "Payment Terms",
        content: "Payment terms are defined in individual project agreements or invoices. Unless otherwise specified, full payment is required before the final delivery of all project materials. Late payments may incur additional fees as outlined in the project agreement. Gevify.media reserves the right to pause or withhold deliverables until payment is received in full."
      },
      {
        title: "Revisions and Changes",
        content: "Each project includes a defined number of revision rounds as specified in the project scope. Additional revisions beyond the agreed scope may incur extra charges. Significant changes to the project brief after work has commenced may be treated as a new project and quoted accordingly. Revision requests should be submitted in a consolidated manner to ensure efficient processing."
      },
      {
        title: "Confidentiality",
        content: "Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of the business relationship. Gevify.media will not disclose client information, project details, or business strategies to any third party without prior written consent. This obligation survives the termination of the business relationship."
      },
      {
        title: "Limitation of Liability",
        content: "Gevify.media shall not be held liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the total amount paid by the client for the specific service giving rise to the claim. We are not responsible for delays or failures in performance resulting from circumstances beyond our reasonable control."
      },
      {
        title: "Termination",
        content: "Either party may terminate the business relationship with written notice as outlined in the project agreement. Upon termination, the client is responsible for payment of all work completed up to the date of termination. Gevify.media reserves the right to terminate services immediately if the client breaches any terms outlined in this agreement."
      },
      {
        title: "Governing Law",
        content: "These Terms and Conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which Gevify.media operates. Any disputes arising from these terms shall be resolved through good-faith negotiation before pursuing formal legal remedies."
      },
      {
        title: "Amendments",
        content: "Gevify.media reserves the right to update or modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after any modifications constitutes acceptance of the updated terms. Clients are encouraged to review these terms periodically."
      },
      {
        title: "Contact Information",
        content: "For any questions or concerns regarding these Terms and Conditions, please contact us at aman.gevify@gmail.com or through our official social media channels listed on our website."
      }
    ]
  },
  privacyPolicy: {
    title: "Privacy Policy",
    sections: [
      {
        title: "Information We Collect",
        content: "We collect information you provide directly to us, such as your name, email address, WhatsApp number, video production requirements, budget details, and any other information you choose to provide through our contact forms or during project discussions. We also automatically collect certain technical data including your IP address, browser type, device information, and browsing behavior on our website."
      },
      {
        title: "How We Use Your Information",
        content: "We use the information we collect to respond to your inquiries, provide and improve our services, communicate with you about projects and updates, process transactions, send marketing communications with your consent, analyze website usage to enhance user experience, and comply with legal obligations."
      },
      {
        title: "Information Sharing",
        content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided those parties agree to keep this information confidential. We may also disclose your information when required by law or to protect our rights and safety."
      },
      {
        title: "Cookies and Tracking",
        content: "Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us understand how you use our site. You can control cookie preferences through your browser settings. Disabling cookies may affect certain functionalities of our website."
      },
      {
        title: "Data Security",
        content: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. While we strive to protect your data, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
      },
      {
        title: "Data Retention",
        content: "We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, including to satisfy legal, accounting, or reporting requirements. Project-related data is retained for the duration of the business relationship and for a reasonable period afterward to address any ongoing obligations."
      },
      {
        title: "Your Rights",
        content: "You have the right to access, correct, update, or delete your personal information at any time. You may also opt out of receiving marketing communications from us by following the unsubscribe instructions in our emails or contacting us directly. To exercise any of these rights, please reach out to us at aman.gevify@gmail.com."
      },
      {
        title: "Third-Party Links",
        content: "Our website may contain links to third-party websites, including our social media profiles on Facebook, Instagram, YouTube, and WhatsApp. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit."
      },
      {
        title: "AI-Generated Content",
        content: "Gevify.media utilizes artificial intelligence technologies in content production. While we ensure all AI-generated content adheres to our quality standards, clients should be aware that AI tools may be employed in the creative process. Specific details about AI usage in individual projects are discussed during project planning and agreement phases."
      },
      {
        title: "Children's Privacy",
        content: "Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without verification of parental consent, we will take steps to delete that information promptly."
      },
      {
        title: "Changes to This Policy",
        content: "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your information."
      },
      {
        title: "Contact Us",
        content: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at aman.gevify@gmail.com or reach out through our official social media channels listed on our website."
      }
    ]
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

export const updateSolutionPage = async (req, res) => {
  const { solution } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.solution = solution;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating solution page" });
  }
};

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

export const updateTermsAndConditions = async (req, res) => {
  const { termsAndConditions } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.termsAndConditions = termsAndConditions;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating terms and conditions page" });
  }
};

export const updatePrivacyPolicy = async (req, res) => {
  const { privacyPolicy } = req.body;
  try {
    let content = await Content.findOne({ key: "homepage" });
    if (!content) {
      content = new Content(DEFAULT_CONTENT);
    }
    content.privacyPolicy = privacyPolicy;
    await content.save();
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error updating privacy policy page" });
  }
};
