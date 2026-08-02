import { useAuth } from "../components/context/AuthContext";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  return user?.role === "Admin" ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;
