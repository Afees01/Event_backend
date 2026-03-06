const pool = require('../config/db');

// user should be authenticated
exports.registerForEvent = async (req, res) => {
  const { eventId } = req.params;
  const { name, email, phone } = req.body;
  const userId = req.user && req.user.id;

  if (!name || !email || !phone) {
    return res.status(400).json({ success: false, message: "Name, email and phone are required" });
  }

  try {
    // verify event exists and not deleted
    const [events] = await pool.query('SELECT id FROM EVENTS WHERE id = ? AND is_deleted = 0', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const [result] = await pool.query(
      'INSERT INTO registrations (user_id, event_id, NAME, email, phone) VALUES (?, ?, ?, ?, ?)',
      [userId || null, eventId, name, email, phone]
    );

    res.status(201).json({ success: true, message: "Registration successful", data: { id: result.insertId, eventId, name, email, phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMyRegistrations = async (req, res) => {
  const userId = req.user && req.user.id;

  try {
    const [rows] = await pool.query(
      'SELECT r.id, r.event_id, e.title, e.DATE, r.NAME, r.email, r.phone FROM registrations r JOIN EVENTS e ON r.event_id = e.id WHERE r.user_id = ? AND r.is_deleted = 0 AND e.is_deleted = 0',
      [userId]
    );
    res.json({ success: true, message: "Registrations fetched successfully", data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update a registration (user own)
exports.updateRegistration = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const userId = req.user && req.user.id;

  try {
    const [result] = await pool.query(
      'UPDATE registrations SET NAME = ?, email = ?, phone = ? WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [name, email, phone, id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }
    res.json({ success: true, message: "Registration updated successfully", data: { id, name, email, phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// cancel (soft delete) registration
exports.deleteRegistration = async (req, res) => {
  const { id } = req.params;
  const userId = req.user && req.user.id;

  try {
    const [result] = await pool.query(
      'UPDATE registrations SET is_deleted = 1 WHERE id = ? AND user_id = ? AND is_deleted = 0',
      [id, userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Registration not found" });
    }
    res.json({ success: true, message: "Registration cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
