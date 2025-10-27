const express = require('express');
const router = express.Router();
const beritaAcaraController = require('../controllers/beritaAcaraController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Route to get available requests for daily log generation
router.get('/available-requests', beritaAcaraController.getAvailableRequestsForDailyLog);

// Route to generate a new Berita Acara from completed requests
router.post('/generate', beritaAcaraController.createBeritaAcara);

// Route to get pending signatures (for notifications)
router.get('/pending-signatures', beritaAcaraController.getPendingSignatures);

// Route to list all Berita Acara events
router.get('/', beritaAcaraController.getAllBeritaAcara);

// Route to get a single Berita Acara by ID
router.get('/:id', beritaAcaraController.getBeritaAcaraById);

// Route for signing ("approving") a Berita Acara
router.post('/:id/approve', beritaAcaraController.signBeritaAcara);

module.exports = router;