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

const API_URL = 'https://server.ngidolihub.my.id/?target=https%3A%2F%2Faps12.playlist.live-video.net%2Fv1%2Fplaylist%2FCuYFt29IYiruArjZ8eQmJemOBUCpXIWPx6eZOAefnCUw7kuojXdADnbPU2Xay-7e3NRcsKC1zA7EsBbyTR36xpoEhT1Az_aTb7wE16hkpYgDFn8tGUKgImZ0B2vVq34Ai11J_yaLLbdGQ7FKOG2DYSrlKEPTbZIp2yqvDhl3L9saMd9gFtiStVuhepAi6gEdY6Uy7INtJ9-Qfd1OV70xCKWt2TX7eVbCvosMEs6b_AhqkuxzZsBlT9JYddNMcT9kXZBuNplXIwv6LK2HRsy5K1EYQ5fHmeXLzlQkYU42HrGLQnMVm03AUoeCG1oznqwEkDldD4rtLtjxN_OWl5_aKkSDolfC9edDcWbDetRLWOv7caZa2yg99qZcKbGKUOO1yNU0tzeyF1fP2wSH3HM_4zh3pyhI9DdQQ0coCmrmKfg8O8AuVIZANqlQUorl-v7mez4uuQv8WeZEsZO3nKti76p7GhqMjtYYU_XrRID9REpjqDFRNswxHuOOUSc7SpKs8GKV3jSDFfw4CXF-zvFE1z-MjywQFjVK8BV1Nx8_iR6Q5UxfH4HZutWdjo98DNYV0wXXU_u8KYPOBEKCiXRW5yfnDqvlEdKzkYE99TOoEgghaGR90OwZOra-WoEC4dPAIl7wH6vdyFnHj4NSbQaTOIqKk2y3qbRT1LzL73BQ69k5vQC2ysz55T7A33txyMw0x24yDZdRd7xGqIDjgitrYTCsMwSbQBBeZmyw-mU8fVHCQ2BiEa2lS68nLKZ8HIqDHPMz_xhg4M4VzypTLZrO0lvvbuUscQp_nm6KW6BoTCJ_ZWOYyqKjQOejOeVsJdMdccibLM5s-sFoDmAwazRUBWRzZaEs51pEx-V9YHya2bI4BVYQkgIBH4jOuFgGrkVy9qhU4PuHf9HkMCUlh-Vegweh1mIykSpBgIyibaO-QCK1qK2kZYa7xgWxaryUrvR8Kl3U_Sg3TlgOVuBKbk07h7zLsR_0qj9-2RoMPNPFO4qE_SlsJy1gIAEqCXVzLXdlc3QtMjCwDg.m3u8';
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


