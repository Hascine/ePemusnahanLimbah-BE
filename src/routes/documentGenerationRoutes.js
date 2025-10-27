const express = require('express');
const router = express.Router();
const { 
    getPermohonanDataForDoc, 
    getBeritaAcaraDataForDoc,
    generatePermohonanExcel,
    generateLogbookExcel
} = require('../controllers/documentGenerationController');
const PrintController = require('../controllers/printController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes in this file are protected by the authentication middleware
router.use(authMiddleware);

/**
 * GET /api/document-generation/permohonan/:id
 * Retrieves formatted data for generating the 'Permohonan' document.
 */
router.get('/permohonan/:id', getPermohonanDataForDoc);

/**
 * GET /api/document-generation/berita-acara/:id
 * Retrieves formatted data for generating the 'Berita Acara' document.
 */
router.get('/berita-acara/:id', getBeritaAcaraDataForDoc);

/**
 * GET /api/print-permohonan-pemusnahan
 * The new endpoint for printing the 'Permohonan Pemusnahan' document.
 */
router.get('/print-permohonan-pemusnahan', PrintController.printPermohonanPemusnahan);

/**
 * GET /api/print-berita-acara-pemusnahan
 * The new endpoint for printing the 'Berita Acara Pemusnahan' document.
 */
router.get('/print-berita-acara-pemusnahan', PrintController.printBeritaAcaraPemusnahan);

/**
 * GET /api/document-generation/permohonan/:id/excel
 * Generates an Excel file with the details of a specific Permohonan.
 */
router.get('/permohonan/:id/excel', generatePermohonanExcel);

/**
 * GET /api/document-generation/logbook/excel?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
 * Generates an Excel logbook file with multiple sheets grouped by jenis limbah.
 */
router.get('/logbook/excel', generateLogbookExcel);

module.exports = router;
