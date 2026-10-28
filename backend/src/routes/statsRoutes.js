const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');
// GET /api/stats — dashboard summary (authenticated users only)
router.get('/', protect, getStats);

module.exports = router;
