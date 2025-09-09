import express from "express";
import dotenv from "dotenv";
import songsRoutes from "./routes/songs.js";  

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/songs", songsRoutes);

// Health check route (optional but useful)
app.get("/", (req, res) => {
  res.send("🎵 SongShelf API is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});