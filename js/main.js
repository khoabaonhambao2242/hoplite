gsap.registerPlugin(ScrollTrigger, TextPlugin);

const $ = (s) => document.querySelector(s);
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ===== SVG icons (pengganti emoji) ===== */
const ICONS = {
  mata: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/><circle cx="9" cy="12" r=".8" fill="currentColor"/><circle cx="13" cy="12" r=".8" fill="currentColor"/><circle cx="17" cy="12" r=".8" fill="currentColor"/></svg>',
  hati: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.8-10-9.3C.4 8.4 2.4 4.5 6.2 4.5c2.2 0 3.9 1.3 4.8 3 .9-1.7 2.6-3 4.8-3 3.8 0 5.8 3.9 4.2 7.2C19.5 16.2 12 21 12 21z"/></svg>',
  bunga: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="9" r="2.5"/><path d="M12 6.5C12 4 10 2.5 8 3.5s-1.5 4 0 5M12 6.5C12 4 14 2.5 16 3.5s1.5 4 0 5M9.5 10.5c-2.4-.5-4.4 1-4 3s3.2 2.3 5 1M14.5 10.5c2.4-.5 4.4 1 4 3s-3.2 2.3-5 1M12 12v9M12 17c-2 0-4-1-4.5-3M12 15c1.5 0 3.4-.6 4-2.5"/></svg>',
  cincin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="14" r="6"/><path d="M9.5 5.5 12 8l2.5-2.5L13 3h-2l-1.5 2.5z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6L22 9.3l-5.4 4.8L18.2 21 12 17.3 5.8 21l1.6-6.9L2 9.3l7.1-.7z"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="4"/><rect x="5" y="12" width="14" height="9"/><path d="M12 8v13M12 8c-2-.5-5-1.5-5-3.5S9.5 2 12 8zM12 8c2-.5 5-1.5 5-3.5S14.5 2 12 8z"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8zM17 9h2a2.5 2.5 0 0 1 0 5h-2M7 4.5c0-1 .8-1 .8-2M11 4.5c0-1 .8-1 .8-2"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 13.5A8.5 8.5 0 0 1 10.5 4 8.5 8.5 0 1 0 20 13.5z"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 18a4 4 0 0 1 0-8 6 6 0 0 1 11.5-1.5A4.5 4.5 0 0 1 17 18H6z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>',
};
const CARD_ICONS = ["hati", "star", "gift", "music", "coffee", "moon", "cloud", "spark"];

/* ===== isi konten dari config ===== */
$("#nama1").textContent = CONFIG.nama1;
$("#nama2").textContent = CONFIG.nama2;
$("#footerNames").textContent = `${CONFIG.nama1} & ${CONFIG.nama2}`;
$("#footerDate").textContent = CONFIG.tanggalJadian.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
$("#quizQuestion").textContent = `${CONFIG.nama2}, kamu sayang ${CONFIG.nama1} gak?`;

/* ===== custom cursor ===== */
const cursor = $("#cursorDot");
window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power2.out" });
});
document.querySelectorAll("button, a, .flip-card").forEach(() => {});
document.addEventListener("mouseover", (e) => {
  const hot = e.target.closest("button, a, .flip-card");
  cursor.classList.toggle("cursor-hot", !!hot);
});

/* ===== progress bar ===== */
gsap.to("#progressBar", {
  scaleX: 1, ease: "none",
  scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
});

/* ===== 1. HERO ===== */
document.querySelectorAll(".hero-name").forEach((el) => {
  el.innerHTML = el.textContent.split("").map((c) => `<span class="ch">${c}</span>`).join("");
});

const heroTl = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });
heroTl
  .from("#heroKicker", { y: -40, opacity: 0, duration: 0.7 })
  .from("#nama1 .ch", { y: 100, opacity: 0, rotation: () => rand(-60, 60), stagger: 0.06, duration: 0.8 }, "-=0.2")
  .from("#heroAmp", { scale: 0, rotation: 360, duration: 0.8, ease: "elastic.out(1, .5)" }, "-=0.3")
  .from("#nama2 .ch", { y: 100, opacity: 0, rotation: () => rand(-60, 60), stagger: 0.06, duration: 0.8 }, "-=0.5")
  .from("#scrollBtn", { opacity: 0, y: 20, duration: 0.6 });

// hero fade saat scroll keluar
gsap.to(".hero-content", {
  opacity: 0, y: -120, ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 40%", scrub: true },
});

const typingLines = [
  "cerita kita dimulai 9 Februari 2026...",
  "dan gak akan ada kata tamat.",
  "scroll deh, ada kejutan di bawah.",
];
let typeIdx = 0;
function typeNext() {
  gsap.to("#typingText", {
    text: typingLines[typeIdx], duration: 2, ease: "none",
    onComplete: () => {
      gsap.to("#typingText", {
        text: "", duration: 0.8, delay: 1.6, ease: "none",
        onComplete: () => { typeIdx = (typeIdx + 1) % typingLines.length; typeNext(); },
      });
    },
  });
}
typeNext();

$("#scrollBtn").addEventListener("click", () => {
  $("#timeline").scrollIntoView({ behavior: "smooth" });
});

/* ===== 2. TIMELINE HORIZONTAL (scroll panjang) ===== */
const track = $("#timelineTrack");
CONFIG.timeline.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "polaroid";
  div.innerHTML = `
    <div class="polaroid-img">${ICONS[item.icon] || ICONS.hati}</div>
    <h3>${item.judul}</h3>
    <p>${item.teks}</p>
    <span class="polaroid-num">${String(i + 1).padStart(2, "0")}</span>`;
  track.appendChild(div);
});

const getScroll = () => track.scrollWidth - innerWidth + innerWidth * 0.16;
gsap.to(track, {
  x: () => -getScroll(),
  ease: "none",
  scrollTrigger: {
    trigger: ".timeline-section",
    pin: ".timeline-pin",
    scrub: 1,
    // 2.2x jarak konten = scroll lebih panjang & santai
    end: () => "+=" + getScroll() * 2.2,
    invalidateOnRefresh: true,
  },
});

document.querySelectorAll(".polaroid").forEach((p, i) => {
  gsap.from(p, {
    y: -160, opacity: 0, rotation: i % 2 ? 10 : -10,
    duration: 0.9, ease: "bounce.out",
    scrollTrigger: { trigger: ".timeline-section", start: "top 60%" },
    delay: i * 0.15,
  });
  gsap.to(p, { rotation: i % 2 ? 2 : -2, duration: rand(2, 3), yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.2 });
});

/* ===== 3. REASONS CARDS ===== */
const grid = $("#cardsGrid");
CONFIG.alasan.forEach((teks, i) => {
  const card = document.createElement("div");
  card.className = "flip-card";
  card.innerHTML = `
    <div class="flip-inner">
      <div class="flip-face flip-front">
        <span class="card-icon">${ICONS[CARD_ICONS[i % CARD_ICONS.length]]}</span>
        <small>alasan #${i + 1}</small>
      </div>
      <div class="flip-face flip-back">${teks}</div>
    </div>`;
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    if (card.classList.contains("flipped")) burstConfetti(card, 8);
  });
  grid.appendChild(card);
});

gsap.from(".flip-card", {
  y: 140, opacity: 0, rotation: () => rand(-16, 16), scale: 0.6,
  stagger: { each: 0.12, from: "random" },
  duration: 0.9, ease: "back.out(1.6)",
  scrollTrigger: { trigger: ".reasons-section", start: "top 70%" },
});

// judul reasons masuk dengan scrub halus
gsap.from(".reasons-section .section-title", {
  y: 80, opacity: 0,
  scrollTrigger: { trigger: ".reasons-section", start: "top 90%", end: "top 55%", scrub: true },
});

/* ===== 4. METER ===== */
const days = Math.max(0, Math.floor((Date.now() - CONFIG.tanggalJadian) / 86400000));

document.querySelectorAll(".stat-num[data-count]").forEach((el) => {
  const target = el.dataset.count === "days" ? days : parseInt(el.dataset.count);
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target, duration: 2.4, ease: "power2.out",
    scrollTrigger: { trigger: ".meter-section", start: "top 65%" },
    onUpdate: () => (el.textContent = Math.floor(obj.v).toLocaleString("id-ID")),
  });
});

gsap.from(".stat-num.infinity", {
  scale: 0, rotation: 360, duration: 1, ease: "elastic.out(1, .4)",
  scrollTrigger: { trigger: ".meter-section", start: "top 65%" },
});

const meterTl = gsap.timeline({
  scrollTrigger: { trigger: ".meter-wrap", start: "top 75%" },
});
const pctObj = { v: 0 };
meterTl
  .to("#meterFill", { width: "100%", duration: 2.4, ease: "power1.inOut" })
  .to(pctObj, {
    v: 100, duration: 2.4, ease: "power1.inOut",
    onUpdate: () => ($("#meterPct").textContent = Math.floor(pctObj.v) + "%"),
  }, "<")
  .set("#meterPct", { textContent: "9999+%" })
  .to("#meterBoom", { opacity: 1, scale: 1.1, duration: 0.4, ease: "back.out(3)" })
  .add(() => burstConfetti($("#meterBoom"), 26))
  .to("#meterBoom", { scale: 1, duration: 0.3 });

/* ===== 5. GALAXY 3D (pin panjang, scrub kamera) ===== */
const galaxyLines = ["#gLine1", "#gLine2", "#gLine3", "#gLine4"];
const galaxyTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".galaxy-section",
    pin: ".galaxy-pin",
    scrub: 1,
    start: "top top",
    end: "+=350%", // scroll ekstra panjang di sini
    onUpdate: (self) => (galaxyScene.progress = self.progress),
  },
});
galaxyLines.forEach((sel, i) => {
  galaxyTl
    .fromTo(sel, { opacity: 0, y: 50, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 })
    .to(sel, { opacity: i === galaxyLines.length - 1 ? 1 : 0, y: i === galaxyLines.length - 1 ? 0 : -50, duration: 1 }, "+=0.6");
});
galaxyTl.to("#gLine4", { scale: 1.15, duration: 1.4, ease: "power1.inOut" });

/* ===== 6. GOMBAL ===== */
let gombalBusy = false;
const slotFrames = ["♥ ♥ ♥", "★ ★ ★", "♦ ♦ ♦", "✦ ✦ ✦", "❀ ❀ ❀"];
function spinGombal() {
  if (gombalBusy) return;
  gombalBusy = true;
  const screen = $("#gombalText");
  gsap.to("#slotLever", { rotation: 28, duration: 0.18, yoyo: true, repeat: 1, transformOrigin: "bottom center" });
  const spinTl = gsap.timeline({ onComplete: () => (gombalBusy = false) });
  spinTl.to(screen, {
    duration: 0.07, opacity: 0.3, yoyo: true, repeat: 13,
    onRepeat: () => (screen.textContent = pick(slotFrames)),
  });
  spinTl.add(() => {
    screen.textContent = pick(CONFIG.gombalan);
    burstConfetti($("#slotScreen"), 12);
  });
  spinTl.fromTo("#slotScreen", { scale: 0.94 }, { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1.2, .5)" });
  spinTl.to(screen, { opacity: 1, duration: 0.1 }, "<");
}
$("#slotLever").addEventListener("click", spinGombal);
$("#gombalBtn").addEventListener("click", spinGombal);

gsap.from(".slot-machine", {
  scale: 0.6, opacity: 0, rotation: -4, duration: 0.8, ease: "back.out(1.7)",
  scrollTrigger: { trigger: ".gombal-section", start: "top 65%" },
});

/* ===== 7. QUIZ ===== */
const btnNo = $("#btnNo");
const btnYes = $("#btnYes");
const quizArea = $("#quizArea");
const taunts = [
  "eits, mau ke mana?",
  "yakin? coba klik lagi deh.",
  "tombolnya malu tuh.",
  "udah, nyerah aja.",
  "iya aja susah amat.",
  "tombol 'nggak'-nya takut sama kamu.",
];
let dodges = 0;
function dodge() {
  dodges++;
  const area = quizArea.getBoundingClientRect();
  const bw = btnNo.offsetWidth, bh = btnNo.offsetHeight;
  gsap.to(btnNo, {
    x: rand(-(area.width / 2 - bw), area.width / 2 - bw),
    y: rand(-(area.height / 2 - bh), area.height / 2 - bh),
    duration: 0.3, ease: "back.out(2)",
    scale: Math.max(0.4, 1 - dodges * 0.08),
  });
  gsap.to(btnYes, { scale: Math.min(2, 1 + dodges * 0.12), duration: 0.3 });
  $("#quizTaunt").textContent = taunts[Math.min(dodges - 1, taunts.length - 1)];
}
btnNo.addEventListener("mouseenter", dodge);
btnNo.addEventListener("click", dodge);
btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });

btnYes.addEventListener("click", () => {
  $("#quizQuestion").textContent = "Aku juga sayang kamu. Banget.";
  $("#quizTaunt").textContent = "tuh kan, gampang.";
  gsap.fromTo(btnYes, { scale: 1.3 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.4, .4)" });
  btnNo.style.display = "none";
  heartRainBurst(40);
});

gsap.from(".quiz-btns button", {
  y: 60, opacity: 0, stagger: 0.15, duration: 0.7, ease: "back.out(2)",
  scrollTrigger: { trigger: ".quiz-section", start: "top 65%" },
});

/* ===== 8. LETTER ===== */
const letterContent = $("#letterContent");
CONFIG.suratCinta.forEach((line) => {
  const p = document.createElement("p");
  p.className = "line";
  p.textContent = line;
  letterContent.appendChild(p);
});

const letterTl = gsap.timeline({
  scrollTrigger: { trigger: ".letter-section", start: "top 45%" },
});
letterTl
  .to("#envelopeFlap", { rotationX: 180, duration: 0.9, ease: "power2.inOut", transformOrigin: "bottom center" })
  .set("#envelopeFlap", { zIndex: 1 })
  .to("#letterPaper", { y: -210, duration: 1.1, ease: "power2.out" })
  .to("#letterPaper", { zIndex: 5, duration: 0.01 })
  .to(".letter-content .line", { opacity: 1, y: 0, stagger: 0.35, duration: 0.5 })
  .add(() => heartRainBurst(28));

gsap.from(".envelope-wrap", {
  y: 100, opacity: 0, duration: 0.8,
  scrollTrigger: { trigger: ".letter-section", start: "top 60%" },
});

/* ===== helpers: confetti & heart rain (CSS shapes, bukan emoji) ===== */
const CONF_COLORS = ["#ff6b9d", "#e0407a", "#a06cd5", "#ffd166", "#ff8fb3"];
function burstConfetti(el, n) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div");
    const heart = Math.random() > 0.5;
    c.className = heart ? "confetti confetti-heart" : "confetti confetti-dot";
    c.style.setProperty("--c", pick(CONF_COLORS));
    c.style.left = r.left + r.width / 2 + "px";
    c.style.top = r.top + r.height / 2 + "px";
    document.body.appendChild(c);
    gsap.to(c, {
      x: rand(-170, 170), y: rand(-190, 60),
      rotation: rand(-360, 360), opacity: 0, scale: rand(0.5, 1.5),
      duration: rand(0.8, 1.5), ease: "power2.out",
      onComplete: () => c.remove(),
    });
  }
}

function heartRainBurst(n) {
  const rain = $("#heartRain");
  for (let i = 0; i < n; i++) {
    const s = document.createElement("i");
    s.className = "rain-heart";
    s.style.setProperty("--c", pick(CONF_COLORS));
    s.style.left = rand(0, 100) + "vw";
    s.style.setProperty("--s", rand(0.5, 1.4));
    rain.appendChild(s);
    gsap.to(s, {
      y: innerHeight + 120, rotation: rand(-160, 160),
      duration: rand(2.4, 4.8), delay: rand(0, 1.2), ease: "none",
      onComplete: () => s.remove(),
    });
  }
}

window.addEventListener("load", () => ScrollTrigger.refresh());
