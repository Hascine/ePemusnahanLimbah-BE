const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all user-related routes
router.use(authMiddleware);

// GET /api/users -> Get a filterable list of all users from the external API
router.get('/', userController.getAllUsers);

// GET /api/users/departments -> Get unique departments
router.get('/departments', userController.getDepartments);

// GET /api/users/job-levels -> Get unique job levels
router.get('/job-levels', userController.getJobLevels);

// GET /api/users/by-nik/:nik -> Get specific user by NIK
router.get('/by-nik/:nik', userController.getUserByNik);

module.exports = router;
