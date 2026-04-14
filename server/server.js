const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const helmet    = require('helmet');
require('dotenv').config();

const app = express();

// ── MIDDLEWARE ──
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ── DATABASE ──
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── ROUTES ──
app.get('/', (req, res) => res.send('🚀 Polaroid Shop API is running...'));
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/payment',  require('./routes/payment'));
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));
app.use('/api/reviews',  require('./routes/reviews'));

// ── GLOBAL ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));