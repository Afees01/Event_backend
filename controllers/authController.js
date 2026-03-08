const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};

// Admin login uses fixed credentials stored in env
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = generateToken({ role: 'admin', email });
  res.json({ token });
};

// User signup
exports.userSignup = async (req, res) => {
  const { name, email, password, role } = req.body;
  const userRole = role || 'user'; // default to 'user'

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  }

  if (userRole !== 'user' && userRole !== 'admin') {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (NAME, email, PASSWORD, ROLE) VALUES (?, ?, ?, ?)',
      [name, email, hashed, userRole]
    );

    const userId = result.insertId;
    const token = generateToken({ role: userRole, id: userId, email });
    res.status(201).json({ success: true, message: "User created successfully", data: { token } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// User login with role (optional)
exports.userLogin = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const [rows] = await pool.query('SELECT id, PASSWORD, ROLE FROM users WHERE email = ? AND is_deleted = 0', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.PASSWORD);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

<<<<<<< HEAD
    // If role parameter is provided, validate it matches user's role
    if (role && user.ROLE !== role) {
      return res.status(403).json({ success: false, message: `User is registered as ${user.ROLE}, not ${role}` });
    }

    const token = generateToken({ role: user.ROLE, id: user.id, email });
    res.json({ success: true, message: "Login successful", data: { token, role: user.ROLE } });
=======
    const token = generateToken({ role: user.ROLE, id: user.id, email });
    res.json({ success: true, message: "Login successful", data: { token } });
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
