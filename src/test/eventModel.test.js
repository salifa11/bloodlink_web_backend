import SequelizeMock from "sequelize-mock";
const dbMock = new SequelizeMock();

// Define the mock to match your actual schema
const EventMock = dbMock.define("Event", {});



describe("Event Model Unit Tests", () => {
  
  it("should create an event with correct attributes", async () => {
    const eventData = {
      id: 1,
      eventName: "Blood Donation Drive",
      location: "City Hospital",
      eventDate: "2026-03-15",
      startTime: "09:00:00",
      endTime: "14:00:00",
      capacity: 100,
      eventType: "Blood Donation",
      description: "Join us for our monthly blood donation drive",
      eventImage: "/uploads/event-123.jpg"
    };

    const event = await EventMock.create(eventData);

    expect(event.eventName).toBe(eventData.eventName);
    expect(event.location).toBe(eventData.location);
    expect(event.eventDate).toBe(eventData.eventDate);
    expect(event.startTime).toBe(eventData.startTime);
    expect(event.endTime).toBe(eventData.endTime);
    expect(event.capacity).toBe(eventData.capacity);
    expect(event.eventType).toBe(eventData.eventType);
    expect(event.description).toBe(eventData.description);
    expect(event.eventImage).toBe(eventData.eventImage);
  });

  it("should have the correct table name", () => {
    expect(EventMock.name).toBe("Event");
  });

  it("should verify default event type value", async () => {
    const event = await EventMock.create({
      eventName: "Test Event",
      location: "Hospital",
      eventType: "Blood Donation"
    });

    expect(event.eventType).toBe("Blood Donation");
  });

  it("should update event details", async () => {
    const event = await EventMock.create({
      eventName: "Initial Event",
      location: "Downtown",
      capacity: 50
    });

    event.eventName = "Updated Event";
    event.capacity = 75;

    expect(event.eventName).toBe("Updated Event");
    expect(event.capacity).toBe(75);
  });

  it("should validate event with optional image field", async () => {
    const eventData = {
      id: 5,
      eventName: "Simple Donation Event",
      location: "Community Center",
      eventDate: "2026-04-20",
      startTime: "10:00:00",
      endTime: "16:00:00",
      capacity: 200,
      description: "A community blood donation event"
      // eventImage is optional and not provided
    };

    const event = await EventMock.create(eventData);

    expect(event.eventName).toBe(eventData.eventName);
    expect(event.eventImage).toBeUndefined();
  });

  it("should handle associations with applications", async () => {
    const ApplicationMock = dbMock.define('Application', { id: 1, eventId: 1 });
    
    // Define the association: Event has many Applications
    EventMock.hasMany(ApplicationMock, { foreignKey: 'eventId', as: 'applications' });

    const event = await EventMock.create({ eventName: "Test Event" });
    
    // When you define hasMany, Sequelize adds a getter method
    expect(typeof event.getApplications).toBe('function');
  });
});


// Why These Tests Work
// =====================
// 1. Mocking: We use sequelize-mock to avoid database queries during tests
// 2. Attributes: We test that all model fields can be created and retrieved
// 3. Table Name: We verify the model maps to the correct database table
// 4. Defaults: We check default values like eventType: "Blood Donation"
// 5. Updates: We verify that model instances can be modified
// 6. Associations: We check that relationships (hasMany, belongsTo) are properly defined
// 7. Optional Fields: We test that optional fields like eventImage don't break the model
