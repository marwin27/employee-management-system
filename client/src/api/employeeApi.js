import axios from "axios";

const API_URL = "http://localhost:5000/api/employees";

export const createEmployee = async (employeeData, token) => {
  const response = await axios.post(API_URL, employeeData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getEmployees = async (token) => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};