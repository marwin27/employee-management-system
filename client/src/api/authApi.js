import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);

  return response.data;
};

export default api;
