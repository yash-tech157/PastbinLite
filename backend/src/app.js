// src/app.js
import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.js";
import viewRoutes from "./routes/view.js";

// import pasteRoutes from "./routes/paste.js";
import pasteRoutes from "./routes/paste.js";    

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api/pastes", pasteRoutes);
app.use("/p", viewRoutes);


export default app;
