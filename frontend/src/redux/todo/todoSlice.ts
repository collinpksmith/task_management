import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  toastMessage: "",
  isLoading: false,
  isError: false,
};

export const fetchTodos: any = createAsyncThunk("fetchTodos", async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`);
  const todos = await response.json();
  return todos.data.map((todo: any) => {
    return {
      id: todo[0],
      item: todo[1],
      user_id: todo[2],
      user: todo[3],
    };
  });
});

export const addTodo: any = createAsyncThunk(
  "addTodo",
  async (newTodo: any) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const data = await response.json();
    return data.data[0];
  }
);

export const deleteTodo: any = createAsyncThunk(
  "deleteTodo",
  async (id: number) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/todos/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    return data.data;
  }
);

export const updateTodo: any = createAsyncThunk(
  "updateTodo",
  async ({ id, updatedTodo }: { id: number; updatedTodo: any }) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/todos/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: updatedTodo }),
      }
    );
    const data = await response.json();
    return data.data;
  }
);

// @ts-ignore
const todoSlice = createSlice({
  name: "todo",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(fetchTodos.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default todoSlice.reducer;
