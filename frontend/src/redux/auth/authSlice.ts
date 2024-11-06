import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserRoles } from "../../types/user-roles";

export const register: any = createAsyncThunk(
  "register",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const user = await response.json();
    return user;
  }
);

export const login: any = createAsyncThunk(
  "login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const user = await response.json();
    localStorage.setItem("token", user.user[1]);
    const userRole = user.user[3] === 1 ? UserRoles.Admin : UserRoles.User;
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: user.user[0],
        email: user.user[1],
        userRole,
      })
    );

    return {
      id: user.user[0],
      email: user.user[1],
      userRole,
    };
  }
);

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
