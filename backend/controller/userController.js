const express = require("express");
const router = express.Router();
const User = require("../model/user");
const path = require("path");
const jwt = require("jsonwebtoken");
const isAuthenticatedUser = require("../middleware/auth");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const isAuthenticatedAdmin = require("../middleware/adminAuth");

//=======================Create User Start============================
router.post(
  "/create-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { username, password, email } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        username,
        password,
        email,
      });
      await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      next(new ErrorHander(error.message, 500));
    }
  })
);
//=======================Create User End===============================
//=======================LogIn User Start==============================
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ success: true, user: user });
  })
);

//=======================LogIn User End==============================
//=======================Get User Start===============================
router.get(
  "/getuser",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(new ErrorHander(error.message, 500));
    }
  })
);
//=======================Get User End===============================
router.post(
  "/logout",
  isAuthenticatedUser,
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Clearing the token cookie
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      next(new ErrorHander(error.message, 500));
    }
  })
);
//=======================Update User Start===============================
router.post("/admin-logout", (req, res, next) => {
  try {
    res.clearCookie("AdminToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {}
});

router.get("/get-admin", isAuthenticatedAdmin, async (req, res) => {
  try {
    // Admin user information is stored in req.Admin by the isAuthenticatedAdmin middleware
    const admin = req.Admin;
    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

module.exports = router;
