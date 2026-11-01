
const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// =====================================
// RATE LIMITING
// =====================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        message: "Too many attempts. Please try again later."
    }
});

// =====================================
// REGISTER
// POST /api/auth/register
// Database integration pending
// =====================================

router.post("/register", authLimiter, (req, res) => {
    return res.status(503).json({
        message: "Registration is temporarily unavailable. Database integration is pending."
    });
});

// =====================================
// LOGIN
// POST /api/auth/login
// Database integration pending
// =====================================

router.post("/login", authLimiter, (req, res) => {
    return res.status(503).json({
        message: "Login is temporarily unavailable. Database integration is pending."
    });
});

// =====================================
// CURRENT USER SESSION
// GET /api/auth/me
// Database integration pending
// =====================================

router.get("/me", (req, res) => {
    return res.status(503).json({
        message: "Account sessions are unavailable until database integration is complete."
    });
});

// =====================================
// LOGOUT
// POST /api/auth/logout
// =====================================

router.post("/logout", (req, res) => {
    res.clearCookie("cineit_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/"
    });

    return res.json({
        message: "You have been signed out."
    });
});

// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;
