import api from "@/lib/api";

const login = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

const signup = async (data) => {
  const res = await api.post("/api/auth/signup", data);
  return res.data;
};

const verifyOtp = async (data) => {
  const res = await api.post("/api/auth/verify", data);
  return res.data;
};

const logout = async () => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};

export const authService = {
  login,
  signup,
  verifyOtp,
  logout,
};
