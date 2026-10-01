const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());
app.get('/api/test-db',async (req ,res) =>{
    try{
        const result =await pool.query('SELECT NOW()');
        res.json({
            success: true,
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (err){
        console.error("Database Error:",Error.message);
        res.status(500).json({
            success: false,
            error:err.message
        })
    }
});

app.post('/api/expenses', async (req, res) => {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
        return res.status(400).json({ success: false, message: "All fields are required(title, amount, category, date)" });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: "The amount must be a number > zero." });
    }

    const allowedCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ success: false, message: "Classification is not permitted. Available classifications:Food, Transport, Bills, Entertainment, Other" });
    }

    try {
        const query = `
            INSERT INTO expenses (title, amount, category, date) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, title, amount, category, TO_CHAR(date, 'YYYY-MM-DD') AS date;
 `;
        const values = [title, amount, category, date];
        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
message: "The expense has been added successfully",
            data: result.rows[0]
        });

    } catch (err) {
        console.error("Error adding expense:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/expenses', async (req, res) => {
    try {
        const query = `
            SELECT id, title, amount, category, TO_CHAR(date, 'YYYY-MM-DD') AS date 
            FROM expenses 
            ORDER BY id ASC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching expenses:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});


app.get('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT id, title, amount, category, TO_CHAR(date, 'YYYY-MM-DD') AS date 
            FROM expenses 
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "The expense does not exist" });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching expense by ID:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});


app.put('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
        return res.status(400).json({ success: false, message: "All fields are required for editing" });
    }

    if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: "The amount must be a number > zero"  });
    }

    const allowedCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
    if (!allowedCategories.includes(category)) {
        return res.status(400).json({ success: false, message: "Classification is not permitted"});
    }

    try {
        const query = `
            UPDATE expenses 
            SET title = $1, amount = $2, category = $3, date = $4 
            WHERE id = $5 
            RETURNING id, title, amount, category, TO_CHAR(date, 'YYYY-MM-DD') AS date;
        `;
        const values = [title, amount, category, date, id];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "The expense does not exist" });
        }

        res.status(200).json({
            success: true,
            message: "Successfully edited",
            data: result.rows[0]
        });

    } catch (err) {
        console.error("Error updating expense:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});


app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "The expense to be deleted does not exist" });
        }

        res.status(200).json({
            success: true,
            message: "The expense was successfully deleted",
            deletedId: result.rows[0].id
        });

    } catch (err) {
        console.error("Error deleting expense:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
