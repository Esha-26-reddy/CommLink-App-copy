import express, { Application } from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import requestRoutes from "./routes/request";
import messageRoutes from "./routes/message";

const app: Application = express();

// ===== Middleware =====

const allowedOrigins = ["https://commlink-app-copy.onrender.com", "http://localhost:3000"];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Backend is working!",
        timestamp: new Date().toISOString()
    });
})

export default app;
