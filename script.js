const intro = document.getElementById('intro');
const invite = document.getElementById('invite');
const openInvite = document.getElementById('openInvite');
const book = document.getElementById('book');
const pages = [...document.querySelectorAll('.page')];
const prevBtn = document.getElementById('prevPage');
const nextBtn = document.getElementById('nextPage');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');

let current = 0;
let startX = 0;
let startY = 0;
let tracking = false;
let locked = false;

pages.forEach((page, index) => {
  page.style.zIndex = String(pages.length - index + 2);
});

function updateUI() {
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;
}

function nextPage() {
  if (locked || current >= pages.length - 1) return;
  locked = true;
  const page = pages[current];
  page.classList.add('flipping');
  requestAnimationFrame(() => page.classList.add('flipped'));
  window.setTimeout(() => {
    page.classList.remove('flipping');
    current += 1;
    updateUI();
    locked = false;
  }, 900);
}

function previousPage() {
  if (locked || current <= 0) return;
  locked = true;
  const page = pages[current - 1];
  page.classList.add('flipping');
  page.classList.remove('flipped');
  window.setTimeout(() => {
    page.classList.remove('flipping');
    current -= 1;
    updateUI();
    locked = false;
  }, 900);
}

openInvite.addEventListener('click', () => {
  if (openInvite.classList.contains('opening')) return;
  openInvite.classList.add('opening');
  backgroundMusic.volume = 0.5;
  backgroundMusic.play().catch(() => {
    musicToggle.classList.add('muted');
    musicToggle.setAttribute('aria-label', 'Tocar música');
    musicToggle.title = 'Tocar música';
  });
  window.setTimeout(() => {
    invite.classList.add('visible');
    invite.setAttribute('aria-hidden', 'false');
    intro.classList.add('hidden');
  }, 1250);
});

prevBtn.addEventListener('click', previousPage);
nextBtn.addEventListener('click', nextPage);

document.addEventListener('keydown', (event) => {
  if (!invite.classList.contains('visible')) return;
  if (event.key === 'ArrowLeft') previousPage();
  if (event.key === 'ArrowRight') nextPage();
});

book.addEventListener('pointerdown', (event) => {
  if (event.target.closest('a, button')) return;
  startX = event.clientX;
  startY = event.clientY;
  tracking = true;
  book.setPointerCapture?.(event.pointerId);
});

book.addEventListener('pointerup', (event) => {
  if (!tracking) return;
  tracking = false;
  const dx = event.clientX - startX;
  const dy = event.clientY - startY;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.15) {
    if (dx < 0) nextPage();
    else previousPage();
  }
});

book.addEventListener('pointercancel', () => { tracking = false; });
updateUI();


musicToggle.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play().then(() => {
      musicToggle.classList.remove('muted');
      musicToggle.setAttribute('aria-label', 'Pausar música');
      musicToggle.title = 'Pausar música';
    }).catch(() => {});
  } else {
    backgroundMusic.pause();
    musicToggle.classList.add('muted');
    musicToggle.setAttribute('aria-label', 'Tocar música');
    musicToggle.title = 'Tocar música';
  }
});
