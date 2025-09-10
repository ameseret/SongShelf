import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ add this
import songsRoutes from "./routes/songs.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // ✅ allow frontend requests
app.use(express.json());

// Routes
app.use("/songs", songsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("🎵 SongShelf API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});