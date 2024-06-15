const express = require("express");
const router = express.Router();
const TodoData = require("../model/TodoData"); // Import the TodoData model
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

router.post(
  "/create-todo",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { tododata, duration, status, startTime } = req.body;
      console.log(tododata);
      // Create new todo data
      const newTodoData = new TodoData({
        tododata,
      });

      // Save new todo data to the database
      await newTodoData.save();

      // Send success response
      res.status(201).json({
        message: "Todo data created successfully",
        todo: newTodoData,
      });
    } catch (error) {
      // Pass error to the error handling middleware
      next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const todoItems = await TodoData.find();

      res.status(200).json({
        message: "Todo items fetched successfully",
        todo: todoItems,
      });
    } catch (error) {
      // Pass error to the error handling middleware
      next(new ErrorHandler(error.message, 500));
    }
  })
);

router.delete(
  "/delete/:id",
  catchAsyncErrors(async (req, res, next) => {
    console.log("del");
    try {
      const deletedTodo = await TodoData.findByIdAndDelete(req.params.id);
      if (!deletedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      // Assuming you have some authorization logic here to check if the user is authorized to delete the todo

      res
        .status(200)
        .json({ message: "Todo deleted successfully", todo: deletedTodo });
    } catch (error) {
      // Pass error to the error handling middleware
      next(new ErrorHandler(error.message, 500));
    }
  })
);

//Start  actvity
router.post(
  "/start/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const todo = await TodoData.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: "Todo is not available" });
      }

      todo.status = "Ongoing";
      todo.startTime = Date.now();
      await todo.save();

      res.status(200).json({ message: "Todo started successfully", todo });
    } catch (error) {
      // Pass error to the error handling middleware
      next(new ErrorHandler(error.message, 500));
    }
  })
);

router.post(
  "/end/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const todo = await TodoData.findById(req.params.id);
      if (!todo) {
        return res.status(404).json({ message: "Todo is not available" });
      }

      todo.status = "Completed";
      todo.duration += Math.floor(
        (Date.now() - new Date(todo.startTime)) / 1000
      );
      todo.startTime = null;
      await todo.save();

      res.status(200).json({ message: "Todo ended successfully", todo });
    } catch (error) {
      // Pass error to the error handling middleware
      next(new ErrorHandler(error.message, 500));
    }
  })
);
router.post(
  "/resume/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("Resume....");
      const todo = await TodoData.findById(req.params.id);
      if (!todo) return res.status(404).json({ message: "Todo not found" });
      console.log();
      const pausedDuration = todo.duration;
      todo.status = "Ongoing";
      todo.startTime = Date.now() - pausedDuration * 1000;
      await todo.save();

      res.json(todo);
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  })
);

router.post(
  "/pause/:id",
  catchAsyncErrors(async (req, res, next) => {
    console.log(req.params.id);
    try {
      const todo = await TodoData.findById(req.params.id);
      const { currDuration } = req.body;
      if (!todo) return res.status(404).json({ message: "Todo not found" });

      todo.status = "Paused";
      todo.duration = currDuration;
      console.log("Currrent duration", currDuration);
      await todo.save(); // You need to save the updated todo in the database

      res.json({ todo });
    } catch (err) {
      next(new ErrorHandler(err.message, 500));
    }
  })
);

module.exports = router;
