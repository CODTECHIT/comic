import jwt from "jsonwebtoken";
import User from "../models/User.js";

const extractToken = (req) => {
  // Check Bearer Authorization header first
  const authHeader = req.headers?.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  // Fall back to cookie
  if (req.cookies?.jwt) return req.cookies.jwt;
  return null;
};

export const protect = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    
    // Automatic Expiry Cleanup
    if (req.user.subscriptionStatus === "active" && req.user.subscriptionExpiry && new Date() > req.user.subscriptionExpiry) {
        req.user.subscriptionStatus = "inactive";
        await req.user.save();
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const protectAdmin = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }
    req.adminId = decoded.id || null;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
