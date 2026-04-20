const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Song = require('./models/Song');
const Artist = require('./models/Artist');
const bcrypt = require('bcrypt');
const fs = require('fs');
const https = require('https');
const path = require('path');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/beatnest';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    // Clear existing
    await User.deleteMany({});
    await Song.deleteMany({});
    await Artist.deleteMany({});
    console.log('Cleared existing data');

    // Create Songs folder if not exists
    const songsDir = path.join(__dirname, '../songs');
    if (!fs.existsSync(songsDir)) {
      fs.mkdirSync(songsDir);
    }
    
    const download = (url, dest) => {
      const file = fs.createWriteStream(dest);
      return new Promise((resolve, reject) => {
          https.get(url, (response) => {
              response.pipe(file);
              file.on('finish', () => {
                  file.close(resolve);
              });
          }).on('error', (err) => {
              fs.unlink(dest, () => reject(err));
          });
      });
    };
    
    // Simple files download for demo
    const songFiles = [
      { name: 'song1.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { name: 'song2.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { name: 'song3.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { name: 'punjabi1.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { name: 'punjabi2.mp3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
    ];

    console.log('Downloading audio files...');
    for (const file of songFiles) {
        const dest = path.join(songsDir, file.name);
        if (!fs.existsSync(dest)) {
           await download(file.url, dest);
        }
    }

    // Create Demo Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        name: 'Demo Admin',
        email: 'admin@beatnest.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'Demo User',
        email: 'user@beatnest.com',
        password: hashedPassword,
        role: 'user'
      }
    ]);
    console.log('Demo users created: admin@beatnest.com and user@beatnest.com (Password: password123)');

    // Create Artists
    const artists = await Artist.insertMany([
      {
        name: 'SoundHelix',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80',
        bio: 'Creating algorithmically generated instrumental music since 2008.'
      },
      {
        name: 'Lofey House',
        image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&q=80',
        bio: 'Lofey is an indie producer specializing in chill beats and lo-fi textures.'
      }
    ]);
    console.log('Artists created');

    // Create Songs
    const songs = [
      {
        title: 'SoundHelix Song 1',
        artist: artists[0].name,
        artistRef: artists[0]._id,
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80',
        genre: 'Electronic',
        songFilePath: '/songs/song1.mp3',
        likes: 120,
        playCount: 1500
      },
      {
        title: 'SoundHelix Song 2',
        artist: artists[0].name,
        artistRef: artists[0]._id,
        coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80',
        genre: 'Electronic',
        songFilePath: '/songs/song2.mp3',
        likes: 340,
        playCount: 2200
      },
      {
        title: 'GOAT - Punjabi Mix',
        artist: 'Daljit & Co',
        coverImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=500&q=80',
        genre: 'Punjabi',
        songFilePath: '/songs/punjabi1.mp3',
        likes: 2450,
        playCount: 15400
      },
      {
        title: 'Legendary Vibez',
        artist: 'Moose King',
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
        genre: 'Punjabi Rap',
        songFilePath: '/songs/punjabi2.mp3',
        likes: 8900,
        playCount: 54000
      },
      {
        title: 'Lofey Chill Track',
        artist: artists[1].name,
        artistRef: artists[1]._id,
        coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
        genre: 'Lo-fi',
        songFilePath: '/songs/song3.mp3',
        likes: 890,
        playCount: 5400
      }
    ];

    const insertedSongs = await Song.insertMany(songs);
    console.log('Dummy songs with real playable mp3 files created');

    // Add songs to Demo User's saved/liked
    await User.findByIdAndUpdate(users[1]._id, {
        $push: { 
            likedSongs: { $each: [insertedSongs[0]._id, insertedSongs[2]._id, insertedSongs[3]._id] },
            savedSongs: { $each: [insertedSongs[1]._id, insertedSongs[2]._id, insertedSongs[4]._id] }
        }
    });

    console.log('Songs added to demo user library');
    process.exit(0);
  } catch (err) {
    console.error('SEED ERROR:', err);
    process.exit(1);
  }
};

seedData();
