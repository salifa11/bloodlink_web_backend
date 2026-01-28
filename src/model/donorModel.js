import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./userModel.js";

const Donor = sequelize.define("donor_registered", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: User,
      key: "id",
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phone',
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'city',
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'age',
    validate: {
      min: 18,
      max: 100,
    },
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'bloodgroup',
  },
  hospital: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'hospital',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'status',
    defaultValue: "available",
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'createdat',
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updatedat',
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "donor_registered",
  timestamps: false,
});

export default Donor;