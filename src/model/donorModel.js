import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./userModel.js";

const Donor = sequelize.define("donor_registered", {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    field: 'userId', // Database column name is 'userId' (camelCase)
    // Removed unique: true to allow multiple registrations per user
    references: { 
      model: User, 
      key: "id" 
    }
  },
  phone: { 
    type: DataTypes.STRING(255), 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Phone number cannot be empty"
      },
      len: {
        args: [10, 15],
        msg: "Phone number must be between 10 and 15 characters"
      }
    }
  },
  city: { 
    type: DataTypes.STRING(255), 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "City cannot be empty"
      }
    }
  },
  age: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: { 
      min: {
        args: [18],
        msg: "Minimum age is 18"
      },
      max: {
        args: [100],
        msg: "Maximum age is 100"
      },
      isInt: {
        msg: "Age must be a valid number"
      }
    }
  },
  bloodGroup: { 
    type: DataTypes.STRING(10), 
    allowNull: false, 
    field: 'bloodGroup', // Database column name is 'bloodGroup' (camelCase)
    validate: {
      notEmpty: {
        msg: "Blood group cannot be empty"
      },
      isIn: {
        args: [['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']],
        msg: "Blood group must be one of: A+, A-, B+, B-, O+, O-, AB+, AB-"
      }
    }
  },
  hospital: { 
    type: DataTypes.STRING(255), 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Hospital cannot be empty"
      }
    }
  },
  status: { 
    type: DataTypes.STRING(50), 
    defaultValue: "available",
    validate: {
      isIn: {
        args: [['available', 'unavailable', 'requested']],
        msg: "Status must be one of: available, unavailable, requested"
      }
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'createdAt',
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'updatedAt',
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "donor_registered",
  timestamps: true,
  // Sequelize uses camelCase by default, which matches your database
  underscored: false, // Important: set to false since your DB uses camelCase
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default Donor;