const express = require("express");
const router = express.Router();
const { adminOnly } = require("../middleware/adminMiddleware");

const { protect } = require("../middleware/authMiddleware");
const {
  getDashboardStatistics,
  getEmployeeDashboard,
} = require("../controllers/dashboardController");

router.get("/admin", protect, adminOnly, getDashboardStatistics);
router.get("/me", protect, getEmployeeDashboard);

module.exports = router;
