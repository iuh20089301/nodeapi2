// api/notes.js
const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import kết nối

// API để lấy dữ liệu từ bảng 'notes'
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM notes';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        if (results.length === 0) {
            return res.status(404).send('Không có dữ liệu nào trong bảng notes');
        }
        res.json(results);
    });
});

// API để lấy ghi chú theo ngày và user_id
router.get('/date', (req, res) => {
    const { date, user_id } = req.query; // Lấy ngày và user_id từ query parameters
    let sql = 'SELECT * FROM notes WHERE user_id = ?';
    const params = [user_id];

    if (date) {
        sql += ' AND date = ?';
        params.push(date);
    }

    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        res.json(results);
    });
});


// API để thêm ghi chú mới
router.post('/', (req, res) => {
    const { note, user_id, date } = req.body;
    const sql = 'INSERT INTO notes (note, user_id, date) VALUES (?, ?, ?)';
    
    connection.query(sql, [note, user_id, date], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi thêm ghi chú:', err);
            return res.status(500).send('Có lỗi xảy ra khi thêm ghi chú');
        }
        res.status(201).json({ id: result.insertId, note, user_id, date }); // Trả về ghi chú vừa thêm
    });
});

// API để cập nhật ghi chú
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { note, date, user_id } = req.body;
    const sql = 'UPDATE notes SET note = ?, date = ?, user_id = ? WHERE id = ?';

    connection.query(sql, [note, date, user_id, id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi cập nhật ghi chú:', err);
            return res.status(500).send('Có lỗi xảy ra khi cập nhật ghi chú');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy ghi chú để cập nhật');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

// API để xóa ghi chú
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notes WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi xóa ghi chú:', err);
            return res.status(500).send('Có lỗi xảy ra khi xóa ghi chú');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy ghi chú để xóa');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

module.exports = router; // Xuất router để sử dụng trong app.js