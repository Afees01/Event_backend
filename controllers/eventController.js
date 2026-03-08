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
  const image = req.file ? req.file.path : null;

  if (!title || !date || !location) {
<<<<<<< HEAD
    return res.status(400).json({
      success: false,
      message: "Title, date, and location are required"
    });
=======
    return res.status(400).json({ success: false, message: "Title, date, and location are required" });
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
  }

  try {
    const [result] = await pool.query(
<<<<<<< HEAD
      'INSERT INTO EVENTS (title, DATE, location, DESCRIPTION, image) VALUES (?, ?, ?, ?, ?)',
      [title, date, location, description || '', image]
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        id: result.insertId,
        title,
        date,
        location,
        description,
        image
      }
    });

=======
      'INSERT INTO EVENTS (title, DATE, location, DESCRIPTION) VALUES (?, ?, ?, ?)',
      [title, date, location, description || '']
    );
    res.status(201).json({ success: true, message: "Event created successfully", data: { id: result.insertId, title, date, location, description } });
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, location, description } = req.body;
  const image = req.file ? req.file.path : null;

  try {
<<<<<<< HEAD
    // build query dynamically if image present
    let query = 'UPDATE EVENTS SET title = ?, DATE = ?, location = ?, DESCRIPTION = ?';
    const params = [title, date, location, description];
    if (image) {
      query += ', image = ?';
      params.push(image);
    }
    query += ' WHERE id = ? AND is_deleted = 0';
    params.push(id);

    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    const data = { id, title, date, location, description };
    if (image) data.image = image;
    res.json({ success: true, message: "Event updated successfully", data });
=======
    const [result] = await pool.query(
      'UPDATE EVENTS SET title = ?, DATE = ?, location = ?, DESCRIPTION = ? WHERE id = ? AND is_deleted = 0',
      [title, date, location, description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, message: "Event updated successfully", data: { id, title, date, location, description } });
>>>>>>> 546609132fd46052f973a3704fe9a41bab3f2c78
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
