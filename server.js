require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-connect';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Mongoose Models ---

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  blocked: { type: Boolean, default: false },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// Item Model
const itemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  photoUrl: { type: String },
  status: { type: String, enum: ['active', 'claimed', 'returned'], default: 'active' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  claimQuestion: { type: String }, // Used to verify ownership
  tags: [{ type: String }],
}, { timestamps: true });
const Item = mongoose.model('Item', itemSchema);

// Claim Model
const claimSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  claimantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });
const Claim = mongoose.model('Claim', claimSchema);

// --- Basic API Routes ---

// Get all items (filter by query params like type=lost)
app.get('/api/items', async (req, res) => {
  try {
    const filters = req.query;
    const items = await Item.find(filters).populate('postedBy', 'name email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post (lost or found)
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Claim an item
app.post('/api/claim', async (req, res) => {
  try {
    const newClaim = new Claim(req.body);
    await newClaim.save();
    res.status(201).json(newClaim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update item status (e.g., mark as returned)
app.patch('/api/items/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Provide a simple message at the root
app.get('/', (req, res) => {
  res.send('Welcome to the CampusCrate API Server!');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
