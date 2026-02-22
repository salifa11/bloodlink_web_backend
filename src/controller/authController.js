import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import Donor from "../model/donorModel.js";

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

    // Include role in JWT payload
    const token = jwt.sign(
      { id: user.id, email: user.userEmail, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log("Token generated with role:", user.role);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("JWT_EXPIRES_IN:", process.env.JWT_EXPIRES_IN);

    // Include role in the response user object
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
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        'id', 
        'userName',
        'userEmail',
        'bloodGroup',
        'image',
        'phone',
        'location',
        'age',
        'role'
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compute donation stats live from Donor table
    const donorRecords = await Donor.findAll({ 
      where: { userId: req.user.id },
      attributes: ['createdAt']
    });

    const totalDonations = donorRecords.length;
    
    // Get the most recent donation date (latest createdAt)
    const lastDonation = donorRecords.length > 0
      ? new Date(Math.max(...donorRecords.map(d => new Date(d.createdAt)))).toISOString().split('T')[0]
      : null;

    const userData = {
      id: user.id,
      userName: user.userName,
      userEmail: user.userEmail,
      bloodGroup: user.bloodGroup,
      totalDonations: totalDonations,
      lastDonation: lastDonation,
      image: user.image,
      phone: user.phone,
      location: user.location,
      age: user.age,
      role: user.role
    };

    console.log("Profile data being sent:", userData);

    res.status(200).json(userData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User (Admin only) - IMPROVED VERSION
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`🗑️ DELETE REQUEST - User ID: ${userId}`);
    console.log(`👤 Requester ID: ${req.user.id}, Role: ${req.user.role}`);

    // SECURITY CHECK 1: Verify admin role
    if (req.user.role !== 'admin') {
      console.log("❌ Access denied - Not an admin");
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // SECURITY CHECK 2: Prevent self-deletion
    if (parseInt(userId) === req.user.id) {
      console.log("❌ Cannot delete own account");
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // SECURITY CHECK 3: Prevent deleting other admins (optional)
    if (user.role === 'admin') {
      console.log("❌ Cannot delete admin users");
      return res.status(403).json({ message: "Cannot delete admin users" });
    }

    console.log(`📋 User to delete: ${user.userName} (${user.userEmail})`);

    // CASCADE DELETE - Delete all related records first
    try {
      // 1. Delete donor registrations
      const donorCount = await Donor.destroy({ where: { userId } });
      console.log(`🗑️ Deleted ${donorCount} donor record(s)`);

      // 2. Delete event applications (if you have this model)
      // const appCount = await Application.destroy({ where: { userId } });
      // console.log(`🗑️ Deleted ${appCount} application(s)`);

      // Add more related model deletions here as needed

    } catch (cascadeError) {
      console.error("⚠️ Error during cascade deletion:", cascadeError);
      // Continue with user deletion even if cascade fails
    }

    // 3. Finally, delete the user
    await User.destroy({ where: { id: userId } });

    console.log(`✅ User ${userId} deleted successfully`);
    
    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUser: {
        id: user.id,
        userName: user.userName,
        userEmail: user.userEmail
      }
    });

  } catch (error) {
    console.error("❌ Delete user error:", error);
    res.status(500).json({ 
      message: "Server error while deleting user",
      error: error.message 
    });
  }
};