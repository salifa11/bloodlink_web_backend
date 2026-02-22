import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/userModel.js";
import Donor from "../model/donorModel.js";
import { sendMail } from "../security/mailer.js";

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

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validation: Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Password validation - same as reset password
    const passwordErrors = [];

    if (password.length < 8) {
      passwordErrors.push("At least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      passwordErrors.push("One uppercase letter (A-Z)");
    }
    if (!/[0-9]/.test(password)) {
      passwordErrors.push("One number (0-9)");
    }
    if (!/[!@#$%&*]/.test(password)) {
      passwordErrors.push("One special character (!@#$%&*)");
    }

    if (passwordErrors.length > 0) {
      return res.status(400).json({ 
        message: "Password does not meet requirements",
        requirements: passwordErrors 
      });
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

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      userName,
      userEmail,
      phone,
      location,
      age,
      bloodGroup
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate emails if email is being updated
    if (userEmail && userEmail !== user.userEmail) {
      const existingUser = await User.findOne({ 
        where: { userEmail: userEmail } 
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Consolidate update data
    const updateData = {};
    if (userName !== undefined) updateData.userName = userName;
    if (userEmail !== undefined) updateData.userEmail = userEmail;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (age !== undefined) updateData.age = age;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;

    await user.update(updateData);

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['userPassword'] }
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Profile Image
export const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Path string to store in the database
    const imagePath = `/uploads/${req.file.filename}`;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the image column in the database
    await user.update({ image: imagePath });

    res.status(200).json({
      message: "Profile image updated successfully",
      imageUrl: imagePath
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

// Request password reset - generates a time-limited token and returns a reset link
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ where: { userEmail: email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create a short-lived token (1 hour)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Construct a frontend reset URL (frontend should have a route to accept token)
    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontend}/reset-password?token=${token}`;

    // Attempt to send the reset URL by email
    let emailSent = false;
    try {
      await sendMail({
        to: user.userEmail,
        subject: 'Bloodlink Password Reset',
        html: `
          <p>Hello ${user.userName || ''},</p>
          <p>You requested a password reset for your Bloodlink account. Click the link below to reset your password. This link expires in 1 hour.</p>
          <p><a href="${resetUrl}">Reset your password</a></p>
          <p>If you didn't request this, please ignore this email.</p>
        `
      });
      emailSent = true;
    } catch (mailErr) {
      console.error('Failed to send reset email:', mailErr);
      emailSent = false;
    }

    // In production do not return the token in the response; rely on email delivery.
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      if (!emailSent) return res.status(500).json({ message: 'Failed to send reset email' });
      return res.status(200).json({ message: 'Password reset link sent to your email' });
    }

    // Development: return link in response to make testing easier
    return res.status(200).json({ message: 'Password reset link generated', resetUrl, emailSent });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Reset password using token from the reset link
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and newPassword are required' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findByPk(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.update({ userPassword: hashed }, { where: { id: user.id } });

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};