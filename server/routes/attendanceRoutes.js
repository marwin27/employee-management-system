const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  timeIn,
  timeOut,
  getAttendance,
  getAttendanceById,
  getAttendanceByEmployee,
  getAttendanceSummary,
  getAttendanceReports,
  getTodayAttendance,
  getMonthlyAttendance,
  getRecentAttendance,
} = require("../controllers/attendanceController");

router.post("/time-in", protect, timeIn);
router.post("/time-out", protect, timeOut);

router.get("/dashboard", protect, getAttendanceSummary);
router.get("/monthly", protect, getMonthlyAttendance);
router.get("/recent", protect, getRecentAttendance);
router.get("/reports", protect, getAttendanceReports);
router.get("/", protect, getAttendance);
router.get("/today", protect, getTodayAttendance);
router.get("/employee/:id", protect, getAttendanceByEmployee);

router.get("/:id", protect, getAttendanceById);

module.exports = router;
