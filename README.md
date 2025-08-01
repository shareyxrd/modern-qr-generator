# 🚀 QR Kod Oluşturucu

Modern ve profesyonel QR kod oluşturucu web uygulaması. Node.js ile güçlendirilmiş, güvenli ve kullanıcı dostu arayüz.

## ✨ Özellikler

### 🎯 QR Kod Türleri
- **📝 Metin** - Herhangi bir metin için QR kod
- **🔗 URL** - Web sitesi linkleri için QR kod
- **📶 WiFi** - WiFi ağ bilgileri için QR kod
- **👤 vCard** - Kişi bilgileri için QR kod
- **💬 SMS** - SMS mesajları için QR kod
- **📧 E-posta** - E-posta bilgileri için QR kod

### 🎨 Özelleştirme Seçenekleri
- **📏 Boyut Seçimi** - 200x200'den 500x500'e kadar
- **🎨 Renk Özelleştirme** - Ön plan ve arka plan renkleri
- **🛡️ Hata Düzeltme** - 4 farklı seviye (L, M, Q, H)

### 💾 İndirme Formatları
- **PNG** - Yüksek kaliteli raster format
- **SVG** - Vektör format (sonsuz ölçeklenebilir)

### 🔒 Güvenlik Özellikleri
- **F12 Anti-Debugging** - Geliştirici araçlarına karşı koruma
- **Sağ Tık Koruması** - Kaynak kodunu görüntülemeyi engeller
- **Console Uyarıları** - Güvenlik uyarı mesajları

### 🎨 Modern Tasarım
- **Glassmorphism** - Modern cam efekti tasarım
- **Responsive** - Tüm cihazlarda mükemmel görünüm
- **Animasyonlar** - Akıcı geçişler ve efektler
- **Gradient Arka Planlar** - Profesyonel görünüm

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar
1. **Projeyi klonlayın**
   ```bash
   git clone <repository-url>
   cd qr-generator
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Sunucuyu başlatın**
   ```bash
   npm start
   ```

4. **Tarayıcıda açın**
   ```
   http://localhost:3000
   ```

## 📁 Proje Yapısı

```
qr-generator/
├── public/
│   ├── index.html          # Ana HTML dosyası
│   ├── styles.css          # CSS stilleri
│   └── script.js           # Frontend JavaScript
├── server.js               # Express.js sunucu
├── package.json            # Proje bağımlılıkları
└── README.md              # Bu dosya
```

## 🛠️ Teknolojiler

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **qrcode** - QR kod oluşturma kütüphanesi
- **cors** - Cross-origin resource sharing

### Frontend
- **HTML5** - Modern markup
- **CSS3** - Gelişmiş stiller ve animasyonlar
- **JavaScript (ES6+)** - Modern JavaScript
- **Font Awesome** - İkonlar
- **Google Fonts (Inter)** - Tipografi

### Tasarım Özellikleri
- **Glassmorphism** - Cam efekti tasarım
- **Backdrop Filter** - Bulanıklık efektleri
- **CSS Grid & Flexbox** - Modern layout
- **CSS Animations** - Akıcı animasyonlar
- **Responsive Design** - Mobil uyumlu

## 📱 Kullanım

### 1. QR Kod Türü Seçin
- İstediğiniz QR kod türüne tıklayın
- Form alanları otomatik olarak değişecek

### 2. Bilgileri Girin
- Gerekli alanları doldurun
- Real-time validasyon ile hataları görün

### 3. Özelleştirin
- Boyut, renk ve hata düzeltme seviyesini ayarlayın
- Önizleme anında güncellenir

### 4. Oluşturun ve İndirin
- "QR Kod Oluştur" butonuna tıklayın
- PNG veya SVG formatında indirin

## 🔧 API Endpoints

### POST /api/generate
QR kod oluşturur ve base64 formatında döner.

**Request Body:**
```json
{
  "text": "QR kod metni",
  "type": "text|url|wifi|vcard|sms|email",
  "options": {
    "size": 300,
    "foreground": "#000000",
    "background": "#ffffff",
    "errorLevel": "M"
  }
}
```

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "data": "QR kod metni",
  "type": "text"
}
```

### POST /api/download
QR kod dosyasını indirir.

**Request Body:**
```json
{
  "text": "QR kod metni",
  "format": "png|svg",
  "type": "text",
  "options": { ... }
}
```

## 🎨 Tasarım Detayları

### Renk Paleti
- **Primary:** #0f172a (Koyu lacivert)
- **Secondary:** #334155 (Gri-mavi)
- **Accent:** #64748b (Açık gri)
- **Background:** Gradient (Beyaz tonları)

### Tipografi
- **Font Family:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800, 900

### Animasyonlar
- **Hover Effects:** Transform ve box-shadow
- **Loading States:** Spinner animasyonları
- **Transitions:** Cubic-bezier easing

## 🔒 Güvenlik

### Anti-Debugging Koruması
- F12 tuşu devre dışı
- Sağ tık menüsü engellendi
- Ctrl+U (kaynak görüntüle) engellendi
- Ctrl+S (sayfa kaydet) engellendi
- DevTools algılama sistemi

### Veri Güvenliği
- Veriler sunucuda saklanmaz
- Anlık işleme ve silme
- CORS koruması aktif

## 📱 Responsive Tasarım

### Breakpoints
- **Desktop:** 1200px+
- **Tablet:** 768px - 1199px
- **Mobile:** 480px - 767px
- **Small Mobile:** <480px

### Adaptif Özellikler
- Grid layout otomatik ayarlanır
- Font boyutları ölçeklenir
- Touch-friendly butonlar
- Optimized spacing

## 🚀 Performans

### Optimizasyonlar
- **Lazy Loading** - Gerektiğinde yükleme
- **Minified Assets** - Küçültülmüş dosyalar
- **Efficient Animations** - GPU hızlandırmalı
- **Optimized Images** - Sıkıştırılmış görseller

### Metrics
- **First Paint:** <1s
- **Interactive:** <2s
- **Bundle Size:** <500KB

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**@shareyxrd** tarafından geliştirilmiştir.

- Instagram: [@shareyxrd](https://instagram.com/shareyxrd)

## 🙏 Teşekkürler

- **Axeprime** - Teknik destek ve altyapı
- **qrcode** kütüphanesi geliştiricilerine

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!


**© 2025 QR Generator by @shareyxrd**
