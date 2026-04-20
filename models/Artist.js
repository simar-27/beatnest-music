const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
