const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/dashboard/stats -> Get dashboard statistics for current user
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;