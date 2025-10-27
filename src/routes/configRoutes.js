const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/permohonan-pemusnahan-limbah-columns', configController.getPermohonanColumns);
router.get('/berita-acara-columns', configController.getBeritaAcaraColumns);
router.get('/status-display-properties', configController.getStatusProperties);
router.get('/berita-acara-deletable-statuses', configController.getDeletableStatuses);

module.exports = router;