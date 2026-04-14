const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Register attempt:', { name, email, password });
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });
    const exists = await User.findOne({ email });
    console.log('User exists check:', exists);
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password });
    console.log('User created:', user._id);
    res.status(201).json({ token: signToken(user._id), user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('REGISTER ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ token: signToken(user._id), user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', protect, (req, res) => res.json(req.user));

module.exports = router;