const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import kết nối đến cơ sở dữ liệu

// API để lấy mục tiêu theo người dùng và tháng
router.get('/', (req, res) => {
    const { user_id, month } = req.query;
    const sql = 'SELECT * FROM goals WHERE user_id = ? AND month = ?';

    connection.query(sql, [user_id, month], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        res.json(results);
    });
});

// API để thêm mục tiêu mới
router.post('/', (req, res) => {
    const { user_id, month, goal } = req.body;
    const sql = 'INSERT INTO goals (user_id, month, goal) VALUES (?, ?, ?)';

    connection.query(sql, [user_id, month, goal], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi thêm mục tiêu:', err);
            return res.status(500).send('Có lỗi xảy ra khi thêm mục tiêu');
        }
        res.status(201).json({ id: result.insertId, user_id, month, goal, is_completed: false });
    });
});

// API để cập nhật trạng thái hoàn thành của mục tiêu
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { is_completed } = req.body;
    const sql = 'UPDATE goals SET is_completed = ? WHERE id = ?';

    connection.query(sql, [is_completed, id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi cập nhật mục tiêu:', err);
            return res.status(500).send('Có lỗi xảy ra khi cập nhật mục tiêu');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy mục tiêu để cập nhật');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

// API để xóa mục tiêu theo ID
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Lấy ID từ tham số URL
    const sql = 'DELETE FROM goals WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi xóa mục tiêu:', err);
            return res.status(500).send('Có lỗi xảy ra khi xóa mục tiêu');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy mục tiêu để xóa');
        }
        res.sendStatus(204); // Xóa thành công, không trả về nội dung
    });
});

module.exports = router; // Xuất router để sử dụng trong app.js