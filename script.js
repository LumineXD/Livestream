// ============ KEAMANAN DASAR ============
// Cegah klik kanan (right-click)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
});

// Cegah copy
document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
});

// Cegah F12 dan DevTools
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
    
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
    }
});

// Deteksi DevTools dibuka
setInterval(function() {
    const threshold = 160;
    if ((window.outerWidth - window.innerWidth > threshold) || 
        (window.outerHeight - window.innerHeight > threshold)) {
        window.location.href = '/404.html';
    }
}, 500);

// ============ END KEAMANAN ============

// ============ KONFIG M3U8 AUTO-DETECT ============
// 🔗 LINK WEBSITE STREAMING (di mana m3u8 diload):
const SOURCE_WEBSITE = 'https://play.ngidolihub.my.id/?slug=sambil-menggandeng-erat-tanganku-2026-02-12-260201200059';
const videoElement = document.getElementById('livestreamVideo');
const videoSource = document.getElementById('videoSource');
const deviceInfo = document.getElementById('deviceInfo');

let currentM3U8URL = '';
let detectedQualities = [];

// Intercept fetch requests untuk mendeteksi m3u8 URLs
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const result = originalFetch.apply(this, args);
    
    result.then(response => {
        // Cek jika response URL mengandung .m3u8
        if (response.url && response.url.includes('.m3u8')) {
            const newUrl = response.url.split('?')[0]; // Hapus query params jika ada
            if (newUrl !== currentM3U8URL) {
                currentM3U8URL = newUrl;
                
                // Clone response untuk parsing kualitas
                response.clone().text().then(data => {
                    parseM3U8Qualities(data, newUrl);
                    updateVideoSource(newUrl);
                });
            }
        }
    }).catch(err => {
        // Silently catch errors
    });
    
    return result;
};

// Deteksi XMLHttpRequest untuk m3u8 URLs
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    if (url && url.includes('.m3u8')) {
        const newUrl = url.split('?')[0];
        if (newUrl !== currentM3U8URL) {
            currentM3U8URL = newUrl;
            updateVideoSource(newUrl);
        }
    }
    return originalOpen.apply(this, [method, url, ...rest]);
};

// ============ END M3U8 AUTO-DETECT ============

// Parse M3U8 master playlist untuk detect kualitas
function parseM3U8Qualities(m3u8Content, masterUrl) {
    detectedQualities = [];
    
    const lines = m3u8Content.split('\n');
    let qualityInfo = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Cek jika ada #EXT-X-STREAM-INF (stream info)
        if (line.includes('#EXT-X-STREAM-INF')) {
            qualityInfo = line;
            
            if (i + 1 < lines.length) {
                let playlistUrl = lines[i + 1].trim();
                
                if (!playlistUrl.startsWith('http')) {
                    const baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf('/') + 1);
                    playlistUrl = baseUrl + playlistUrl;
                }
                
                // Extract resolution/bitrate
                let resolution = 'Auto';
                let bandwidth = '';
                
                const resMatch = qualityInfo.match(/RESOLUTION=(\d+x\d+)/);
                const bandwidthMatch = qualityInfo.match(/BANDWIDTH=(\d+)/);
                
                if (resMatch) {
                    resolution = resMatch[1];
                }
                if (bandwidthMatch) {
                    bandwidth = (parseInt(bandwidthMatch[1]) / 1000).toFixed(0) + 'kbps';
                }
                
                detectedQualities.push({
                    name: `${resolution} (${bandwidth})`,
                    resolution: resolution,
                    bandwidth: bandwidth,
                    url: playlistUrl
                });
                
                // Quality detected
            }
        }
    }
    
    // Tampilkan qualities di UI
    if (detectedQualities.length > 0) {
        displayQualitySelector();
    }
}

// Tampilkan quality selector UI
function displayQualitySelector() {
    let selector = document.getElementById('qualitySelector');
    
    if (!selector) {
        selector = document.createElement('div');
        selector.id = 'qualitySelector';
        selector.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 100;
            border: 1px solid #555;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        videoElement.parentElement.style.position = 'relative';
        videoElement.parentElement.insertBefore(selector, videoElement.nextSibling);
    }
    
    let html = '<strong style="display: block; margin-bottom: 8px;">📊 Pilih Kualitas:</strong>';
    detectedQualities.forEach((quality, index) => {
        html += `<button onclick="switchQuality(${index})" style="
            display: block;
            width: 100%;
            margin: 5px 0;
            padding: 6px 8px;
            background: #333;
            color: white;
            border: 1px solid #666;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            text-align: left;
            transition: all 0.3s;
        " onmouseover="this.style.background='#555'" onmouseout="this.style.background='#333'">
            ▶ ${quality.name}
        </button>`;
    });
    
    selector.innerHTML = html;
}

// Switch ke quality tertentu
function switchQuality(index) {
    if (detectedQualities[index]) {
        const quality = detectedQualities[index];
        updateVideoSource(quality.url);
    }
}

function updateVideoSource(url) {
    if (!url) return;
    
    currentM3U8URL = url;
    
    if (Hls.isSupported()) {
        if (videoElement.hls) {
            // Update existing instance
            videoElement.hls.loadSource(url);
            videoElement.hls.startLoad();
        } else {
            // Create new HLS instance
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                maxBufferLength: 30,
                fragLoadingTimeOut: 20000
            });
            
            hls.loadSource(url);
            hls.attachMedia(videoElement);
            videoElement.hls = hls;
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                videoElement.play().catch(e => {});
            });
            
            hls.on(Hls.Events.ERROR, function(event, data) {
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                    }
                }
            });
        }
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Untuk Safari
        videoSource.src = url;
        videoElement.load();
        videoElement.play();
    }
}

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
    
    // Device info disembunyikan
}

async function fetchStreamUrl() {
    try {
        const response = await fetch(SOURCE_WEBSITE);
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
        return null;
    }
}

async function initLivestream() {
    // Coba fetch API dulu (jika ada)
    const streamUrl = await fetchStreamUrl();
    if (streamUrl) {
        updateVideoSource(streamUrl);
    }
    
    // Refresh URL setiap 20 detik untuk mendeteksi perubahan
    setInterval(async function() {
        const newStreamUrl = await fetchStreamUrl();
        if (newStreamUrl && newStreamUrl !== currentM3U8URL) {
            updateVideoSource(newStreamUrl);
        }
    }, 20000);
}

document.addEventListener('DOMContentLoaded', function() {
    detectDevice();
    initLivestream();
});
