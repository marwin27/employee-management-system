import { Box, Typography, Grid, Card, CardContent, Stack } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState, useEffect } from "react";
import { getAttendanceSummary } from "../api/attendanceApi";
import { useAuth } from "../components/context/AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const { token } = useAuth();
  const stats = [
    {
      title: "Total Attendance",
      value: summary?.totalAttendance || 0,
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Present",
      value: summary?.present || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Absent",
      value: summary?.absent || 0,
      icon: <CancelIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Late",
      value: summary?.late || 0,
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: "Half Day",
      value: summary?.halfDay || 0,
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    },
  ];

  const chartData = [
    {
      name: "Present",
      value: summary?.present || 0,
    },
    {
      name: "Absent",
      value: summary?.absent || 0,
    },
    {
      name: "Late",
      value: summary?.late || 0,
    },
    {
      name: "Half Day",
      value: summary?.halfDay || 0,
    },
  ];

  const fetchSummary = async () => {
    try {
      const data = await getAttendanceSummary(token);
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
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Welcome to the Employee Management System.
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      color: "primary.main",
                      p: 1.5,
                      borderRadius: 2,
                      display: "flex",
                    }}
                  >
                    {stat.icon}
                  </Box>

                  <Box>
                    <Typography color="text.secondary">{stat.title}</Typography>

                    <Typography variant="h4" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Attendance Overview
              </Typography>

              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1976d2" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Recent Attendance
              </Typography>

              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Table Coming Soon
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
