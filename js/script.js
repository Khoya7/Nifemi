document.addEventListener('DOMContentLoaded', () => {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------
     1. Ambient falling petals
  ---------------------------------------- */
  const petalField = document.getElementById('petalField');
  const petalColors = ['#E8674A', '#E8A33D', '#7C9070', '#4A1942'];

  function spawnPetal() {
    if (!petalField) return;
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 8 + Math.random() * 8;
    petal.style.width = size + 'px';
    petal.style.height = size * 1.3 + 'px';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.background = petalColors[Math.floor(Math.random() * petalColors.length)];
    petal.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
    const duration = 9 + Math.random() * 9;
    petal.style.animationDuration = duration + 's';
    petalField.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
  }

  if (!prefersReducedMotion) {
    for (let i = 0; i < 6; i++) setTimeout(spawnPetal, i * 900);
    setInterval(spawnPetal, 2200);
  }

  /* ----------------------------------------
     2. Scroll-reveal for gallery polaroids
  ---------------------------------------- */
  const polaroids = document.querySelectorAll('.polaroid');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'),
            Array.from(polaroids).indexOf(entry.target) % 3 * 90);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    polaroids.forEach((p) => io.observe(p));
  } else {
    polaroids.forEach((p) => p.classList.add('is-visible'));
  }

  /* ----------------------------------------
     2b. Looping clips: load + play only while on screen
  ---------------------------------------- */
  const loopVideos = document.querySelectorAll('video[muted][loop]');
  function playSafe(v) {
    const attempt = v.play();
    if (attempt && attempt.catch) attempt.catch(() => {});
  }
  function loadClip(v) {
    if (v.dataset.src && !v.getAttribute('src')) {
      v.setAttribute('src', v.dataset.src);
      v.load();
    }
  }
  loopVideos.forEach((v) => {
    v.addEventListener('click', () => {
      loadClip(v);
      playSafe(v);
    });
  });
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const v = entry.target;
        if (entry.isIntersecting) {
          loadClip(v);
          playSafe(v);
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    loopVideos.forEach((v) => vio.observe(v));
  } else {
    // Without IntersectionObserver, load metadata but avoid starting every clip.
    loopVideos.forEach((v) => {
      loadClip(v);
      v.preload = 'metadata';
    });
  }

  /* ----------------------------------------
     3. Video play button
  ---------------------------------------- */
  const video = document.getElementById('birthdayVideo');
  const playButton = document.getElementById('playButton');
  if (video && playButton) {
    playButton.addEventListener('click', () => {
      video.play();
    });
    video.addEventListener('play', () => playButton.classList.add('is-hidden'));
    video.addEventListener('pause', () => playButton.classList.remove('is-hidden'));
    video.addEventListener('ended', () => playButton.classList.remove('is-hidden'));
    video.addEventListener('error', () => {
      const frame = video.closest('.video-frame');
      if (frame) {
        frame.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#FBF3E7;font-family:var(--font-display);font-style:italic;text-align:center;padding:24px;">' +
          'This video could not load. Check that <code>videos/message-to-nifemi.mp4</code> is next to index.html.</div>';
      }
    });
  }

  /* ----------------------------------------
     4. Interactive birthday cake
  ---------------------------------------- */
  const candles = document.querySelectorAll('.candle');
  const wishMade = document.getElementById('wishMade');
  const cakeInstruction = document.getElementById('cakeInstruction');
  let litCount = candles.length;

  candles.forEach((candle) => {
    candle.addEventListener('click', () => {
      if (candle.dataset.lit === 'false') return;
      candle.dataset.lit = 'false';
      candle.setAttribute('aria-label', 'Candle blown out');
      litCount--;

      if (litCount === 0) {
        if (cakeInstruction) cakeInstruction.textContent = 'Every candle is dark. Wish granted-in-progress.';
        if (wishMade) wishMade.hidden = false;
        launchConfetti();
      }
    });
  });

  function launchConfetti() {
    if (prefersReducedMotion) return;
    const colors = ['#E8674A', '#E8A33D', '#7C9070', '#4A1942', '#F3E8D6'];
    const count = 90;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '60';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      const size = 6 + Math.random() * 6;
      const startX = 50 + (Math.random() * 20 - 10);
      piece.style.position = 'absolute';
      piece.style.top = '55%';
      piece.style.left = startX + 'vw';
      piece.style.width = size + 'px';
      piece.style.height = size * 0.4 + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = '2px';
      piece.style.opacity = '0.95';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.transition = 'transform 1.6s cubic-bezier(.15,.7,.4,1), top 1.6s cubic-bezier(.15,.7,.4,1), opacity 1.6s ease-in';
      container.appendChild(piece);

      requestAnimationFrame(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 30;
        const dx = Math.cos(angle) * distance;
        const dy = -Math.abs(Math.sin(angle) * distance) - 20;
        piece.style.top = (55 + dy) + 'vh';
        piece.style.left = (startX + dx) + 'vw';
        piece.style.opacity = '0';
        piece.style.transform = `rotate(${Math.random() * 720}deg)`;
      });
    }
    setTimeout(() => container.remove(), 2000);
  }

  /* ----------------------------------------
     5. Birthday music
  ---------------------------------------- */
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    let isOn = false;
    const birthdayMusic = new Audio('Lara_Del_Rey_-_Young_And_Beautiful_(mp3.pm).mp3');
    birthdayMusic.loop = true;
    birthdayMusic.preload = 'none';
    birthdayMusic.volume = 0.6;

    soundToggle.addEventListener('click', async () => {
      if (isOn) {
        isOn = false;
        birthdayMusic.pause();
      } else {
        try {
          await birthdayMusic.play();
          isOn = true;
        } catch (error) {
          isOn = false;
        }
      }

      soundToggle.setAttribute('aria-pressed', String(isOn));
      soundToggle.setAttribute('aria-label', isOn ? 'Pause birthday music' : 'Play birthday music');
      soundToggle.querySelector('.sound-toggle__icon').textContent = isOn ? '❚❚' : '♪';
    });
  }

  /* ----------------------------------------
     6. Footer year
  ---------------------------------------- */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

});
