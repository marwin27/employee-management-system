const ATTENDANCE_CONFIG = require("../config/attendanceConfig");
const calculateLateMinutes = (timeIn) => {
  const shiftStart = new Date(timeIn);

  shiftStart.setHours(
    ATTENDANCE_CONFIG.SHIFT_START_HOUR,
    ATTENDANCE_CONFIG.SHIFT_START_MINUTE,
    0,
    0,
  );

  const lateMilliseconds = timeIn - shiftStart;

  const lateMinutes = Math.floor(lateMilliseconds / 60000);

  if (lateMinutes <= 0) {
    return 0;
  }
  return lateMinutes;
};

const calculateOvertimeMinutes = (timeOut) => {
  const shiftEnd = new Date(timeOut);

  shiftEnd.setHours(
    ATTENDANCE_CONFIG.SHIFT_END_HOUR,
    ATTENDANCE_CONFIG.SHIFT_END_MINUTE,
    0,
    0,
  );

  const overtimeMilliseconds = timeOut - shiftEnd;

  const overtimeMinutes = Math.floor(overtimeMilliseconds / 60000);

  if (overtimeMinutes <= 0) {
    return 0;
  }
  return (
    Math.floor(overtimeMinutes / ATTENDANCE_CONFIG.OT_INCREMENT) *
    ATTENDANCE_CONFIG.OT_INCREMENT
  );
};

const calculateStatus = (lateMinutes) => {
  if (lateMinutes >= ATTENDANCE_CONFIG.ABSENT_MINUTES) {
    return "Absent";
  }

  if (lateMinutes >= ATTENDANCE_CONFIG.HALF_DAY_MINUTES) {
    return "Half Day";
  }

  if (lateMinutes > 0) {
    return "Late";
  }

  return "Present";
};

module.exports = {
  calculateLateMinutes,
  calculateOvertimeMinutes,
  calculateStatus,
};
