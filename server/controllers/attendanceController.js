const Attendance = require("../models/Attendance");
const {
  calculateLateMinutes,
  calculateOvertimeMinutes,
  calculateStatus,
} = require("../utils/attendanceUtils");

const timeIn = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();

    const existingAttendance = await Attendance.findOne({
      userId,
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Already timed in today",
      });
    }

    const currentTime = new Date();
    const lateMinutes = calculateLateMinutes(currentTime);
    console.log("Late to save:", lateMinutes);

    const attendance = await Attendance.create({
      userId,
      date: currentTime,
      timeIn: currentTime,
      lateMinutes,
      status: calculateStatus(lateMinutes),
    });
    console.log("Saved attendance:", attendance);
    res.status(200).json({
      message: "Time in successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const timeOut = async (req, res) => {
  try {
    const userId = req.user._id;

    const today = new Date();

    const attendance = await Attendance.findOne({
      userId,
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
    });

    if (!attendance) {
      return res.status(404).json({
        message: "No time-in record found for today",
      });
    }

    if (attendance.timeOut) {
      return res.status(400).json({
        message: "Already timed out today",
      });
    }

    const timeOut = new Date();

    attendance.timeOut = timeOut;

    attendance.overtimeMinutes = calculateOvertimeMinutes(timeOut);

    await attendance.save();

    res.status(200).json({
      message: "Time out successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const userId = req.user._id;

    const query = { userId };

    const date = new Date(req.query.date);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.date) {
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      query.date = {
        $gte: date,
        $lte: nextDate,
      };
    }
    const total = await Attendance.countDocuments(query);

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance not found",
      });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAttendanceByEmployee = async (req, res) => {
  try {
    const attendance = await Attendance.find({
      userId: req.params.employeeId,
    }).sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalAttendance, present, absent, late, halfDay, attendance] =
      await Promise.all([
        Attendance.countDocuments({ userId }),
        Attendance.countDocuments({ userId, status: "Present" }),
        Attendance.countDocuments({ userId, status: "Absent" }),
        Attendance.countDocuments({ userId, status: "Late" }),
        Attendance.countDocuments({ userId, status: "Half Day" }),
        Attendance.find({ userId }),
      ]);

    const totalOvertimeMinutes = attendance.reduce(
      (total, record) => total + record.overtimeMinutes,
      0,
    );

    res.status(200).json({
      totalAttendance,
      present,
      absent,
      late,
      halfDay,
      totalOvertimeMinutes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAttendanceReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month, year, status } = req.query;

    const query = { userId };

    // Optional status filter
    if (status) {
      query.status = status;
    }

    // Optional date filter
    if (year) {
      let startDate;
      let endDate;

      if (month) {
        // Monthly report
        startDate = new Date(Number(year), Number(month) - 1, 1);
        endDate = new Date(Number(year), Number(month), 1);
      } else {
        // Yearly report
        startDate = new Date(Number(year), 0, 1);
        endDate = new Date(Number(year) + 1, 0, 1);
      }

      query.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const report = await Attendance.find(query).sort({ date: -1 });

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  timeIn,
  timeOut,
  getAttendance,
  getAttendanceById,
  getAttendanceByEmployee,
  getAttendanceSummary,
  getAttendanceReports,
};
