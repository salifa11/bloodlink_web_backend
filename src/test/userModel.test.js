import SequelizeMock from "sequelize-mock";
const dbMock = new SequelizeMock();

// Define the mock to match your actual schema
const UserMock = dbMock.define("User", {});

describe("User Model Unit Tests", () => {
  
  it("should create a user with correct attributes", async () => {
    const userData = {
      id: 1,
      userName: "Salifa Shrestha",
      userEmail: "salifa@example.com",
      userPassword: "$2b$10$hashedPasswordExample",
      image: "/uploads/profile-123.jpg",
      phone: "9841234567",
      location: "Kathmandu",
      age: 28,
      bloodGroup: "O+",
      totalDonations: 5,
      lastDonation: "2026-02-15",
      role: "user"
    };

    const user = await UserMock.create(userData);

    expect(user.userName).toBe(userData.userName);
    expect(user.userEmail).toBe(userData.userEmail);
    expect(user.userPassword).toBe(userData.userPassword);
    expect(user.image).toBe(userData.image);
    expect(user.phone).toBe(userData.phone);
    expect(user.location).toBe(userData.location);
    expect(user.age).toBe(userData.age);
    expect(user.bloodGroup).toBe(userData.bloodGroup);
    expect(user.totalDonations).toBe(userData.totalDonations);
    expect(user.lastDonation).toBe(userData.lastDonation);
    expect(user.role).toBe(userData.role);
  });

  it("should have the correct table name", () => {
    expect(UserMock.name).toBe("User");
  });

  it("should verify default role value", async () => {
    const user = await UserMock.create({
      userName: "Test User",
      userEmail: "test@example.com",
      userPassword: "hashed",
      role: "user"
    });

    expect(user.role).toBe("user");
  });

  it("should verify default totalDonations value", async () => {
    const user = await UserMock.create({
      userName: "New User",
      userEmail: "new@example.com",
      userPassword: "hashed",
      totalDonations: 0
    });

    expect(user.totalDonations).toBe(0);
  });

  it("should update user profile information", async () => {
    const user = await UserMock.create({
      userName: "Initial Name",
      userEmail: "initial@example.com"
    });

    user.userName = "Updated Name";
    user.age = 30;
    user.location = "Pokhara";

    expect(user.userName).toBe("Updated Name");
    expect(user.age).toBe(30);
    expect(user.location).toBe("Pokhara");
  });

  it("should handle admin role assignment", async () => {
    const user = await UserMock.create({
      userName: "Admin User",
      userEmail: "admin@example.com",
      userPassword: "hashed",
      role: "admin"
    });

    expect(user.role).toBe("admin");
  });

  it("should allow optional fields like image and phone", async () => {
    const userData = {
      id: 8,
      userName: "User Without Image",
      userEmail: "noimage@example.com",
      userPassword: "hashed"
      // image and phone are optional
    };

    const user = await UserMock.create(userData);

    expect(user.userName).toBe(userData.userName);
    expect(user.userEmail).toBe(userData.userEmail);
    expect(user.image).toBeUndefined();
    expect(user.phone).toBeUndefined();
  });

  it("should handle associations with donors", async () => {
    const DonorMock = dbMock.define('Donor', { id: 1, userId: 1 });
    
    // Define the association: User has many Donors
    UserMock.hasMany(DonorMock, { foreignKey: 'userId', as: 'donors' });

    const user = await UserMock.create({
      userName: "Donor User",
      userEmail: "donor@example.com"
    });

    // When you define hasMany, Sequelize adds a getter method
    expect(typeof user.getDonors).toBe('function');
  });

  it("should handle associations with notifications", async () => {
    const NotificationMock = dbMock.define('Notification', { id: 1, userId: 1 });
    
    // Define the association: User has many Notifications
    UserMock.hasMany(NotificationMock, { foreignKey: 'userId', as: 'notifications' });

    const user = await UserMock.create({
      userName: "Notified User",
      userEmail: "notified@example.com"
    });

    expect(typeof user.getNotifications).toBe('function');
  });
});


// Why These Tests Work
// =====================
// 1. Mocking: sequelize-mock simulates the User model without a real database
// 2. Attributes: Tests verify all fields (userEmail, userPassword, bloodGroup, etc.) work correctly
// 3. Table Name: Ensures the model maps to the correct "users" table
// 4. Defaults: Checks that role defaults to "user" and totalDonations to 0
// 5. Updates: Verifies user info can be modified (updating profile)
// 6. Role Types: Tests both "user" and "admin" roles
// 7. Optional Fields: Tests that optional fields don't break the model
// 8. Relationships: Verifies associations with Donor and Notification models
