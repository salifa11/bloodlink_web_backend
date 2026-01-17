import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const Application = sequelize.define("event_applications", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  applicationType: {
    type: DataTypes.ENUM('donor', 'volunteer'),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // Can be 'pending', 'approved', or 'rejected'
  }
}, {
  // This ensures a user can't apply twice for the same event
  indexes: [{ unique: true, fields: ['userId', 'eventId'] }]
});

export default Application;