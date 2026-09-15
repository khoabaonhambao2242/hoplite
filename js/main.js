gsap.registerPlugin(ScrollTrigger, TextPlugin);

const $ = (s) => document.querySelector(s);
const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ===== isi konten dari config ===== */
$("#nama1").textContent = CONFIG.nama1;
$("#nama2").textContent = CONFIG.nama2;
$("#footerNames").textContent = `${CONFIG.nama1} & ${CONFIG.nama2}`;
$("#footerDate").textContent = CONFIG.tanggalJadian.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
$("#quizQuestion").textContent = `${CONFIG.nama2}, kamu sayang ${CONFIG.nama1} gak? 🥺`;

/* ===== custom cursor + trail ===== */
const cursor = $("#cursorHeart");
let lastTrail = 0;
window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.12, ease: "power2.out" });
  const now = Date.now();
  if (now - lastTrail > 90) {
    lastTrail = now;
    const t = document.createElement("div");
    t.className = "cursor-trail";
    t.textContent = pick(["💗", "✨", "💖"]);
    t.style.left = e.clientX + "px";
    t.style.top = e.clientY + "px";
    document.body.appendChild(t);
    gsap.to(t, {
      y: -30, opacity: 0, scale: 0.4, duration: 0.8, ease: "power1.out",
      onComplete: () => t.remove(),
    });
  }
});

/* ===== progress bar ===== */
gsap.to("#progressBar", {
  scaleX: 1, ease: "none",
  scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
});

/* ===== 1. HERO ===== */
// pecah nama jadi huruf
document.querySelectorAll(".hero-name").forEach((el) => {
  el.innerHTML = el.textContent.split("").map((c) => `<span class="ch">${c}</span>`).join("");
});

const heroTl = gsap.timeline({ defaults: { ease: "back.out(1.8)" } });
heroTl
  .from("#heroKicker", { y: -40, opacity: 0, duration: 0.7 })
  .from("#nama1 .ch", { y: rand(80, 120), opacity: 0, rotation: () => rand(-90, 90), stagger: 0.07, duration: 0.8 }, "-=0.2")
  .from("#heroAmp", { scale: 0, rotation: 720, duration: 0.9, ease: "elastic.out(1, .5)" }, "-=0.3")
  .from("#nama2 .ch", { y: () => rand(80, 120), opacity: 0, rotation: () => rand(-90, 90), stagger: 0.07, duration: 0.8 }, "-=0.5")
  .from("#scrollBtn", { opacity: 0, y: 20, duration: 0.6 });

// typing loop
const typingLines = [
  "cerita kita dimulai 9 Februari 2026...",
  "dan gak akan ada kata tamat 💞",
  "scroll deh, ada kejutan di bawah 👀",
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

// floating hearts parallax
const heroHearts = $("#heroHearts");
for (let i = 0; i < 16; i++) {
  const s = document.createElement("span");
  s.textContent = pick(["💗", "💖", "💘", "🩷", "✨"]);
  s.style.left = rand(2, 95) + "%";
  s.style.top = rand(5, 90) + "%";
  s.dataset.depth = rand(0.2, 1).toFixed(2);
  s.style.fontSize = rand(16, 38) + "px";
  heroHearts.appendChild(s);
  gsap.to(s, { y: rand(-25, 25), duration: rand(2, 4), yoyo: true, repeat: -1, ease: "sine.inOut" });
}
window.addEventListener("mousemove", (e) => {
  const cx = (e.clientX / innerWidth - 0.5) * 2;
  const cy = (e.clientY / innerHeight - 0.5) * 2;
  heroHearts.querySelectorAll("span").forEach((s) => {
    gsap.to(s, { x: cx * 30 * s.dataset.depth, duration: 0.6 });
  });
});

$("#scrollBtn").addEventListener("click", () => {
  $("#timeline").scrollIntoView({ behavior: "smooth" });
});

/* ===== 2. TIMELINE HORIZONTAL ===== */
const track = $("#timelineTrack");
CONFIG.timeline.forEach((item) => {
  const div = document.createElement("div");
  div.className = "polaroid";
  div.innerHTML = `
    <div class="polaroid-img">${item.emoji}</div>
    <h3>${item.judul}</h3>
    <p>${item.teks}</p>`;
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
    end: () => "+=" + getScroll(),
    invalidateOnRefresh: true,
  },
});

// polaroid jatuh + ayun saat muncul
document.querySelectorAll(".polaroid").forEach((p, i) => {
  gsap.from(p, {
    y: -160, opacity: 0, rotation: i % 2 ? 12 : -12,
    duration: 0.9, ease: "bounce.out",
    scrollTrigger: { trigger: ".timeline-section", start: "top 60%" , toggleActions: "play none none none" },
    delay: i * 0.15,
  });
  gsap.to(p, { rotation: i % 2 ? 2.5 : -2.5, duration: rand(1.8, 2.6), yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.2 });
});

/* ===== 3. REASONS CARDS ===== */
const grid = $("#cardsGrid");
CONFIG.alasan.forEach((teks, i) => {
  const card = document.createElement("div");
  card.className = "flip-card";
  card.innerHTML = `
    <div class="flip-inner">
      <div class="flip-face flip-front">${pick(["💝", "💌", "🌹", "🎁", "🍫", "🧸", "🌈", "⭐"])}<small>alasan #${i + 1}</small></div>
      <div class="flip-face flip-back">${teks}</div>
    </div>`;
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    if (card.classList.contains("flipped")) burstConfetti(card, 6);
  });
  grid.appendChild(card);
});

gsap.from(".flip-card", {
  y: 120, opacity: 0, rotation: () => rand(-20, 20), scale: 0.6,
  stagger: { each: 0.1, from: "random" },
  duration: 0.8, ease: "back.out(1.6)",
  scrollTrigger: { trigger: ".reasons-section", start: "top 65%" },
});

/* ===== 4. METER ===== */
const days = Math.max(0, Math.floor((Date.now() - CONFIG.tanggalJadian) / 86400000));

document.querySelectorAll(".stat-num[data-count]").forEach((el) => {
  const target = el.dataset.count === "days" ? days : parseInt(el.dataset.count);
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target, duration: 2, ease: "power2.out",
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
  .to("#meterFill", { width: "100%", duration: 2.2, ease: "power1.inOut" })
  .to(pctObj, {
    v: 100, duration: 2.2, ease: "power1.inOut",
    onUpdate: () => ($("#meterPct").textContent = Math.floor(pctObj.v) + "%"),
  }, "<")
  .set("#meterPct", { textContent: "9999+%" })
  .to("#meterBoom", { opacity: 1, scale: 1.15, duration: 0.4, ease: "back.out(3)" })
  .add(() => burstConfetti($("#meterBoom"), 24))
  .to("#meterBoom", { scale: 1, duration: 0.3 });

/* ===== 5. GOMBAL ===== */
let gombalBusy = false;
function spinGombal() {
  if (gombalBusy) return;
  gombalBusy = true;
  const screen = $("#gombalText");
  gsap.to("#slotLever", { rotation: 28, duration: 0.18, yoyo: true, repeat: 1, transformOrigin: "bottom center" });
  const spinTl = gsap.timeline({ onComplete: () => (gombalBusy = false) });
  // efek "berputar"
  let ticks = 0;
  spinTl.to(screen, {
    duration: 0.07, opacity: 0.3, yoyo: true, repeat: 13,
    onRepeat: () => {
      ticks++;
      screen.textContent = pick(["💘", "🎰", "💝", "✨", "💖", "🌹"]).repeat(3);
    },
  });
  spinTl.add(() => {
    screen.textContent = pick(CONFIG.gombalan);
    burstConfetti($("#slotScreen"), 10);
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

/* ===== 6. QUIZ (tombol kabur) ===== */
const btnNo = $("#btnNo");
const btnYes = $("#btnYes");
const quizArea = $("#quizArea");
const taunts = [
  "eits, mau ke mana? 😏",
  "yakin? coba klik lagi deh 🤭",
  "tombolnya malu tuh 🙈",
  "udah, nyerah aja 😆",
  "IYA aja susah amat 😤",
  "tombol 'nggak'-nya takut sama kamu 💨",
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
  $("#quizQuestion").textContent = "YEEEY! Aku juga sayang kamu! 🥰🎉";
  $("#quizTaunt").textContent = "tuh kan, gampang 😌💕";
  gsap.fromTo(btnYes, { scale: 1.3 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.4, .4)" });
  btnNo.style.display = "none";
  heartRainBurst(40);
});

gsap.from(".quiz-btns button", {
  y: 60, opacity: 0, stagger: 0.15, duration: 0.7, ease: "back.out(2)",
  scrollTrigger: { trigger: ".quiz-section", start: "top 65%" },
});

/* ===== 7. LETTER ===== */
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
  .add(() => heartRainBurst(30));

gsap.from(".envelope-wrap", {
  y: 100, opacity: 0, duration: 0.8,
  scrollTrigger: { trigger: ".letter-section", start: "top 60%" },
});

/* ===== helpers: confetti & heart rain ===== */
function burstConfetti(el, n) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.textContent = pick(["💖", "💘", "✨", "🎉", "💝", "🩷"]);
    c.style.left = r.left + r.width / 2 + "px";
    c.style.top = r.top + r.height / 2 + "px";
    document.body.appendChild(c);
    gsap.to(c, {
      x: rand(-160, 160), y: rand(-180, 60),
      rotation: rand(-360, 360), opacity: 0, scale: rand(0.5, 1.4),
      duration: rand(0.8, 1.5), ease: "power2.out",
      onComplete: () => c.remove(),
    });
  }
}

function heartRainBurst(n) {
  const rain = $("#heartRain");
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.textContent = pick(["❤️", "💖", "💘", "🩷", "💕"]);
    s.style.left = rand(0, 100) + "vw";
    s.style.fontSize = rand(16, 40) + "px";
    rain.appendChild(s);
    gsap.to(s, {
      y: innerHeight + 100, rotation: rand(-180, 180),
      duration: rand(2.2, 4.5), delay: rand(0, 1.2), ease: "none",
      onComplete: () => s.remove(),
    });
  }
}

/* refresh ScrollTrigger setelah semua siap */
window.addEventListener("load", () => ScrollTrigger.refresh());
