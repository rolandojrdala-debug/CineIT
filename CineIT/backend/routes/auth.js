
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const db = require("../database");

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
// AUTHENTICATION COOKIE CONFIGURATION
// =====================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000
};

// =====================================
// JWT AUTHENTICATION
// =====================================

function setAuthCookie(res, user) {
  const token = jwt.sign(
    {
      sub: String(user.id),
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
      issuer: "cineit-api",
      audience: "cineit-client"
    }
  );

  res.cookie("cineit_session", token, cookieOptions);
}

// =====================================
// EMAIL NORMALIZATION
// =====================================

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

// =====================================
// REGISTER
// POST /api/auth/register
// =====================================

router.post("/register", authLimiter, async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    // Validate name
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        message: "Name must be between 2 and 100 characters."
      });
    }

    // Validate email
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 150
    ) {
      return res.status(400).json({
        message: "Enter a valid email address."
      });
    }

    // Validate password
    if (password.length < 12 || password.length > 128) {
      return res.status(400).json({
        message: "Password must be between 12 and 128 characters."
      });
    }

    // Check whether email already exists
    // Requires database integration.
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "That email is already registered."
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new user
    // Requires database integration.
    const [result] = await db.execute(
      "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    const user = {
      id: result.insertId,
      email
    };

    setAuthCookie(res, user);

    return res.status(201).json({
      message: "Your CineIT account has been created.",
      user: {
        id: user.id,
        name,
        email
      }
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error.code || error.message
    );

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "That email is already registered."
      });
    }

    return res.status(500).json({
      message: "Registration failed. Check the backend logs."
    });
  }
});

// =====================================
// LOGIN
// POST /api/auth/login
// =====================================

router.post("/login", authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    // Find user by email
    // Requires database integration.
    const [rows] = await db.execute(
      "SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const user = rows[0];

    // Compare submitted password with stored hash
    const valid = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // Create authentication cookie
    setAuthCookie(res, user);

    return res.json({
      message: "Welcome back to CineIT.",
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(
      "Login error:",
      error.code || error.message
    );

    return res.status(500).json({
      message: "Login failed. Check the backend logs."
    });
  }
});

// =====================================
// CURRENT USER SESSION
// GET /api/auth/me
// =====================================

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.cineit_session;

    if (!token) {
      return res.status(401).json({
        message: "Not signed in."
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        issuer: "cineit-api",
        audience: "cineit-client"
      }
    );

    // Find authenticated user
    // Requires database integration.
    const [rows] = await db.execute(
      "SELECT id, full_name, email FROM users WHERE id = ? LIMIT 1",
      [payload.sub]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Account no longer exists."
      });
    }

    const user = rows[0];

    return res.json({
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(401).json({
      message: "Session is invalid or expired."
    });
  }
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
