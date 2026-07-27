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
  TablePagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useState, useEffect } from "react";

import EmployeeDialog from "../components/employee/EmployeeDialog";
import { getEmployees, deactivateEmployee } from "../api/employeeApi";
import { useAuth } from "../components/context/AuthContext";

const Employees = () => {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to deactivate this employee?"
    );

    if (!confirmDelete) return;

    try {
      await deactivateEmployee(id, token);
      await fetchEmployees();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchTerm = search.toLowerCase();

    const fullName =
      `${employee.firstName || ""} ${employee.lastName || ""}`.toLowerCase();

    return (
      fullName.includes(searchTerm) ||
      (employee.employeeId || "").toLowerCase().includes(searchTerm) ||
      (employee.department || "").toLowerCase().includes(searchTerm) ||
      (employee.role || "").toLowerCase().includes(searchTerm)
    );
  });

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
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditEmployee(null);
            setOpen(true);
          }}
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
            {filteredEmployees
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              .map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell>{employee.employeeId}</TableCell>

                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>

                  <TableCell>{employee.department}</TableCell>

                  <TableCell>{employee.role}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditEmployee(employee);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(employee._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredEmployees.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={(event, newPage) => {
            setPage(newPage);
          }}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <EmployeeDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditEmployee(null);
        }}
        fetchEmployees={fetchEmployees}
        editEmployee={editEmployee}
      />
    </Box>
  );
};

export default Employees;