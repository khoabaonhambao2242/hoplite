/* ===== Three.js scenes: hero hearts + galaxy ===== */

function makeHeartGeometry(scale = 1) {
  const s = new THREE.Shape();
  const x = 0, y = 0;
  s.moveTo(x, y + 0.5);
  s.bezierCurveTo(x, y + 0.85, x - 0.55, y + 1.1, x - 0.55, y + 0.55);
  s.bezierCurveTo(x - 0.55, y + 0.2, x - 0.2, y + 0.1, x, y - 0.35);
  s.bezierCurveTo(x + 0.2, y + 0.1, x + 0.55, y + 0.2, x + 0.55, y + 0.55);
  s.bezierCurveTo(x + 0.55, y + 1.1, x, y + 0.85, x, y + 0.5);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.35, bevelEnabled: true, bevelSegments: 4,
    bevelSize: 0.08, bevelThickness: 0.08, curveSegments: 24,
  });
  geo.center();
  geo.scale(scale, -scale, scale); // flip agar hati tegak
  return geo;
}

const HEART_COLORS = [0xff6b9d, 0xe0407a, 0xa06cd5, 0xff8fb3, 0xffb3c9];

// WebGL bisa tidak tersedia (browser lawas/headless); fallback ke CSS
function tryCreateRenderer(opts) {
  try {
    return new THREE.WebGLRenderer(opts);
  } catch (_) {
    return null;
  }
}

/* ---------- HERO: hati 3D melayang ---------- */
const heroScene = { mouse: { x: 0, y: 0 } };
(function initHero() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || !window.THREE) return;

  const renderer = tryCreateRenderer({ canvas, alpha: true, antialias: true });
  if (!renderer) { document.body.classList.add("no-webgl"); return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
  camera.position.z = 9;

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa06cd5, 0.8);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  const hearts = [];
  for (let i = 0; i < 14; i++) {
    const size = 0.25 + Math.random() * 0.55;
    const mat = new THREE.MeshPhysicalMaterial({
      color: HEART_COLORS[i % HEART_COLORS.length],
      roughness: 0.25, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.2,
    });
    const m = new THREE.Mesh(makeHeartGeometry(size), mat);
    m.position.set((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5 - 1);
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    m.userData = {
      speed: 0.2 + Math.random() * 0.5,
      floatAmp: 0.3 + Math.random() * 0.6,
      baseY: m.position.y,
      phase: Math.random() * Math.PI * 2,
      depth: 0.3 + Math.random() * 0.7,
    };
    scene.add(m);
    hearts.push(m);
  }

  window.addEventListener("mousemove", (e) => {
    heroScene.mouse.x = (e.clientX / innerWidth - 0.5) * 2;
    heroScene.mouse.y = (e.clientY / innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();
  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);

  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();
    hearts.forEach((h) => {
      const u = h.userData;
      h.rotation.y += 0.004 * u.speed * 2;
      h.rotation.x = Math.sin(t * u.speed + u.phase) * 0.25;
      h.position.y = u.baseY + Math.sin(t * u.speed + u.phase) * u.floatAmp;
      h.position.x += (heroScene.mouse.x * u.depth * 1.2 - h.position.x * 0.002) * 0.01;
    });
    camera.position.x += (heroScene.mouse.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (-heroScene.mouse.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();
})();

/* ---------- GALAXY: bintang + hati besar, discrub oleh scroll ---------- */
const galaxyScene = { progress: 0 };
(function initGalaxy() {
  const canvas = document.getElementById("galaxyCanvas");
  if (!canvas || !window.THREE) return;

  const renderer = tryCreateRenderer({ canvas, antialias: true });
  if (!renderer) { document.body.classList.add("no-webgl"); return; }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a0b2e, 0.035);
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x1a0b2e);

  // starfield
  const starCount = 2600;
  const pos = new Float32Array(starCount * 3);
  const col = new Float32Array(starCount * 3);
  const palette = [new THREE.Color(0xffffff), new THREE.Color(0xffd3e2), new THREE.Color(0xc9b3ff), new THREE.Color(0xff8fb3)];
  for (let i = 0; i < starCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 90;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
    pos[i * 3 + 2] = -Math.random() * 120;
    const c = palette[Math.floor(Math.random() * palette.length)];
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.28, vertexColors: true, sizeAttenuation: true }));
  scene.add(stars);

  // hati besar di ujung perjalanan
  const bigHeart = new THREE.Mesh(
    makeHeartGeometry(3.2),
    new THREE.MeshPhysicalMaterial({
      color: 0xff4d88, roughness: 0.2, metalness: 0.25,
      clearcoat: 1, clearcoatRoughness: 0.1,
      emissive: 0xe0407a, emissiveIntensity: 0.35,
    })
  );
  bigHeart.position.set(0, 0, -95);
  scene.add(bigHeart);

  // orbit hati kecil di sekitar hati besar
  const orbiters = [];
  for (let i = 0; i < 8; i++) {
    const m = new THREE.Mesh(
      makeHeartGeometry(0.5),
      new THREE.MeshPhysicalMaterial({ color: HEART_COLORS[i % HEART_COLORS.length], roughness: 0.3, clearcoat: 0.7 })
    );
    m.userData = { angle: (i / 8) * Math.PI * 2, radius: 6 + (i % 3), speed: 0.3 + Math.random() * 0.4, yOff: (Math.random() - 0.5) * 3 };
    scene.add(m);
    orbiters.push(m);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const glow = new THREE.PointLight(0xff6b9d, 60, 60);
  glow.position.set(0, 2, -88);
  scene.add(glow);
  const fill = new THREE.DirectionalLight(0xc9b3ff, 1.2);
  fill.position.set(5, 6, 10);
  scene.add(fill);

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  const clock = new THREE.Clock();
  let visible = false;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(canvas);

  (function loop() {
    requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const p = galaxyScene.progress; // 0..1 dari ScrollTrigger

    // kamera terbang menembus bintang menuju hati
    camera.position.z = -p * 80;
    camera.position.y = Math.sin(p * Math.PI) * 2;
    camera.rotation.z = Math.sin(p * Math.PI * 2) * 0.06;
    camera.lookAt(0, 0, -95);

    stars.rotation.z = t * 0.01;
    bigHeart.rotation.y = t * 0.5;
    bigHeart.scale.setScalar(1 + Math.sin(t * 2.4) * 0.05); // detak

    orbiters.forEach((o) => {
      const u = o.userData;
      const a = u.angle + t * u.speed;
      o.position.set(Math.cos(a) * u.radius, u.yOff + Math.sin(a * 1.3), -95 + Math.sin(a) * u.radius * 0.4);
      o.rotation.y = t;
    });

    renderer.render(scene, camera);
  })();
})();
