const Song = require('../models/Song');
const User = require('../models/User');

const getSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getRecommendedSongs = async (req, res) => {
  try {
    // Basic recommendation logic: recently added or most liked
    const songs = await Song.find().sort({ likes: -1 }).limit(10);
    res.json(songs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getTrendingSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ playCount: -1 }).limit(10);
    res.json(songs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addSong = async (req, res) => {
  try {
    const { title, artist, album, genre, duration, coverImage } = req.body;
    const songFilePath = req.file ? `/songs/${req.file.filename}` : null;
    
    // Try to find matching artist to link
    const existingArtist = await require('../models/Artist').findOne({ name: { $regex: new RegExp(`^${artist}$`, 'i') } });
    
    const song = await Song.create({ 
      title, 
      artist, 
      artistRef: existingArtist ? existingArtist._id : null,
      album, 
      genre, 
      duration, 
      songFilePath,
      coverImage 
    });
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSong = async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: 'Song deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const likeSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { likedSongs: song._id } });
    res.json(song);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const saveSong = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { $addToSet: { savedSongs: req.params.id } }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getLikedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('likedSongs');
    res.json(user.likedSongs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSavedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedSongs');
    res.json(user.savedSongs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const incrementPlayCount = async (req, res) => {
  try {
    await Song.findByIdAndUpdate(req.params.id, { $inc: { playCount: 1 } });
    res.json({ message: 'Play count updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSongsByArtist = async (req, res) => {
  try {
    const { artistName } = req.params;
    const songs = await Song.find({ artist: artistName });
    res.json(songs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { 
  getSongs, getSongById, addSong, deleteSong, likeSong, saveSong, 
  getLikedSongs, getSavedSongs, getRecommendedSongs, getTrendingSongs, incrementPlayCount,
  getSongsByArtist
};
