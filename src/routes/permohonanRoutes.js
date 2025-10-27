const express = require('express');
const router = express.Router();
const permohonanController = require('../controllers/permohonanController');
const authMiddleware = require('../middleware/authMiddleware');

// The middleware is applied to all routes in this file.
// Every endpoint below will require a valid JWT.
router.use(authMiddleware);

// --- Core CRUD Routes ---

// GET /api/permohonan -> List all requests
router.get('/', permohonanController.getAllPermohonan);

// POST /api/permohonan -> Create a new request (as a draft)
router.post('/', permohonanController.createPermohonan);

// GET /api/permohonan/:id -> Get a single request's details
router.get('/:id', permohonanController.getPermohonanById);

// GET /api/permohonan/:id/detail -> Get detailed request info for editing
router.get('/:id/detail', permohonanController.getPermohonanById);

// PUT /api/permohonan/:id -> Update a request
router.put('/:id', permohonanController.updatePermohonan);

// DELETE /api/permohonan/:id -> Delete a request (if draft or rejected)
router.delete('/:id', permohonanController.deletePermohonan);


// --- Workflow Action Routes ---

// POST /api/permohonan/:id/submit -> Submit a draft for approval
router.post('/:id/submit', permohonanController.submitPermohonan);

// POST /api/permohonan/:id/approve -> Approve a request at its current step
router.post('/:id/approve', permohonanController.approvePermohonan);

// POST /api/permohonan/:id/reject -> Reject a request at its current step
router.post('/:id/reject', permohonanController.rejectPermohonan);

module.exports = router;