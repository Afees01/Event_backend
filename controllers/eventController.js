const pool = require('../config/db');

exports.getAllEvents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM EVENTS WHERE is_deleted = 0 ORDER BY DATE');
    res.json({ success: true, message: "Events fetched successfully", data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM EVENTS WHERE id = ? AND is_deleted = 0', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, message: "Event fetched successfully", data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  const { title, date, location, description } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ success: false, message: "Title, date, and location are required" });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO EVENTS (title, DATE, location, DESCRIPTION) VALUES (?, ?, ?, ?)',
      [title, date, location, description || '']
    );
    res.status(201).json({ success: true, message: "Event created successfully", data: { id: result.insertId, title, date, location, description } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, location, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE EVENTS SET title = ?, DATE = ?, location = ?, DESCRIPTION = ? WHERE id = ? AND is_deleted = 0',
      [title, date, location, description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, message: "Event updated successfully", data: { id, title, date, location, description } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('UPDATE EVENTS SET is_deleted = 1 WHERE id = ? AND is_deleted = 0', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
