const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} = require("../controllers/employeeController");

router.get("/", protect, adminOnly, getEmployees);
router.get("/:id", protect, adminOnly, getEmployeeById);
router.post("/", protect, adminOnly, createEmployee);
router.put("/:id", protect, adminOnly, updateEmployee);
router.put("/:id/deactivate", protect, adminOnly, deactivateEmployee);

module.exports = router;
