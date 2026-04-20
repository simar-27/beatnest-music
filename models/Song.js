const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  artistRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  album: { type: String },
  genre: { type: String },
  coverImage: { type: String },
  songFilePath: { type: String, required: true },
  duration: { type: String },
  likes: { type: Number, default: 0 },
  playCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
