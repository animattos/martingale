// ==== SinaisPower static ====
const BASE_TRADERS = 3400;
const TRIAL_KEY = 'sp_trial_clicks';

function getClicks(){return Number(localStorage.getItem(TRIAL_KEY)||0)}
function currentTraders(){return BASE_TRADERS+getClicks()}

function updateTradersUI(){
  const n=currentTraders();
  document.querySelectorAll('.js-traders').forEach(el=>el.textContent=n.toLocaleString('pt-BR'));
  const s=document.querySelector('.js-stat-traders');
  if(s){s.dataset.target=String(n); s.textContent='+'+n.toLocaleString('pt-BR');}
}

function incrementTrial(){
  localStorage.setItem(TRIAL_KEY,String(getClicks()+1));
  updateTradersUI();
}

document.querySelectorAll('.js-trial').forEach(b=>b.addEventListener('click',incrementTrial));

// Year
document.getElementById('year').textContent=new Date().getFullYear();

// Count-up on scroll
function animateCount(el){
  const target=Number(el.dataset.target||0);
  const prefix=el.dataset.prefix||'';
  const suffix=el.dataset.suffix||'';
  const fmt=el.dataset.format;
  const dur=1600, start=performance.now();
  function tick(now){
    const p=Math.min(1,(now-start)/dur);
    const eased=1-Math.pow(1-p,3);
    const v=Math.round(target*eased);
    const shown=fmt==='thousands'?v.toLocaleString('pt-BR'):v;
    el.textContent=prefix+shown+suffix;
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !e.target.dataset.done){
      e.target.dataset.done='1';
      animateCount(e.target);
    }
  });
},{threshold:.3});
document.querySelectorAll('.stat-num').forEach(el=>io.observe(el));

updateTradersUI();

// Video modal
const modal=document.getElementById('videoModal');
const frame=document.getElementById('videoFrame');
const VIDEO_SRC='https://www.youtube.com/embed/ddIa9X3pwLE?autoplay=1';
function openVideo(){modal.classList.add('open');frame.src=VIDEO_SRC;document.body.style.overflow='hidden';}
function closeVideo(){modal.classList.remove('open');frame.src='';document.body.style.overflow='';}
document.querySelectorAll('.js-open-video').forEach(b=>b.addEventListener('click',openVideo));
document.querySelectorAll('.js-close-video').forEach(b=>b.addEventListener('click',closeVideo));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeVideo()});
