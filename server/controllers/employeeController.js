const User = require("../models/User");
const bcrypt = require("bcrypt");

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ isActive: true }).select("-password");

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id).select("-password");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    return res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      position,
    } = req.body;

    const existingEmployee = await User.findOne({
      $or: [{ email }, { employeeId }],
    });
    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      employeeId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      department,
      position,
    });
    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        position: employee.position,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeId,
      firstName,
      lastName,
      email,
      role,
      department,
      position,
    } = req.body;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.email = email || employee.email;
    employee.role = role || employee.role;
    employee.department = department || employee.department;
    employee.position = position || employee.position;

    await employee.save();

    res.status(200).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deactivateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.isActive = false;

    await employee.save();

    res.status(200).json({
      message: "Employee deactivated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
};
