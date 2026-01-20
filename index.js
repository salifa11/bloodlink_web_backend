import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connection } from "./src/Database/db.js";
import authRouter from "./src/route/authRoute.js";
import profileRoute from "./src/route/profileRoute.js";
import donorRoute from "./src/route/donorRoute.js";
import { createUploadsFolder } from "./src/security/helper.js";
import eventRoute from "./src/route/eventRoute.js";
import applicationRoute from "./src/route/applicationRoute.js";

// IMPORT MODELS FOR ASSOCIATIONS
import User from "./src/model/userModel.js";
import Event from "./src/model/eventModel.js";
import Application from "./src/model/applicationModel.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// --- DEFINE ASSOCIATIONS HERE ---
// These allow you to fetch User and Event names in the Admin panel
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

Event.hasMany(Application, { foreignKey: 'eventId' });
Application.belongsTo(Event, { foreignKey: 'eventId' });

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connection(); // Database connection handles sequelize.sync()

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRoute);
app.use("/api/donor", donorRoute);
app.use("/api/events", eventRoute);
app.use("/api/applications", applicationRoute);


createUploadsFolder();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});