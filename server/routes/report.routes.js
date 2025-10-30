/**
 * Report Routes
 */

const express = require('express');
const router = express.Router();
const { getSummary, exportCSV, exportPDF } = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.get('/summary', getSummary);
router.get('/export/csv', exportCSV);
router.get('/export/pdf', exportPDF);

module.exports = router;
