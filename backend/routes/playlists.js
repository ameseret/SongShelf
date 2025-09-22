import express from "express";
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  getPlaylistSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controllers/playlistsController.js";

const router = express.Router();

router.get("/", getPlaylists);
router.post("/", createPlaylist);
router.put("/:id", updatePlaylist);   
router.delete("/:id", deletePlaylist);
router.get("/:id/songs", getPlaylistSongs);
router.post("/:id/songs", addSongToPlaylist);
router.delete("/:id/songs/:songId", removeSongFromPlaylist);

export default router;
