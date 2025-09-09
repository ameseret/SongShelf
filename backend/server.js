import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

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

// PUT /songs/:id - update a song by ID
app.put("/songs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, album, release_year } = req.body;

    // Validate required fields
    if (!title || !artist) {
      return res.status(400).json({ error: "Title and artist are required" });
    }

    const result = await pool.query(
      `UPDATE songs
       SET title = $1, artist = $2, album = $3, release_year = $4
       WHERE id = $5
       RETURNING *`,
      [title, artist, album, release_year, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json(result.rows[0]); // return updated song
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /songs/:id - delete a song by ID
app.delete("/songs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM songs WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json({ message: "Song deleted successfully", song: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});