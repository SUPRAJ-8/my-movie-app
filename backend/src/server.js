require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection (update .env for your URI)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/movieapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: String,
  description: String,
  posterUrl: String,
  category: String,
  rating: String,
  views: { type: Number, default: 0 },
  releaseDate: String,
  quality: String,
  language: String,
  tailorPlayer: String,
  fastPlayer: String,
  ultraPlayer: String,
  imdb: String,
  director: String,
  actors: [String],
  genres: [String],
  country: String,
  addedDate: String,
});
const Movie = mongoose.model('Movie', movieSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: String,
  password: String, // hashed
});
const Admin = mongoose.model('Admin', adminSchema);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, user) => {
    console.log('JWT verify error:', err, 'user:', user);
    if (!token) {
      console.log('No token provided');
      return res.sendStatus(401);
    }
    if (err) {
      console.log('JWT verification failed!');
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

// Movie CRUD routes

// Minimal test route to update only the duration field
app.put('/api/movies/:id/duration', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: { duration: req.body.duration } },
      { new: true }
    );
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/movies', async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

app.post('/api/movies', authenticateToken, async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.status(201).json(movie);
});

app.put('/api/movies/:id', authenticateToken, async (req, res) => {
  // Ensure duration is always present in the update
  if (!('duration' in req.body)) {
    req.body.duration = "";
  }
  console.log('Update payload:', req.body); // Debug log
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.json(movie);
});

app.delete('/api/movies/:id', authenticateToken, async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '2h' });
  res.json({ token });
});

// Create initial admin if not exists
app.post('/api/admin/create', async (req, res) => {
  const { username, password } = req.body;
  if (await Admin.findOne({ username })) return res.status(400).json({ error: 'Admin exists' });
  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, password: hashed });
  await admin.save();
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
