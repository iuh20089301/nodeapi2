// db.js
const mysql = require('mysql2');

// Kết nối tới MySQL
const connection = mysql.createConnection({
    // host: 'sql.freedb.tech',
    // user: 'freedb_mobi_user2',
    // password: '?9ZcRs5MeZeBuz3',
    // database: 'freedb_mobiquanly2'

    host: 'sql12.freesqldatabase.com',
    user: 'sql12745973',
    password: '4UP9bi4PsX',
    database: 'sql12745973'
});

// Kiểm tra kết nối
connection.connect(err => {
    if (err) {
        console.error('Lỗi kết nối đến MySQL:', err);
        return;
    }
    console.log('Kết nối đến MySQL thành công!');
});

module.exports = connection; // Xuất kết nối để sử dụng ở nơi khác