import User from "../model/userModel.js";
import bcrypt from "bcrypt";

// Get Profile (READ)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID comes from auth middleware
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['userPassword'] } // Exclude password from response
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      message: "Profile retrieved successfully",
      user: user
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Profile (UPDATE)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      userName,
      userEmail,
      phone,
      location,
      age,
      bloodGroup,
      totalDonations,
      lastDonation
    } = req.body;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if email is being changed and if it already exists
    if (userEmail && userEmail !== user.userEmail) {
      const existingUser = await User.findOne({ 
        where: { 
          userEmail: userEmail 
        } 
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields
    const updateData = {};
    if (userName !== undefined) updateData.userName = userName;
    if (userEmail !== undefined) updateData.userEmail = userEmail;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (age !== undefined) updateData.age = age;
    if (bloodGroup !== undefined) updateData.bloodGroup = bloodGroup;
    if (totalDonations !== undefined) updateData.totalDonations = totalDonations;
    if (lastDonation !== undefined) updateData.lastDonation = lastDonation;

    // Update user
    await user.update(updateData);

    // Get updated user without password
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

// Change Password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide current and new password" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await user.update({ userPassword: hashedPassword });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Profile (DELETE)
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await user.destroy();

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};