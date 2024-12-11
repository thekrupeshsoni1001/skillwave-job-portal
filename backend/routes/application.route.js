import express from "express";
import Job from '../models/job.model.js'; // Job model
import Application from '../models/application.model.js'; // Application model
import isAuthenticated from "../middlewares/isAuthenticated.js"; // Auth middleware
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js"; // Controller functions
import getJobSeekerId from "../utils/getJobSeekerId.js"; // Utility to get job seeker by phone number
import sendSms from "../services/smsService.js"; // SMS service for notifications

const router = express.Router();

// Apply for a job (POST request)
router.route("/apply/:id").post(isAuthenticated, async (req, res) => {
    const jobId = req.params.id;
    const userPhoneNumber = req.user.phoneNumber; // Assuming req.user contains the authenticated user's info

    try {
        // Get the job seeker ID based on their phone number
        const jobSeekerId = await getJobSeekerId(userPhoneNumber); // Assuming job seeker info is tied to phone number

        if (!jobSeekerId) {
            return res.status(404).json({ message: "Job Seeker not found." });
        }

        // Check if the user has already applied for this job
        const existingApplication = await Application.findOne({ job: jobId, applicant: jobSeekerId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false,
            });
        }

        // Find the job and recruiter details
        const job = await Job.findById(jobId).populate('created_by'); // Assuming 'created_by' references the recruiter

        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        // Ensure recruiter has a valid phone number
        if (!job.created_by || !job.created_by.phoneNumber) {
            return res.status(404).json({ message: "Recruiter's phone number not found." });
        }

        const recruiterPhone = job.created_by.phoneNumber; // Get the recruiter's phone number

        // Save the application to the database
        const newApplication = new Application({
            job: jobId,
            applicant: jobSeekerId,
        });
        await newApplication.save();

        // Send SMS to recruiter notifying them of the application
        const message = `Job seeker with ID: ${jobSeekerId} has applied for the job with ID: ${jobId}.`;
        await sendSms(recruiterPhone, message); // Send SMS to recruiter

        return res.status(200).json({
            message: "Applied for job and SMS sent to recruiter.",
            success: true,
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({
            message: "Server error.",
            error: error.message,
        });
    }
});

// Get applied jobs (GET request)
router.route("/get").get(isAuthenticated, getAppliedJobs);

// Get applicants for a job (GET request)
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// Update application status (POST request)
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
