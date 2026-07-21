import { useState } from "react";
import { Box, Typography, Stack, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LoginForm from "../components/auth/LoginForm";
import { useAuth } from "../components/context/AuthContext";
import { login as loginApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginApi({
        email,
        password,
      });

      login(data);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        bgcolor: "black",
        background: "#0E3386",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          px: 24,
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Employee Management System
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mt: 2,
            mb: 5,
            maxWidth: 500,
          }}
        >
          A complete solution for managing employee attendance, reports, and
          workforce information in one secure platform.
        </Typography>
        <Stack spacing={2}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AccessTimeIcon color="primary" fontSize="large" />

            <Box>
              <Typography fontWeight="bold">Attendance Tracking</Typography>

              <Typography variant="body2" color="text.secondary">
                Track employee time-in, time-out, overtime and lateness.
              </Typography>
            </Box>
          </Paper>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <GroupsIcon color="primary" fontSize="large" />

            <Box>
              <Typography fontWeight="bold">Employee Management</Typography>

              <Typography variant="body2" color="text.secondary">
                Employee Management Manage employee information, departments and
                positions.
              </Typography>
            </Box>
          </Paper>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AssessmentIcon color="primary" fontSize="large" />

            <Box>
              <Typography fontWeight="bold">Reports and Analytics</Typography>

              <Typography variant="body2" color="text.secondary">
                Reports & Analytics Generate monthly attendance and performance
                reports.
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 24,
        }}
      >
        <LoginForm
          email={email}
          password={password}
          loading={loading}
          error={error}
          setEmail={setEmail}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </Box>
    </Box>
  );
};

export default Login;
