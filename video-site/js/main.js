(() => {
  const video1 = document.getElementById('video1');
  const video2 = document.getElementById('video2');
  const soundBtn = document.getElementById('soundBtn');
  const startBtn = document.getElementById('startBtn');
  const errorEl = document.getElementById('error');

  let soundOn = false;
  let started = false;

  // Компьютер (широкий экран + мышь): сайт только для телефона, видео не запускаем
  const desktopQuery = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');

  function showError(text) {
    errorEl.textContent = text;
    errorEl.hidden = false;
  }

  // Переключение на второе (зацикленное) видео
  function playSecond() {
    video2.currentTime = 0;
    video2.muted = !soundOn;
    video2.play().then(() => {
      video2.classList.add('is-active');
      video1.classList.remove('is-active');
    }).catch(() => {
      startBtn.hidden = false;
    });
  }

  // Запуск первого видео при входе на сайт
  function playFirst() {
    video1.muted = !soundOn;
    return video1.play();
  }

  video1.addEventListener('ended', playSecond);

  video1.addEventListener('error', () => {
    showError('Не найден файл videos/video1.mp4');
  });
  video2.addEventListener('error', () => {
    showError('Не найден файл videos/video2.mp4');
  });

  // Кнопка звука
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    video1.muted = !soundOn;
    video2.muted = !soundOn;
    soundBtn.textContent = soundOn ? 'Выключить звук' : 'Включить звук';
    soundBtn.setAttribute('aria-pressed', String(soundOn));
  });

  // Если автозапуск заблокирован — запускаем по клику
  startBtn.addEventListener('click', () => {
    startBtn.hidden = true;
    const active = video1.classList.contains('is-active') ? video1 : video2;
    active.play();
  });

  function start() {
    if (started) return;
    started = true;
    // Без звука — иначе телефон заблокирует автозапуск
    playFirst().catch(() => {
      startBtn.hidden = false;
    });
  }

  function onDeviceChange() {
    if (desktopQuery.matches) {
      video1.pause();
      video2.pause();
    } else if (started) {
      const active = video1.classList.contains('is-active') ? video1 : video2;
      active.play().catch(() => { startBtn.hidden = false; });
    } else {
      start();
    }
  }

  // Ставим на паузу, когда вкладку свернули, и продолжаем при возврате
  document.addEventListener('visibilitychange', () => {
    if (desktopQuery.matches || !started) return;
    const active = video1.classList.contains('is-active') ? video1 : video2;
    if (document.hidden) active.pause();
    else active.play().catch(() => { startBtn.hidden = false; });
  });

  desktopQuery.addEventListener('change', onDeviceChange);
  onDeviceChange();
})();
