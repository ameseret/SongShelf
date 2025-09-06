const express = require('express');
const cors = require('cors');
require('dotenv').config();

const songsRouter = require('./routes/songs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/songs', songsRouter);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});