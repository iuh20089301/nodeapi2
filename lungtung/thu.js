const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Cấu hình CORS
app.use(cors());
app.use(express.json()); // Để parse JSON body

// Kết nối tới MySQL
const connection = mysql.createConnection({
    host: 'sql.freedb.tech',
    user: 'freedb_mobi_user1',
    password: 'Wjed&tA&aANF7D&',
    database: 'freedb_mobiquanly'
});

// Kiểm tra kết nối
connection.connect(err => {
    if (err) {
        console.error('Lỗi kết nối đến MySQL:', err);
        return;
    }
    console.log('Kết nối đến MySQL thành công!');
});

// Route cho đường dẫn gốc
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// API để lấy dữ liệu từ bảng 'notes'
app.get('/api/notes', (req, res) => {
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

// API để thêm ghi chú mới
app.post('/api/notes', (req, res) => {
    const { note, user_id } = req.body; // Giả sử bạn cũng cần user_id
    const sql = 'INSERT INTO notes (note, user_id, date) VALUES (?, ?, NOW())';
    
    connection.query(sql, [note, user_id], (err, result) => {
        if (err) {
            console.error('Có lỗi xảy ra khi thêm ghi chú:', err);
            return res.status(500).send('Có lỗi xảy ra khi thêm ghi chú');
        }
        res.status(201).json({ id: result.insertId, note, user_id }); // Trả về ghi chú vừa thêm
    });
});

// API để cập nhật ghi chú
app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { note } = req.body;
    const sql = 'UPDATE notes SET note = ? WHERE id = ?';
    
    connection.query(sql, [note, id], (err, result) => {
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
app.delete('/api/notes/:id', (req, res) => {
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

// Bắt đầu server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});