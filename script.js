// ============ KEAMANAN BERLAPIS ============

// Watermark di console
console.log('%c⚠️ PERHATIAN! ⚠️', 'color: red; font-size: 20px; font-weight: bold;');
console.log('%cHalaman ini DILINDUNGI. Mengakses atau mengubah kode tanpa izin adalah ILEGAL.', 'color: red; font-size: 14px;');
console.log('%cTanggung Jawab Penuh: Semua aktivitas tidak sah dilacak dan dilaporkan.', 'color: orange; font-size: 12px;');

// 1. DETEKSI DEBUGGER
setInterval(function() {
    const start = new Date();
    debugger;
    const end = new Date();
    if (end - start > 100) {
        // Debugger terdeteksi, redirect ke 404
        window.location.href = '/404.html';
    }
}, 1000);

// 2. CEGAH KLIK KANAN
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// 3. CEGAH F12 DAN DEVELOPER TOOLS
document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+Shift+K (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+S (Save)
    if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
    }
});

// 4. CEGAH DRAG SELECTION
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// 5. CEGAH COPY
document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});

// 6. CEGAH CUT
document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
});

// 7. CEGAH PASTE
document.addEventListener('paste', function(e) {
    e.preventDefault();
    return false;
});

// 8. DETEKSI DEVTOOLS YANG SUDAH TERBUKA
setInterval(function() {
    const threshold = 160;
    
    if (window.outerWidth - window.innerWidth > threshold || 
        window.outerHeight - window.innerHeight > threshold) {
        // DevTools terdeteksi, redirect ke 404
        window.location.href = '/404.html';
    }
}, 500);

// 9. CEGAH MOUSEDOWN KLIK KANAN
document.addEventListener('mousedown', function(e) {
    if (e.button === 2) {
        e.preventDefault();
        return false;
    }
});

// 10. PROTEKSI KEYBOARD TAMBAHAN
document.onkeydown = function(e) {
    // Cegah berbagai kombinasi keyboard yang mencurigakan
    if (e.ctrlKey || e.altKey || e.shiftKey) {
        // Logging untuk deteksi
        return false;
    }
};

// 11. CEGAH INSPECT VIA CHROME EXTENSION
Object.defineProperty(window, 'chrome', {
    writable: false,
    configurable: false
});

// 12. OBFUSCATE DIRI - Cegah eksekusi code dari console
const originalEval = eval;
eval = function() {
    return null;
};

// ============ END KEAMANAN BERLAPIS ============

const API_URL = 'https://api.ngidolihub.my.id/api/stream/v3/playback?slug=pertaruhan-cinta-2026-02-05-260201195523';
const videoElement = document.getElementById('livestreamVideo');
const videoSource = document.getElementById('videoSource');
const deviceInfo = document.getElementById('deviceInfo');

function detectDevice() {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobi)/i.test(userAgent);
    
    let deviceType = 'Desktop';
    if (isTablet) {
        deviceType = 'Tablet';
    } else if (isMobile) {
        deviceType = 'Mobile';
    }
    
    deviceInfo.textContent = `Mode: ${deviceType}`;
    console.log(`Device Type: ${deviceType}`);
}

async function fetchStreamUrl() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        let streamUrl = null;
        if (data.data && data.data.url) {
            streamUrl = data.data.url;
        } else if (data.url) {
            streamUrl = data.url;
        } else if (data.playback_url) {
            streamUrl = data.playback_url;
        } else if (data.stream_url) {
            streamUrl = data.stream_url;
        }
        
        return streamUrl;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function initLivestream() {
    const streamUrl = await fetchStreamUrl();
    if (!streamUrl) return;
    
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
    } else {
        videoSource.src = streamUrl;
        videoElement.load();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    detectDevice();
    initLivestream();
});
