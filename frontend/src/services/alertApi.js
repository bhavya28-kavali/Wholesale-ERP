import axios from 'axios';

const API = "http://localhost:8080/api"

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getLowStockProducts = () =>
  axios.get("/api/alerts/low-stock")

export const registerUser = (data) => {
  return API.post("/auth/register", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};


const handleRegister = async () => {
  const data = {
    name: "Test",
    email: "test@test.com",
    password: "123456",
  };

  await axios.post("http://localhost:8080/api/auth/register", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
fetch("http://localhost:8080/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Test",
    email: "test@test.com",
    password: "123456",
  }),
});