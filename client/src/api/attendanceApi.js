import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance";

export const timeIn = async (token) => {
  const response = await axios.post(
    `${API_URL}/time-in`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const timeOut = async (token) => {
  const response = await axios.post(
    `${API_URL}/time-out`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getAttendance = async (token, page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getAttendanceSummary = async (token) => {
  const response = await axios.get(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getTodayAttendance = async (token) => {
  const response = await axios.get(`${API_URL}/today`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMonthlyAttendance = async (token) => {
  const response = await axios.get(`${API_URL}/monthly`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getRecentAttendance = async (token) => {
  const response = await axios.get(`${API_URL}/recent`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
