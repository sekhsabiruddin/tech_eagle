import React, { useState, useEffect } from "react";
import "./TodoListTable.css";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchTodos,
  deleteTodo,
  startTodo,
  endTodo,
  resumeTodo,
  pauseTodo,
} from "../../redux/reducer/todo"; // Importing Redux actions

const TodoListTable = () => {
  debugger;
  const [timerId, setTimerId] = useState(null);
  const dispatch = useDispatch();
  const [todos, setTodos] = useState([]);
  const [currDuration, setCurrDuration] = useState(null);
  const todosFromStore = useSelector((state) => state.todos.items);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    setTodos([...todosFromStore]);
  }, [todosFromStore]);

  const formatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this todo item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      dispatch(deleteTodo(id));
    }
  };

  const updateDuration = (id) => {
    debugger;
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo._id === id && todo.status === "Ongoing") {
          const elapsedTime = Math.floor((Date.now() - todo.startTime) / 1000);
          const pausedTime = todo.pausedTime || 0;
          const duration = elapsedTime + pausedTime;
          setCurrDuration(duration);
          return {
            ...todo,
            duration: duration >= 0 ? duration : 0, // Ensure duration is not negative
          };
        } else {
          return todo;
        }
      })
    );
  };

  const handleStart = (id) => {
    const ongoingTask = todos.find(
      (todo) => todo.status === "Ongoing" || todo.status === "Paused"
    );

    // If there's an ongoing or paused task, alert the user and return early
    if (ongoingTask) {
      toast.warning(
        `Please complete  "${ongoingTask.tododata}" before starting a new task.`
      );
      return;
    }

    // If there's an ongoing task, alert the user and return early
    if (ongoingTask) {
      alert(
        `Please complete or pause "${ongoingTask.tododata}" before starting a new task.`
      );
      return;
    }
    dispatch(startTodo(id));
    if (timerId) {
      clearInterval(timerId);
    }

    const currentTime = Date.now();

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id
          ? { ...todo, status: "Ongoing", startTime: currentTime, duration: 0 } // Initialize startTime and duration
          : { ...todo }
      )
    );

    const newTimerId = setInterval(() => updateDuration(id), 1000);
    setTimerId(newTimerId);
  };

  const handleEnd = (id) => {
    dispatch(endTodo(id));
    if (timerId) {
      clearInterval(timerId);
    }
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id
          ? {
              ...todo,
              status: "Completed",
              duration: Math.floor((Date.now() - todo.startTime) / 1000),
              startTime: null,
            }
          : todo
      )
    );
    setTimerId(null);
  };

  const handleResume = (id) => {
    if (timerId) {
      clearInterval(timerId);
    }
    const pausedDuration = todos.find((todo) => todo._id === id).duration;
    const resumedTime = Date.now() - pausedDuration * 1000;
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id
          ? { ...todo, status: "Ongoing", startTime: resumedTime }
          : { ...todo }
      )
    );
    const newTimerId = setInterval(() => updateDuration(id), 1000);
    setTimerId(newTimerId);
  };

  const handlePause = (id) => {
    if (timerId) {
      debugger;
      dispatch(pauseTodo({ id, currDuration }));
      clearInterval(timerId);
    }
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id
          ? {
              ...todo,
              status: "Paused",
              duration: Math.floor((Date.now() - todo.startTime) / 1000),
              startTime: null,
            }
          : todo
      )
    );
    setTimerId(null);
  };

  const handleShowDetails = (id) => {
    const todo = todos.find((todo) => todo._id === id);
    alert(
      `Details of ${todo.name}:\nStart Time: ${
        todo.startTime ? new Date(todo.startTime).toLocaleTimeString() : "N/A"
      }\nDuration: ${formatTime(todo.duration)}`
    );
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  return (
    <div className="w-full px-2 overflow-x-auto">
      <table className="min-w-full bg-white border-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4">Serial Number</th>
            <th className="py-2 px-4">Activity Name</th>
            <th className="py-2 px-4">Activity Duration</th>
            <th className="py-2 px-4">Actions</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Remove</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {todos &&
            todos.map((todo, index) => (
              <tr
                key={todo._id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{todo.tododata}</td>
                <td className="py-2 px-4">{formatTime(todo.duration)}</td>
                <td className="py-2 px-4">
                  {todo.status === "Pending" && (
                    <button
                      onClick={() => handleStart(todo._id)}
                      className="btn start"
                    >
                      Start
                    </button>
                  )}
                  {todo.status === "Ongoing" && (
                    <>
                      <button
                        onClick={() => handleEnd(todo._id)}
                        className="btn end"
                      >
                        End
                      </button>
                      <button
                        onClick={() => handlePause(todo._id)}
                        className="btn pause"
                      >
                        Pause
                      </button>
                    </>
                  )}
                  {todo.status === "Paused" && (
                    <button
                      onClick={() => handleResume(todo._id)}
                      className="btn resume"
                    >
                      Resume
                    </button>
                  )}
                  {todo.status === "Completed" && (
                    <button
                      onClick={() => handleShowDetails(todo._id)}
                      className="btn details"
                    >
                      Show Details
                    </button>
                  )}
                </td>
                <td className="py-2 px-4">{todo.status}</td>
                <td className="py-2 px-4">
                  <MdDelete
                    size={25}
                    color="red"
                    className="cursor-pointer"
                    onClick={() => handleDelete(todo._id)}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoListTable;
