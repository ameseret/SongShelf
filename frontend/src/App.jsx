import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SongsPage from "./pages/SongsPage";
import AddSongPage from "./pages/AddSongPage";
import EditSongPage from "./pages/EditSongPage";

export default function App() {
  return (
    <BrowserRouter>
      <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">All Songs</Link>
          <Link to="/add">Add Song</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<SongsPage />} />
        <Route path="/add" element={<AddSongPage />} />
        <Route path="/edit/:id" element={<EditSongPage />} />
      </Routes>
    </BrowserRouter>
  );
}