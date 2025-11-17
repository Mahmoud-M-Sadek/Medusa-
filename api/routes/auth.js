const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    const { password } = req.body;
    // In a real app, use bcrypt to compare hashed passwords.
    // For this project, we use an environment variable for simplicity.
    if (password === process.env.ADMIN_PASSWORD) {
        res.status(200).json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

module.exports = router;
