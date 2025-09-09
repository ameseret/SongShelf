import pool from "../config/db.js";

// GET all songs
export const getSongs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM songs ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// GET one song by ID
export const getSongById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM songs WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// POST create a new song
export const createSong = async (req, res) => {
  try {
    const { title, artist, album, release_year } = req.body;
    const result = await pool.query(
      "INSERT INTO songs (title, artist, album, release_year) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, artist, album, release_year]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update a song
export const updateSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, artist, album, release_year } = req.body;

    const result = await pool.query(
      "UPDATE songs SET title = $1, artist = $2, album = $3, release_year = $4 WHERE id = $5 RETURNING *",
      [title, artist, album, release_year, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE a song
export const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM songs WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Song not found" });
    }

    res.json({ message: "Song deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};