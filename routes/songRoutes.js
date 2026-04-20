const express = require('express');
const { 
  getSongs, getSongById, addSong, deleteSong, likeSong, saveSong, 
  getLikedSongs, getSavedSongs, getRecommendedSongs, getTrendingSongs, incrementPlayCount 
} = require('../controllers/songController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const router = express.Router();

router.get('/', getSongs);
router.get('/recommended', getRecommendedSongs);
router.get('/trending', getTrendingSongs);
router.get('/artist/:artistName', require('../controllers/songController').getSongsByArtist);
router.get('/:id', getSongById);
router.post('/', protect, adminOnly, upload.single('songFile'), addSong);
router.delete('/:id', protect, adminOnly, deleteSong);
router.post('/:id/like', protect, likeSong);
router.post('/:id/save', protect, saveSong);
router.post('/:id/play', incrementPlayCount);

module.exports = router;
