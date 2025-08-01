// QR Code Generator Server - Created by @shareyxrd
const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ana sayfa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// QR Kod oluşturma API'si
app.post('/api/generate', async (req, res) => {
    try {
        const { text, type = 'text', options = {} } = req.body;
        
        if (!text) {
            return res.status(400).json({ 
                success: false, 
                error: 'Metin gerekli!' 
            });
        }

        // QR kod verisi hazırla - @shareyxrd
        let qrData = '';
        
        switch (type) {
            case 'text':
                qrData = text;
                break;
                
            case 'url':
                qrData = text.startsWith('http') ? text : `https://${text}`;
                break;
                
            case 'wifi':
                const { ssid, password, security = 'WPA', hidden = false } = JSON.parse(text);
                qrData = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
                break;
                
            case 'vcard':
                const vcard = JSON.parse(text);
                qrData = `BEGIN:VCARD\nVERSION:3.0\n`;
                qrData += `FN:${vcard.firstName} ${vcard.lastName}\n`;
                qrData += `N:${vcard.lastName};${vcard.firstName};;;\n`;
                if (vcard.organization) qrData += `ORG:${vcard.organization}\n`;
                if (vcard.phone) qrData += `TEL:${vcard.phone}\n`;
                if (vcard.email) qrData += `EMAIL:${vcard.email}\n`;
                if (vcard.website) qrData += `URL:${vcard.website}\n`;
                if (vcard.address) qrData += `ADR:;;${vcard.address};;;;\n`;
                qrData += `END:VCARD`;
                break;
                
            case 'sms':
                const sms = JSON.parse(text);
                qrData = `sms:${sms.phone}${sms.message ? '?body=' + encodeURIComponent(sms.message) : ''}`;
                break;
                
            case 'email':
                const email = JSON.parse(text);
                qrData = `mailto:${email.to}`;
                const params = [];
                if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`);
                if (email.body) params.push(`body=${encodeURIComponent(email.body)}`);
                if (params.length > 0) qrData += '?' + params.join('&');
                break;
                
            default:
                qrData = text;
        }

        // QR kod seçenekleri
        const qrOptions = {
            width: options.size || 300,
            margin: 2,
            color: {
                dark: options.foreground || '#000000',
                light: options.background || '#FFFFFF'
            },
            errorCorrectionLevel: options.errorLevel || 'M'
        };

        // QR kod oluştur - @shareyxrd
        const qrCodeDataURL = await QRCode.toDataURL(qrData, qrOptions);
        
        res.json({
            success: true,
            qrCode: qrCodeDataURL,
            data: qrData,
            type: type
        });

    } catch (error) {
        console.error('QR kod oluşturma hatası:', error);
        res.status(500).json({
            success: false,
            error: 'QR kod oluşturulurken hata oluştu: ' + error.message
        });
    }
});

// QR kod SVG formatında oluşturma
app.post('/api/generate-svg', async (req, res) => {
    try {
        const { text, type = 'text', options = {} } = req.body;
        
        if (!text) {
            return res.status(400).json({ 
                success: false, 
                error: 'Metin gerekli!' 
            });
        }

        // QR kod verisi hazırla (yukarıdaki ile aynı)
        let qrData = text;
        // ... (type switch case'leri aynı)

        // QR kod seçenekleri
        const qrOptions = {
            width: options.size || 300,
            margin: 2,
            color: {
                dark: options.foreground || '#000000',
                light: options.background || '#FFFFFF'
            },
            errorCorrectionLevel: options.errorLevel || 'M'
        };

        // SVG formatında QR kod oluştur
        const svgString = await QRCode.toString(qrData, {
            ...qrOptions,
            type: 'svg'
        });
        
        res.json({
            success: true,
            svg: svgString,
            data: qrData,
            type: type
        });

    } catch (error) {
        console.error('SVG QR kod oluşturma hatası:', error);
        res.status(500).json({
            success: false,
            error: 'SVG QR kod oluşturulurken hata oluştu: ' + error.message
        });
    }
});

// QR kod dosya olarak indirme - @shareyxrd
app.post('/api/download', async (req, res) => {
    try {
        const { text, format = 'png', type = 'text', options = {} } = req.body;
        
        if (!text) {
            return res.status(400).json({ 
                success: false, 
                error: 'Metin gerekli!' 
            });
        }

        // QR kod verisi hazırla
        let qrData = text;
        // ... (type switch case'leri aynı)

        // QR kod seçenekleri
        const qrOptions = {
            width: options.size || 300,
            margin: 2,
            color: {
                dark: options.foreground || '#000000',
                light: options.background || '#FFFFFF'
            },
            errorCorrectionLevel: options.errorLevel || 'M'
        };

        const timestamp = Date.now();
        
        if (format === 'png') {
            // PNG buffer oluştur
            const buffer = await QRCode.toBuffer(qrData, qrOptions);
            
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Disposition', `attachment; filename="qr-code-${timestamp}.png"`);
            res.send(buffer);
            
        } else if (format === 'svg') {
            // SVG string oluştur
            const svgString = await QRCode.toString(qrData, {
                ...qrOptions,
                type: 'svg'
            });
            
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Disposition', `attachment; filename="qr-code-${timestamp}.svg"`);
            res.send(svgString);
        }

    } catch (error) {
        console.error('QR kod indirme hatası:', error);
        res.status(500).json({
            success: false,
            error: 'QR kod indirilemedi: ' + error.message
        });
    }
});

// Sağlık kontrolü
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'QR Generator API çalışıyor!',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint bulunamadı'
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server hatası:', error);
    res.status(500).json({
        success: false,
        error: 'Sunucu hatası oluştu'
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🚀 QR Generator sunucusu http://localhost:${PORT} adresinde çalışıyor`);
    console.log(`📱 API endpoint: http://localhost:${PORT}/api/generate`);
    console.log(`💻 Geliştirici: @shareyxrd`);
});

module.exports = app;