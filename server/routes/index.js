import { Router } from "express";
import { getHello } from "../controllers/index.js";
import { 
  adminLogin, 
  adminSignup, 
  verifySession,
  updateProfile,
  getSignupCode,
  updateSignupCode,
  getTeamMembers,
  updateMemberRole,
  submitApplication,
  getApplications,
  toggleCheckApplication
} from "../controllers/adminController.js";
import { 
  getContent, 
  updateHero, 
  updateSolutionTitle,
  updateSolution, 
  updateReviews, 
  updateFaqs,
  updateWorkVideos,
  updateBrands,
  updateProduction,
  updateWorkPage,
  updateAbout,
  updateContact,
  updateFooter,
  updateLogo
} from "../controllers/contentController.js";
import { verifyAdminToken } from "../middleware/auth.js";

const router = Router();

router.get("/", getHello);

// Admin Authentication & Profile
router.post("/admin/login", adminLogin);
router.post("/admin/signup", adminSignup);
router.get("/admin/me", verifyAdminToken, verifySession);
router.put("/admin/profile", verifyAdminToken, updateProfile);

// Superadmin Signup Code Settings
router.get("/admin/signup-code", verifyAdminToken, getSignupCode);
router.put("/admin/signup-code", verifyAdminToken, updateSignupCode);

// Team Management
router.get("/admin/team", verifyAdminToken, getTeamMembers);
router.put("/admin/team/role", verifyAdminToken, updateMemberRole);

// Applications (Contact submissions)
router.post("/applications", submitApplication);
router.get("/admin/applications", verifyAdminToken, getApplications);
router.put("/admin/applications/:id/check", verifyAdminToken, toggleCheckApplication);

// Dynamic Content
router.get("/content", getContent);
router.put("/content/logo", verifyAdminToken, updateLogo);
router.put("/content/hero", verifyAdminToken, updateHero);
router.put("/content/solution-title", verifyAdminToken, updateSolutionTitle);
router.put("/content/solution", verifyAdminToken, updateSolution);
router.put("/content/reviews", verifyAdminToken, updateReviews);
router.put("/content/faqs", verifyAdminToken, updateFaqs);
router.put("/content/work-videos", verifyAdminToken, updateWorkVideos);
router.put("/content/brands", verifyAdminToken, updateBrands);
router.put("/content/production", verifyAdminToken, updateProduction);
router.put("/content/work-page", verifyAdminToken, updateWorkPage);
router.put("/content/about", verifyAdminToken, updateAbout);
router.put("/content/contact", verifyAdminToken, updateContact);
router.put("/content/footer", verifyAdminToken, updateFooter);

export default router;
