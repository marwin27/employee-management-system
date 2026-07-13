const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} = require("../controllers/employeeController");

router.get("/", protect, getEmployees);
router.get("/:id", protect, getEmployeeById);
router.post("/", protect, createEmployee);
router.put("/:id", protect, updateEmployee);
router.put("/:id/deactivate", protect, deactivateEmployee);


module.exports = router;
