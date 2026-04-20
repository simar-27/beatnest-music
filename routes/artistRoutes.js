const express = require('express');
const { getArtists, addArtist, deleteArtist } = require('../controllers/artistController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getArtists);
router.post('/', protect, adminOnly, addArtist);
router.delete('/:id', protect, adminOnly, deleteArtist);

module.exports = router;
