import express from "express";
import User from "../models/User.js";
import ApiError from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//generating access token and refresh token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log("grf", user);

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

  console.log("password matched");

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

const userDetails = asyncHandler(async (req, res, next) => {
  // console.log(req.cookies)
  // Extract refresh token and access token from request headers or cookies
  const refreshToken = req.cookies.refreshToken; // Change this according to your token extraction method
  const accessToken = req.cookies.accessToken; // Change this according to your token extraction method

  if (!(refreshToken || accessToken)) {
    throw new ApiError(400, "Refresh token and access token are required");
  }

  // Verify the access token
  const decodedAccessToken = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRETE
  );

  // console.log("decodedaccesstoken",decodedAccessToken);

  // Return the user details
  return res
    .status(200)
    .json(new ApiResponse(200, decodedAccessToken, "User details"));
});

const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", "", options)
    .clearCookie("refreshToken", "", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const getAdminUsers = async (req, res) => {
  const { pass } = req.params;
  try {
    if (pass !== "krupesh") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export { userRegister, getAdminUsers, loginUser, logoutUser, userDetails };
export default router;
