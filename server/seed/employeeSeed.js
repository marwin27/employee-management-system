const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedEmployees = async () => {
  try {
    console.log("Connected to MongoDB");

    await User.deleteMany({
      role: "Employee",
    });

    const password = await bcrypt.hash("password123", 10);

    const employees = [];
    const departments = ["IT", "HR", "Finance", "Marketing", "Sales"];

    const positions = ["Staff", "Officer", "Supervisor", "Manager"];

    for (let i = 1; i <= 20; i++) {
      employees.push({
        employeeId: `EMP${String(i).padStart(3, "3")}`,
        firstName: `Employee${i}`,
        lastName: "Test",
        email: `employee${i}@gmail.com`,
        password,
        department: departments[i % departments.length],
        position: positions[i % positions.length],
        role: "Employee",
        isActive: true,
      });
    }

    await User.insertMany(employees);

    console.log("20 Employees Created");
  } catch (error) {
    console.log(error);
  } finally {
    mongoose.disconnect();
  }
};

seedEmployees();
