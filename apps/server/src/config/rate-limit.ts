import rateLimit from "express-rate-limit";

const DEFAULT_MAX = process.env.NODE_ENV === "production" ? 300 : 2000;

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX) || DEFAULT_MAX, // limit each IP to this many requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    }
});