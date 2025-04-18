import { User as userModel } from "../models/user.model.js";
import { BlackListToken as blackListTokenModel } from "../models/blackListToken.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginValidation, registerValidation } from "../validation/user.validation.js";
import { jWT_SECRET } from "../config/env.js";
import { subscribeToQueue } from "../service/rabbit.js";

export const register = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, jWT_SECRET, {
      expiresIn: "1h",
    });

    const filtredUser = await userModel.findById(newUser._id).select("-password");

    res.cookie("token", token);

    return res.status(201).json({
      message: "User registered successfully",
      token: token,
      user: filtredUser,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, jWT_SECRET, {
      expiresIn: "1h",
    });

    const filtredUser = await userModel.findById(user._id).select("-password");

    res.cookie("token", token);

    return res.status(200).json({
      message: "User logged in successfully",
      token: token,
      data: filtredUser,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "Invalid Token or Token Expired" });
    }

    await blackListTokenModel.create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "User logout successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const userId = req.user.id;

    // Set up a subscription to listen for ride acceptance
    const cleanup = await subscribeToQueue("ride-accepted", (rideData) => {
      const ride = JSON.parse(rideData);
      
         // Remove the subscription
        return res.status(200).json({
          message: "Ride accepted",
          ride: ride,
        });
      
    });

    // Set timeout to avoid hanging the request indefinitely
    const timeout = setTimeout(() => {
       // Remove the subscription
      res.status(408).json({ message: "No captain accepted the ride" });
    }, 30000); // 30 second timeout

    // Clean up if client disconnects
    req.on("close", () => {
      clearTimeout(timeout);
      
    });
  } catch (error) {
    console.error("Error in acceptRide:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
