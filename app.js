// app.js
const express = require('express');
const cors = require('cors');
const notesRouter = require('./api/notes'); // Import router cho ghi chú (import để gọi sử dụng ở dưới) (đường dẫn này phải trỏ tới đúng path của api)
const userRouter = require('./api/user');
const goalsRouter = require('./api/goals');
const tasksRouter = require('./api/tasks');
const moodRouter = require('./api/mood');// Đường dẫn đến file API tâm trạng
const gratitudesRouter = require('./api/gratitudes');
const habitRouter = require ('./api/habit');

const app = express();
const port = 3000;

// Cấu hình CORS
app.use(cors());
app.use(express.json()); // Để parse JSON body

// Route cho đường dẫn gốc
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Sử dụng router cho ghi chú
app.use('/api/notes', notesRouter); // đường dẫn dưới này là đường dẫn hiển thị trên trình duyệt, vì notesRouter đã được định nghĩa từ phía trên 
app.use('/api/users', userRouter);
app.use('/api/goals', goalsRouter); // Thêm router cho mục tiêu
app.use('/api/tasks', tasksRouter);
app.use('/api/gratitudes', gratitudesRouter);
app.use('/api/mood', moodRouter);
app.use('/api/habits', habitRouter);

// Bắt đầu server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});