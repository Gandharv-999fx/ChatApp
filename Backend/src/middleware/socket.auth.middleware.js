import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const cookieString = socket.handshake.headers.cookie;
    
    if (!cookieString) {
      console.log("Socket connection rejected: No cookies found");
      return next(new Error("Unauthorized - No Cookies Found"));
    }

    // Parse cookies into an object 
    const token = cookieString
      .split(';')
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith('jwt='))
      ?.split('=')[1];

    if (!token) {
      console.log("Socket connection rejected: No JWT token found");
      return next(new Error("Unauthorized - No Token Found"));
    }

    // Debug log to check token
    console.log("Found token:", token.substring(0, 10) + "...");

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded?.id) {
      console.log("Invalid token payload");
      return next(new Error("Unauthorized - Invalid token"));
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);
    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};