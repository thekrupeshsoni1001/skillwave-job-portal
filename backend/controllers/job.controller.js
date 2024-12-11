import Job from "../models/job.model.js"; // Use the default import
import sendSms from '../services/textbeltService.js'; // Adjust import to the new service

// Recruiter posts a job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.user._id; // Get user ID from middleware

        // Validate input
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Some fields are missing.",
                success: false
            });
        }

        // Create the job
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(",").map(req => req.trim()), // Handle requirements as an array
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId // Associate the job with the recruiter
        });

        return res.status(201).json({
            message: "Job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({
            message: "An error occurred while posting the job.",
            success: false
        });
    }
};

// Job seeker applies to a job
export const applyJob = async (req, res) => {
    try {
        const { jobId, jobSeekerId, recruiterPhone } = req.body; 
        const userId = req.user._id; // Get user ID from middleware

        // Find job by ID
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Send SMS to recruiter notifying them of the application
        const message = `Job seeker with ID: ${jobSeekerId} has applied for the job with ID: ${jobId}.`;
        await sendSms(recruiterPhone, message);

        return res.status(200).json({
            message: "Applied for job and SMS sent to recruiter.",
            success: true
        });
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({
            message: "An error occurred while applying for the job.",
            success: false
        });
    }
};

// Recruiter approves a job seeker
export const approveJob = async (req, res) => {
    try {
        const { jobId, jobSeekerPhone } = req.body;
        const userId = req.user._id; // Get user ID from middleware

        // Find job by ID
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Logic to approve the job application (not shown here)
        // ...

        // Send SMS to job seeker notifying them of the approval
        const message = `Your application for job ID: ${jobId} has been approved.`;
        await sendSms(jobSeekerPhone, message);

        return res.status(200).json({
            message: "Job approved and SMS sent to job seeker.",
            success: true
        });
    } catch (error) {
        console.error("Error approving job:", error);
        return res.status(500).json({
            message: "An error occurred while approving the job.",
            success: false
        });
    }
};

// Get all jobs (available for job seekers)
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        // Fetch jobs matching the search query
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            message: "An error occurred while fetching jobs.",
            success: false
        });
    }
};

// Get job details by ID (for job seekers)
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        return res.status(500).json({
            message: "An error occurred while fetching the job.",
            success: false
        });
    }
};

// Get all jobs created by the recruiter
export const getRecruiterJobs = async (req, res) => {
    try {
        const recruiterId = req.user._id; // Get user ID from middleware
        const jobs = await Job.find({ created_by: recruiterId }).populate({
            path: 'company',
            options: { sort: { createdAt: -1 } }
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error fetching recruiter jobs:", error);
        return res.status(500).json({
            message: "An error occurred while fetching jobs.",
            success: false
        });
    }
};
