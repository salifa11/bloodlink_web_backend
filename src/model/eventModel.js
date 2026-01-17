import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const Event = sequelize.define("Event", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  eventName: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  eventDate: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false },
  eventType: { type: DataTypes.STRING, defaultValue: 'Blood Donation' },
  description: { type: DataTypes.TEXT, allowNull: false },
  eventImage: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: "events",
  timestamps: true,
});

export default Event;