<!-- التصميم (CSS) وهيكل المشغل (HTML) والسكربت كاملاً -->
<style>
:root {
  --bg: #080711;
  --purple: #8b5cf6;
  --purple-dark: #6d35d5;
  --white: #f8f7ff;
  --muted: #aaa3bd;
  --line: #ffffff20;
}
* { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0; width: 100%; height: 100%; min-height: 100%;
  overflow: hidden; background: var(--bg); color: var(--white); font-family: Tajawal, Arial, sans-serif;
  direction: ltr;
}
body { display: block; position: fixed; inset: 0; }
.player {
  position: fixed; inset: 0; width: 100%; height: 100%; height: 100dvh;
  max-width: none; max-height: none; aspect-ratio: auto; overflow: hidden; background: #000; isolation: isolate;
}
.player.cursor-hidden { cursor: none !important; }
video { display: block; width: 100%; height: 100%; object-fit: cover; background: #000; }
.shade {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, #0009, transparent 25%, transparent 60%, #000b);
}
.topbar, .controls {
  position: absolute; z-index: 5; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between; padding: 20px;
  direction: ltr;
}
.topbar { top: 0; }
.controls { bottom: 0; }
.brand-link { display: flex; align-items: center; gap: 10px; text-decoration: none; color: inherit; cursor: pointer; direction: rtl; }
.brand-link:hover .brand-name { color: #a78bfa; }
.brand-mark {
  width: 39px; height: 39px; border-radius: 12px; display: grid; place-items: center;
  color: #fff; background: linear-gradient(145deg, #a78bfa, #6128c7); box-shadow: 0 5px 25px #7138d866;
}
.brand-mark svg { width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.brand-name { font-size: 17px; font-weight: 900; transition: color 0.2s ease; text-align: right; }
.brand-sub { font-size: 9px; color: #c2b8da; letter-spacing: 1.5px; direction: ltr; text-align: right; }
.live { background: #ed3150; color: white; padding: 6px 11px; border-radius: 7px; font-size: 11px; font-weight: 900; }
.control-group { display: flex; align-items: center; gap: 9px; direction: ltr; }
.icon-btn {
  width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px;
  border: 1px solid var(--line); background: #171326bb; color: white; cursor: pointer; backdrop-filter: blur(12px);
}
.icon-btn:hover { background: var(--purple-dark); border-color: #a78bfa; }
.icon-btn svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.main-play { width: 42px; height: 42px; border-radius: 12px; }
.volume-wrap { display: flex; align-items: center; gap: 8px; }
.volume { width: 75px; accent-color: #a78bfa; }
.status {
  position: absolute; z-index: 4; inset: 0; display: flex; flex-direction: column;
  justify-content: center; align-items: center; gap: 12px; text-align: center; background: #0005; pointer-events: none; padding: 20px;
  direction: rtl;
}
.status[hidden] { display: none; }
.spinner {
  width: 45px; height: 45px; border: 3px solid #ffffff25; border-top-color: #a78bfa;
  border-radius: 50%; animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.status-text { font-weight: 800; font-size: 15px; }
.status-sub { color: var(--muted); font-size: 12px; }
.menu {
  position: absolute; z-index: 10; bottom: 80px; right: 20px; width: 220px;
  padding: 10px; border: 1px solid var(--line); border-radius: 14px; background: #151123f2; backdrop-filter: blur(20px);
  direction: rtl;
  text-align: right;
}
.menu[hidden] { display: none; }
.menu-title { padding: 8px; color: #c4a6ff; font-weight: 800; border-bottom: 1px solid var(--line); text-align: right; }
.menu button {
  width: 100%; padding: 11px 12px; margin-top: 4px; border: 0; border-radius: 8px;
  background: transparent; color: white; font: 700 13px Tajawal; text-align: right; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  direction: rtl;
}
.menu button:hover { background: #7540ce35; }
.menu button.active-quality { background: var(--purple-dark); color: #fff; }
.menu button.active-quality::after {
  content: '✓';
  font-weight: 900;
  color: #a78bfa;
}
.progress {
  position: absolute; z-index: 6; bottom: 76px; left: 20px; right: 20px;
  height: 5px; background: #ffffff35; cursor: pointer; direction: ltr; border-radius: 3px;
}
.progress span { display: block; height: 100%; width: 100%; background: #a78bfa; border-radius: 3px; pointer-events: none; }
.toast {
  position: absolute; z-index: 15; top: 20%; left: 50%; transform: translateX(-50%);
  background: #171326; border: 1px solid #8b5cf6; border-radius: 9px; padding: 9px 15px; font-size: 12px; display: none;
  direction: rtl;
}
.toast.show { display: block; }
.player.controls-hidden .topbar,
.player.controls-hidden .controls,
.player.controls-hidden .progress,
.player.controls-hidden .menu,
.player.controls-hidden .shade { opacity: 0; visibility: hidden; pointer-events: none; }
.player .topbar, .player .controls, .player .progress, .player .menu, .player .shade { transition: opacity .25s ease, visibility .25s ease; }
.player:fullscreen { width: 100%; height: 100%; max-width: none; max-height: none; background: #000; }
</style>

<!-- هيكل المشغل (HTML) -->
<div class="player" id="player">
  <video id="video" playsinline="playsinline" webkit-playsinline="webkit-playsinline"></video>
  <div class="shade"></div>

  <header class="topbar">
    <a href="https://www.eishha.com/" target="_blank" class="brand-link" title="انتقل إلى موقع عيشها لايف">
      <div class="brand-mark">
        <svg viewBox="0 0 24 24">
          <rect x="3.5" y="5" width="17" height="14" rx="3"/>
          <path d="m10 9 5 3-5 3z"/>
        </svg>
      </div>
      <div>
        <div class="brand-name">عيشها لايف</div>
        <div class="brand-sub">LIVE STREAMING</div>
      </div>
    </a>
    <span class="live">مباشر LIVE</span>
  </header>

  <div class="status" id="status">
    <div class="spinner" id="spinner"></div>
    <div class="status-text" id="statusText">جاري تجهيز البث...</div>
    <div class="status-sub" id="statusSub">عيشها لايف</div>
  </div>

  <div class="toast" id="toast"></div>

  <div class="progress" id="progressBar">
    <span id="progressFill"></span>
  </div>

  <div class="controls">
    <div class="control-group">
      <button class="icon-btn main-play" id="playBtn" title="تشغيل وإيقاف">
        <svg id="playIcon" viewBox="0 0 24 24">
          <path d="M7 4.8c0-.8.9-1.3 1.6-.9l11 7.1c.7.5.7 1.5 0 2l-11 7.1c-.7.4-1.6-.1-1.6-.9V4.8Z"/>
        </svg>
        <svg id="pauseIcon" viewBox="0 0 24 24" style="display:none">
          <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
        </svg>
      </button>

      <div class="volume-wrap">
        <button class="icon-btn" id="muteBtn" title="الصوت">
          <svg id="volumeIcon" viewBox="0 0 24 24">
            <path d="M4 9v6h4l5 4V5L8 9H4Z"/>
            <path d="M16 9a5 5 0 0 1 0 6m2-9a9 9 0 0 1 0 12"/>
          </svg>
          <svg id="mutedIcon" viewBox="0 0 24 24" style="display:none">
            <path d="M4 9v6h4l5 4V5L8 9H4Z"/>
            <path d="m17 9 5 6m0-6-5 6"/>
          </svg>
        </button>
        <input class="volume" id="volume" type="range" min="0" max="1" step=".05" value="1" />
      </div>
    </div>

    <div class="control-group">
      <button class="icon-btn" id="pipBtn" title="نافذة عائمة">
        <svg viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2"/>
          <path d="M13 12h6v5h-6z"/>
        </svg>
      </button>

      <button class="icon-btn" id="qualityBtn" title="جودة البث">
        <svg viewBox="0 0 24 24">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c-.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c-.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
        </svg>
      </button>

      <button class="icon-btn" id="fullscreenBtn" title="ملء الشاشة">
        <svg id="expandIcon" viewBox="0 0 24 24">
          <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>
        </svg>
        <svg id="compressIcon" viewBox="0 0 24 24" style="display:none">
          <path d="M8 3v5H3m13-5v5h5M3 16h5v5m13-5h-5v5"/>
        </svg>
      </button>
    </div>
  </div>

  <div class="menu" id="qualityMenu" hidden="hidden">
    <div class="menu-title">جودة البث</div>
    <div id="qualityOptions"></div>
  </div>
</div>

<!-- السكربت التشغيلي -->
<script>
(() => {
  const $ = id => document.getElementById(id);
  const video = $('video');
  const root = $('player');

  let player = null;
  let currentQualitySetting = 'auto';

  const manifest = window.CUSTOM_MANIFEST;
  const streamClearKeys = window.CUSTOM_CLEAR_KEYS || {};

  function showMessage(title, sub='', loading=false) {
    $('statusText').textContent = title;
    $('statusSub').textContent = sub;
    $('spinner').style.display = loading ? 'block' : 'none';
    $('status').hidden = false;
  }

  function hideMessage() { $('status').hidden = true; }

  function toast(text) {
    $('toast').textContent = text;
    $('toast').classList.add('show');
    setTimeout(() => $('toast').classList.remove('show'), 2200);
  }

  function syncPlay() {
    $('playIcon').style.display = video.paused ? 'block' : 'none';
    $('pauseIcon').style.display = video.paused ? 'none' : 'block';
  }

  let controlsTimer = null;
  let cursorTimer = null;

  function showControls() {
    root.classList.remove('controls-hidden');
    root.classList.remove('cursor-hidden');
    clearTimeout(controlsTimer);
    clearTimeout(cursorTimer);

    controlsTimer = setTimeout(() => {
      if ($('qualityMenu').hidden && !video.paused) {
        root.classList.add('controls-hidden');
      }
    }, 2000);

    cursorTimer = setTimeout(() => {
      if ($('qualityMenu').hidden && !video.paused) {
        root.classList.add('cursor-hidden');
      }
    }, 2000);
  }

  video.addEventListener('click', () => {
    if (video.paused) { video.play().catch(() => toast('تعذر بدء التشغيل')); }
    else { video.pause(); }
    showControls();
  });

  root.addEventListener('mousemove', showControls);
  root.addEventListener('touchstart', showControls, {passive:true});

  $('playBtn').onclick = (e) => {
    e.stopPropagation();
    if (video.paused) { video.play().catch(() => toast('تعذر بدء التشغيل')); }
    else { video.pause(); }
    showControls();
  };

  video.addEventListener('play', () => { syncPlay(); hideMessage(); showControls(); });
  video.addEventListener('pause', () => {
    syncPlay();
    root.classList.remove('controls-hidden');
    root.classList.remove('cursor-hidden');
    clearTimeout(controlsTimer);
    clearTimeout(cursorTimer);
  });

  $('muteBtn').onclick = (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    $('volumeIcon').style.display = video.muted ? 'none' : 'block';
    $('mutedIcon').style.display = video.muted ? 'block' : 'none';
  };

  $('volume').oninput = e => {
    video.volume = Number(e.target.value);
    video.muted = video.volume === 0;
    $('volumeIcon').style.display = video.muted ? 'none' : 'block';
    $('mutedIcon').style.display = video.muted ? 'block' : 'none';
  };

  $('qualityBtn').onclick = (e) => {
    e.stopPropagation();
    $('qualityMenu').hidden = !$('qualityMenu').hidden;
    if (!$('qualityMenu').hidden) { addQualityOptions(); }
    showControls();
  };

  $('fullscreenBtn').onclick = async (e) => {
    e.stopPropagation();
    try {
      if (!document.fullscreenElement) { await root.requestFullscreen(); }
      else { await document.exitFullscreen(); }
    } catch (err) { toast('ملء الشاشة غير مدعوم'); }
  };

  document.addEventListener('fullscreenchange', () => {
    const full = document.fullscreenElement === root;
    $('expandIcon').style.display = full ? 'none' : 'block';
    $('compressIcon').style.display = full ? 'block' : 'none';
    showControls();
  });

  $('pipBtn').onclick = async (e) => {
    e.stopPropagation();
    try {
      if (document.pictureInPictureElement) { await document.exitPictureInPicture(); }
      else if (document.pictureInPictureEnabled) { await video.requestPictureInPicture(); }
      else { toast('النافذة العائمة غير مدعومة'); }
    } catch (err) { toast('تعذر تشغيل النافذة العائمة'); }
  };

  video.addEventListener('timeupdate', () => {
    if (player && player.isLive && player.isLive()) {
      $('progressFill').style.width = '100%';
    } else if (Number.isFinite(video.duration) && video.duration > 0) {
      const percent = (video.currentTime / video.duration) * 100;
      $('progressFill').style.width = percent + '%';
    } else {
      $('progressFill').style.width = '100%';
    }
  });

  $('progressBar').onclick = (e) => {
    e.stopPropagation();
    if (Number.isFinite(video.duration) && video.duration > 0) {
      const rect = $('progressBar').getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = Math.max(0, Math.min(1, clickX / width));
      video.currentTime = percentage * video.duration;
    }
  };

  function onError(error) {
    console.error('Shaka Player error:', error);
    showMessage('تعذر تشغيل البث', 'تحقق من رابط البث وصلاحية الوصول وإعدادات الترخيص.');
  }

  function addQualityOptions() {
    const list = $('qualityOptions');
    list.innerHTML = '';
    if (!player) return;

    const auto = document.createElement('button');
    auto.textContent = 'تلقائي (Auto)';
    if (currentQualitySetting === 'auto') { auto.classList.add('active-quality'); }
    auto.onclick = (e) => {
      e.stopPropagation();
      player.configure({abr:{enabled:true}});
      currentQualitySetting = 'auto';
      $('qualityMenu').hidden = true;
      toast('تم التفعيل على الوضع التلقائي');
    };
    list.append(auto);

    const tracks = player.getVariantTracks().filter(t => t.height);
    const heights = [...new Set(tracks.map(t => t.height))].sort((a,b) => b-a);

    heights.forEach(height => {
      const button = document.createElement('button');
      button.textContent = height + 'p';
      if (currentQualitySetting === height) { button.classList.add('active-quality'); }
      button.onclick = (e) => {
        e.stopPropagation();
        player.configure({abr:{enabled:false}});
        const track = tracks.find(t => t.height === height);
        if (track) {
          player.selectVariantTrack(track, true);
          currentQualitySetting = height;
          toast('تم ضبط الجودة على ' + height + 'p');
        }
        $('qualityMenu').hidden = true;
      };
      list.append(button);
    });
  }

  async function init() {
    if (!manifest) {
      showMessage('عذراً، لم يتم تحديد رابط البث', 'يرجى إضافة رابط البث ومفاتيح التشفير داخل المشاركة.');
      return;
    }

    if (!window.shaka) { showMessage('تعذر تحميل محرك التشغيل', 'تحقق من اتصال الإنترنت.'); return; }
    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) { showMessage('المتصفح غير مدعوم', 'جرّب متصفحاً حديثاً.'); return; }

    player = new shaka.Player(video);
    player.addEventListener('error', event => onError(event.detail));

    player.addEventListener('buffering', event => {
      if (event.buffering) { showMessage('جاري تحميل البث...', 'يرجى الانتظار', true); }
      else if (!video.paused) { hideMessage(); }
    });

    player.configure({
      streaming: {
        bufferingGoal: 20,
        rebufferingGoal: 3,
        bufferBehind: 15,
        retryParameters: { maxAttempts: 5, baseDelay: 500, backoffFactor: 1.5 }
      },
      abr: { enabled: true, defaultBandwidthEstimate: 2500000 },
      drm: { clearKeys: streamClearKeys }
    });

    try {
      showMessage('جاري الاتصال بالبث...', 'عيشها لايف', true);
      await player.load(manifest);
      hideMessage();
      await video.play().catch(() => { showMessage('البث جاهز', 'اضغط زر التشغيل لبدء المشاهدة.'); });
    } catch (error) { onError(error); }
  }

  syncPlay();
  init();
})();
</script>
