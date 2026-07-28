const intro=document.getElementById('intro');
const invite=document.getElementById('invite');
const openInvite=document.getElementById('openInvite');
const book=document.getElementById('book');
const pages=[...document.querySelectorAll('.page')];
const prevBtn=document.getElementById('prevPage');
const nextBtn=document.getElementById('nextPage');
const backgroundMusic=document.getElementById('backgroundMusic');
const musicToggle=document.getElementById('musicToggle');
let current=0,startX=0,startY=0,tracking=false,locked=false;
pages.forEach((page,index)=>{page.style.zIndex=String(pages.length-index+2)});
function updateUI(){prevBtn.disabled=current===0;nextBtn.disabled=current===pages.length-1}
function nextPage(){if(locked||current>=pages.length-1)return;locked=true;const page=pages[current];page.classList.add('flipping');requestAnimationFrame(()=>page.classList.add('flipped'));setTimeout(()=>{page.classList.remove('flipping');current++;updateUI();locked=false},950)}
function previousPage(){if(locked||current<=0)return;locked=true;const page=pages[current-1];page.classList.add('flipping');page.classList.remove('flipped');setTimeout(()=>{page.classList.remove('flipping');current--;updateUI();locked=false},950)}
openInvite.addEventListener('click',()=>{if(openInvite.classList.contains('opening'))return;openInvite.classList.add('opening');backgroundMusic.volume=.5;backgroundMusic.play().catch(()=>{musicToggle.classList.add('muted');musicToggle.setAttribute('aria-label','Tocar música');musicToggle.title='Tocar música'});setTimeout(()=>{invite.classList.add('visible');invite.setAttribute('aria-hidden','false')},900);setTimeout(()=>intro.classList.add('hidden'),1650)});
prevBtn.addEventListener('click',previousPage);nextBtn.addEventListener('click',nextPage);
document.addEventListener('keydown',e=>{if(!invite.classList.contains('visible'))return;if(e.key==='ArrowLeft')previousPage();if(e.key==='ArrowRight')nextPage()});
book.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;startX=e.clientX;startY=e.clientY;tracking=true;book.setPointerCapture?.(e.pointerId)});
book.addEventListener('pointerup',e=>{if(!tracking)return;tracking=false;const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>42&&Math.abs(dx)>Math.abs(dy)*1.1){dx<0?nextPage():previousPage()}});
book.addEventListener('pointercancel',()=>tracking=false);
musicToggle.addEventListener('click',()=>{if(backgroundMusic.paused){backgroundMusic.play().then(()=>{musicToggle.classList.remove('muted');musicToggle.setAttribute('aria-label','Pausar música');musicToggle.title='Pausar música'}).catch(()=>{})}else{backgroundMusic.pause();musicToggle.classList.add('muted');musicToggle.setAttribute('aria-label','Tocar música');musicToggle.title='Tocar música'}});
updateUI();
