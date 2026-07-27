import { useState, useEffect } from "react";
import { useAuth } from "../components/context/AuthContext";
import {
  timeIn,
  timeOut,
  getAttendance,
  getTodayAttendance,
} from "../api/attendanceApi";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TablePagination,
} from "@mui/material";
import dayjs from "dayjs";

const Attendance = () => {
  const { token } = useAuth();

  const [attendance, setAttendance] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [canTimeIn, setCanTimeIn] = useState(true);
  const [canTimeOut, setCanTimeOut] = useState(false);

  const fetchAttendance = async () => {
    try {
      const response = await getAttendance(token, page, rowsPerPage);

      setAttendance(response.attendance);
      setTotal(response.total);
      
      const todayData = await getTodayAttendance(token);
      const todayAttendance = todayData.attendance;

      if (!todayAttendance) {
        setCanTimeIn(true);
        setCanTimeOut(false);
      } else if (!todayAttendance.timeOut) {
        setCanTimeIn(false);
        setCanTimeOut(true);
      } else {
        setCanTimeIn(false);
        setCanTimeOut(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAttendance();
    }
  }, [token, page, rowsPerPage]);

  const formatMinutes = (minutes) => {
    if (!minutes || minutes <= 0) return "-";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} min${mins > 1 ? "s" : ""}`;
    if (mins === 0) return `${hours} hr${hours > 1 ? "s" : ""}`;

    return `${hours} hr${hours > 1 ? "s" : ""} ${mins} min${mins > 1 ? "s" : ""}`;
  };
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Attendance
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          disabled={!canTimeIn}
          onClick={async () => {
            try {
              await timeIn(token);
              fetchAttendance();
            } catch (error) {
              console.log(error.response?.data);
            }
          }}
        >
          Time In
        </Button>

        <Button
          variant="contained"
          color="error"
          disabled={!canTimeOut}
          onClick={async () => {
            try {
              await timeOut(token);
              fetchAttendance();
            } catch (error) {
              console.log(error.response?.data);
            }
          }}
        >
          Time Out
        </Button>
      </Box>

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
            {attendance.map((record) => (
              <TableRow key={record._id}>
                <TableCell>
                  {dayjs(record.date).format("MMM D, YYYY")}
                </TableCell>

                <TableCell>{dayjs(record.timeIn).format("h:mm A")}</TableCell>

                <TableCell>
                  {record.timeOut
                    ? dayjs(record.timeOut).format("h:mm A")
                    : "-"}
                </TableCell>

                <TableCell>{formatMinutes(record.lateMinutes)}</TableCell>

                <TableCell>{formatMinutes(record.overtimeMinutes)}</TableCell>

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
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={(event, newPage) => {
            setPage(newPage + 1);
          }}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(1);
          }}
        />
      </TableContainer>
    </Box>
  );
};

export default Attendance;
