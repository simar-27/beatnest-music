const express = require('express');
const { getLikedSongs, getSavedSongs } = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/liked', protect, getLikedSongs);
router.get('/saved', protect, getSavedSongs);

module.exports = router;
