const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import kết nối

// API để lấy tất cả công việc của người dùng
router.get('/', (req, res) => {
    const userId = req.query.user_id; // Lấy user_id từ yêu cầu
    const sql = 'SELECT * FROM tasks WHERE user_id = ?';
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        if (results.length === 0) {
            return res.status(404).send('Không có dữ liệu nào trong bảng tasks');
        }
        res.json(results);
    });
});

// API để lấy tất cả công việc của người dùng theo ngày
router.get('/by-date', (req, res) => {
    const userId = req.query.user_id; // Lấy user_id từ yêu cầu
    const date = req.query.date; // Lấy date từ yêu cầu

    // Định dạng ngày để so sánh
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1); // Thêm một ngày để lấy tất cả công việc trong ngày

    const sql = 'SELECT * FROM tasks WHERE user_id = ? AND thoigian >= ? AND thoigian < ?';
    connection.query(sql, [userId, startDate, endDate], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        res.json(results);
    });
});

// API để thêm công việc mới
router.post('/', (req, res) => {
    const { user_id, title, thoigian, ghichu } = req.body;
    const sql = 'INSERT INTO tasks (user_id, title, thoigian, ghichu) VALUES (?, ?, ?, ?)';
    
    connection.query(sql, [user_id, title, thoigian, ghichu], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi thêm công việc:', err);
            return res.status(500).send('Có lỗi xảy ra khi thêm công việc');
        }
        res.status(201).json({ id: result.insertId, title, thoigian, ghichu, is_completed: false });
    });
});

// API để cập nhật trạng thái công việc
router.put('/status/:id', (req, res) => {
    const { id } = req.params;
    const { is_completed } = req.body; // Lấy trạng thái mới từ yêu cầu
    const sql = 'UPDATE tasks SET is_completed = ? WHERE id = ?';

    connection.query(sql, [is_completed, id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi cập nhật trạng thái công việc:', err);
            return res.status(500).send('Có lỗi xảy ra khi cập nhật trạng thái công việc');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy công việc để cập nhật');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

// API để xóa công việc
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi xóa công việc:', err);
            return res.status(500).send('Có lỗi xảy ra khi xóa công việc');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy công việc để xóa');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

module.exports = router; // Xuất router để sử dụng trong app.js