// Main interactions module - exposed for re-initialization after dynamic rendering
window.MainInteractions = (function() {
  'use strict';

  function init() {
    initHeroCTA();
    initHeroCinemaMode();
    // Tab and accordion init moved to section-renderer
  }

  function initHeroCTA() {
    // Hero primary CTA: smooth scroll to next section (Highlights)
    const heroCtaPrimary = document.querySelector('section#overview button[data-material="hero.ctaPrimary"]');
    if (heroCtaPrimary) {
      heroCtaPrimary.addEventListener('click', () => {
        const next = document.getElementById('highlights');
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function initHeroCinemaMode() {
    const heroSection   = document.querySelector('section#overview');
    const watchButton   = document.querySelector('.hero-cinema-secondary');
    const exitButton    = document.querySelector('.hero-exit-cinema');
    const controls      = document.querySelector('.hero-video-controls');
    const playPauseBtn  = document.querySelector('.hero-video-playpause');
    const progressTrack = document.querySelector('.hero-video-progress-track');
    const progressFill  = document.querySelector('.hero-video-progress-fill');
    const timeLabel     = document.querySelector('.hero-video-time');
    const video         = document.querySelector('section#overview video[data-material-video]');

    if (!heroSection || !watchButton || !exitButton) return;

    // ── Helpers ──────────────────────────────────────────────────────────
    function updatePlayPauseIcon(paused) {
      if (!playPauseBtn) return;
      playPauseBtn.innerHTML = paused
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
      playPauseBtn.setAttribute('aria-label', paused ? 'Play' : 'Pause');
    }

    function updateProgress() {
      if (!video || !video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      if (progressFill) progressFill.style.width = pct + '%';
      if (timeLabel) timeLabel.textContent = formatTime(video.currentTime);
    }

    // ── Video event listeners ─────────────────────────────────────────────
    if (video) {
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('play',  () => updatePlayPauseIcon(false));
      video.addEventListener('pause', () => updatePlayPauseIcon(true));
    }

    // ── Play / Pause toggle ───────────────────────────────────────────────
    if (playPauseBtn && video) {
      playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play().catch(err => console.warn('Play failed:', err));
        } else {
          video.pause();
        }
      });
    }

    // ── Progress seek ─────────────────────────────────────────────────────
    if (progressTrack && video) {
      progressTrack.addEventListener('click', (e) => {
        if (!video.duration) return;
        const rect = progressTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        video.currentTime = ratio * video.duration;
      });
    }

    // ── Enter cinema mode ─────────────────────────────────────────────────
    watchButton.addEventListener('click', () => {
      heroSection.classList.add('cinema-mode');
      // CSS drives visibility of exitButton and controls via .cinema-mode selector

      if (video) {
        video.muted = false;
        video.play().catch(err => console.warn('Video play failed:', err));
      }
    });

    // ── Exit cinema mode ──────────────────────────────────────────────────
    exitButton.addEventListener('click', () => {
      heroSection.classList.remove('cinema-mode');
      // CSS hides exitButton and controls when .cinema-mode is removed

      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  }

  return {
    init
  };
})();

// Don't auto-initialize - let section-renderer handle it after DOM is rendered
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', () => {
//     window.MainInteractions.init();
//   });
// } else {
//   window.MainInteractions.init();
// }
