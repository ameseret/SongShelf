import { useEffect, useState } from "react";
import { Link } from "react-router-dom";   // ✅ import Link for navigation
import api from "../services/api";

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    try {
      const { data } = await api.get("/songs");
      setSongs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async (id) => {
    const ok = confirm("Delete this song?");
    if (!ok) return;
    try {
      await api.delete(`/songs/${id}`);
      setSongs((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete song");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  if (loading) return <main style={{ padding: 16 }}>Loading…</main>;

  return (
    <main style={{ padding: 16 }}>
      <h1>SongShelf — All Songs</h1>

      {songs.length === 0 ? (
        <p>No songs yet.</p>
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
                  <Link to={`/edit/${s.id}`} style={{ marginRight: 8 }}>
                    Edit
                  </Link>
                  <button onClick={() => deleteSong(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}