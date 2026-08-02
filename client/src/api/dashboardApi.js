import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";
export const getAdminDashboard = async (token) => {
  const response = await axios.get(`${API_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getEmployeeDashboard = async (token) => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
