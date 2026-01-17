import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js"; // Ensure this path matches your db config

const Donor = sequelize.define("donor_registered", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bloodGroup: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true // Prevents Sequelize from renaming it to 'donor_registereds'
});

export default Donor;