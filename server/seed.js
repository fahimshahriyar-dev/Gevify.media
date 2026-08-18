import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import Content from "./models/Content.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://fahimshahriyardev_db_user:yAsfA0twNmLVYBUi@development.noel1vx.mongodb.net/broeditz?retryWrites=true&w=majority";

const DEFAULT_CONTENT = {
  key: "homepage",
  logo: "https://res.cloudinary.com/dsmkxcczo/image/upload/v1786910291/logo_o11gn5.png",
  hero: {
    title: "Next-Gen Creative Commercial Video Production",
    subtitle: "For e-commerce brands that refuse to blend in. Custom AI-powered videos designed to build a distinctive brand identity, capture attention, and drive measurable growth."
  },
  solutionTitle: "Unleash Your AI \n application's full potential",
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
  about: {
    title: "About BroEditz",
    subtitle: "AI-Powered Video Production for Modern Brands",
    description: "BroEditz is a next-generation creative video production agency that combines cutting-edge AI technology with human creativity. We help e-commerce brands, agencies, and businesses scale their video content production without compromising on quality. From AI-powered ad creatives to cinematic commercial productions, our team delivers high-performance video solutions designed to capture attention, build brand identity, and drive measurable growth."
  },
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

const seed = async () => {
  try {
    console.log("Connecting to database for seeding...");
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected.");

    // Seed Admin
    const adminEmail = "admin@broeditz.com";
    const adminPassword = "adminpassword123";
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log("No admin found. Seeding default admin account...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const newAdmin = new Admin({
        email: adminEmail,
        password: hashedPassword
      });
      await newAdmin.save();
      console.log(`Admin account seeded successfully.`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    } else {
      console.log("Admin account already exists.");
    }

    // Seed Content
    const existingContent = await Content.findOne({ key: "homepage" });
    if (!existingContent) {
      console.log("No homepage content found. Seeding default content...");
      const content = new Content(DEFAULT_CONTENT);
      await content.save();
      console.log("Homepage content seeded successfully.");
    } else {
      console.log("Homepage content already exists.");
    }

    console.log("Seeding process finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
