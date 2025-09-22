import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // Fetch playlists
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

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Create new playlist
  const addPlaylist = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;

    try {
      const { data } = await api.post("/playlists", { name });
      setPlaylists((prev) => [...prev, data]);
      setName("");
    } catch (err) {
      console.error(err);
      setError("Failed to create playlist");
    }
  };

  // Start editing
  const startEdit = (id, currentName) => {
    setEditingId(id);
    setEditName(currentName);
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editName.trim()) return;
    try {
      const { data } = await api.put(`/playlists/${id}`, { name: editName });
      setPlaylists((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: data.name } : p))
      );
      setEditingId(null);
      setEditName("");
    } catch (err) {
      console.error(err);
      setError("Failed to update playlist");
    }
  };

  // Delete playlist
  const deletePlaylist = async (id) => {
    const ok = confirm("Are you sure you want to delete this playlist?");
    if (!ok) return;

    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete playlist");
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">Loading playlists…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">
          Playlists
        </h1>

        {/* Error message */}
        {error && (
          <p className="text-red-400 mb-4 text-center font-medium">{error}</p>
        )}

        {/* Add new playlist form */}
        <form
          onSubmit={addPlaylist}
          className="flex gap-3 mb-8 justify-center"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New Playlist Name"
            className="flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition-colors"
          >
            Add
          </button>
        </form>

        {/* Playlists list */}
        {playlists.length === 0 ? (
          <p className="text-gray-400 text-center">
            No playlists yet. Create one above!
          </p>
        ) : (
          <ul className="space-y-3">
            {playlists.map((p) => (
              <li
                key={p.id}
                className="bg-gray-700 hover:bg-gray-600 transition-colors rounded p-4 flex justify-between items-center"
              >
                {editingId === p.id ? (
                  <div className="flex gap-3 w-full">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => saveEdit(p.id)}
                      className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold">{p.name}</span>
                    <div className="flex gap-3">
                      <Link
                        to={`/playlists/${p.id}`}
                        className="text-blue-400 hover:underline"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => startEdit(p.id, p.name)}
                        className="text-yellow-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePlaylist(p.id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}