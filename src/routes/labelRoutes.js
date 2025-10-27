const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { 
    generateLabelsForRequest, 
    getLabelTemplate, 
    getEligibleRequestsForLabels 
} = require('../controllers/labelController');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/labels/template - Get label template information
router.get('/template', getLabelTemplate);

// GET /api/labels/eligible-requests - Get requests eligible for label generation
router.get('/eligible-requests', getEligibleRequestsForLabels);

// GET /api/labels/:requestId - Generate labels for a specific request
router.get('/:requestId', generateLabelsForRequest);

module.exports = router;

