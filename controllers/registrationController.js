const pool = require('../config/db');

// user should be authenticated
exports.registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const { name, email, phone } = req.body;
  const userId = req.user && req.user.id;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email and phone are required' });
  }

  try {
    // optionally verify event exists
    const [events] = await pool.query('SELECT id FROM events WHERE id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO registrations (user_id, event_id, name, email, phone) VALUES (?, ?, ?, ?, ?)',
      [userId || null, eventId, name, email, phone]
    );

    res.status(201).json({ id: result.insertId, eventId, name, email, phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyRegistrations = async (req, res) => {
  const userId = req.user && req.user.id;

  try {
    const [rows] = await pool.query(
      'SELECT r.id, r.event_id, e.title, e.date, r.name, r.email, r.phone FROM registrations r JOIN events e ON r.event_id = e.id WHERE r.user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
