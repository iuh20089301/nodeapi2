const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); //phép frontend (như ứng dụng React Native) truy cập dữ liệu từ server.

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
    const sql = 'SELECT * FROM notes'; // Thay đổi theo bảng của bạn
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

// Bắt đầu server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});