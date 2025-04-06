import jwt from "jsonwebtoken";
import { Captain as captainModel } from "../models/captain.model.js";
import { jWT_SECRET } from "../config/env.js";
import { BlackListToken as blackListTokenModel } from "../models/blackListToken.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenblackList = await blackListTokenModel.findOne({token})

    if(isTokenblackList) {
      return res.status(401).json({message: "Invalid token or token expired"})
    }

    const decoded = jwt.verify(token, jWT_SECRET);
    const captain = await captainModel.findById(decoded.id);
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.captain = captain;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
