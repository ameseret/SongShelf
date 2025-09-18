import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSongs = async () => {
    try {
      const { data } = await api.get("/songs");
      setSongs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load songs");
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

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-lg text-white">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="flex flex-col items-center">
        {/* Page Title */}
        <h1 className="text-5xl font-extrabold text-white mb-4">Song Shelf</h1>
        <h2 className="text-xl text-gray-400 mb-8">All Songs</h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {songs.length === 0 ? (
          <p className="text-gray-400">No songs yet. Add one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
            {songs.map((s) => (
              <div
                key={s.id}
                className="bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
              >
                {/* Artwork placeholder (replace with real image later) */}
                <div className="bg-gray-700 h-40 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">🎵</span>
                </div>

                {/* Song info */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-white truncate">
                    {s.title}
                  </h3>
                  <p className="text-gray-400">{s.artist}</p>
                  <p className="text-gray-500 text-sm">
                    {s.album || "—"} • {s.release_year || "—"}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Link
                      to={`/edit/${s.id}`}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteSong(s.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}