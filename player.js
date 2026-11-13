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
