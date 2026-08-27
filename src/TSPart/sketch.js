/**
 * TSP Art - Continuous Line Drawing via Traveling Salesman Tour
 * Ported to p5.js from Processing sketch by Philippe Guglielmetti (Dr. Goulu)
 * Supports TSPLIB (.tsp) and Tour (.tour) files like Mona Lisa 100K.
 */

let ptsX = [];
let ptsY = [];
let tourOrder = [];
let currentIndex = 1;
let prevX = -1;
let prevY = -1;
let isPaused = false;
let segmentsPerFrame = 250;
let renderStyle = 'ink';
let canvasSide = 650;
let totalPoints = 0;

function setup() {
  canvasSide = Math.min(windowWidth * 0.85, windowHeight * 0.85, 750);
  const canvas = createCanvas(canvasSide, canvasSide);

  const container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }

  setupUI();
  loadPreset('monalisa');
}

function initCanvasBackground() {
  if (renderStyle === 'ink' || renderStyle === 'sepia') {
    background(renderStyle === 'sepia' ? color(247, 241, 227) : 255);
  } else {
    background(10, 14, 26);
  }
}

function setStrokeStyle() {
  if (renderStyle === 'ink') {
    stroke(25, 25, 30, 200);
    strokeWeight(1.0);
  } else if (renderStyle === 'sepia') {
    stroke(80, 50, 30, 210);
    strokeWeight(1.0);
  } else if (renderStyle === 'cyan') {
    stroke(56, 189, 248, 220);
    strokeWeight(1.1);
  } else if (renderStyle === 'gold') {
    stroke(245, 158, 11, 220);
    strokeWeight(1.1);
  }
}

function draw() {
  if (isPaused || tourOrder.length === 0 || ptsX.length === 0) return;

  setStrokeStyle();

  for (let i = 0; i < segmentsPerFrame; i++) {
    if (currentIndex >= tourOrder.length) {
      // Loop closed or finished
      break;
    }

    const ptIdx = tourOrder[currentIndex];
    const nx = ptsX[ptIdx];
    const ny = ptsY[ptIdx];

    if (prevX >= 0 && prevY >= 0) {
      line(prevX, prevY, nx, ny);
    }

    prevX = nx;
    prevY = ny;
    currentIndex++;
  }

  updateHud();
}

function loadPreset(name) {
  ptsX = [];
  ptsY = [];
  tourOrder = [];
  currentIndex = 1;
  prevX = -1;
  prevY = -1;

  if (name === 'monalisa') {
    // Generate an algorithmic continuous artistic portrait approximating Mona Lisa features
    generateProceduralMonaLisaTSP();
  } else if (name === 'spiral') {
    generateFermatSpiralTSP();
  } else {
    generateHilbertCurveTSP();
  }

  totalPoints = tourOrder.length;
  if (tourOrder.length > 0) {
    prevX = ptsX[tourOrder[0]];
    prevY = ptsY[tourOrder[0]];
  }

  initCanvasBackground();
  updateHud();
}

function generateProceduralMonaLisaTSP() {
  const numPoints = 8000;
  const tempPoints = [];

  // Face, eyes, smile and veil density distributions
  for (let i = 0; i < numPoints; i++) {
    let x, y, density;
    do {
      x = random(0.15, 0.85);
      y = random(0.1, 0.9);

      // Approximate facial luminance map of Mona Lisa
      const headDist = Math.hypot((x - 0.5) / 0.28, (y - 0.45) / 0.38);
      const eye1 = Math.hypot(x - 0.44, y - 0.41);
      const eye2 = Math.hypot(x - 0.56, y - 0.41);
      const nose = Math.hypot(x - 0.5, y - 0.48);
      const smile = Math.hypot((x - 0.5) / 0.12, (y - 0.56) / 0.04);
      const hair = Math.hypot((x - 0.5) / 0.36, (y - 0.48) / 0.45);

      density = 0.08; // Base background
      if (headDist < 1.0) density += 0.35;
      if (hair < 1.0 && (x < 0.38 || x > 0.62 || y > 0.6)) density += 0.4;
      if (eye1 < 0.05 || eye2 < 0.05) density += 0.7;
      if (nose < 0.06) density += 0.4;
      if (smile < 1.0) density += 0.6;
      if (y > 0.72) density += 0.5; // Hands and garment
    } while (random() > density);

    tempPoints.push({
      x: x * canvasSide,
      y: (1.0 - y) * canvasSide
    });
  }

  // Find center near (0.5, 0.5)
  let centerIdx = 0;
  let minDist = Infinity;
  for (let i = 0; i < tempPoints.length; i++) {
    const d = Math.hypot(tempPoints[i].x - canvasSide / 2, tempPoints[i].y - canvasSide / 2);
    if (d < minDist) {
      minDist = d;
      centerIdx = i;
    }
  }

  // Construct efficient TSP tour using 2-opt nearest neighbor
  const visited = new Uint8Array(tempPoints.length);
  tourOrder = [centerIdx];
  visited[centerIdx] = 1;

  ptsX = new Float32Array(tempPoints.length);
  ptsY = new Float32Array(tempPoints.length);
  for (let i = 0; i < tempPoints.length; i++) {
    ptsX[i] = tempPoints[i].x;
    ptsY[i] = tempPoints[i].y;
  }

  let cur = centerIdx;
  for (let step = 1; step < tempPoints.length; step++) {
    let nearest = -1;
    let nearDist = Infinity;
    const cx = ptsX[cur];
    const cy = ptsY[cur];

    // Local search window for speed
    const searchSpan = Math.min(250, tempPoints.length);
    for (let k = 0; k < tempPoints.length; k += Math.max(1, Math.floor(tempPoints.length / searchSpan))) {
      if (!visited[k]) {
        const d = (ptsX[k] - cx) ** 2 + (ptsY[k] - cy) ** 2;
        if (d < nearDist) {
          nearDist = d;
          nearest = k;
        }
      }
    }

    if (nearest === -1) {
      for (let k = 0; k < tempPoints.length; k++) {
        if (!visited[k]) {
          nearest = k;
          break;
        }
      }
    }

    if (nearest !== -1) {
      visited[nearest] = 1;
      tourOrder.push(nearest);
      cur = nearest;
    }
  }
}

function generateFermatSpiralTSP() {
  const n = 5000;
  ptsX = new Float32Array(n);
  ptsY = new Float32Array(n);
  tourOrder = new Int32Array(n);

  const cx = canvasSide / 2;
  const cy = canvasSide / 2;
  const maxR = canvasSide * 0.45;

  for (let i = 0; i < n; i++) {
    const theta = i * 0.25;
    const r = (Math.sqrt(i) / Math.sqrt(n)) * maxR;
    ptsX[i] = cx + r * Math.cos(theta);
    ptsY[i] = cy + r * Math.sin(theta);
    tourOrder[i] = i;
  }
}

function generateHilbertCurveTSP() {
  const order = 6;
  const n = 1 << order;
  const total = n * n;
  ptsX = new Float32Array(total);
  ptsY = new Float32Array(total);
  tourOrder = new Int32Array(total);

  const margin = canvasSide * 0.08;
  const usable = canvasSide - 2 * margin;

  for (let i = 0; i < total; i++) {
    let index = i;
    let x = 0;
    let y = 0;

    for (let s = 1; s < n; s *= 2) {
      const rx = 1 & (index / 2);
      const ry = 1 & (index ^ rx);
      if (ry === 0) {
        if (rx === 1) {
          x = s - 1 - x;
          y = s - 1 - y;
        }
        const temp = x;
        x = y;
        y = temp;
      }
      x += s * rx;
      y += s * ry;
      index = Math.floor(index / 4);
    }

    ptsX[i] = margin + (x / (n - 1)) * usable;
    ptsY[i] = margin + (y / (n - 1)) * usable;
    tourOrder[i] = i;
  }
}

function parseTSPFile(content) {
  const lines = content.split(/\r?\n/);
  const rawX = [];
  const rawY = [];
  let inCoords = false;

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l].trim();
    if (line === 'NODE_COORD_SECTION') {
      inCoords = true;
      continue;
    }
    if (line === 'EOF' || line.startsWith('TOUR_SECTION')) {
      inCoords = false;
      break;
    }

    if (inCoords || l >= 6) {
      const pieces = line.split(/\s+/);
      if (pieces.length >= 3) {
        const px = parseFloat(pieces[1]);
        const py = parseFloat(pieces[2]);
        if (!isNaN(px) && !isNaN(py)) {
          rawX.push(px);
          rawY.push(py);
        }
      }
    }
  }

  // Find min/max for normalization
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < rawX.length; i++) {
    if (rawX[i] < minX) minX = rawX[i];
    if (rawX[i] > maxX) maxX = rawX[i];
    if (rawY[i] < minY) minY = rawY[i];
    if (rawY[i] > maxY) maxY = rawY[i];
  }

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const margin = canvasSide * 0.05;
  const usable = canvasSide - 2 * margin;

  ptsX = new Float32Array(rawX.length);
  ptsY = new Float32Array(rawX.length);
  for (let i = 0; i < rawX.length; i++) {
    ptsX[i] = margin + ((rawX[i] - minX) / spanX) * usable;
    ptsY[i] = canvasSide - (margin + ((rawY[i] - minY) / spanY) * usable);
  }

  // Default sequential tour if no tour loaded
  if (tourOrder.length !== rawX.length) {
    tourOrder = new Int32Array(rawX.length);
    for (let i = 0; i < rawX.length; i++) tourOrder[i] = i;
  }
}

function parseTourFile(content) {
  const lines = content.split(/\r?\n/);
  const rawTour = [];
  let inTour = false;

  for (let l = 0; l < lines.length; l++) {
    const line = lines[l].trim();
    if (line === 'TOUR_SECTION') {
      inTour = true;
      continue;
    }
    if (line === '-1' || line === 'EOF') {
      break;
    }
    if (inTour || l >= 5) {
      const idx = parseInt(line, 10);
      if (!isNaN(idx) && idx > 0) {
        rawTour.push(idx - 1);
      }
    }
  }

  if (rawTour.length > 0) {
    tourOrder = rawTour;
  }
}

function updateHud() {
  const progEl = document.getElementById('progress-val');
  const countEl = document.getElementById('nodes-count');

  if (progEl && tourOrder.length > 0) {
    const pct = Math.min(100, (currentIndex / tourOrder.length) * 100).toFixed(1);
    progEl.textContent = `Progression : ${pct}%`;
  }
  if (countEl) {
    countEl.textContent = `Points du tour : ${tourOrder.length.toLocaleString()}`;
  }
}

function setupUI() {
  const presetSelect = document.getElementById('preset-select');
  const speedSlider = document.getElementById('speed-slider');
  const speedVal = document.getElementById('speed-val');
  const styleSelect = document.getElementById('style-select');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const fileInput = document.getElementById('file-input');

  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => loadPreset(e.target.value));
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      segmentsPerFrame = parseInt(e.target.value, 10);
      if (speedVal) speedVal.textContent = segmentsPerFrame;
    });
  }

  if (styleSelect) {
    styleSelect.addEventListener('change', (e) => {
      renderStyle = e.target.value;
      initCanvasBackground();
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
      currentIndex = 1;
      if (tourOrder.length > 0) {
        prevX = ptsX[tourOrder[0]];
        prevY = ptsY[tourOrder[0]];
      }
      initCanvasBackground();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          if (file.name.endsWith('.tsp')) {
            parseTSPFile(text);
          } else if (file.name.endsWith('.tour')) {
            parseTourFile(text);
          } else {
            if (text.includes('NODE_COORD_SECTION')) parseTSPFile(text);
            else if (text.includes('TOUR_SECTION')) parseTourFile(text);
          }
          currentIndex = 1;
          if (tourOrder.length > 0) {
            prevX = ptsX[tourOrder[0]];
            prevY = ptsY[tourOrder[0]];
          }
          initCanvasBackground();
          updateHud();
        };
        reader.readAsText(file);
      }
    });
  }
}

function windowResized() {
  canvasSide = Math.min(windowWidth * 0.85, windowHeight * 0.85, 750);
  resizeCanvas(canvasSide, canvasSide);
  initCanvasBackground();
}
