import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  Warning,
  Cancel,
  WorkHistory,
  AccessTime,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getAttendanceReports } from "../api/attendanceApi";
import { useAuth } from "../components/context/AuthContext";

import dayjs from "dayjs";

const Reports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);

  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatMinutes = (minutes) => {
    if (!minutes || minutes <= 0) return "-";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min${mins > 1 ? "s" : ""}`;
    if (mins === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;

    return `${hours} hr${hours > 1 ? "s" : ""} ${mins} min${mins > 1 ? "s" : ""}`;
  };

  const handleChangePage = (event, newPage) => {};

  const fetchReports = async () => {
    try {
      const data = await getAttendanceReports(token, month, year);
      setReports(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReports();
    }
  }, [token, month, year]);

  const totalPresent = reports.filter(
    (record) => record.status === "Present",
  ).length;

  const totalLate = reports.filter((record) => record.status === "Late").length;

  const totalHalfDay = reports.filter(
    (record) => record.status === "Half Day",
  ).length;

  const totalAbsent = reports.filter(
    (record) => record.status === "Absent",
  ).length;

  const totalOvertime = reports.reduce(
    (sum, record) => sum + record.overtimeMinutes,
    0,
  );

  const totalWorked = reports.filter(
    (record) => record.status !== "Absent",
  ).length;

  const StatCard = ({ title, value, icon, bgColor }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: bgColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Attendance Reports
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        View your attendance reports by month and year.
      </Typography>
      <Card sx={{ mt: 3, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Month</InputLabel>
                <Select
                  value={month}
                  label="Month"
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <MenuItem value={1}>January</MenuItem>
                  <MenuItem value={2}>February</MenuItem>
                  <MenuItem value={3}>March</MenuItem>
                  <MenuItem value={4}>April</MenuItem>
                  <MenuItem value={5}>May</MenuItem>
                  <MenuItem value={6}>June</MenuItem>
                  <MenuItem value={7}>July</MenuItem>
                  <MenuItem value={8}>August</MenuItem>
                  <MenuItem value={9}>September</MenuItem>
                  <MenuItem value={10}>October</MenuItem>
                  <MenuItem value={11}>November</MenuItem>
                  <MenuItem value={12}>December</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Year</InputLabel>
                <Select
                  value={year}
                  label="Year"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <MenuItem value={2025}>2025</MenuItem>
                  <MenuItem value={2026}>2026</MenuItem>
                  <MenuItem value={2027}>2027</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <StatCard
                title="Worked"
                value={totalWorked}
                icon={<WorkHistory />}
                bgColor="#1976d2"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <StatCard
                title="Present"
                value={totalPresent}
                icon={<CheckCircle />}
                bgColor="#2e7d32"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <StatCard
                title="Late"
                value={totalLate}
                icon={<Schedule />}
                bgColor="#ed6c02"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <StatCard
                title="Half Day"
                value={totalHalfDay}
                icon={<AccessTime />}
                bgColor="#9c27b0"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <StatCard
                title="Absent"
                value={totalAbsent}
                icon={<Cancel />}
                bgColor="#d32f2f"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <StatCard
                title="Overtime"
                value={formatMinutes(totalOvertime)}
                icon={<AccessTime />}
                bgColor="#0288d1"
              />
            </Grid>
          </Grid>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Attendance Records
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time In</TableCell>
                  <TableCell>Time Out</TableCell>
                  <TableCell>Late</TableCell>
                  <TableCell>Overtime</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {reports.length > 0 ? (
                  reports.map((record) => (
                    <TableRow key={record._id}>
                      <TableCell>
                        {dayjs(record.date).format("MMM D, YYYY")}
                      </TableCell>

                      <TableCell>
                        {dayjs(record.timeIn).format("h:mm A")}
                      </TableCell>

                      <TableCell>
                        {record.timeOut
                          ? dayjs(record.timeOut).format("h:mm A")
                          : "-"}
                      </TableCell>

                      <TableCell>{formatMinutes(record.lateMinutes)}</TableCell>

                      <TableCell>
                        {formatMinutes(record.overtimeMinutes)}
                      </TableCell>

                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
