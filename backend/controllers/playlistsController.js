import pool from "../config/db.js";

// GET all playlists
export const getPlaylists = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM playlists ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// POST create a new playlist
export const createPlaylist = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const result = await pool.query(
      "INSERT INTO playlists (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Update playlist name
export const updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const result = await pool.query(
      "UPDATE playlists SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM playlists WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.json({ message: "Playlist deleted", playlist: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};


// GET all songs in a playlist
export const getPlaylistSongs = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT s.* FROM songs s
       JOIN playlist_songs ps ON s.id = ps.song_id
       WHERE ps.playlist_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// POST add a song to a playlist
export const addSongToPlaylist = async (req, res) => {
  try {
    const { id } = req.params; // playlist id
    const { song_id } = req.body;

    if (!song_id) return res.status(400).json({ error: "song_id is required" });

    const result = await pool.query(
      "INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING *",
      [id, song_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE a song from a playlist
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const { id, songId } = req.params;
    await pool.query(
      "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2",
      [id, songId]
    );
    res.json({ message: "Song removed from playlist" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};