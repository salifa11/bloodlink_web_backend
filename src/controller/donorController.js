import Donor from "../model/donorModel.js";

export const registerDonor = async (req, res) => {
  try {
    const { phone, city, age, bloodGroup } = req.body;
    
    console.log("Backend received data:", req.body); // Check your terminal for this!

    const newDonor = await Donor.create({
      userId: req.user.id, // Populated by verifyToken middleware
      phone,
      city,
      age,
      bloodGroup
    });

    res.status(201).json({ message: "Registered successfully!", donor: newDonor });
  } catch (error) {
    console.error("Database Save Error:", error.message);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};