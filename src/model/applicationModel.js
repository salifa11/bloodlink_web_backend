import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./userModel.js"; 
import Event from "./eventModel.js";

const Application = sequelize.define("event_applications", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Event, key: 'id' }
  },
  applicationType: {
    type: DataTypes.ENUM('donor', 'volunteer'),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', 
  }
}, {
  indexes: [{ unique: true, fields: ['userId', 'eventId'] }]
});

// ALIASES: These fix the "N/A" by naming the objects 'user' and 'event'
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Application.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

export default Application;