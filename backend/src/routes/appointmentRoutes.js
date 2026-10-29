const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GET  /api/appointments        — any authenticated user
// POST /api/appointments        — any authenticated user (book an appointment)
router
  .route('/')
  .get(protect, getAppointments)
  .post(protect, createAppointment);

// GET    /api/appointments/:id  — any authenticated user
// PUT    /api/appointments/:id  — any authenticated user (update own; admin can do all)
// DELETE /api/appointments/:id  — admin only
router
  .route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect,  deleteAppointment);

module.exports = router;
