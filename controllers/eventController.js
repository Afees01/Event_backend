const pool = require('../config/db');

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEvent = async (req, res) => {
  const { title, date, location, description } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ message: 'Title, date, and location are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)',
      [title, date, location, description || '']
    );
    res.status(201).json({ id: result.insertId, title, date, location, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, location, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE events SET title = ?, date = ?, location = ?, description = ? WHERE id = ?',
      [title, date, location, description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ id, title, date, location, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
