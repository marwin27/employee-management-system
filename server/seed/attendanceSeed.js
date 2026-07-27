const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Attendance = require("../models/Attendance");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const USER_ID = "6a52f1f2909646800114f52e"; 

const seedAttendance = async () => {
  try {
    console.log("Connected");

    await Attendance.deleteMany({ userId: USER_ID });

    const records = [];

    for (let day = 1; day <= 30; day++) {
      const date = new Date(2026, 6, day); // July = 6

      let status;
      let lateMinutes = 0;
      let overtimeMinutes = 0;
      let timeIn;
      let timeOut;

      const random = Math.random();

      if (random < 0.60) {
      
        status = "Present";
        timeIn = new Date(2026, 6, day, 8, 25);
        timeOut = new Date(2026, 6, day, 17, 30);
      } else if (random < 0.85) {
   
        status = "Late";
        lateMinutes = Math.floor(Math.random() * 60) + 1;
        timeIn = new Date(2026, 6, day, 8, 30 + lateMinutes);
        timeOut = new Date(2026, 6, day, 17, 30);
      } else if (random < 0.95) {
      
        status = "Half Day";
        lateMinutes = 240;
        timeIn = new Date(2026, 6, day, 12, 30);
        timeOut = new Date(2026, 6, day, 17, 30);
      } else {
      
        status = "Absent";
        lateMinutes = 480;
        timeIn = new Date(2026, 6, day, 16, 30);
        timeOut = new Date(2026, 6, day, 17, 30);
      }

      
      if (Math.random() < 0.30) {
        overtimeMinutes = 30;
        timeOut = new Date(timeOut.getTime() + 30 * 60000);
      }

      records.push({
        userId: USER_ID,
        date,
        timeIn,
        timeOut,
        lateMinutes,
        overtimeMinutes,
        status,
      });
    }

    await Attendance.insertMany(records);

    console.log(`Inserted ${records.length} attendance records.`);
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.disconnect();
  }
};

seedAttendance();