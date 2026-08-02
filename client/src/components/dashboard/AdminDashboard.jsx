import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAdminDashboard } from "../../api/dashboardApi";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import CancelIcon from "@mui/icons-material/Cancel";
import StatCard from "../common/StatCard";
const AdminDashboard = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState(null);

  const fetchSummary = async () => {
    try {
      const data = await getAdminDashboard(token);
      setSummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
    }
  }, [token]);

  const stats = [
    {
      title: "Total Employees",
      value: summary?.totalEmployees || 0,
      icon: <GroupsIcon />,
      bgColor: "#1976d2",
    },
    {
      title: "Present Today",
      value: summary?.presentToday || 0,
      icon: <CheckCircleIcon />,
      bgColor: "#2e7d32",
    },
    {
      title: "Late Today",
      value: summary?.lateToday || 0,
      icon: <AccessTimeIcon />,
      bgColor: "#ed6c02",
    },
    {
      title: "Half Day Today",
      value: summary?.halfDayToday || 0,
      icon: <WarningIcon />,
      bgColor: "#9c27b0",
    },
    {
      title: "Absent Today",
      value: summary?.absentToday || 0,
      icon: <CancelIcon />,
      bgColor: "#d32f2f",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Admin Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Monitor employee attendance and workforce activity for today.
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              bgColor={stat.bgColor}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
