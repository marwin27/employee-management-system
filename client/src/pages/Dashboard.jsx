import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useState, useEffect } from "react";
import {
  getAttendanceSummary,
  getMonthlyAttendance,
  getRecentAttendance,
} from "../api/attendanceApi";
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
import dayjs from "dayjs";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const { token, user } = useAuth();

  const formatMinutes = (minutes) => {
    if (!minutes || minutes <= 0) return "0 mins";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min${mins > 1 ? "s" : ""}`;
    if (mins === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;

    return `${hours} hr${hours > 1 ? "s" : ""} ${mins} min${mins > 1 ? "s" : ""}`;
  };

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
    {
      title: "Total Overtime",
      value: formatMinutes(summary?.totalOvertimeMinutes),
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
    },
  ];
  const [monthlyAttendance, setMonthlyAttendance] = useState([]);
  const chartData = monthlyAttendance;

  const fetchSummary = async () => {
    try {
      const data = await getAttendanceSummary(token);
      setSummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMonthlyAttendance = async () => {
    try {
      const data = await getMonthlyAttendance(token);
      console.log(data);
      const monthNames = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const formattedData = data.map((item) => ({
        month: monthNames[item._id.month],
        Present: item.present,
        Late: item.late,
        Absent: item.absent,
        "Half Day": item.halfDay,
      }));

      setMonthlyAttendance(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  const [recentAttendance, setRecentAttendance] = useState([]);
  const fetchRecentAttendance = async () => {
    try {
      const data = await getRecentAttendance(token);
      setRecentAttendance(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSummary();
      fetchMonthlyAttendance();
      fetchRecentAttendance();
    }
  }, [token]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Welcome back, <strong>{user?.firstName}</strong> 👋
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Here's your attendance summary for today.
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.title}>
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
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="Present" fill="#4caf50" />
                    <Bar dataKey="Absent" fill="#9e9e9e" />
                    <Bar dataKey="Late" fill="#ff9800" />
                    <Bar dataKey="Half Day" fill="#f44336" />
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

              <Stack spacing={2} sx={{ mt: 2 }}>
                {recentAttendance.map((record) => (
                  <Box
                    key={record._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #eee",
                      pb: 1,
                    }}
                  >
                    <Box>
                      <Typography fontWeight="bold">
                        {dayjs(record.date).format("MMM D, YYYY")}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {dayjs(record.timeIn).format("h:mm A")}
                        {record.timeOut &&
                          ` - ${dayjs(record.timeOut).format("h:mm A")}`}
                      </Typography>
                    </Box>

                    <Chip
                      label={record.status}
                      color={
                        record.status === "Present"
                          ? "success"
                          : record.status === "Late"
                            ? "warning"
                            : record.status === "Half Day"
                              ? "error"
                              : "default"
                      }
                      size="small"
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
