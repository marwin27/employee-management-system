import { AppBar, Toolbar, Typography, Box, Avatar, Stack } from "@mui/material";
import { useAuth } from "../context/AuthContext";
const Navbar = () => {
  const { user } = useAuth();
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between", display: "flex", px: 3 }}>
        {" "}
        <Typography variant="h6" fontWeight="bold">
          Dashboard
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar>{user?.firstName?.charAt(0)}</Avatar>

          <Box>
            <Typography fontWeight="bold">
              {user?.firstName} {user?.lastName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
