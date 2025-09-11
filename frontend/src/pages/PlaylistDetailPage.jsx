import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function PlaylistDetailPage() {
  const { id } = useParams(); // playlist id from URL
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState(null);
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
    } catch (err) {
      console.error(err);
      setError("Failed to load playlist");
    } finally {
      setLoading(false);
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
            </tr>
          </thead>
          <tbody>
            {songs.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid #eee" }}>
                <td>{s.title}</td>
                <td>{s.artist}</td>
                <td>{s.album || "—"}</td>
                <td>{s.release_year || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}