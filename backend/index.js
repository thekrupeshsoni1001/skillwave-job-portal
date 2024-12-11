import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

// For ES modules, we need to properly handle file paths
const uploadDir = path.resolve('uploads'); // This ensures a correct path relative to the current directory

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Path where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name based on timestamp
    }
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup with credentials
const corsOptions = {
    origin: 'http://localhost:5175', // Your frontend URL
    credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// File upload route
app.post('/api/v1/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    res.json({ message: 'File uploaded successfully', filePath: req.file.path });
});

// Start server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
