const express = require('express');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const router = express.Router();

router.get('/', async (req, res) => {
  const query = req.query.q;
  try {
    const songs = await Song.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { artist: { $regex: query, $options: 'i' } }
      ]
    });
    const artists = await Artist.find({ name: { $regex: query, $options: 'i' } });
    res.json({ songs, artists });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
