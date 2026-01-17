import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";

// Login
export const login = async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST ===");
    console.log("Request body:", req.body);
    
    const { email, password } = req.body;
    
    console.log("Email:", email);
    console.log("Password received:", password ? "Yes" : "No");

    const user = await User.findOne({ where: { userEmail: email } });
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("User not found in database");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.userPassword);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // UPDATED: Include role in JWT payload
    const token = jwt.sign(
      { id: user.id, email: user.userEmail, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log("Token generated with role:", user.role);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);

    // UPDATED: Include role in the response user object
    const response = {
      message: "Login successful", 
      token,
      user: {
        id: user.id,
        email: user.userEmail,
        name: user.userName,
        role: user.role 
      }
    };

    console.log("Sending response with role:", user.role);
    console.log("===================");

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Register
export const register = async (req, res) => {
  try {
    console.log("=== REGISTER REQUEST ===");
    console.log("Request body:", req.body);
    
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ where: { userEmail: email } });
    if (existing) return res.status(409).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // New users default to 'user' role based on the model definition
    const newUser = await User.create({
      userEmail: email,
      userPassword: hashedPassword,
      userName: name || null,
    });

    console.log("User registered:", newUser.userEmail);
    console.log("=======================");

    res.status(201).json({ 
      message: "Registration successful", 
      user: {
        id: newUser.id,
        email: newUser.userEmail,
        name: newUser.userName,
        role: newUser.role // Include default role in registration response
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};