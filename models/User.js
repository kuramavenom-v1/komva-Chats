const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true, // لمنع تسجيل نفس الرقم مرتين
        trim: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true, // يسمح بترك الحقل فارغاً مؤقتاً أثناء مرحلة الـ OTP
        trim: true
    },
    password: {
        type: String,
        required: false // سيكون مطلوباً بعد تخطي خطوة الـ OTP وتعيين باسوورد
    },
    otpCode: {
        type: String, // لتخزين كود التحقق مؤقتاً
        default: null
    },
    otpExpires: {
        type: Date, // وقت انتهاء صلاحية الكود (مثلاً بعد 5 دقائق)
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false // يتحول لـ true بعد كتابة الـ OTP الصحيح
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // قائمة بـ IDs الأصدقاء أو جهات الاتصال
    }]
}, { timestamps: true }); // لإنشاء وقت التسجيل ووقت التحديث تلقائياً

module.exports = mongoose.model('User', UserSchema);

