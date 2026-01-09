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
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
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
