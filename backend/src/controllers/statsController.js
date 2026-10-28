const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get dashboard statistics
// @route   GET /api/stats
exports.getStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      totalDoctors,
      activeDoctors,
      totalAppointments,
      todayAppointments,
      confirmedAppointments,
      completedAppointments,
      recentAppointments,
      specialtyDistribution,
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ status: 'Active' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ date: today }),
      Appointment.countDocuments({ status: 'Confirmed' }),
      Appointment.countDocuments({ status: 'Completed' }),
      Appointment.find()
        .populate('doctor', 'name specialty hospital')
        .sort({ createdAt: -1 })
        .limit(5),
      Doctor.aggregate([
        {
          $group: {
            _id: '$specialty',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
    ]);

    const statusCounts = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStatusCounts = {
      Scheduled: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    };

    statusCounts.forEach((item) => {
      if (item._id && formattedStatusCounts.hasOwnProperty(item._id)) {
        formattedStatusCounts[item._id] = item.count;
      }
    });

    res.json({
      success: true,
      data: {
        totalDoctors,
        activeDoctors,
        totalAppointments,
        todayAppointments,
        confirmedAppointments,
        completedAppointments,
        statusCounts: formattedStatusCounts,
        recentAppointments,
        specialties: specialtyDistribution.map((s) => ({ specialty: s._id, count: s.count })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
