import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./userModel.js";

const Donor = sequelize.define("donor_registered", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: User, key: 'id' } // Link to Users table
  },
  phone: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  bloodGroup: { type: DataTypes.STRING, allowNull: false }, // Matches pgAdmin
  hospital: { type: DataTypes.STRING, allowNull: false },
  // Status field for availability toggle
  status: {
    type: DataTypes.ENUM('available', 'unavailable'),
    defaultValue: 'available',
    allowNull: false
  }
}, {
  freezeTableName: true 
});

// Association for JOIN queries to fetch Full Names
Donor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Donor;