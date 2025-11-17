const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all main categories
router.get('/main', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM main_categories ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a main category
router.post('/main', async (req, res) => {
    const { name, image } = req.body;
    try {
        const { rows } = await db.query('INSERT INTO main_categories (name, image) VALUES ($1, $2) RETURNING *', [name, image]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a main category
router.put('/main/:id', async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
        const { rows } = await db.query('UPDATE main_categories SET name = $1, image = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [name, image, id]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a main category
router.delete('/main/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM main_categories WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Get all subcategories
router.get('/sub', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT id, name, main_category_id as "mainCategoryId" FROM subcategories ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a subcategory
router.post('/sub', async (req, res) => {
    const { name, mainCategoryId } = req.body;
    try {
        const { rows } = await db.query('INSERT INTO subcategories (name, main_category_id) VALUES ($1, $2) RETURNING *', [name, mainCategoryId]);
        res.status(201).json({ id: rows[0].id, name: rows[0].name, mainCategoryId: rows[0].main_category_id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a subcategory
router.put('/sub/:id', async (req, res) => {
    const { id } = req.params;
    const { name, mainCategoryId } = req.body;
    try {
        const { rows } = await db.query('UPDATE subcategories SET name = $1, main_category_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *', [name, mainCategoryId, id]);
        res.json({ id: rows[0].id, name: rows[0].name, mainCategoryId: rows[0].main_category_id });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a subcategory
router.delete('/sub/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM subcategories WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
