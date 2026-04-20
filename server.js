const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// ✅ ADD THIS ROOT ROUTE (FIX)
app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
});

app.use(cors());
app.use(express.json());
app.use('/songs', express.static(path.join(__dirname, '../songs')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/songs', require('./routes/songRoutes'));
app.use('/api/artists', require('./routes/artistRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));