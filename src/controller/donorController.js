import Donor from "../model/donorModel.js";

// 1. Existing Register Donor Function
export const registerDonor = async (req, res) => {
  try {
    const { phone, city, age, bloodGroup, hospital } = req.body;
    console.log("Backend received donor data:", req.body); 

    const newDonor = await Donor.create({
      userId: req.user.id, 
      phone,
      city,
      age,
      bloodGroup,
      hospital 
    });

    res.status(201).json({ 
      message: "Registered as a donor successfully!", 
      donor: newDonor 
    });
  } catch (error) {
    console.error("Database Save Error:", error.message);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// 2. NEW: Function to get all donors for the admin site
export const getAllDonors = async (req, res) => {
  try {
    // Fetches all records from the donor_registered table
    const donors = await Donor.findAll({
      order: [['createdAt', 'DESC']] // Show newest registrations first
    });
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch donors", error: error.message });
  }
};