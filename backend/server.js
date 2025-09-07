import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // allows JSON body parsing

// Routes

// GET /songs - fetch all songs
app.get("/songs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM songs ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /songs - add a new song
app.post("/songs", async (req, res) => {
  try {
    const { title, artist, album, release_year } = req.body;

    // validate required fields
    if (!title || !artist) {
      return res.status(400).json({ error: "Title and artist are required" });
    }

    const result = await pool.query(
      `INSERT INTO songs (title, artist, album, release_year)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, artist, album, release_year]
    );

    res.status(201).json(result.rows[0]); // return the new song
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});