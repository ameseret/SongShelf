import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [allSongs, setAllSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaylist = async () => {
    try {
      const { data: playlists } = await api.get("/playlists");
      const found = playlists.find((p) => p.id === Number(id));
      setPlaylist(found || { name: "Unknown Playlist" });

      const { data } = await api.get(`/playlists/${id}/songs`);
      setSongs(data);

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
      fetchPlaylist();
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

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-blue-400 mb-4">
          {playlist?.name}
        </h1>

        <p className="mb-6">
          <Link to="/playlists" className="text-blue-400 hover:underline">
            ← Back to Playlists
          </Link>
        </p>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {/* Add song form */}
        <div className="flex gap-3 mb-8">
          <select
            value={selectedSongId}
            onChange={(e) => setSelectedSongId(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a song --</option>
            {allSongs.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — {s.artist}
              </option>
            ))}
          </select>
          <button
            onClick={addSong}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Song
          </button>
        </div>

        {/* Playlist songs */}
        {songs.length === 0 ? (
          <p className="text-gray-400 text-center">
            No songs in this playlist yet.
          </p>
        ) : (
          <table className="w-full bg-gray-700 border border-gray-600 rounded-lg">
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Artist</th>
                <th className="px-4 py-2 text-left">Album</th>
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  <td className="px-4 py-2">{s.title}</td>
                  <td className="px-4 py-2">{s.artist}</td>
                  <td className="px-4 py-2">{s.album || "—"}</td>
                  <td className="px-4 py-2">{s.release_year || "—"}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => removeSong(s.id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}