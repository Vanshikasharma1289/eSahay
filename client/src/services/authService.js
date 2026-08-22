import api from "./api";

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);

  if (response.data?.user?.token) {
    localStorage.setItem("esahay_token", response.data.user.token);
  }

  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  if (response.data?.user?.token) {
    localStorage.setItem("esahay_token", response.data.user.token);
  }

  return response.data;
};

const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

const logout = () => {
  localStorage.removeItem("esahay_token");
};

export default {
  register,
  login,
  getProfile,
  logout,
};