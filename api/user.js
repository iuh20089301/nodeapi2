const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const connection = require('../db'); // Import kết nối

const JWT_SECRET = 'your_jwt_secret'; // Thay đổi thành một bí mật mạnh

// Đăng ký người dùng
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    connection.query(sql, [username, hashedPassword, email], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi đăng ký:', err);
            return res.status(500).send('Có lỗi xảy ra khi đăng ký');
        }
        res.status(201).json({ id: result.insertId, username });
    });
});

// Đăng nhập người dùng
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    connection.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi đăng nhập:', err);
            return res.status(500).send('Có lỗi xảy ra khi đăng nhập');
        }
        if (results.length === 0) {
            return res.status(404).send('Người dùng không tồn tại');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Mật khẩu không đúng');
        }

        // Tạo JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// API để lấy thông tin người dùng
router.get('/me', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header
    if (!token) {
        return res.status(401).send('Không có quyền truy cập');
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Token không hợp lệ');
        }

        const sql = 'SELECT id, username, email FROM users WHERE id = ?';
        connection.query(sql, [decoded.id], (err, results) => {
            if (err) {
                console.error('Có lỗi xảy ra:', err);
                return res.status(500).send('Có lỗi xảy ra');
            }
            res.json(results[0]); // Trả về thông tin người dùng
        });
    });
});

module.exports = router;