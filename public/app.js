// تفعيل وإغلاق الوضع الليلي (Dark Mode)
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// فتح وإغلاق لوحة الملصقات (Stickers)
const stickerToggleBtn = document.getElementById('sticker-toggle-btn');
const stickersPanel = document.getElementById('stickers-panel');

stickerToggleBtn.addEventListener('click', () => {
    stickersPanel.classList.toggle('hidden');
});

// التنقل بين التبويبات (مثل واتساب)
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');
        // هنا يمكنك إضافة منطق فلترة القائمة حسب التبويب (شات، مجموعات، جهات اتصال)
    });
});

// إظهار شاشة الدردشة عند الضغط على المجموعة التجريبية
const groupItem = document.querySelector('.group-item');
const chatScreen = document.getElementById('chat-screen');
const backBtn = document.getElementById('back-btn');

groupItem.addEventListener('click', () => {
    chatScreen.classList.remove('hidden');
});

backBtn.addEventListener('click', () => {
    chatScreen.classList.add('hidden');
});

// إرسال ملصق (Sticker) عند الضغط عليه
const messagesArea = document.getElementById('messages-area');
const stickerItems = document.querySelectorAll('.sticker-item');

stickerItems.forEach(sticker => {
    sticker.addEventListener('click', () => {
        const stickerEmoji = sticker.textContent;
        
        // عرض الملصق داخل شاشة الشات فوراً كرسالة مرسلة
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message sent';
        msgDiv.style.fontSize = '40px'; // لتكبير حجم الملصق مثل واتساب
        msgDiv.style.background = 'none'; // مسح خلفية الرسالة العادية للملصقات
        msgDiv.textContent = stickerEmoji;
        
        messagesArea.appendChild(msgDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight; // النزول لآخر رسالة
        stickersPanel.classList.add('hidden'); // إغلاق اللوحة
    });
});
