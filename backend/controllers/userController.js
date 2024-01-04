import express from "express";
import User from "../models/User.js";
import ApiError from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//generating access token and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
      const user = await User.findById(userId);
      console.log("grf",user);

      //generate a token
      const accessToken = await user.generateTokens();
      const refreshToken = await user.generateRefreshToken();

      console.log("generated");

      //save refresh token in db
      user.refreshToken = refreshToken;

      //validateBeforeSave - false
      //because we don't have password field in user model
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
  } catch (error) {
      throw new ApiError(500, "Token generation failed");
  }
};

const userRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (
    //checking all the fields are filled or not using some method
    [username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists.");
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  const newUser = await User.create({
    username,
    email,
    password,
  });

  //remove password and refresh token field from response
  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  //check for user creation
  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  res.status(201).json({ message: "User registered successfully." });

  //return response
  return res
    .status(201)
    .json(new ApiResponse(201, "User created", createdUser));
});

const loginUser = asyncHandler(async (req, res, next) => {
  //req.body - data
  //username or email
  //find the user
  //password check
  //generate access token and refresh token
  //send cookie

  const { username, email, password } = req.body;

  console.log(email);

  if (!(email || username)) {
    throw new ApiError(400, "Please provide email");
  }

  //find the user
  const user = await User.findOne({ $or: [{ username }, { email }] });

  // console.log(user);
  //check if user exists
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //password check
  const isPasswordMatch = await user.isPasswordMatch(password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  console.log('password matched')

  //generate access token and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  //don't send password and refresh token in response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    path: "/",
  };

  //send cookie
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          message: "Logged in successfully",
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Logged in successfully"
      )
    );
});

const getAdminUsers = async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findOne({ name });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export { userRegister, getAdminUsers, loginUser };
export default router;
