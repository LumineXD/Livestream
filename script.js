// ============ KEAMANAN ============
// Cegah klik kanan (right-click)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Cegah F12 dan Developer Tools
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
    
    // Ctrl+Shift+K (Delete)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
        e.preventDefault();
        return false;
    }
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
});

// Cegah drag selection (select text)
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
});

// Cegah copy
document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});

// Deteksi jika Developer Tools dibuka
setInterval(function() {
    const devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    // Cek ukuran window
    if (window.outerWidth - window.innerWidth > threshold || 
        window.outerHeight - window.innerHeight > threshold) {
        devtools.open = true;
    }
    
    // Cek konsol (jika diperlukan, Anda bisa tambahkan aksi di sini)
    if (devtools.open) {
        // Optional: Jika ingin memberi alert
        // console.clear();
    }
}, 500);

// Cegah inspect element dengan mousedown
document.addEventListener('mousedown', function(e) {
    if (e.button === 2) { // Klik kanan
        e.preventDefault();
        return false;
    }
});

// ============ END KEAMANAN ============

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
