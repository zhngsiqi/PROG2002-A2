const express = require('express');
const router = express.Router();
const db = require('../event_db');
const conn = db.getconnection();

// get events (not suspended)
router.get('/', (req, res) => {
  // select event columns and join other tables
  const sql = `SELECT e.event_id, e.name, e.location, e.start_date, e.end_date, 
              e.ticket_price, e.status, c.name AS category, o.name AS organisation
       FROM events e
       JOIN categories c ON e.category_id = c.category_id
       JOIN organisations o ON e.organisation_id = o.organisation_id
       WHERE e.status != 'suspended'
       ORDER BY e.start_date ASC`

  conn.promise().query(sql)
    .then(([rows]) => res.json(rows))  // return json to frontend
    .catch(err => {
      // console and handle error
      console.log(err.message)
      res.status(500).json({
        error: "Server error"
      })
    });
});

module.exports = router;
