import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!localStorage.getItem("authToken"), // Check if there's a token in localStorage
  userRole: localStorage.getItem("user"), // Retrieve user role from localStorage
  token: localStorage.getItem("authToken"), // Retrieve token from localStorage
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.userRole = action.payload.role;
      state.token = action.payload.token;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      state.token = null;
      localStorage.removeItem("authToken");
    },
    setToken(state, action) {
      state.token = action.payload.token;
    },
  },
});

export const { login, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
