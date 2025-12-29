// Global handler for uncaught exceptions
process.on("uncaughtException", (err, origin) => {
  console.error(
    "\n\n\n==================== UNCAUGHT EXCEPTION ===================="
  );
  console.error(err);
  console.error("----- ORIGIN -----");
  console.error(origin);
  console.error(
    "============================================================\n\n\n"
  );
  process.exit(1);
});

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { listAvailableModels } from "./services/aiService.js";
import courseRoutes from "./routes/courseRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import utilityRoutes from "./routes/utilityRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

// Mongoose instance for global error handling
import { mongoose } from "./config/db.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Global Mongoose connection error handler
mongoose.connection.on("error", (err) => {
  console.error(
    "\n\n\n==================== MONGOOSE RUNTIME ERROR ===================="
  );
  console.error(err);
  console.error(
    "================================================================\n\n\n"
  );
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Text-to-Learn API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api", utilityRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  // Debug: List available Gemini models on startup
  try {
    await listAvailableModels();
  } catch (e) {
    console.error("Could not list Gemini models:", e);
  }
  app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    );
  });
};

startServer();
