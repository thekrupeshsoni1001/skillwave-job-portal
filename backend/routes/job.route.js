import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getRecruiterJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();

// Route to post a job
router.route("/post").post(isAuthenticated, postJob);

// Route to get all jobs (for job seekers)
router.route("/get").get(isAuthenticated, getAllJobs);

// Route to get jobs created by the recruiter
router.route("/getrecruiterjobs").get(isAuthenticated, getRecruiterJobs); // Updated

// Route to get a job by ID
router.route("/get/:id").get(isAuthenticated, getJobById);

export default router;
