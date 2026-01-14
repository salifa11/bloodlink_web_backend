import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 18,
      max: 100,
    }
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'bloodgroup'  // Map bloodGroup -> bloodgroup
  },
  totalDonations: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
    validate: {
      min: 0,
    },
    field: 'totaldonations'  // Map totalDonations -> totaldonations
  },
  lastDonation: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'lastdonation'  // Map lastDonation -> lastdonation
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "users",
  timestamps: true,
});

export default User;