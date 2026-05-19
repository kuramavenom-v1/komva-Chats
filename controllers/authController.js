const User = require('../models/User');

// 1. إرسال كود الـ OTP إلى رقم الهاتف
exports.sendOTP = async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ message: "الرجاء إدخال رقم الهاتف" });
    }

    try {
        // توليد كود مكون من 6 أرقام عشوائية
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresTime = new Date(Date.now() + 5 * 60 * 1000); // صلاحية 5 دقائق

        // البحث عن المستخدم أو إنشاؤه إذا لم يكن موجوداً
        let user = await User.findOne({ phoneNumber });

        if (!user) {
            user = new User({ phoneNumber });
        }

        // حفظ الكود ووقت الانتهاء
        user.otpCode = generatedOTP;
        user.otpExpires = expiresTime;
        await user.save();

        // ⚠️ طباعة الكود في لوحة تحكم السيرفر لتجربته بالفرونت اند
        console.log(`\n============== OTP GATEWAY =============`);
        console.log(`📱 الرَّقم: ${phoneNumber}`);
        console.log(`🔑 كود التحقق المرسل: ${generatedOTP}`);
        console.log(`========================================\n`);

        return res.status(200).json({ message: "تم إرسال كود التحقق بنجاح (راجع سيرفر الترمكس لترى الكود)" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "حدث خطأ في السيرفر أثناء إرسال الـ OTP" });
    }
};

// 2. التحقق من صحة الكود (Verify OTP)
exports.verifyOTP = async (req, res) => {
    const { phoneNumber, otpCode } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user || user.otpCode !== otpCode) {
            return res.status(400).json({ message: "كود التحقق غير صحيح" });
        }

        // التأكد من عدم انتهاء الصلاحية
        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: "انتهت صلاحية الكود، اطلب كوداً جديداً" });
        }

        // تحديث حالة المستخدم إلى مؤكد
        user.isVerified = true;
        user.otpCode = null; // مسح الكود بعد الاستخدام
        user.otpExpires = null;
        await user.save();

        return res.status(200).json({ 
            message: "تم التحقق بنجاح!", 
            isNewUser: !user.username // إذا لم يكن لديه يوزر نيم فهو مستخدم جديد يحتاج لإكمال بياناته
        });

    } catch (error) {
        return res.status(500).json({ message: "حدث خطأ أثناء عملية التحقق" });
    }
};

// 3. إكمال البيانات (إنشاء الباسوورد واليوزر نيم الفريد)
exports.completeProfile = async (req, res) => {
    const { phoneNumber, username, password } = req.body;

    try {
        const user = await User.findOne({ phoneNumber });

        if (!user || !user.isVerified) {
            return res.status(400).json({ message: "يجب التحقق من رقم الهاتف أولاً" });
        }

        // التأكد من أن اسم المستخدم غير مأخوذ من قبل
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "اسم المستخدم هذا مأخوذ بالفعل، اختر اسماً آخر" });
        }

        // حفظ البيانات (يُفضل تشفير الباسوورد لاحقاً بمكتبة bcrypt)
        user.username = username;
        user.password = password; 
        await user.save();

        return res.status(200).json({ message: "تم إنشاء الحساب بنجاح في Komva Chats! جاهز لتسجيل الدخول" });

    } catch (error) {
        return res.status(500).json({ message: "حدث خطأ أثناء حفظ البيانات" });
    }
};

