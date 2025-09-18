import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SongsPage from "./pages/SongsPage";
import AddSongPage from "./pages/AddSongPage";
import EditSongPage from "./pages/EditSongPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      {/* Header/Nav */}
      <header className="p-4 border-b border-gray-700 bg-gray-900 text-white">
        <nav className="flex gap-6 text-lg font-medium justify-center">
          <Link to="/" className="text-blue-400 hover:underline">
            All Songs
          </Link>
          <Link to="/add" className="text-blue-400 hover:underline">
            Add Song
          </Link>
          <Link to="/playlists" className="text-blue-400 hover:underline">
            Playlists
          </Link>
        </nav>
      </header>

      {/* Routes */}
      <main className="p-6 bg-black text-white min-h-screen">
        <Routes>
          <Route path="/" element={<SongsPage />} />
          <Route path="/add" element={<AddSongPage />} />
          <Route path="/edit/:id" element={<EditSongPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}