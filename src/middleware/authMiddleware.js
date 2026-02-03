import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debug logs: show decoded token and incoming token id
    console.log("verifyToken: decoded token:", { id: decoded.id, role: decoded.role });

    // Load latest user data from DB to ensure role is up-to-date
    const user = await User.findByPk(decoded.id);
    console.log("verifyToken: DB user role:", user ? user.role : null);
    if (!user) return res.status(401).json({ message: "User not found" });

    // Attach minimal user info used by downstream handlers
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};
