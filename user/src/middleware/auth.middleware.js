import jwt from "jsonwebtoken";
import { User as userModel } from "../models/user.model.js";
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
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
