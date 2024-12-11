import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // To hash passwords

// User Schema (supports job-seekers, recruiters, and admins)
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Regex for email format
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10,15}$/ // Validates phone number format (10-15 digits)
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['job-seeker', 'recruiter', 'admin'],
        required: true
    },
    profile: {
        bio: { type: String, default: '' },
        skills: [{ type: String }],
        resume: { 
            type: String, 
            default: '', 
            match: /^https?:\/\/.+\.pdf$/i // Only allows PDF URLs
        },
        resumeOriginalName: { type: String, default: '' },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: "",
        },
        recruiterProof: { // New field for recruiter proof
            type: String,
            default: "", // Stores the file URL
            match: /^https?:\/\/.+\.(pdf|jpg|jpeg|png)$/i // Only allows valid file formats
        },
        recruiterProofOriginalName: { // To store the original file name
            type: String,
            default: ""
        }
    },
}, { timestamps: true });

// Adding indexes for email and phoneNumber
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

// Create the User model
export const User = mongoose.model('User', userSchema);
