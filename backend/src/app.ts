import express, { Application } from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import requestRoutes from "./routes/request";
import messageRoutes from "./routes/message";

const app: Application = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/test", (req, res) => {
    res.status(200).json({message: "Backend is working!"});
})

export default app;
