import Donor from "../model/donorModel.js";
import User from "../model/userModel.js";

// 1. Register Donor Function
export const registerDonor = async (req, res) => {
  try {
    const { phone, city, age, bloodGroup, hospital } = req.body;
    const newDonor = await Donor.create({
      userId: req.user.id,
      phone,
      city,
      age,
      bloodGroup,
      hospital,
      status: 'available'
    });
    res.status(201).json({ message: "Registered successfully!", donor: newDonor });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// 2. Fetch all donors for Admin site
export const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['userName'] // Matches capital 'N' in pgAdmin
      }],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(donors || []); 
  } catch (error) {
    return res.status(500).json([]); 
  }
};

// 3. Update Donor Status (Admin Toggle)
export const updateDonorStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const donor = await Donor.findByPk(id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    donor.status = status;
    await donor.save();

    return res.status(200).json({ message: "Status updated", donor });
  } catch (error) {
    return res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 4. Fetch Available Donors for User "Blood Banks" View
export const getAvailableDonors = async (req, res) => {
  try {
    const donors = await Donor.findAll({
      where: { status: 'available' }, // Filter only available donors
      include: [{
        model: User,
        as: 'user',
        attributes: ['userName'] // Case-sensitive pgAdmin attribute
      }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(donors || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};