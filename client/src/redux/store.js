import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import todosReducer from "./reducer/todo";

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
  },
});

export default store;
