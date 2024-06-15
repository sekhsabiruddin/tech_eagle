import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createtodo } from "../../redux/reducer/todo";

const AddActivity = () => {
  const [activityName, setActivityName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch(); // Initialize dispatch
  const todosFromStore = useSelector((state) => state.todos.items);
  const handleInputChange = (e) => {
    setActivityName(e.target.value);
  };

  const handleAddActivity = async () => {
    if (activityName.trim()) {
      setLoading(true); // Set loading state to true
      try {
        // Dispatch the createtodo action with the activity name as payload
        await dispatch(createtodo({ tododata: activityName }));
        setActivityName("");
        toast.success("Todo is created successfully");
        location.reload();
      } catch (error) {
        console.error("Error creating todo:", error);
      }
      setLoading(false); // Set loading state to false after request completes
    } else {
      console.log("Please enter an activity name");
    }
  };

  return (
    <div className="flex justify-center my-5">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              id="activity"
              value={activityName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter activity name"
            />
          </div>
          <button
            onClick={handleAddActivity}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Adding..." : "ADD"}{" "}
            {/* Display loading text if loading */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddActivity;
