const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import kết nối

// API để lấy cảm xúc của người dùng theo ngày
router.get('/by-date', (req, res) => {
    const userId = req.query.user_id; // Lấy user_id từ yêu cầu
    const date = req.query.date; // Lấy date từ yêu cầu

    const sql = 'SELECT * FROM user_moods WHERE user_id = ? AND date = ?';
    connection.query(sql, [userId, date], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        res.json(results);
    });
});

// API để thêm cảm xúc mới
router.post('/', (req, res) => {
    const { user_id, mood, date } = req.body;
    const sql = 'INSERT INTO user_moods (user_id, mood, date) VALUES (?, ?, ?)';

    connection.query(sql, [user_id, mood, date], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi thêm cảm xúc:', err);
            return res.status(500).send('Có lỗi xảy ra khi thêm cảm xúc');
        }
        res.status(201).json({ id: result.insertId, user_id, mood, date });
    });
});

// API để cập nhật cảm xúc
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { mood } = req.body; // Lấy cảm xúc mới từ yêu cầu
    const sql = 'UPDATE user_moods SET mood = ? WHERE id = ?';

    connection.query(sql, [mood, id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi cập nhật cảm xúc:', err);
            return res.status(500).send('Có lỗi xảy ra khi cập nhật cảm xúc');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy cảm xúc để cập nhật');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

// API để xóa cảm xúc
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM user_moods WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi xóa cảm xúc:', err);
            return res.status(500).send('Có lỗi xảy ra khi xóa cảm xúc');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy cảm xúc để xóa');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

module.exports = router; // Xuất router để sử dụng trong app.js