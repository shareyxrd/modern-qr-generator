// QR Code Generator Frontend - Created by @shareyxrd
// Global Variables
let currentQRData = null;

// Anti-debugging protection - @shareyxrd
(function() {
    'use strict';
    
    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
    });

    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Detect DevTools
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    setInterval(function() {
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%cDurdur!', 'color: red; font-size: 50px; font-weight: bold;');
                console.log('%cBu bir tarayıcı özelliğidir ve geliştiriciler için tasarlanmıştır.', 'color: red; font-size: 16px;');
            }
        } else {
            devtools.open = false;
        }
    }, 500);

    // Console warning
    console.log('%cDurdur!', 'color: red; font-size: 50px; font-weight: bold;');
    console.log('%cBu bir tarayıcı özelliğidir ve geliştiriciler için tasarlanmıştır. Birisi size buraya kod kopyalayıp yapıştırmanızı söylediyse, bu bir dolandırıcılıktır ve onlara hesabınıza erişim izni verecektir.', 'color: red; font-size: 16px;');
})();


// DOM Elements
const typeButtons = document.querySelectorAll('.type-btn');
const inputForms = document.querySelectorAll('.input-form');
const generateBtn = document.getElementById('generate-btn');
const qrPreview = document.getElementById('qr-preview');
const downloadSection = document.getElementById('download-section');
const loadingOverlay = document.getElementById('loading-overlay');
const messageContainer = document.getElementById('message-container');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showMessage('Hoş geldiniz! QR kod oluşturmaya başlayın.', 'info');
});

// Event Listeners
function initializeEventListeners() {
    // QR Type Selection
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-type');
            selectQRType(type);
        });
    });

    // Generate QR Code
    generateBtn.addEventListener('click', generateQRCode);

    // Download Buttons
    document.getElementById('download-png').addEventListener('click', () => downloadQR('png'));
    document.getElementById('download-svg').addEventListener('click', () => downloadQR('svg'));
}

// QR Type Selection
function selectQRType(type) {
    // Update type buttons
    typeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-type') === type) {
            button.classList.add('active');
        }
    });

    // Show corresponding form
    inputForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${type}-form`) {
            form.classList.add('active');
        }
    });

    // Clear previous QR code
    clearQRPreview();
}

// QR Code Generation - @shareyxrd
async function generateQRCode() {
    const activeType = document.querySelector('.type-btn.active').getAttribute('data-type');
    const qrData = getQRData(activeType);
    
    if (!qrData) {
        showMessage('Lütfen gerekli alanları doldurun.', 'error');
        return;
    }

    const options = getQROptions();
    
    // Show loading
    showLoading(true);
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Oluşturuluyor...';

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: qrData,
                type: activeType,
                options: options
            })
        });

        const result = await response.json();

        if (result.success) {
            displayQRCode(result.qrCode, result.data, result.type);
            currentQRData = { data: qrData, type: activeType, options: options };
            showMessage('QR kod başarıyla oluşturuldu!', 'success');
        } else {
            showMessage('Hata: ' + result.error, 'error');
        }

    } catch (error) {
        console.error('QR kod oluşturma hatası:', error);
        showMessage('QR kod oluşturulurken hata oluştu: ' + error.message, 'error');
    } finally {
        showLoading(false);
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> QR Kod Oluştur';
    }
}

// Get QR Data based on type
function getQRData(type) {
    switch (type) {
        case 'text':
            return document.getElementById('text-input').value.trim();
            
        case 'url':
            return document.getElementById('url-input').value.trim();
            
        case 'wifi':
            const ssid = document.getElementById('wifi-ssid').value.trim();
            const password = document.getElementById('wifi-password').value.trim();
            const security = document.getElementById('wifi-security').value;
            const hidden = document.getElementById('wifi-hidden').checked;
            
            if (!ssid) return '';
            
            return JSON.stringify({ ssid, password, security, hidden });
            
        case 'vcard':
            const firstName = document.getElementById('vcard-firstname').value.trim();
            const lastName = document.getElementById('vcard-lastname').value.trim();
            const organization = document.getElementById('vcard-organization').value.trim();
            const phone = document.getElementById('vcard-phone').value.trim();
            const email = document.getElementById('vcard-email').value.trim();
            const website = document.getElementById('vcard-website').value.trim();
            const address = document.getElementById('vcard-address').value.trim();
            
            if (!firstName && !lastName) return '';
            
            return JSON.stringify({
                firstName, lastName, organization, phone, email, website, address
            });
            
        case 'sms':
            const smsPhone = document.getElementById('sms-phone').value.trim();
            const smsMessage = document.getElementById('sms-message').value.trim();
            
            if (!smsPhone) return '';
            
            return JSON.stringify({ phone: smsPhone, message: smsMessage });
            
        case 'email':
            const emailTo = document.getElementById('email-to').value.trim();
            const emailSubject = document.getElementById('email-subject').value.trim();
            const emailBody = document.getElementById('email-body').value.trim();
            
            if (!emailTo) return '';
            
            return JSON.stringify({ to: emailTo, subject: emailSubject, body: emailBody });
            
        default:
            return '';
    }
}

// Get QR Options
function getQROptions() {
    return {
        size: parseInt(document.getElementById('qr-size').value),
        foreground: document.getElementById('qr-foreground').value,
        background: document.getElementById('qr-background').value,
        errorLevel: document.getElementById('qr-error-level').value
    };
}

// Display QR Code
function displayQRCode(qrCodeDataURL, data, type) {
    qrPreview.innerHTML = `<img src="${qrCodeDataURL}" alt="QR Code">`;
    qrPreview.classList.add('has-qr');
    downloadSection.classList.remove('hidden');
    
    // Update info display
    document.getElementById('qr-data-display').textContent = data.length > 50 ? data.substring(0, 50) + '...' : data;
    document.getElementById('qr-type-display').textContent = getTypeDisplayName(type);
}

// Clear QR Preview
function clearQRPreview() {
    qrPreview.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-qrcode"></i>
            <p>QR kodunuz burada görünecek</p>
        </div>
    `;
    qrPreview.classList.remove('has-qr');
    downloadSection.classList.add('hidden');
    currentQRData = null;
}

// Download QR Code - @shareyxrd
async function downloadQR(format) {
    if (!currentQRData) {
        showMessage('İndirilecek QR kod bulunamadı.', 'error');
        return;
    }

    try {
        showLoading(true);
        
        const response = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: currentQRData.data,
                format: format,
                type: currentQRData.type,
                options: currentQRData.options
            })
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${Date.now()}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showMessage(`${format.toUpperCase()} dosyası indirildi!`, 'success');
        } else {
            const error = await response.json();
            showMessage('İndirme hatası: ' + error.error, 'error');
        }

    } catch (error) {
        console.error('İndirme hatası:', error);
        showMessage('İndirme sırasında hata oluştu: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Show Loading Overlay
function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

// Show Message
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 
                 type === 'error' ? 'fas fa-exclamation-circle' : 
                 'fas fa-info-circle';
    
    messageDiv.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;

    messageContainer.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Get Type Display Name
function getTypeDisplayName(type) {
    const typeNames = {
        'text': 'Metin',
        'url': 'URL',
        'wifi': 'WiFi',
        'vcard': 'vCard',
        'sms': 'SMS',
        'email': 'E-posta'
    };
    return typeNames[type] || type;
}

// Utility Functions
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Real-time validation
document.addEventListener('input', function(e) {
    const target = e.target;
    
    // URL validation
    if (target.type === 'url') {
        if (target.value && !isValidURL(target.value) && !target.value.startsWith('http')) {
            target.classList.add('error-state');
        } else {
            target.classList.remove('error-state');
        }
    }
    
    // Email validation
    if (target.type === 'email') {
        if (target.value && !target.value.includes('@')) {
            target.classList.add('error-state');
        } else {
            target.classList.remove('error-state');
        }
    }
    
    // Phone validation
    if (target.type === 'tel') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (target.value && !phoneRegex.test(target.value)) {
            target.classList.add('error-state');
        } else {
            target.classList.remove('error-state');
        }
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate QR code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateQRCode();
    }
    
    // Escape to clear QR code
    if (e.key === 'Escape') {
        clearQRPreview();
    }
});

// Auto-save form data to localStorage
function saveFormData() {
    const formData = {};
    
    // Save all input values
    document.querySelectorAll('input, textarea, select').forEach(input => {
        if (input.id) {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        }
    });
    
    localStorage.setItem('qr-generator-form-data', JSON.stringify(formData));
}

// Load form data from localStorage
function loadFormData() {
    try {
        const savedData = localStorage.getItem('qr-generator-form-data');
        if (savedData) {
            const formData = JSON.parse(savedData);
            
            Object.keys(formData).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = formData[id];
                    } else {
                        element.value = formData[id];
                    }
                }
            });
        }
    } catch (error) {
        console.warn('Form verisi yüklenemedi:', error);
    }
}

// Save form data on input change
document.addEventListener('input', saveFormData);
document.addEventListener('change', saveFormData);

// Load form data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics (if needed) - @shareyxrd
function trackEvent(eventName, eventData = {}) {
    // Google Analytics veya başka analytics servisi için
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    console.log('Event tracked:', eventName, eventData); // @shareyxrd
}

// Track QR code generation
const originalGenerateQRCode = generateQRCode;
generateQRCode = async function() {
    const activeType = document.querySelector('.type-btn.active').getAttribute('data-type');
    trackEvent('qr_code_generated', { type: activeType });
    return originalGenerateQRCode.call(this);
};