import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "../../server";

// Async thunk to check if user is authenticated as admin
export const checkAdminAuth = createAsyncThunk(
  "admin/checkAdminAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${server}/user/get-admin`, {
        withCredentials: true,
      });
      return response.data.admin; // Assuming your API returns admin status
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    user: null,
    isAdminAuthenticated: false,
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(checkAdminAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAdminAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(checkAdminAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("admin/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      );
  },
});

export default adminSlice.reducer;
