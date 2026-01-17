import Application from "../model/applicationModel.js";

export const applyToEvent = async (req, res) => {
  try {
    const { eventId, applicationType } = req.body;
    const userId = req.user.id; // Automatically identifies the logged-in user

    const newApplication = await Application.create({
      userId,
      eventId,
      applicationType
    });

    res.status(201).json({ message: "Applied successfully!", application: newApplication });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "You have already applied for this event." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};