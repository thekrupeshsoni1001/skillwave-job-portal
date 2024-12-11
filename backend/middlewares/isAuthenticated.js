import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Check for token in cookies
        if (!req.cookies || !req.cookies.token) {
            return res.status(401).json({
                message: "User not authenticated. Token missing.",
                success: false,
            });
        }

        const token = req.cookies.token;

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token.",
                success: false,
            });
        }

        // Set user ID in request object
        req.id = decoded.userId;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        // Handle specific JWT errors (e.g., expired token)
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired. Please log in again.",
                success: false,
            });
        }

        return res.status(500).json({
            message: "Internal server error during authentication.",
            success: false,
        });
    }
};

export default isAuthenticated;
