import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaylists = async () => {
    try {
      const { data } = await api.get("/playlists");
      setPlaylists(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const { data } = await api.post("/playlists", { name: newName });
      setPlaylists((prev) => [...prev, data]);
      setNewName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if (loading) return <main style={{ padding: 16 }}>Loading…</main>;

  return (
    <main style={{ padding: 16 }}>
      <h1>Playlists</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={createPlaylist} style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New playlist name"
          required
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Create
        </button>
      </form>

      {playlists.length === 0 ? (
        <p>No playlists yet.</p>
      ) : (
        <ul>
          {playlists.map((p) => (
            <li key={p.id}>
              <Link to={`/playlists/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}