const User = require("../models/User");
const Attendance = require("../models/Attendance");

const getDashboardStatistics = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalEmployees,
      activeEmployees,
      presentToday,
      lateToday,
      halfDayToday,
      absentToday,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        isActive: true,
      }),

      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        status: "Present",
      }),

      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        status: "Late",
      }),

      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        status: "Half Day",
      }),

      Attendance.countDocuments({
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
        status: "Absent",
      }),
    ]);

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      presentToday,
      lateToday,
      halfDayToday,
      absentToday,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEmployeeDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalAttendance, present, absent, late, halfDay, attendance] =
      await Promise.all([
        Attendance.countDocuments({ userId }),

        Attendance.countDocuments({
          userId,
          status: "Present",
        }),

        Attendance.countDocuments({
          userId,
          status: "Absent",
        }),

        Attendance.countDocuments({
          userId,
          status: "Late",
        }),

        Attendance.countDocuments({
          userId,
          status: "Half Day",
        }),

        Attendance.find({ userId }),
      ]);

    const totalOvertimeMinutes = attendance.reduce(
      (total, record) => total + record.overtimeMinutes,
      0,
    );

    const attendanceRate =
      totalAttendance === 0
        ? 0
        : Math.round(((present + late + halfDay) / totalAttendance) * 100);

    res.status(200).json({
      totalAttendance,
      present,
      late,
      halfDay,
      absent,
      totalOvertimeMinutes,
      attendanceRate,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStatistics,
  getEmployeeDashboard,
};
