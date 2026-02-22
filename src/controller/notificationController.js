import Notification from "../model/notificationModel.js";
import User from "../model/userModel.js";

// Get all notifications for logged-in user
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 20
    });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark all as read
export const markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id } }
    );
    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Submit blood request — notifies all matching blood type users
export const requestBlood = async (req, res) => {
  try {
    const { bloodGroup, location, message } = req.body;
    const requesterId = req.user.id;

    const matchingUsers = await User.findAll({ where: { bloodGroup } });

    const notifications = matchingUsers
      .filter(u => u.id !== requesterId)
      .map(u => ({
        userId: u.id,
        message: `🩸 Urgent! Someone in ${location} needs ${bloodGroup} blood. ${message || "Please consider donating!"}`,
        type: "blood_request"
      }));

    if (notifications.length > 0) {
      await Notification.bulkCreate(notifications);
    }

    res.status(201).json({ message: `Blood request sent! ${notifications.length} users notified.` });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Notify a specific donor by clicking Notify button
export const notifySpecificDonor = async (req, res) => {
  try {
    const { donorUserId, bloodGroup, location } = req.body;
    const requesterId = req.user.id;

    if (donorUserId === requesterId) {
      return res.status(400).json({ message: "You cannot notify yourself" });
    }

    const requester = await User.findByPk(requesterId);

    // Use the requester's stored location only; do not use the donor-sent location
    const requesterLocation = requester?.location || "your area";

    await Notification.create({
      userId: donorUserId,
      message: `🩸 ${requester?.userName || "Someone"} in ${requesterLocation} urgently needs ${bloodGroup} blood. Can you help?`,
      type: "blood_request"
    });

    res.status(201).json({ message: "Donor notified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};