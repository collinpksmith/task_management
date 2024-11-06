import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./redux/todo/todoSlice";
import authReducer from "./redux/auth/authSlice";

const store = configureStore({
  reducer: {
    todo: todoReducer,
    auth: authReducer,
  },
});

export default store;
