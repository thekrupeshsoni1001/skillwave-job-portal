import express from "express";
import {
    login,
    logout,
    updateProfile,
    register,
    getJobSeekers,
    deleteJobSeeker,
    adminSignup,
    adminLogin
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Public Routes
router.post("/register", singleUpload, register); // Added singleUpload here for handling file uploads during registration
router.post("/login", login);
router.post("/admin/signup", adminSignup); // Admin signup (consider adding restrictions)
router.post("/admin/login", adminLogin);

// Authenticated Routes
router.get("/logout", isAuthenticated, logout);
router.post("/profile/update", isAuthenticated, singleUpload, updateProfile); // Profile update with file upload

// Admin Routes
router.get("/admin/job-seekers", isAuthenticated, isAdmin, getJobSeekers);
router.delete("/admin/job-seekers/:id", isAuthenticated, isAdmin, deleteJobSeeker);

export default router;
