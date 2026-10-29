import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
// @desc    Get all appointments with filters
// @route   GET /api/appointments
exports.getAppointments = async (req, res) => {
  try {
    const { doctorId, status, date, search, sortBy = 'date', sortOrder = 'asc' } = req.query;

    const query = {};

    if (doctorId && doctorId !== 'All') {
      query.doctor = doctorId;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { patientPhone: { $regex: search, $options: 'i' } },
        { symptoms: { $regex: search, $options: 'i' } },
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    // Secondary sort by timeSlot
    sort.timeSlot = 1;

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialty hospital chamber consultationFee visitingHours avatarUrl')
      .sort(sort);

    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single appointment by ID
// @route   GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      'doctor',
      'name specialty hospital chamber phone email'
    );
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const doctorExists = await Doctor.findById(req.body.doctor);
    if (!doctorExists) {
      return res.status(400).json({ success: false, message: 'Selected doctor not found' });
    }

    const appointment = await Appointment.create(req.body);
    const populated = await appointment.populate(
      'doctor',
      'name specialty hospital chamber consultationFee visitingHours'
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment (status, details, etc.)
// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('doctor', 'name specialty hospital chamber consultationFee visitingHours');

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, message: 'Appointment deleted successfully', data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
