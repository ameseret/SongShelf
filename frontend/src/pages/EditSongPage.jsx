import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditSongPage() {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    release_year: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch the existing song details
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data } = await api.get(`/songs/${id}`);
        setForm({
          title: data.title || "",
          artist: data.artist || "",
          album: data.album || "",
          release_year: data.release_year || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load song details");
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/songs/${id}`, {
        title: form.title,
        artist: form.artist,
        album: form.album || null,
        release_year: form.release_year ? Number(form.release_year) : null,
      });
      navigate("/"); // go back to songs list
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || "Failed to update song";
      setError(msg);
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">Loading song details…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-400 mb-6">
          Edit Song
        </h1>

        {error && (
          <p className="text-red-400 mb-4 text-center font-medium">{error}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Artist</label>
            <input
              name="artist"
              value={form.artist}
              onChange={onChange}
              required
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Album</label>
            <input
              name="album"
              value={form.album}
              onChange={onChange}
              placeholder="Optional"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Release Year
            </label>
            <input
              type="number"
              name="release_year"
              value={form.release_year}
              onChange={onChange}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
