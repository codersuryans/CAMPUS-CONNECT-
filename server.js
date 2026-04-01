require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('./middleware/upload');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

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
  password: { type: String, required: true },
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

// --- Authentication Routes ---

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // Generate JWT
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate token
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// Get single item
app.get('/api/items/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid Item ID' });
    }
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');
    if (!item) return res.status(404).json({ msg: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new post (lost or found) - PROTECTED ROUTE
app.post('/api/items', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const itemData = req.body;
    // Extract userId from JWT middleware and attach it as the poster ID
    itemData.postedBy = req.userId;
    
    // Save image URL from Cloudinary if it exists in the request
    if (req.file && req.file.path) {
      itemData.photoUrl = req.file.path;
    }
    
    const newItem = new Item(itemData);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Claim an item
app.post('/api/claim', authMiddleware, async (req, res) => {
  try {
    const claimData = { ...req.body, claimantId: req.userId };
    const newClaim = new Claim(claimData);
    await newClaim.save();
    res.status(201).json(newClaim);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// View claims made on the user's items
app.get('/api/claims/my-items', authMiddleware, async (req, res) => {
  try {
    const userItems = await Item.find({ postedBy: req.userId });
    const itemIds = userItems.map(item => item._id);
    
    // Find all claims targeting any of the items this user posted
    const claims = await Claim.find({ itemId: { $in: itemIds } })
      .populate('claimantId', 'name email')
      .populate('itemId', 'title type status');
      
    res.json(claims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Accept a claim and mark the item as resolved
app.patch('/api/claims/:id/accept', authMiddleware, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ msg: 'Claim not found' });
    
    const item = await Item.findById(claim.itemId);
    if (!item || item.postedBy.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    claim.status = 'approved';
    await claim.save();
    
    item.status = item.type === 'found' ? 'returned' : 'claimed';
    await item.save();

    res.json({ msg: 'Claim approved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Global Error Handler to catch middleware exceptions (like Multer/Cloudinary errors) and return JSON
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
