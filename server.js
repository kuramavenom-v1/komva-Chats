// استيراد المكتبات الأساسية
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // لقراءة متغيرات البيئة من ملف .env

const app = express();

// إعدادات الـ Middleware
app.use(cors()); // للسماح للفرونت اند بالاتصال بالسيرفر دون مشاكل CORS
app.use(express.json());
app.use(express.static('public')); // لقراءة البيانات القادمة بصيغة JSON في الـ APIs

// استدعاء مسارات نظام الحسابات (Auth)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// إنشاء خادم HTTP مدمج مع Express
const server = http.createServer(app);

// ربط الـ Socket.io بالخادم مع السماح بـ CORS للفرونت اند
const io = new Server(server, {
    cors: {
        origin: "*", // في الإنتاج استبدلها برابط موقع Komva Chats الخاص بك
        methods: ["GET", "POST"]
    }
});

// 🌐 الاتصال بقاعدة بيانات MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/komva_chats";
mongoose.connect(MONGO_URI)
.then(() => console.log("متصل بنجاح بقاعدة بيانات MongoDB"))
.catch(err => console.error("فشل الاتصال بقاعدة البيانات:", err));

// 🚪 نقطة فحص أساسية للسيرفر (REST API Test)
app.get('/', (req, res) => {
    res.send("سيرفر Komva Chats يعمل بنجاح ومتصل دائماً! 🚀");
});

// 💬 منطق الـ WebSockets (اتصال الشات الفوري المستمر)
io.on('connection', (socket) => {
    console.log(`👤 مستخدم جديد متصل الآن: ${socket.id}`);

    // عندما يدخل مستخدم إلى غرفته (سواء شات خاص أو عام)
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`🚪 المستخدم [${socket.id}] انضم إلى الغرفة: ${roomId}`);
    });

    // الاستماع لإرسال رسالة جديدة وتوزيعها على أعضاء الغرفة فوراً
    socket.on('send_message', (data) => {
        // data تحتوي على: (roomId, senderId, text, timestamp)
        io.to(data.roomId).emit('receive_message', data);
    });

    // الاستماع لحدث الطرد من الشات (لتحقيق الصلاحيات التي طلبتها)
    socket.on('kick_member', (data) => {
        // data تحتوي على: (roomId, memberId, adminId)
        // هنا سنقوم بإرسال حدث للفرونت اند لإخراج العضو المطرود فوراً
        io.to(data.roomId).emit('member_kicked', { memberId: data.memberId });
    });

    // عند قطع اتصال المستخدم
    socket.on('disconnect', () => {
        console.log(`انقطع اتصال المستخدم: ${socket.id}`);
    });
});

// ⚡ تشغيل السيرفر على منفذ (Port) محدد ليبقى مستمعاً دائماً
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`السيرفر يعمل و يستجيب دائماً على المنفذ: http://localhost:${PORT}`);
});
