import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddSongPage() {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    release_year: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/songs", {
        title: form.title,
        artist: form.artist,
        album: form.album || null,
        release_year: form.release_year ? Number(form.release_year) : null,
      });
      navigate("/"); // go back to songs list
    } catch (err) {
      const msg = err?.response?.data?.error || "Failed to add song";
      setError(msg);
    }
  };

  return (
    <main style={{ padding: 16, maxWidth: 500 }}>
      <h1>Add Song</h1>
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
            placeholder="Optional"
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
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}