import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createEmployee, updateEmployee } from "../../api/employeeApi";

const EmployeeDialog = ({ open, onClose, fetchEmployees, editEmployee }) => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    password: "",
    role: "Employee",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (editEmployee) {
      setFormData({
        firstName: editEmployee.firstName,
        lastName: editEmployee.lastName,
        email: editEmployee.email,
        employeeId: editEmployee.employeeId,
        department: editEmployee.department,
        position: editEmployee.position,
        password: "",
        role: editEmployee.role,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        employeeId: "",
        department: "",
        position: "",
        password: "",
        role: "Employee",
      });
    }
    setErrorMessage("");
  }, [editEmployee]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editEmployee) {
        await updateEmployee(editEmployee._id, formData, token);
      } else {
        await createEmployee(formData, token);
      }

      await fetchEmployees();

      onClose();
    } catch (error) {
      setErrorMessage(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editEmployee ? "Edit Employee" : "Add Employee"}
      </DialogTitle>
      <form onSubmit={handleSave}>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required={!editEmployee}
                helperText={
                  editEmployee
                    ? "Leave blank to keep the current password."
                    : ""
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>

                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="Employee">Employee</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>

          <Button type="submit" variant="contained">
            {editEmployee ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EmployeeDialog;
