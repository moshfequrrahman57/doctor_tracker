const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET  /api/doctors        — any authenticated user
// POST /api/doctors        — admin only
router
  .route('/')
  .get(protect, getDoctors)
  .post(protect,  createDoctor);

// GET    /api/doctors/:id  — any authenticated user
// PUT    /api/doctors/:id  — admin only
// DELETE /api/doctors/:id  — admin only
router
  .route('/:id')
  .get(protect, getDoctorById)
  .put(protect,  updateDoctor)
  .delete(protect,deleteDoctor);

module.exports = router;
