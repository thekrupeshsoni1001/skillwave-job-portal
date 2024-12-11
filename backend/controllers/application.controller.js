import Application from '../models/application.model.js'; // Default import
import Job from "../models/job.model.js"; // Default import
import sendSms from "../services/smsService.js"; // Ensure you import the SMS service

// Apply for a job
export const applyJob = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is stored in req.user._id (adjust as necessary)
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Create the application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });

        // Link the application to the job
        job.applications.push(newApplication._id);
        await job.save();

        // Send SMS notification to the recruiter (ensure recruiterPhone is in the Job model)
        const recruiterPhone = job.recruiterPhone; // Ensure recruiterPhone is a valid field in the job model
        const message = `Job seeker with ID: ${userId} has applied for the job: ${job.title}.`;
        await sendSms(recruiterPhone, message); // Send SMS notification

        return res.status(201).json({
            message: "Job applied successfully and SMS sent to recruiter.",
            success: true
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Get applied jobs for the job seeker
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.user._id;
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'company',
                    options: { sort: { createdAt: -1 } },
                }
            });

        if (!applications.length) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        return res.status(200).json({
            applications,
            success: true
        });
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Get applicants for a specific job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });

        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.error("Error fetching applicants:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Update the status of an application (e.g., accepted or rejected)
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: 'Status is required.',
                success: false
            });
        }

        // Find the application by application ID
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase(); // Ensure consistency by converting to lowercase
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Get job seeker activities (for admin dashboard)
export const getJobSeekerActivities = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate({
                path: 'job',
                select: 'title company',
                populate: { path: 'company', select: 'name' }
            })
            .populate({
                path: 'applicant',
                select: 'name email' // Include any other necessary fields
            })
            .sort({ createdAt: -1 });

        if (!applications.length) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        return res.status(200).json({
            applications,
            success: true
        });
    } catch (error) {
        console.error("Error fetching job seeker activities:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
