/**
 * Spiral Galaxy Simulation
 * Ported to p5.js from Processing sketch by Philippe Guglielmetti (Dr. Goulu, 2008)
 * http://3dmon.wordpress.com/2007/08/26/simulation-de-galaxie-spirale/
 */

let starsCount = 2500;
let rMax;
let speed = 0.015;
let eratio = 0.85;
let etwist;
let angles = [];
let radii = [];
let starSizes = [];
let starAlphas = [];
let isPaused = false;
let showTrails = true;
let colorScheme = 'warm';
let flareImg = null;

function preload() {
  // Try loading flares.jpg if present
  flareImg = loadImage('flares.jpg', () => {}, () => { flareImg = null; });
}

function initStars() {
  rMax = Math.min(windowWidth, windowHeight) * 0.42;
  etwist = 8.0 / 200; // Original twist factor

  angles = new Float32Array(starsCount);
  radii = new Float32Array(starsCount);
  starSizes = new Float32Array(starsCount);
  starAlphas = new Float32Array(starsCount);

  for (let i = 0; i < starsCount; i++) {
    angles[i] = Math.random() * Math.PI * 2;
    // Distribution concentrating stars towards the center with a long tail
    const u = Math.random();
    radii[i] = Math.pow(u, 1.3) * rMax;
    starSizes[i] = Math.random() < 0.05 ? random(2.5, 4.5) : random(1.2, 2.2);
    starAlphas[i] = random(160, 255);
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  background(0);
  initStars();
  setupUI();
}

function draw() {
  if (showTrails) {
    background(0, 0, 3, 40); // Soft trailing effect
  } else {
    background(0, 0, 3);
  }

  translate(width / 2, height / 2);

  const currentSpeed = isPaused ? 0 : speed;

  // Center galactic core glow
  drawGalacticCore();

  // Draw each star
  for (let i = 0; i < starsCount; i++) {
    if (!isPaused) {
      // Differential angular speed: inner stars orbit slightly faster
      const differential = 1 + (rMax / (radii[i] + 30)) * 0.15;
      angles[i] += currentSpeed * differential;
    }

    const r = radii[i];
    const a = angles[i];

    // Parametric ellipse
    const x = r * Math.sin(a);
    const y = r * eratio * Math.cos(a);

    // Orbit twist according to distance from core
    const b = r * etwist;
    const s = Math.sin(b);
    const c = Math.cos(b);

    // Rotated position
    const px = s * x + c * y;
    const py = c * x - s * y;

    // Color based on scheme and radius
    setStarStyle(r, i);

    if (flareImg && starSizes[i] > 3) {
      imageMode(CENTER);
      tint(255, 240, 200, 180);
      image(flareImg, px, py, starSizes[i] * 6, starSizes[i] * 6);
    } else {
      ellipse(px, py, starSizes[i], starSizes[i]);
    }
  }
}

function drawGalacticCore() {
  noStroke();
  for (let rad = 60; rad > 0; rad -= 8) {
    const alpha = map(rad, 0, 60, 45, 0);
    if (colorScheme === 'warm') {
      fill(255, 230, 160, alpha);
    } else if (colorScheme === 'cyan') {
      fill(140, 230, 255, alpha);
    } else if (colorScheme === 'plasma') {
      fill(240, 160, 255, alpha);
    } else {
      fill(255, 220, 180, alpha);
    }
    ellipse(0, 0, rad * 2, rad * 2 * eratio);
  }
}

function setStarStyle(r, i) {
  noStroke();
  const rel = r / rMax; // 0 (center) to 1 (outer arm)
  const a = starAlphas[i];

  if (colorScheme === 'warm') {
    // Warm galactic palette: bright yellow/white core -> golden/blueish arms
    if (rel < 0.25) {
      fill(255, 255, 230, a);
    } else if (rel < 0.6) {
      fill(255, 220, 150, a);
    } else {
      fill(200, 220, 255, a * 0.85);
    }
  } else if (colorScheme === 'cyan') {
    fill(100 + rel * 100, 210, 255, a);
  } else if (colorScheme === 'plasma') {
    fill(240 - rel * 80, 120 + rel * 50, 255, a);
  } else if (colorScheme === 'core-gradient') {
    colorMode(HSB, 100);
    fill((rel * 70 + 10) % 100, 80, 100, (a / 255) * 100);
    colorMode(RGB, 255);
  }
}

function setupUI() {
  const starsSlider = document.getElementById('stars-slider');
  const starsVal = document.getElementById('stars-val');
  const twistSlider = document.getElementById('twist-slider');
  const ratioSlider = document.getElementById('ratio-slider');
  const speedSlider = document.getElementById('speed-slider');
  const colorSelect = document.getElementById('color-select');
  const pauseBtn = document.getElementById('pause-btn');
  const trailsBtn = document.getElementById('trails-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (starsSlider) {
    starsSlider.addEventListener('input', (e) => {
      starsCount = parseInt(e.target.value, 10);
      starsVal.textContent = starsCount;
      initStars();
    });
  }

  if (twistSlider) {
    twistSlider.addEventListener('input', (e) => {
      etwist = parseFloat(e.target.value);
    });
  }

  if (ratioSlider) {
    ratioSlider.addEventListener('input', (e) => {
      eratio = parseFloat(e.target.value);
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      speed = parseFloat(e.target.value);
    });
  }

  if (colorSelect) {
    colorSelect.addEventListener('change', (e) => {
      colorScheme = e.target.value;
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? '▶ Reprendre' : '⏸ Pause';
    });
  }

  if (trailsBtn) {
    trailsBtn.addEventListener('click', () => {
      showTrails = !showTrails;
      trailsBtn.textContent = showTrails ? '✨ Traînées : ON' : '✨ Traînées : OFF';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      initStars();
      background(0);
    });
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    eratio = Math.min(1.0, eratio * 1.02);
    document.getElementById('ratio-slider').value = eratio;
  } else if (keyCode === DOWN_ARROW) {
    eratio = Math.max(0.2, eratio / 1.02);
    document.getElementById('ratio-slider').value = eratio;
  } else if (keyCode === LEFT_ARROW) {
    etwist += 0.002;
    document.getElementById('twist-slider').value = etwist;
  } else if (keyCode === RIGHT_ARROW) {
    etwist = Math.max(0, etwist - 0.002);
    document.getElementById('twist-slider').value = etwist;
  } else if (key === ' ') {
    isPaused = !isPaused;
    const btn = document.getElementById('pause-btn');
    if (btn) btn.textContent = isPaused ? '▶ Reprendre' : '⏸ Pause';
  } else if (key === 'r' || key === 'R') {
    initStars();
    background(0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initStars();
  background(0);
}
