import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator"; 
import multer from "multer";
import path from "path";

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/proofs"); // Directory where recruiter proofs will be stored
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    // Accept only valid file types
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.mimetype)) {
        return cb(new Error("Only PDF, JPG, and PNG files are allowed"), false);
    }
    cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Register
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role, company } = req.body;

        // Validate input fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if all required fields are provided
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Role-specific validations
        if (role === "recruiter") {
            // Ensure recruiter proof is uploaded
            if (!req.file) {
                return res.status(400).json({ message: "Recruiter proof is required." });
            }

            // Ensure company name is provided
            if (!company) {
                return res.status(400).json({ message: "Company name is required for recruiters." });
            }
        } else if (role === "job-seeker" && !req.file) {
            // Ensure job-seekers upload a resume
            return res.status(400).json({ message: "Resume is required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email or phone number already exists." });
        }

        // Prepare profile data
        const profile = {};

        if (role === "job-seeker" && req.file) {
            // Save resume for job-seeker
            profile.resume = req.file.path; // Store the file path
            profile.resumeOriginalName = req.file.originalname; // Store the original file name
        } else if (role === "recruiter" && req.file) {
            // Save recruiter proof
            profile.recruiterProof = req.file.path; // Store the file path of proof
            profile.recruiterProofOriginalName = req.file.originalname; // Store the original name of the proof
            profile.company = company; // Attach the company name
        }

        // Create new user
        const newUser = new User({
            fullname,
            email,
            phoneNumber,
            password,
            role,
            profile,
        });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

        // Return success message with the user's role for redirection
        res.status(201).json({
            message: "User registered successfully.",
            success: true,
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role, // Include the role for frontend redirection
            },
        });
    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ message: "Server error. Please try again later.", success: false });
    }
};


// Login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate input fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find the user by email and role
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials: User not found." });
        }

        console.log("User found:", user); // Debug log for user

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isMatch); // Debug log for comparison result

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials: Incorrect password." });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
        
        // Send token in cookies (for front-end to use)
        res.cookie("token", token, { httpOnly: true, secure: false }); // Set secure: false for local testing

        res.status(200).json({ message: "Login successful.", user, token });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Server error. Please try again later.", success: false });
    }
};

// Logout
export const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful." });
    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: "Server error. Please try again later.", success: false });
    }
};

// Update profile
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const { fullname, bio, skills, resume } = req.body;

        // Find the user by ID and update the profile fields
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.fullname = fullname || user.fullname;
        user.profile.bio = bio || user.profile.bio;
        user.profile.skills = skills || user.profile.skills;
        user.profile.resume = resume || user.profile.resume;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ message: "Server error. Please try again later.", success: false });
    }
};

// Get all job seekers (Admin route)
export const getJobSeekers = async (req, res) => {
    try {
        const jobSeekers = await User.find({ role: "job-seeker" }).select("-password");
        res.status(200).json({ jobSeekers });
    } catch (error) {
        console.error("Error in getJobSeekers:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Delete a job seeker (Admin route)
export const deleteJobSeeker = async (req, res) => {
    try {
        const { id } = req.params;

        const jobSeeker = await User.findByIdAndDelete(id);
        if (!jobSeeker) {
            return res.status(404).json({ message: "Job seeker not found." });
        }

        res.status(200).json({ message: "Job seeker deleted successfully." });
    } catch (error) {
        console.error("Error in deleteJobSeeker:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

// Admin signup
export const adminSignup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email is provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists." });
        }

        const newAdmin = new User({
            email,
            password,
            role: "admin"
        });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        newAdmin.password = await bcrypt.hash(password, salt);

        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully.", success: true });
    } catch (error) {
        console.error("Error in adminSignup:", error);
        res.status(500).json({ message: "Server error. Please try again later.", success: false });
    }
};

// Admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.SECRET_KEY, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: false }); // Set secure: false for local testing
        res.status(200).json({ message: "Login successful.", token });
    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ message: "Server error. Please try again later.", success: false });
    }
};
