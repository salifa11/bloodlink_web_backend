// import { Sequelize } from "sequelize";

// export const sequelize = new Sequelize("postgres", "postgres", "postgres", {
//     host: "localhost",
//     dialect: "postgres",
// });

// export const connection = async () => {
//     try {
//         await sequelize.authenticate(); // checks DB connection
//         await sequelize.sync();         // ensures models are synced
//         console.log("Database connected successfully");
//     } catch (e) {
//         console.error("Database connection failed:", e);
//     }
// };

// src/database/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  }
);

export default sequelize;

// optional connection check
export const connection = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Database connected successfully");
  } catch (e) {
    console.error("Database connection failed:", e);
  }
};
