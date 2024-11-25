const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import kết nối

// API để lấy tất cả thói quen của người dùng
router.get('/', (req, res) => {
    const userId = req.query.user_id; // Lấy user_id từ yêu cầu
    const sql = 'SELECT * FROM habits WHERE user_id = ?';
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        if (results.length === 0) {
            return res.status(404).send('Không có dữ liệu nào trong bảng habits');
        }
        res.json(results);
    });
});

// API để lấy tất cả thói quen của người dùng theo ngày
router.get('/by-date', (req, res) => {
    const userId = req.query.user_id; // Lấy user_id từ yêu cầu
    const date = req.query.date; // Lấy date từ yêu cầu

    const sql = 'SELECT hr.*, h.name FROM habit_records hr JOIN habits h ON hr.habit_id = h.id WHERE h.user_id = ? AND hr.date = ?';
    connection.query(sql, [userId, date], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        res.json(results);
    });
});

// API để thêm thói quen mới
router.post('/', (req, res) => {
    const { user_id, name } = req.body;
    const sql = 'INSERT INTO habits (user_id, name) VALUES (?, ?)';
    
    connection.query(sql, [user_id, name], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi thêm thói quen:', err);
            return res.status(500).send('Có lỗi xảy ra khi thêm thói quen');
        }
        res.status(201).json({ id: result.insertId, user_id, name });
    });
});

// API để cập nhật trạng thái hoàn thành của thói quen
router.post('/records', (req, res) => {
    const { habit_id, date, is_completed } = req.body;
    const sql = 'INSERT INTO habit_records (habit_id, date, is_completed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_completed = ?';

    connection.query(sql, [habit_id, date, is_completed, is_completed], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi cập nhật trạng thái thói quen:', err);
            return res.status(500).send('Có lỗi xảy ra khi cập nhật trạng thái thói quen');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

// API để xóa thói quen
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM habits WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi xóa thói quen:', err);
            return res.status(500).send('Có lỗi xảy ra khi xóa thói quen');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy thói quen để xóa');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

module.exports = router; // Xuất router để sử dụng trong app.js