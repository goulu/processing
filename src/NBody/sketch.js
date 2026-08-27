/**
 * N-Body Gravitational Simulation
 * Ported to p5.js from Processing sketch by Philippe Guglielmetti (Dr. Goulu)
 * Loads celestial system definition from system.xml
 */

let bodies = [];
let initialBodiesData = [];
let G = 6.6743e-11; // Gravitational constant scaled for simulation
let timeScale = 86400 * 2; // 2 days per second by default
let isPaused = false;
let showTrails = true;
let showLabels = true;
let zoom = 1.0;
let panX = 0;
let panY = 0;
let isDragging = false;
let startDragX = 0;
let startDragY = 0;
let maxRadius = 1;
let scaleFactor = 1;
let simulatedSeconds = 0;
let focusTarget = 'sun';

class CelestialBody {
  constructor(name, id, x, y, z, vx, vy, vz, mass) {
    this.name = name.replace(/\s*\(\d+\)/, ''); // Clean name
    this.id = id;
    this.x = x; // km
    this.y = y; // km
    this.z = z; // km
    this.vx = vx; // km/s
    this.vy = vy; // km/s
    this.vz = vz; // km/s
    this.mass = mass; // arbitrary scaled mass units
    this.isFixed = (this.name.toLowerCase().includes('sun') || id === '10');
    this.trail = [];
    this.maxTrail = 180;
    this.color = this.assignColor();
    this.radiusPx = this.assignRadius();
  }

  assignColor() {
    const n = this.name.toLowerCase();
    if (n.includes('sun')) return color(255, 220, 60);
    if (n.includes('mercury')) return color(180, 180, 180);
    if (n.includes('venus')) return color(230, 200, 140);
    if (n.includes('earth')) return color(80, 180, 255);
    if (n.includes('moon')) return color(200, 200, 210);
    if (n.includes('mars')) return color(255, 100, 70);
    if (n.includes('jupiter')) return color(240, 170, 110);
    if (n.includes('saturn')) return color(220, 200, 130);
    if (n.includes('uranus')) return color(130, 220, 240);
    if (n.includes('neptune')) return color(90, 140, 255);
    if (n.includes('pluto')) return color(190, 170, 150);
    if (n.includes('pioneer')) return color(0, 255, 200);
    return color(200, 220, 255);
  }

  assignRadius() {
    const n = this.name.toLowerCase();
    if (n.includes('sun')) return 9;
    if (n.includes('jupiter') || n.includes('saturn')) return 6;
    if (n.includes('earth') || n.includes('venus') || n.includes('uranus') || n.includes('neptune')) return 4.5;
    if (n.includes('moon') || n.includes('mars') || n.includes('mercury')) return 3.5;
    return 2.5;
  }
}

function preload() {
  loadXML('system.xml', onXMLLoaded, onXMLError);
}

function onXMLLoaded(xml) {
  const bodyNodes = xml.getChildren('Body');
  initialBodiesData = [];
  maxRadius = 1;

  for (let i = 0; i < bodyNodes.length; i++) {
    const b = bodyNodes[i];
    const name = b.getChild('HorizonName')?.getContent() || `Body ${i}`;
    const id = b.getChild('HorizonID')?.getContent() || `${i}`;
    const x = parseFloat(b.getChild('PositionX')?.getContent() || 0);
    const y = parseFloat(b.getChild('PositionY')?.getContent() || 0);
    const z = parseFloat(b.getChild('PositionZ')?.getContent() || 0);
    const vx = parseFloat(b.getChild('VelocityX')?.getContent() || 0);
    const vy = parseFloat(b.getChild('VelocityY')?.getContent() || 0);
    const vz = parseFloat(b.getChild('VelocityZ')?.getContent() || 0);
    const m = parseFloat(b.getChild('Mass')?.getContent() || 0);

    const dist = Math.hypot(x, y, z);
    if (dist > maxRadius) maxRadius = dist;

    initialBodiesData.push({ name, id, x, y, z, vx, vy, vz, mass: m });
  }

  resetBodies();
  updateHud();
}

function onXMLError() {
  console.warn('Could not load system.xml, initializing default solar system');
  // Fallback if needed
}

function resetBodies() {
  bodies = [];
  simulatedSeconds = 0;
  for (const data of initialBodiesData) {
    bodies.push(
      new CelestialBody(
        data.name,
        data.id,
        data.x,
        data.y,
        data.z,
        data.vx,
        data.vy,
        data.vz,
        data.mass
      )
    );
  }
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  const container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }
  setupUI();
  setupInteractions();
}

function updatePhysics(dt) {
  // Gravitational factor tuned for original units (km, km/s, scaled mass)
  const GM_factor = 2.959e-4; // Solar gravitational parameter scaling

  // Substepping for numerical precision
  const steps = 8;
  const subDt = dt / steps;

  for (let step = 0; step < steps; step++) {
    const ax = new Float64Array(bodies.length);
    const ay = new Float64Array(bodies.length);

    for (let i = 0; i < bodies.length; i++) {
      const b1 = bodies[i];
      if (b1.isFixed) continue;

      for (let j = 0; j < bodies.length; j++) {
        if (i === j) continue;
        const b2 = bodies[j];
        if (b2.mass === 0) continue;

        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const distSq = dx * dx + dy * dy + 1e6; // softening factor
        const dist = Math.sqrt(distSq);

        const force = (GM_factor * b2.mass) / distSq;
        ax[i] += force * (dx / dist);
        ay[i] += force * (dy / dist);
      }
    }

    for (let i = 0; i < bodies.length; i++) {
      const b = bodies[i];
      if (b.isFixed) continue;
      b.vx += ax[i] * subDt;
      b.vy += ay[i] * subDt;
      b.x += b.vx * subDt;
      b.y += b.vy * subDt;
    }
  }

  simulatedSeconds += dt;
}

function draw() {
  background(3, 6, 17);

  if (!isPaused && bodies.length > 0) {
    const dt = (timeScale * (deltaTime / 1000));
    updatePhysics(dt);
  }

  // Base scale calculation to fit outer planets
  const baseScale = (Math.min(width, height) * 0.45) / (maxRadius || 1);
  scaleFactor = baseScale * zoom;

  // Apply camera transformations
  push();
  translate(width / 2 + panX, height / 2 + panY);

  // Auto focus adjustment
  applyFocusTarget();

  // Draw Trails
  if (showTrails) {
    noFill();
    for (const b of bodies) {
      if (b.trail.length > 1) {
        stroke(red(b.color), green(b.color), blue(b.color), 80);
        strokeWeight(1.2 / zoom);
        beginShape();
        for (const pt of b.trail) {
          vertex(pt.x * scaleFactor, pt.y * scaleFactor);
        }
        endShape();
      }
    }
  }

  // Draw Celestial Bodies
  for (const b of bodies) {
    const sx = b.x * scaleFactor;
    const sy = b.y * scaleFactor;

    // Record trail
    if (frameCount % 3 === 0 && !isPaused) {
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > b.maxTrail) b.trail.shift();
    }

    // Glow for large mass bodies
    if (b.isFixed) {
      noStroke();
      fill(255, 220, 60, 40);
      ellipse(sx, sy, 30, 30);
      fill(255, 240, 120, 100);
      ellipse(sx, sy, 18, 18);
    }

    // Body shape
    fill(b.color);
    noStroke();
    ellipse(sx, sy, b.radiusPx, b.radiusPx);

    // Labels
    if (showLabels && zoom > 0.5) {
      fill(220, 230, 245, 200);
      textSize(10);
      textAlign(LEFT, CENTER);
      text(b.name, sx + b.radiusPx + 4, sy);
    }
  }

  pop();

  updateHud();
}

function applyFocusTarget() {
  if (focusTarget === 'inner') {
    zoom = 8.0;
  } else if (focusTarget === 'earth') {
    const earth = bodies.find((b) => b.name.toLowerCase().includes('earth'));
    if (earth) {
      panX = -earth.x * scaleFactor;
      panY = -earth.y * scaleFactor;
      zoom = 120.0;
    }
  } else if (focusTarget === 'jupiter') {
    const jup = bodies.find((b) => b.name.toLowerCase().includes('jupiter'));
    if (jup) {
      panX = -jup.x * scaleFactor;
      panY = -jup.y * scaleFactor;
      zoom = 50.0;
    }
  } else if (focusTarget === 'saturn') {
    const sat = bodies.find((b) => b.name.toLowerCase().includes('saturn'));
    if (sat) {
      panX = -sat.x * scaleFactor;
      panY = -sat.y * scaleFactor;
      zoom = 40.0;
    }
  }
}

function updateHud() {
  const countEl = document.getElementById('body-count');
  const timeEl = document.getElementById('sim-time');
  if (countEl) countEl.textContent = `${bodies.length} corps célestes chargés`;
  if (timeEl) {
    const days = (simulatedSeconds / 86400).toFixed(1);
    timeEl.textContent = `Temps simulé : ${days} jours`;
  }
}

function setupUI() {
  const speedSlider = document.getElementById('speed-slider');
  const speedVal = document.getElementById('speed-val');
  const focusSelect = document.getElementById('focus-select');
  const showTrailsCb = document.getElementById('show-trails');
  const showLabelsCb = document.getElementById('show-labels');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      const mult = parseFloat(e.target.value);
      timeScale = 86400 * mult;
      speedVal.textContent = `${mult}x`;
    });
  }

  if (focusSelect) {
    focusSelect.addEventListener('change', (e) => {
      focusTarget = e.target.value;
      if (focusTarget === 'sun') {
        zoom = 1.0;
        panX = 0;
        panY = 0;
      }
    });
  }

  if (showTrailsCb) {
    showTrailsCb.addEventListener('change', (e) => {
      showTrails = e.target.checked;
    });
  }

  if (showLabelsCb) {
    showLabelsCb.addEventListener('change', (e) => {
      showLabels = e.target.checked;
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? '▶ Reprendre' : '⏸ Pause';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetBodies();
    });
  }
}

function setupInteractions() {
  const container = document.getElementById('sketch-container');

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startDragX = e.clientX - panX;
    startDragY = e.clientY - panY;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panX = e.clientX - startDragX;
      panY = e.clientY - startDragY;
      focusTarget = 'custom';
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    zoom = constrain(zoom * factor, 0.2, 500);
    focusTarget = 'custom';
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
