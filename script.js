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
