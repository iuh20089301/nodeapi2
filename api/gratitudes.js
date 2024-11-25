const express = require('express');
const router = express.Router();
const connection = require('../db'); // Import kết nối

// API để lấy tất cả điều biết ơn  của người dùng
router.get('/', (req, res) => {
    const userId = req.query.user_id; // Lấy user_id từ yêu cầu
    const sql = 'SELECT * FROM gratitudes WHERE user_id = ?';
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        if (results.length === 0) {
            return res.status(404).send('Không có dữ liệu nào trong bảng gratitudes');
        }
        res.json(results);
    });
});

router.get('/by-month', (req, res) => {
    const userId = req.query.user_id;
    const month = parseInt(req.query.month);
    const year = parseInt(req.query.year);

    // Xác định ngày bắt đầu và kết thúc của tháng
    const startDate = new Date(year, month - 1, 1); // Bắt đầu từ tháng (0-11)
    const endDate = new Date(year, month, 1); // Bắt đầu của tháng tiếp theo

    const sql = 'SELECT * FROM gratitudes WHERE user_id = ? AND thoigian >= ? AND thoigian < ?';
    connection.query(sql, [userId, startDate, endDate], (err, results) => {
        if (err) {
            console.error('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu:', err);
            return res.status(500).send('Có lỗi xảy ra khi truy vấn cơ sở dữ liệu');
        }
        res.json(results);
    });
});

// API để thêm điều biết ơn  mới
router.post('/', (req, res) => {
    const { user_id, noidung, thoigian } = req.body;
    const sql = 'INSERT INTO gratitudes (user_id, noidung, thoigian) VALUES (?, ?, ?)';
    
    connection.query(sql, [user_id, noidung, thoigian ], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi thêm điều biết ơn :', err);
            return res.status(500).send('Có lỗi xảy ra khi thêm điều biết ơn ');
        }
        res.status(201).json({ id: result.insertId, noidung, thoigian});
    });
});

// API để xóa điều biết ơn 
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM gratitudes WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi xóa điều biết ơn :', err);
            return res.status(500).send('Có lỗi xảy ra khi xóa điều biết ơn ');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Không tìm thấy điều biết ơn để xóa');
        }
        res.sendStatus(204); // Thành công, không trả về nội dung
    });
});

module.exports = router; // Xuất router để sử dụng trong app.js