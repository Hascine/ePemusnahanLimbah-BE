const express = require('express');
const router = express.Router();
const optionsController = require('../controllers/optionsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/golongan-limbah', optionsController.getGolonganLimbah);
router.get('/jenis-limbah-b3', optionsController.getJenisLimbahB3);

module.exports = router;