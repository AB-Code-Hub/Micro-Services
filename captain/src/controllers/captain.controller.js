import { Captain as captainModel } from "../models/captain.model.js";
import { BlackListToken as blackListTokenModel } from "../models/blackListToken.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginValidation, registerValidation } from "../validation/captain.validation.js";
import { jWT_SECRET } from "../config/env.js";
import { subscribeToQueue } from "../service/rabbit.js";

// Store pending requests from captains
const pendingRequests = new Map();
// Store new rides that haven't been assigned
const newRides = [];

// Handle new ride notifications from RabbitMQ
subscribeToQueue("new-ride", (rideData) => {
  const ride = JSON.parse(rideData);
  newRides.push(ride);
  
  // Check for any pending captain requests
  for (const [captainId, res] of pendingRequests.entries()) {
    if (newRides.length > 0) {
      const nextRide = newRides.shift();
      res.json({ ride: nextRide });
      pendingRequests.delete(captainId);
    }
  }
});

export const pollNewRides = async (req, res) => {
  try {
    const captainId = req.captain._id;
    const captain = await captainModel.findById(captainId);

    if (!captain.isAvaliable) {
      return res.status(400).json({ message: "Captain is not available for rides" });
    }

    // If there's a ride available, send it immediately
    if (newRides.length > 0) {
      const ride = newRides.shift();
      return res.json({ ride });
    }

    // Otherwise, hold the request for 30 seconds
    const timeout = setTimeout(() => {
      pendingRequests.delete(captainId);
      res.json({ message: "No new rides available" });
    }, 30000);

    // Store the response object to respond when a ride becomes available
    pendingRequests.set(captainId, res);

    // Clean up if client disconnects
    req.on('close', () => {
      clearTimeout(timeout);
      pendingRequests.delete(captainId);
    });

  } catch (error) {
    console.error("Error in poll rides:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password } = req.body;

    const captainExists = await captainModel.findOne({ email });
    if (captainExists) {
      return res.status(400).json({ message: "captain already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newcaptain = new captainModel({
      name,
      email,
      password: hashPassword,
    });

    await newcaptain.save();

    const token = jwt.sign({ id: newcaptain._id }, jWT_SECRET, {
      expiresIn: "1h",
    });

    const filtredcaptain = await captainModel.findById(newcaptain._id).select("-password");

    res.cookie("token", token);

    return res.status(201).json({
      message: "captain registered successfully",
      token: token,
      captain: filtredcaptain,
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

    const captain = await captainModel.findOne({ email });
    if (!captain) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, captain.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: captain._id }, jWT_SECRET, {
      expiresIn: "1h",
    });

    const filtredcaptain = await captainModel.findById(captain._id).select("-password");

    res.cookie("token", token);

    return res.status(200).json({
      message: "captain logged in successfully",
      token: token,
      data: filtredcaptain,
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
    res.status(200).json({ message: "captain logout successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const captainId = req.captain.id;
    const captain = await captainModel.findById(captainId).select("-password");
    if (!captain) {
      return res.status(404).json({ message: "captain not found" });
    }
    return res.status(200).json({ captain });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const toggleAvialability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);

    if (!captain) {
      return res.status(401).json({ message: "Can't set avaialibility" });
    }
    captain.isAvaliable = !captain.isAvaliable;
    await captain.save();
    res.status(200).json({ message: "Captain avialablility set successfull", captain: captain });
  } catch (error) {
    console.error("Error in toogle captain", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
 