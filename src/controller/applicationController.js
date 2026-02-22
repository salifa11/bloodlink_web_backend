import Application from "../model/applicationModel.js";
import User from "../model/userModel.js";
import Event from "../model/eventModel.js";

// 1. Export getAllApplications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        { model: User, as: 'user', attributes: ['userName', 'userEmail'] },
        { model: Event, as: 'event', attributes: ['eventName'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. Export applyToEvent (This fixes your SyntaxError)
export const applyToEvent = async (req, res) => {
  try {
    const { eventId, applicationType } = req.body;
    const userId = req.user.id; 
    const newApplication = await Application.create({ userId, eventId, applicationType });
    res.status(201).json({ message: "Applied successfully!", application: newApplication });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Export updateStatus with Date-to-String fix
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await Application.findByPk(id);
    if (!application) return res.status(404).json({ message: "Not found" });

    application.status = status;
    await application.save();

    if (status === 'approved') {
      const user = await User.findByPk(application.userId);
      if (user) {
        const currentTotal = Number(user.totaldonations) || 0;
        
        // FIX: Convert Date to String to match your Model validation
        await user.update({
          totaldonations: currentTotal + 1,
          lastdonation: new Date().toISOString().split('T')[0] // Sends "2026-01-18" as a string
        });
      }
    }

    return res.status(200).json({ message: "Success", status });
  } catch (error) {
    console.error("Detailed Error:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// 4. Get user's personal history
export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const userApplications = await Application.findAll({
      where: { userId },
      include: [
        { model: Event, as: 'event', attributes: ['id', 'eventName', 'eventDate', 'location', 'eventType'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (userApplications.length === 0) {
      return res.status(200).json({ 
        message: "No history found", 
        history: [] 
      });
    }

    res.status(200).json({ 
      message: "User history retrieved successfully",
      history: userApplications 
    });
  } catch (error) {
    console.error("Error fetching user history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};