const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 10 là số rounds
        console.log('Mật khẩu đã được mã hóa:', hashedPassword);
    } catch (err) {
        console.error('Có lỗi xảy ra khi mã hóa mật khẩu:', err);
    }
};

// Thay đổi mật khẩu dưới đây
const passwordToHash = '12345'; // Thay đổi mật khẩu bạn muốn mã hóa

hashPassword(passwordToHash);