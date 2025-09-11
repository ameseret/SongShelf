import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function PlaylistDetailPage() {
  const { id } = useParams(); // playlist id
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]); // all available songs
  const [selectedSongId, setSelectedSongId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaylist = async () => {
    try {
      // fetch playlist info
      const { data: playlists } = await api.get("/playlists");
      const found = playlists.find((p) => p.id === Number(id));
      setPlaylist(found || { name: "Unknown Playlist" });

      // fetch playlist songs
      const { data } = await api.get(`/playlists/${id}/songs`);
      setSongs(data);

      // fetch all songs (for adding)
      const { data: all } = await api.get("/songs");
      setAllSongs(all);
    } catch (err) {
      console.error(err);
      setError("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  const addSong = async () => {
    if (!selectedSongId) return;
    try {
      await api.post(`/playlists/${id}/songs`, { song_id: Number(selectedSongId) });
      setSelectedSongId("");
      fetchPlaylist(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to add song to playlist");
    }
  };

  const removeSong = async (songId) => {
    const ok = confirm("Remove this song from playlist?");
    if (!ok) return;
    try {
      await api.delete(`/playlists/${id}/songs/${songId}`);
      setSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove song from playlist");
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  if (loading) return <main style={{ padding: 16 }}>Loading…</main>;

  return (
    <main style={{ padding: 16 }}>
      <h1>{playlist?.name}</h1>
      <p>
        <Link to="/playlists">← Back to Playlists</Link>
      </p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* Add song to playlist */}
      <div style={{ marginBottom: 16 }}>
        <select
          value={selectedSongId}
          onChange={(e) => setSelectedSongId(e.target.value)}
        >
          <option value="">-- Select a song --</option>
          {allSongs.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} — {s.artist}
            </option>
          ))}
        </select>
        <button onClick={addSong} style={{ marginLeft: 8 }}>
          Add to Playlist
        </button>
      </div>

      {/* Playlist songs */}
      {songs.length === 0 ? (
        <p>No songs in this playlist yet.</p>
      ) : (
        <table cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th align="left">Title</th>
              <th align="left">Artist</th>
              <th align="left">Album</th>
              <th align="left">Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{s.title}</td>
                <td>{s.artist}</td>
                <td>{s.album || "—"}</td>
                <td>{s.release_year || "—"}</td>
                <td>
                  <button onClick={() => removeSong(s.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}