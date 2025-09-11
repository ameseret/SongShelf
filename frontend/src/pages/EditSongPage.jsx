import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditSongPage() {
  const { id } = useParams(); // grab the song id from the URL
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    release_year: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch the song details when the component loads
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const { data } = await api.get(`/songs/${id}`);
        setForm({
          title: data.title,
          artist: data.artist,
          album: data.album || "",
          release_year: data.release_year || "",
        });
      } catch (err) {
        console.error("Failed to load song:", err);
        setError("Failed to load song");
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      navigate("/"); // redirect back to the list
    } catch (err) {
      console.error("Error updating song:", err);
      const msg = err?.response?.data?.error || "Failed to update song";
      setError(msg);
    }
  };

  if (loading) return <main style={{ padding: 16 }}>Loading…</main>;

  return (
    <main style={{ padding: 16, maxWidth: 500 }}>
      <h1>Edit Song</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Artist
          <input
            name="artist"
            value={form.artist}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Album
          <input
            name="album"
            value={form.album}
            onChange={onChange}
          />
        </label>

        <label>
          Release Year
          <input
            type="number"
            name="release_year"
            value={form.release_year}
            onChange={onChange}
            min="1900"
            max={new Date().getFullYear()}
          />
        </label>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Update</button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}