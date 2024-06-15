import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Async thunk to fetch todos
export const fetchTodos = createAsyncThunk("todos/fetchtodos", async () => {
  try {
    const response = await axios.get(`${server}/todo`, {
      withCredentials: true,
    });
    console.log("Todo response.data", response.data.todo);
    return response.data.todo;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
});

// Async thunk to create a todo
export const createtodo = createAsyncThunk(
  "todos/createtodo",
  async (tododata) => {
    console.log("tododata", tododata);
    try {
      const response = await axios.post(
        `${server}/todo/create-todo`,
        tododata,
        {
          withCredentials: true,
        }
      );
      console.log("after createing", response.data.todo);
      return response.data.todo;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  }
);

// Async thunk to delete atodo
export const deleteTodo = createAsyncThunk(
  "todo/deleteTodo",
  async (deleteId) => {
    try {
      console.log("Delete api", `${server}/todo/delete/${deleteId}`);
      const response = await axios.delete(`${server}/todo/delete/${deleteId}`);
      return response.data.todo;
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }
);

// Async thunks for starting, ending, resuming, and pausing a todo
export const startTodo = createAsyncThunk("todos/startTodo", async (todoId) => {
  try {
    const response = await axios.post(`${server}/todo/start/${todoId}`);

    return response.data.todo;
  } catch (error) {
    console.error("Error starting todo:", error);
    throw error;
  }
});

export const endTodo = createAsyncThunk("todos/endTodo", async (todoId) => {
  try {
    const response = await axios.post(`${server}/todo/end/${todoId}`);
    console.log("end", response.data.todo);
    return response.data.todo;
  } catch (error) {
    console.error("Error ending todo:", error);
    throw error;
  }
});

export const resumeTodo = createAsyncThunk(
  "todos/resumeTodo",
  async (todoId) => {
    try {
      console.log(`resume....,${server}/todo/resume/${todoId}`);
      const response = await axios.post(`${server}/todo/resume/${todoId}`);
      return response.data.todo;
    } catch (error) {
      console.error("Error resuming todo:", error);
      throw error;
    }
  }
);

export const pauseTodo = createAsyncThunk(
  "todos/pauseTodo",
  async ({ id, currDuration }) => {
    debugger;
    console.log("currDuration", id);
    try {
      const response = await axios.post(`${server}/todo/pause/${id}`, {
        currDuration: currDuration,
      });
      return response.data.pause;
    } catch (error) {
      console.error("Error pausing todo:", error);
      throw error;
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    status: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createtodo.fulfilled, (state, action) => {
        console.log(action.payload);
        state.items.push(action.payload);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (todo) => todo._id !== action.payload._id
        );
      })
      .addCase(endTodo.fulfilled, (state, action) => {
        // Update the state with the updated todo after ending
        state.items = state.items.map((todo) =>
          todo._id === action.payload._id ? action.payload : todo
        );
      });
  },
});

export default todoSlice.reducer;
