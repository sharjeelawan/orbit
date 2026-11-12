// Shots pulled from dribbble.com/sharjeeel — images live in assets/shots/{id}-md|lg.webp
const SHOTS = [
  { id: 'voice-orb', tag: 'AI · Voice', title: 'Voice Orb: Frosted AI Voice Interface', url: 'https://dribbble.com/shots/27860411-Voice-Orb-Frosted-AI-Voice-Interface' },
  { id: 'crypto-intelligence', tag: 'Fintech · Dashboard', title: 'Crypto Intelligence Dashboard & Mobile UI', url: 'https://dribbble.com/shots/27155697-Crypto-Intelligence-Dashboard-Mobile-UI' },
  { id: 'fintech-branding', tag: 'Branding', title: 'Fintech Branding and Logo Design', url: 'https://dribbble.com/shots/27109050-Fintech-Branding-and-Logo-Design' },
  { id: 'multichain-wallet', tag: 'Web3 · Mobile', title: 'Multi-chain Crypto Wallet', url: 'https://dribbble.com/shots/27092304-Multi-chain-crypto-wallet' },
  { id: 'media-streaming', tag: 'Web Platform', title: 'Media & Streaming Discovery Platform', url: 'https://dribbble.com/shots/27013456-Media-Streaming-Discovery-Platform' },
  { id: 'web3-portfolio', tag: 'Web3 · Dashboard', title: 'Web3 Crypto Dashboard for Portfolio Tracking', url: 'https://dribbble.com/shots/26984995-Web3-Crypto-Dashboard-UI-for-Portfolio-Tracking' },
  { id: 'web3-brand', tag: 'Branding', title: 'Web3 Brand Identity & Logo Design', url: 'https://dribbble.com/shots/26428821-Web3-Brand-Identity-Logo-Design' },
  { id: 'wallet-exchange', tag: 'Fintech · Mobile', title: 'Crypto Wallet & Exchange App UI', url: 'https://dribbble.com/shots/26276752-Crypto-Wallet-Exchange-App-UI' },
  { id: 'healthtech-landing', tag: 'Landing Page', title: 'Landing Page for a HealthTech B2B Company', url: 'https://dribbble.com/shots/26262011-Landing-Page-for-a-HealthTech-B2B-Company' },
  { id: 'predz', tag: 'Web3 · Dashboard', title: 'Web3 Prediction Dashboard – PREDZ', url: 'https://dribbble.com/shots/26260518-Web3-Prediction-Dashboard-UI-PREDZ' },
  { id: 'ai-learning', tag: 'AI · Mobile', title: 'AI Mobile App – Smart Learning Experience', url: 'https://dribbble.com/shots/26257186-AI-Mobile-App-Smart-Learning-Experience' },
  { id: 'fitness-landing', tag: 'Landing Page', title: 'Fitness Landing Page Design', url: 'https://dribbble.com/shots/26250038-Fitness-Landing-Page-Design' },
  { id: 'crypto-exchange', tag: 'Fintech · Web', title: 'Centralized Crypto Exchange', url: 'https://dribbble.com/shots/26239854-Centralized-Crypto-Exchange' },
  { id: 'staking-dashboard', tag: 'Web3 · Dashboard', title: 'Crypto Staking Dashboard', url: 'https://dribbble.com/shots/24416781-Crypto-Staking-Dashboard' },
  { id: 'nft-marketplace', tag: 'Web3 · Web', title: 'NFT Marketplace', url: 'https://dribbble.com/shots/23541995-NFT-Marketplace' },
  { id: 'metaverse-app', tag: 'Mobile', title: 'Metaverse Mobile App UI Design', url: 'https://dribbble.com/shots/21376291-Metaverse-Mobile-App-UI-Design' },
  { id: 'crypto-trading', tag: 'Fintech · Mobile', title: 'Crypto Trading Mobile App', url: 'https://dribbble.com/shots/21120182-Crypto-Trading-Mobile-App' },
  { id: 'isometric-room', tag: 'Illustration', title: 'Isometric Room', url: 'https://dribbble.com/shots/15612720-Isometric-Room' },
  { id: 'camera-icon', tag: 'Icon', title: 'Dribbble Cam – Camera App Icon', url: 'https://dribbble.com/shots/13933840-Dribbble-Cam-Camera-App-Icon-Design-DailyUI' },
  { id: 'product-landing', tag: 'Landing Page', title: 'Product Landing Page', url: 'https://dribbble.com/shots/13930836-Product-Landing-Page-DailyUI' },
  { id: 'video-calling', tag: 'Mobile', title: 'Video Calling App Concept', url: 'https://dribbble.com/shots/13921498-Video-Calling-App-Concept-Design' },
  { id: 'sign-up', tag: 'Mobile', title: 'Sign Up – Daily UI', url: 'https://dribbble.com/shots/13905779-Sign-Up-DailyUI' },
];

const RINGS = [-66, -44, -22, 0, 22, 44, 66]; // latitudes, degrees
const CARD_RATIO = 0.36;                       // card width relative to radius
const IDLE_SPEED = 7;                          // deg / second
const BASE_TILT = -8;

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.querySelector('.hero');
const stage = document.querySelector('.stage');
const globe = document.querySelector('.globe');
const lightbox = document.querySelector('.lightbox');
const lbImg = lightbox.querySelector('.lb-img');
const lbTag = lightbox.querySelector('.lb-tag');
const toggle = document.querySelector('.toggle');
const pillTitle = document.querySelector('.pill-title');
const pillLink = document.querySelector('.pill-link');

const state = {
  rx: BASE_TILT, ry: 0, z: 0, vy: reduce ? 0 : IDLE_SPEED,
  tilt: 0, R: 300, open: null, busy: false, lbMix: 0,
  drag: null, tweening: 0,
};

const rad = d => d * Math.PI / 180;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = t => 1 - Math.pow(1 - t, 4);
const src = (shot, size) => `assets/shots/${shot.id}-${size}.webp`;

// ---------- Build the globe ----------

const cards = [];
let n = 0;
RINGS.forEach((lat, ring) => {
  // Same circumference math at any radius, so the count is size-independent
  const count = Math.max(5, Math.floor(2 * Math.PI * Math.cos(rad(lat)) / (CARD_RATIO * 1.14)));
  for (let i = 0; i < count; i++) {
    const lon = (360 / count) * (i + (ring % 2) * .5);
    const shotIndex = (n++ * 5) % SHOTS.length; // stride 5 keeps neighbours different
    const shot = SHOTS[shotIndex];
    const el = document.createElement('button');
    el.className = 'card';
    el.type = 'button';
    el.tabIndex = -1;
    el.setAttribute('role', 'listitem');
    el.setAttribute('aria-label', shot.title);
    el.style.cssText = `--lon:${lon}deg;--lat:${lat}deg;--d:${Math.round(Math.random() * 900)}ms;--spin:${Math.round(Math.random() * 60 - 30)}deg`;
    el.innerHTML = `<span class="tile"><span class="face"><img src="${src(shot, 'md')}" alt="" draggable="false" decoding="async"></span><span class="back"></span></span>`;
    globe.appendChild(el);
    // Outward direction of this card on the unit sphere (matches the CSS transform)
    const dir = [Math.cos(rad(lat)) * Math.sin(rad(lon)), -Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];
    cards.push({ el, lon, lat, shotIndex, dir, nz: 0, fog: -1 });
  }
});

document.querySelectorAll('.total').forEach(t => (t.textContent = SHOTS.length));

// ---------- Sizing ----------

function layout() {
  // Perspective makes the globe look ~1.45× its radius, so keep it inside narrow screens
  const R = clamp(Math.min(innerWidth * 0.31, innerHeight * 0.34), 90, 400);
  state.R = R;
  const w = R * CARD_RATIO;
  globe.style.setProperty('--R', `${R}px`);
  globe.style.setProperty('--w', `${w}px`);
  globe.style.setProperty('--h', `${w * .75}px`);
  stage.style.setProperty('--p', `${R * 3.2}px`);
  if (state.open && !state.busy) state.z = zoomDepth();
}
const zoomDepth = () => state.R * 1.25;

function centerRect() {
  const mobile = innerWidth < 720;
  const portrait = innerHeight > innerWidth;
  const w = mobile ? innerWidth * .9 : Math.min(innerWidth * (portrait ? .8 : .62), 980, innerHeight * .66 * 4 / 3);
  const h = w * .75;
  return { x: (innerWidth - w) / 2, y: (innerHeight - h) / 2 - (mobile ? 20 : 0), w, h };
}

// ---------- Render loop ----------

function apply() {
  globe.style.transform = `translateZ(${state.z}px) rotateX(${state.rx}deg) rotateY(${state.ry}deg)`;

  // Fade cards toward the background as they turn away from the viewer
  const sy = Math.sin(rad(state.ry)), cy = Math.cos(rad(state.ry));
  const sx = Math.sin(rad(state.rx)), cx = Math.cos(rad(state.rx));
  for (const c of cards) {
    const [x, y, z] = c.dir;
    const z1 = -x * sy + z * cy;
    c.nz = y * sx + z1 * cx;
    const fog = Math.round(clamp((.85 - c.nz) * .42, 0, .5) * 100) / 100;
    if (fog !== c.fog) { c.el.style.setProperty('--fog', fog); c.fog = fog; }
  }

  if (state.open && !lightbox.hidden) {
    const c = centerRect();
    const r = state.open.el.getBoundingClientRect();
    const m = state.lbMix;
    const x = lerp(r.left, c.x, m), y = lerp(r.top, c.y, m);
    const s = lerp(r.width, c.w, m) / c.w;
    lightbox.style.width = `${c.w}px`;
    lightbox.style.height = `${c.h}px`;
    lightbox.style.borderRadius = `${lerp(state.R * CARD_RATIO * .06 / s, c.w * .028, m)}px`;
    lightbox.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  }
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000);
  last = now;
  if (!state.open && !state.drag && !state.tweening) {
    // Ease spin back to idle speed (this is also the drag inertia) and follow the cursor tilt
    state.vy = lerp(state.vy, reduce ? 0 : IDLE_SPEED, Math.min(1, dt * 1.2));
    state.ry += state.vy * dt;
    state.rx = lerp(state.rx, BASE_TILT + state.tilt, Math.min(1, dt * 2.5));
  }
  apply();
  requestAnimationFrame(frame);
}

function tween(duration, fn, ease = easeInOut) {
  state.tweening++;
  return new Promise(resolve => {
    const start = performance.now();
    const step = now => {
      const p = reduce ? 1 : Math.min(1, (now - start) / duration);
      fn(ease(p));
      if (p < 1) requestAnimationFrame(step);
      else { state.tweening--; resolve(); }
    };
    requestAnimationFrame(step);
  });
}

// ---------- Open / navigate / close ----------

const nearestAngle = (from, to) => from + ((((to - from) % 360) + 540) % 360 - 180);

function rotateTo(card, duration) {
  const s = { rx: state.rx, ry: state.ry };
  const t = { rx: -card.lat, ry: nearestAngle(state.ry, -card.lon) };
  return tween(duration, e => { state.rx = lerp(s.rx, t.rx, e); state.ry = lerp(s.ry, t.ry, e); });
}

function showShot(card) {
  const shot = SHOTS[card.shotIndex];
  lbImg.src = src(shot, 'md');
  const full = new Image();
  full.onload = () => { if (state.open === card) lbImg.src = full.src; };
  full.src = src(shot, 'lg');
  lbImg.alt = shot.title;
  lbTag.textContent = shot.tag;
  pillTitle.textContent = shot.title;
  pillLink.href = shot.url;
  setCounter(card.shotIndex + 1);
}

async function open(card) {
  if (state.busy || card === state.open) return;
  state.busy = true;
  state.vy = 0;
  const prev = state.open;
  state.open = card;
  hero.classList.add('is-open');
  toggle.setAttribute('aria-label', 'Close');

  if (!prev) {
    showShot(card);
    await rotateTo(card, 750);
    card.el.classList.add('is-active');
    state.lbMix = 0;
    lightbox.hidden = false;
    const z0 = state.z;
    await tween(1100, e => { state.z = lerp(z0, zoomDepth(), e); state.lbMix = e; }, easeOut);
  } else {
    // Already zoomed in: swap the picture and swing the globe to the new card
    prev.el.classList.remove('is-active');
    card.el.classList.add('is-active');
    showShot(card);
    lbImg.animate([{ opacity: .25, transform: 'scale(1.04)' }, { opacity: 1, transform: 'none' }], { duration: reduce ? 0 : 600, easing: 'ease-out' });
    await rotateTo(card, 900);
  }
  state.busy = false;
}

async function close() {
  if (!state.open || state.busy) return;
  state.busy = true;
  const card = state.open;
  hero.classList.remove('is-open');
  toggle.setAttribute('aria-label', 'Open work');
  setCounter(0);
  const z0 = state.z;
  await tween(900, e => { state.z = lerp(z0, 0, e); state.lbMix = 1 - e; });
  card.el.classList.remove('is-active');
  lightbox.hidden = true;
  state.open = null;
  state.busy = false;
}

const frontMost = (list = cards) => list.reduce((a, b) => (b.nz > a.nz ? b : a));

function step(dir) {
  if (!state.open) return;
  const next = (state.open.shotIndex + dir + SHOTS.length) % SHOTS.length;
  open(frontMost(cards.filter(c => c.shotIndex === next)));
}

// ---------- Counter (odometer digits) ----------

const digits = document.querySelector('.digits');
const strips = [0, 1].map(() => {
  const d = document.createElement('span');
  d.className = 'digit';
  d.innerHTML = `<span class="strip">${'0123456789'.split('').map(x => `<span>${x}</span>`).join('')}</span>`;
  digits.appendChild(d);
  return d.firstChild;
});
function setCounter(value) {
  String(value).padStart(2, '0').split('').forEach((ch, i) => {
    strips[i].style.transform = `translateY(${-Number(ch) * 1.2}em)`;
  });
}

// ---------- Input ----------

hero.addEventListener('pointerdown', e => {
  if (state.open || e.button !== 0 || e.target.closest('a, .pill')) return;
  state.drag = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0 };
  state.vy = 0;
});

addEventListener('pointermove', e => {
  state.tilt = (e.clientY / innerHeight - .5) * -16;
  const d = state.drag;
  if (!d) return;
  const now = performance.now();
  const dx = e.clientX - d.x, dy = e.clientY - d.y;
  d.moved += Math.abs(dx) + Math.abs(dy);
  if (d.moved > 6) hero.classList.add('is-dragging');
  state.ry += dx * .3;
  state.rx = clamp(state.rx - dy * .2, -45, 45);
  state.vy = lerp(state.vy, (dx * .3) / Math.max(.008, (now - d.t) / 1000), .5);
  Object.assign(d, { x: e.clientX, y: e.clientY, t: now });
});

addEventListener('pointerup', () => {
  if (!state.drag) return;
  // Let the click handler see whether this was a drag
  setTimeout(() => (state.drag = null), 0);
  hero.classList.remove('is-dragging');
  state.vy = clamp(state.vy, -400, 400);
});

hero.addEventListener('click', e => {
  if (state.drag && state.drag.moved > 6) return;
  const el = e.target.closest('.card');
  if (el) return open(cards.find(c => c.el === el));
  if (state.open && !e.target.closest('.pill, a')) close();
});

toggle.addEventListener('click', e => {
  e.stopPropagation();
  state.open ? close() : open(frontMost());
});

addEventListener('keydown', e => {
  if (e.key === 'Escape') close();
  else if (e.key === 'ArrowRight') state.open ? step(1) : (state.vy = 160);
  else if (e.key === 'ArrowLeft') state.open ? step(-1) : (state.vy = -160);
  else if (e.key === 'Enter' && !state.open && e.target === document.body) open(frontMost());
});

addEventListener('resize', layout);

// ---------- Start ----------

layout();
setCounter(0);
requestAnimationFrame(frame);
requestAnimationFrame(() => requestAnimationFrame(() => globe.classList.remove('intro')));
setTimeout(() => globe.classList.add('ready'), reduce ? 0 : 3000);
