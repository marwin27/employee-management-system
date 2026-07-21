import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const SideBar = () => {
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Employees",
      icon: <GroupsIcon />,
      path: "/employees",
    },
    {
      text: "Attendance",
      icon: <AccessTimeIcon />,
      path: "/attendance",
    },
    {
      text: "Reports",
      icon: <AssessmentIcon />,
      path: "/reports",
    },
  ];
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
  logout();
  navigate("/login");
};
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          EMS
        </Typography>
      </Box>
  <List>
  {menuItems.map((item) => (
    <ListItemButton onClick={() => navigate(item.path)}>
      <ListItemIcon>{item.icon}</ListItemIcon>

      <ListItemText primary={item.text} />
    </ListItemButton>
  ))}
</List>
<Box sx={{ mt: "auto", mb: 2 }}>
  <List>
    <ListItemButton onClick={handleLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>

      <ListItemText primary="Logout" />
    </ListItemButton>
  </List>
</Box>
    </Drawer>
  );
};

export default SideBar;
