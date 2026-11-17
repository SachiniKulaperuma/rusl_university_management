const express = require('express');
const router = express.Router();
const pool = require('../db');
const requireAdminAuth = require('../middleware/adminAuth');

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const VALID_STATUSES = new Set(['Published', 'Unpublished']);

function normalizeAnnouncement(body) {
  const title = typeof body?.title === 'string' ? body.title.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const status = typeof body?.status === 'string' ? body.status : 'Published';

  if (!title || title.length > MAX_TITLE_LENGTH || !description || description.length > MAX_DESCRIPTION_LENGTH || !VALID_STATUSES.has(status)) {
    const error = new Error('Enter a title (up to 200 characters), announcement details (up to 5,000 characters), and a valid visibility status.');
    error.status = 400;
    throw error;
  }

  return { title, description, status };
}

function parseAnnouncementId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    const error = new Error('A valid announcement ID is required.');
    error.status = 400;
    throw error;
  }
  return id;
}

// Public visitors may see only the five newest published announcements.
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT Announcement_Id, Title, Description, Publication_Date
       FROM Announcement
       WHERE Status = 'Published'
       ORDER BY Publication_Date DESC, Announcement_Id DESC
       LIMIT 5`
    );
    res.json({ announcements: result.rows });
  } catch (err) {
    console.error('Error fetching published announcements:', err.message);
    res.status(500).json({ error: 'Unable to load announcements.' });
  }
});

router.use(requireAdminAuth);

router.get('/admin', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.Announcement_Id, a.Title, a.Description, a.Publication_Date, a.Status, a.Admin_Id,
              a.Updated_At, ad.Name AS Administrator_Name, ad.Email AS Administrator_Email
       FROM Announcement a
       JOIN Administrator ad ON ad.Admin_Id = a.Admin_Id
       ORDER BY a.Publication_Date DESC, a.Announcement_Id DESC`
    );
    res.json({ announcements: result.rows });
  } catch (err) {
    console.error('Error fetching announcements:', err.message);
    res.status(500).json({ error: 'Unable to load announcements.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, status } = normalizeAnnouncement(req.body);
    const result = await pool.query(
      `INSERT INTO Announcement (Title, Description, Status, Admin_Id)
       VALUES ($1, $2, $3, $4)
       RETURNING Announcement_Id, Title, Description, Publication_Date, Status, Admin_Id, Updated_At`,
      [title, description, status, req.admin.id]
    );
    res.status(201).json({ message: `Announcement ${status.toLowerCase()} successfully.`, announcement: result.rows[0] });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Error creating announcement:', err.message);
    res.status(500).json({ error: 'Unable to save the announcement. Please try again.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = parseAnnouncementId(req.params.id);
    const { title, description, status } = normalizeAnnouncement(req.body);
    const result = await pool.query(
      `UPDATE Announcement
       SET Title = $1, Description = $2, Status = $3, Updated_At = CURRENT_TIMESTAMP
       WHERE Announcement_Id = $4
       RETURNING Announcement_Id, Title, Description, Publication_Date, Status, Admin_Id, Updated_At`,
      [title, description, status, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Announcement not found.' });
    res.json({ message: 'Announcement updated successfully.', announcement: result.rows[0] });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Error updating announcement:', err.message);
    res.status(500).json({ error: 'Unable to update the announcement. Please try again.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseAnnouncementId(req.params.id);
    const result = await pool.query('DELETE FROM Announcement WHERE Announcement_Id = $1 RETURNING Announcement_Id', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Announcement not found.' });
    res.json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Error deleting announcement:', err.message);
    res.status(500).json({ error: 'Unable to delete the announcement. Please try again.' });
  }
});

module.exports = router;
