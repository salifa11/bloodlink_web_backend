import Event from "../model/eventModel.js";

/**
 * CREATE EVENT
 */
export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const eventData = {
      ...req.body,
      eventImage: req.file ? `/uploads/${req.file.filename}` : null
    };

    const newEvent = await Event.create(eventData);

    res.status(201).json({ 
      message: "Event published successfully!", 
      event: newEvent 
    });
  } catch (error) {
    console.error("Event Creation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET ALL EVENTS
 */
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['eventDate', 'ASC']]
    });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET SINGLE EVENT BY ID
 * Resolves the "Event not found" error on the details page.
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find event by Primary Key (id)
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * DELETE EVENT BY ID (Admin only)
 */
export const deleteEvent = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { id } = req.params;

    // Find the event
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Store event details before deletion
    const deletedEventName = event.eventName;

    // Delete the event
    await Event.destroy({ where: { id } });

    res.status(200).json({ 
      message: "Event deleted successfully",
      deletedEvent: {
        id: id,
        eventName: deletedEventName
      }
    });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * UPDATE EVENT BY ID (Admin only)
 */
export const updateEvent = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updateData = {
      ...req.body,
      eventImage: req.file ? `/uploads/${req.file.filename}` : event.eventImage
    };

    await event.update(updateData);

    res.status(200).json({ 
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};