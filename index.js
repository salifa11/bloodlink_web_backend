import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connection } from "./src/Database/db.js";
import authRouter from "./src/route/authRoute.js";
import profileRoute from "./src/route/profileRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

connection();

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRoute);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
