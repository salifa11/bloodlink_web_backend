import Donor from "../model/donorModel.js";
import User from "../model/userModel.js";

export const registerDonor = async (req, res) => {
  try {
    console.log("📥 Received registration data:", req.body);
    console.log("👤 User ID from token:", req.user?.id);
    
    const { phone, city, age, bloodGroup, hospital } = req.body;
    
    // Validate required fields
    if (!phone || !city || !age || !bloodGroup || !hospital) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        message: "All fields are required",
        received: { phone, city, age, bloodGroup, hospital }
      });
    }

    // Validate user authentication
    if (!req.user || !req.user.id) {
      console.log("❌ User not authenticated");
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if already registered
    const existing = await Donor.findOne({ where: { userId: req.user.id } });
    if (existing) {
      console.log("⚠️ User already registered as donor");
      return res.status(400).json({ message: "You are already registered as a donor" });
    }

    // Validate age
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      console.log("❌ Invalid age:", age);
      return res.status(400).json({ message: "Age must be between 18 and 100" });
    }

    // Create new donor
    const newDonor = await Donor.create({
      userId: req.user.id,
      phone: phone.toString(),
      city,
      age: ageNum,
      bloodGroup,
      hospital,
      status: 'available'
    });
    
    console.log("✅ Donor created successfully:", newDonor.id);
    
    res.status(201).json({ 
      message: "Registered successfully!", 
      donor: {
        id: newDonor.id,
        phone: newDonor.phone,
        city: newDonor.city,
        age: newDonor.age,
        bloodGroup: newDonor.bloodGroup,
        hospital: newDonor.hospital,
        status: newDonor.status
      }
    });
    
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message).join(', ');
      return res.status(400).json({ 
        message: `Validation error: ${messages}`,
        errors: error.errors
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: "You are already registered as a donor"
      });
    }
    
    // Handle database connection errors
    if (error.name === 'SequelizeConnectionError') {
      return res.status(503).json({ 
        message: "Database connection error. Please try again later."
      });
    }
    
    res.status(500).json({ 
      message: error.message || "Registration failed. Please try again.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAvailableDonors = async (req, res) => {
  try {
    console.log("📋 Fetching available donors");
    
    const donors = await Donor.findAll({
      where: { status: 'available' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['userName', 'userEmail']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`✅ Found ${donors.length} available donors`);
    res.status(200).json(donors);
    
  } catch (error) {
    console.error("❌ Error fetching available donors:", error);
    res.status(500).json({ 
      message: "Failed to fetch donors",
      error: error.message 
    });
  }
};

export const getAllDonors = async (req, res) => {
  try {
    console.log("📋 Fetching all donors (admin)");
    
    const donors = await Donor.findAll({
      include: [{ 
        model: User, 
        as: 'user', 
        attributes: ['userName', 'userEmail'] 
      }],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`✅ Found ${donors.length} total donors`);
    res.status(200).json(donors);
    
  } catch (error) {
    console.error("❌ Error fetching all donors:", error);
    res.status(500).json({ 
      message: "Failed to fetch donors",
      error: error.message 
    });
  }
};

export const updateDonorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`🔄 Updating donor ${id} status to: ${status}`);
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const donor = await Donor.findByPk(id);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }
    
    await Donor.update({ status }, { where: { id } });
    
    console.log(`✅ Donor ${id} status updated successfully`);
    res.status(200).json({ message: "Status updated successfully" });
    
  } catch (error) {
    console.error("❌ Error updating donor status:", error);
    res.status(500).json({ 
      message: "Failed to update status",
      error: error.message 
    });
  }
};

// Get donor by userId
export const getDonorByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const donor = await Donor.findOne({
      where: { userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['userName', 'userEmail']
      }]
    });
    
    if (!donor) {
      return res.status(404).json({ message: "Not registered as donor" });
    }
    
    res.status(200).json(donor);
    
  } catch (error) {
    console.error("❌ Error fetching donor:", error);
    res.status(500).json({ 
      message: "Failed to fetch donor data",
      error: error.message 
    });
  }
};