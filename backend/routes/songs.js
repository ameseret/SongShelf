import express from "express";
import {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
} from "../controllers/songsController.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/:id", getSongById);
router.post("/", createSong);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;