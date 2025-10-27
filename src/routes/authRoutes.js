const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

//==============================================================================
// API Endpoints for Authentication
//==============================================================================

// This single endpoint can serve as both "validate-token" and "get-user-profile"
// It's protected by the middleware, so if the token is invalid, it will fail.
// If it's valid, it will return the user's data.
// GET /api/auth/profile
router.get('/profile', authMiddleware, authController.getCurrentUser);

module.exports = router;