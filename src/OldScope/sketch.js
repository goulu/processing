/**
 * OldScope - Vintage CRT Oscilloscope Simulator
 * Ported to p5.js from Processing sketch by Philippe Guglielmetti (Dr. Goulu)
 */

let fx = 3.0;
let fy = 2.0;
let phase = 0.0;
let phaseSpeed = 0.02;
let mode = 'lissajous';
let phosphor = 'green';
let isPaused = false;
let canvasSide = 650;

function setup() {
  canvasSide = Math.min(windowWidth * 0.85, windowHeight * 0.85, 750);
  const canvas = createCanvas(canvasSide, canvasSide);

  const container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }

  setupUI();
  background(8, 12, 10);
}

function draw() {
  // Phosphor persistence / afterglow decay
  background(6, 10, 8, 35);

  drawCRTGrid();
  drawSignalBeam();

  if (!isPaused) {
    phase += phaseSpeed;
  }
}

function drawCRTGrid() {
  push();
  const div = 10;
  const step = width / div;

  // Grid lines
  stroke(25, 55, 35, 90);
  strokeWeight(1);

  for (let i = 0; i <= div; i++) {
    line(i * step, 0, i * step, height);
    line(0, i * step, width, i * step);
  }

  // Central Reticle axes
  stroke(40, 95, 50, 160);
  strokeWeight(1.5);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  // Tick marks
  stroke(45, 110, 60, 180);
  strokeWeight(1);
  for (let p = 0; p < width; p += step / 5.0) {
    line(p, height / 2 - 3, p, height / 2 + 3);
    line(width / 2 - 3, p, width / 2 + 3, p);
  }
  pop();
}

function getPhosphorColors() {
  if (phosphor === 'green') {
    return {
      glow: color(74, 222, 128, 45),
      beam: color(34, 197, 94, 230),
      core: color(220, 252, 231, 255)
    };
  } else if (phosphor === 'amber') {
    return {
      glow: color(251, 191, 36, 45),
      beam: color(245, 158, 11, 230),
      core: color(254, 243, 199, 255)
    };
  } else {
    return {
      glow: color(56, 189, 248, 45),
      beam: color(14, 165, 233, 230),
      core: color(224, 242, 254, 255)
    };
  }
}

function drawSignalBeam() {
  const colors = getPhosphorColors();
  const cx = width / 2.0;
  const cy = height / 2.0;
  const r = width * 0.38;

  // Render glow halo + sharp beam core
  const passes = [
    { weight: 6, color: colors.glow },
    { weight: 2.5, color: colors.beam },
    { weight: 1.0, color: colors.core }
  ];

  for (const pass of passes) {
    stroke(pass.color);
    strokeWeight(pass.weight);
    noFill();

    if (mode === 'lissajous') {
      beginShape();
      const samples = 1000;
      for (let i = 0; i <= samples; i++) {
        const t = (i / samples) * TWO_PI;
        const x = cx + r * Math.sin(fx * t + phase);
        const y = cy + r * Math.sin(fy * t);
        vertex(x, y);
      }
      endShape();
    } else if (mode === 'yt') {
      beginShape();
      const samples = 400;
      for (let i = 0; i <= samples; i++) {
        const x = (i / samples) * width;
        const t = (i / samples) * TWO_PI * 4;
        const y = cy + (r * 0.7) * Math.sin(fx * t + phase);
        vertex(x, y);
      }
      endShape();
    } else if (mode === 'modulation') {
      beginShape();
      const samples = 500;
      for (let i = 0; i <= samples; i++) {
        const x = (i / samples) * width;
        const t = (i / samples) * TWO_PI * 6;
        const carrier = Math.sin(fx * 3 * t + phase);
        const modulator = 1.0 + 0.5 * Math.sin(fy * t);
        const y = cy + (r * 0.6) * carrier * modulator;
        vertex(x, y);
      }
      endShape();
    } else if (mode === 'harmonics') {
      beginShape();
      const samples = 500;
      for (let i = 0; i <= samples; i++) {
        const x = (i / samples) * width;
        const t = (i / samples) * TWO_PI * 3;
        // Fourier square wave synthesis: sum of odd harmonics
        const val = Math.sin(fx * t + phase) + (1 / 3) * Math.sin(3 * fx * t + phase) + (1 / 5) * Math.sin(5 * fx * t + phase);
        const y = cy + (r * 0.6) * val;
        vertex(x, y);
      }
      endShape();
    }
  }
}

function setupUI() {
  const modeSelect = document.getElementById('mode-select');
  const fxSlider = document.getElementById('fx-slider');
  const fxVal = document.getElementById('fx-val');
  const fySlider = document.getElementById('fy-slider');
  const fyVal = document.getElementById('fy-val');
  const phaseSlider = document.getElementById('phase-slider');
  const colorSelect = document.getElementById('color-select');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      mode = e.target.value;
      background(8, 12, 10);
    });
  }

  if (fxSlider) {
    fxSlider.addEventListener('input', (e) => {
      fx = parseFloat(e.target.value);
      if (fxVal) fxVal.textContent = fx.toFixed(1);
    });
  }

  if (fySlider) {
    fySlider.addEventListener('input', (e) => {
      fy = parseFloat(e.target.value);
      if (fyVal) fyVal.textContent = fy.toFixed(1);
    });
  }

  if (phaseSlider) {
    phaseSlider.addEventListener('input', (e) => {
      phaseSpeed = parseFloat(e.target.value);
    });
  }

  if (colorSelect) {
    colorSelect.addEventListener('change', (e) => {
      phosphor = e.target.value;
      background(8, 12, 10);
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
      phase = 0;
      background(8, 12, 10);
    });
  }
}

function keyPressed() {
  if (key === '1') {
    fx = Math.max(1, fx - 0.5);
    const slider = document.getElementById('fx-slider');
    if (slider) slider.value = fx;
    const val = document.getElementById('fx-val');
    if (val) val.textContent = fx.toFixed(1);
  } else if (key === '2') {
    fx = Math.min(12, fx + 0.5);
    const slider = document.getElementById('fx-slider');
    if (slider) slider.value = fx;
    const val = document.getElementById('fx-val');
    if (val) val.textContent = fx.toFixed(1);
  } else if (key === '3') {
    fy = Math.max(1, fy - 0.5);
    const slider = document.getElementById('fy-slider');
    if (slider) slider.value = fy;
    const val = document.getElementById('fy-val');
    if (val) val.textContent = fy.toFixed(1);
  } else if (key === '4') {
    fy = Math.min(12, fy + 0.5);
    const slider = document.getElementById('fy-slider');
    if (slider) slider.value = fy;
    const val = document.getElementById('fy-val');
    if (val) val.textContent = fy.toFixed(1);
  } else if (key === ' ') {
    isPaused = !isPaused;
    const btn = document.getElementById('pause-btn');
    if (btn) btn.textContent = isPaused ? '▶ Reprendre' : '⏸ Pause';
  }
}

function windowResized() {
  canvasSide = Math.min(windowWidth * 0.85, windowHeight * 0.85, 750);
  resizeCanvas(canvasSide, canvasSide);
  background(8, 12, 10);
}
