const Artist = require('../models/Artist');

const getArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addArtist = async (req, res) => {
  try {
    const { name, bio, image } = req.body;
    const artist = await Artist.create({ name, bio, image });
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteArtist = async (req, res) => {
  try {
    await Artist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artist deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getArtists, addArtist, deleteArtist };
