import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

const LoginForm = ({
  email,
  password,
  loading,
  error,
  setEmail,
  setPassword,
  handleLogin,
}) => {
  return (
    <Paper
      elevation={5}
      sx={{
        width: 400,
        padding: 4,
        borderRadius: 3,
    
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Welcome Back!
      </Typography>

      <Typography variant="body2" color="text.secondary" align="center" mb={3}>
        Sign in to access your attendance dashboard.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          required
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;
