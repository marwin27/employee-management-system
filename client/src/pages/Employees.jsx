import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useState, useEffect } from "react";

import EmployeeDialog from "../components/employee/EmployeeDialog";
import { getEmployees } from "../api/employeeApi";
import { useAuth } from "../components/context/AuthContext";

const Employees = () => {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]); 

  const { token } = useAuth();

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees(token);
      setEmployees(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Employees
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Manage all employees in the company.
      </Typography>

      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          placeholder="Search employee..."
          size="small"
          sx={{ width: 350 }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Employee
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.employeeId}</TableCell>

                <TableCell>
                  {employee.firstName} {employee.lastName}
                </TableCell>

                <TableCell>{employee.department}</TableCell>

                <TableCell>{employee.role}</TableCell>

                <TableCell align="center">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>

                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EmployeeDialog
        open={open}
        onClose={() => setOpen(false)}
        fetchEmployees={fetchEmployees}
      />
    </Box>
  );
};

export default Employees;
