require("dotenv").config();

const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

app.post("/assignments", async (req, res) => {
    const { title, deadline } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO assignments (title, deadline)
             VALUES ($1, $2)
             RETURNING *`,
            [title, deadline]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create assignment" });
    }
});

app.get('/assignments', async(req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM assignments ORDER BY id DESC`
        );

        res.status(200).json(result.rows)
    }catch (err){
        console.log(err);
        res.status(500).json({error: 'Failed to load'})
    }
})

app.listen(3000);