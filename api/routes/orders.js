const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
    try {
        const ordersResult = await db.query('SELECT id, timestamp, customer_name as "customerName", customer_phone as "customerPhone", customer_address as "customerAddress", total_price as "totalPrice", status FROM orders ORDER BY timestamp DESC');
        const itemsResult = await db.query('SELECT order_id, name, price, color, size, quantity, product_id as "productId" FROM order_items');
        
        const ordersWithItems = ordersResult.rows.map(order => ({
            ...order,
            items: itemsResult.rows.filter(item => item.order_id === order.id).map(({ order_id, ...item }) => item)
        }));

        res.json(ordersWithItems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new order
router.post('/', async (req, res) => {
    const { customerName, customerPhone, customerAddress, items, totalPrice } = req.body;
    const orderId = `MEDUSA-${Math.floor(Math.random() * 900000) + 100000}`;
    const status = 'تحت المراجعة';

    const client = await db.getPool().connect();
    try {
        await client.query('BEGIN');
        
        const orderQuery = 'INSERT INTO orders(id, customer_name, customer_phone, customer_address, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
        const orderValues = [orderId, customerName, customerPhone, customerAddress, totalPrice, status];
        const { rows } = await client.query(orderQuery, orderValues);
        const newOrder = rows[0];

        const itemInsertPromises = items.map(item => {
            const itemQuery = 'INSERT INTO order_items(order_id, product_id, name, price, color, size, quantity) VALUES($1, $2, $3, $4, $5, $6, $7)';
            const itemValues = [orderId, item.productId, item.name, item.price, item.color, item.size, item.quantity];
            return client.query(itemQuery, itemValues);
        });

        await Promise.all(itemInsertPromises);
        
        await client.query('COMMIT');

        res.status(201).json({ 
            id: newOrder.id,
            timestamp: newOrder.timestamp,
            customerName: newOrder.customer_name,
            customerPhone: newOrder.customer_phone,
            customerAddress: newOrder.customer_address,
            items: items,
            totalPrice: newOrder.total_price,
            status: newOrder.status
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

// Update order status
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;