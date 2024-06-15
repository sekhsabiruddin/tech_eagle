import React from "react";
import Header from "../Header/Header";
import AddActivity from "../AddActivity/AddActivity";
import TodoListTable from "../TodoListTable/TodoListTable";
const Home = () => {
  return (
    <div className="max-w-full">
      <Header />
      <AddActivity />
      <TodoListTable />
    </div>
  );
};

export default Home;
