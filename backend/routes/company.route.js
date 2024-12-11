import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Route to register a company
router.route("/register").post(isAuthenticated, registerCompany);

// Route to get all companies
router.route("/get").get(isAuthenticated, getCompany);

// Route to get a company by ID
router.route("/get/:id").get(isAuthenticated, getCompanyById);

// Route to update a company by ID
router.route("/update/:id").put(isAuthenticated, updateCompany);

export default router;
