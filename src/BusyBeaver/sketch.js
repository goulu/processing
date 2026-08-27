/**
 * Busy Beaver (Castor Affairé) - Turing Machine Simulator
 * Ported to p5.js from Processing sketch by Philippe Guglielmetti (Dr. Goulu)
 */

const TAPE_SIZE = 4000;
let tape = new Uint8Array(TAPE_SIZE);
let headPos = Math.floor(TAPE_SIZE / 2);
let state = 'A';
let steps = 0;
let onesCount = 0;
let currentBB = '4';
let isHalted = false;
let isPaused = false;
let stepsPerFrame = 10;
let viewMode = 'spacetime';

// 2D Turmite support
let grid2D = null;
let gridW = 200;
let gridH = 200;
let turmiteX = 100;
let turmiteY = 100;
let turmiteDir = 0; // 0=North, 1=East, 2=South, 3=West
let turmiteState = 0;

let historyRows = [];
const MAX_HISTORY = 700;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  const container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }

  resetMachine(currentBB);
  setupUI();
}

function resetMachine(bb) {
  currentBB = bb;
  tape = new Uint8Array(TAPE_SIZE);
  headPos = Math.floor(TAPE_SIZE / 2);
  state = 'A';
  steps = 0;
  onesCount = 0;
  isHalted = false;
  historyRows = [];

  if (currentBB === 'turmite') {
    grid2D = new Uint8Array(gridW * gridH);
    turmiteX = Math.floor(gridW / 2);
    turmiteY = Math.floor(gridH / 2);
    turmiteDir = 0;
    turmiteState = 0;
  }

  background(11, 15, 25);
  updateHud();
}

function step1D() {
  if (isHalted) return;

  const symbol = tape[headPos];
  let writeVal = 0;
  let move = 0;
  let nextState = 'H';

  if (currentBB === '2') {
    // BB(2): 6 steps, 4 ones
    if (state === 'A') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else              { writeVal = 1; move = -1; nextState = 'B'; }
    } else if (state === 'B') {
      if (symbol === 0) { writeVal = 1; move = -1; nextState = 'A'; }
      else              { writeVal = 1; move = 1; nextState = 'H'; }
    }
  } else if (currentBB === '3') {
    // BB(3): 21 steps, 6 ones
    if (state === 'A') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else              { writeVal = 1; move = 1; nextState = 'H'; }
    } else if (state === 'B') {
      if (symbol === 0) { writeVal = 0; move = 1; nextState = 'C'; }
      else              { writeVal = 1; move = 1; nextState = 'B'; }
    } else if (state === 'C') {
      if (symbol === 0) { writeVal = 1; move = -1; nextState = 'C'; }
      else              { writeVal = 1; move = -1; nextState = 'A'; }
    }
  } else if (currentBB === '4') {
    // BB(4): 107 steps, 13 ones
    if (state === 'A') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else              { writeVal = 1; move = -1; nextState = 'B'; }
    } else if (state === 'B') {
      if (symbol === 0) { writeVal = 1; move = -1; nextState = 'A'; }
      else              { writeVal = 0; move = -1; nextState = 'C'; }
    } else if (state === 'C') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'H'; }
      else              { writeVal = 1; move = -1; nextState = 'D'; }
    } else if (state === 'D') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'D'; }
      else              { writeVal = 0; move = 1; nextState = 'A'; }
    }
  } else if (currentBB === '5') {
    // BB(5) Champion: 47,176,870 steps, 4098 ones
    if (state === 'A') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else              { writeVal = 1; move = -1; nextState = 'C'; }
    } else if (state === 'B') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'C'; }
      else              { writeVal = 1; move = 1; nextState = 'B'; }
    } else if (state === 'C') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'D'; }
      else              { writeVal = 0; move = -1; nextState = 'E'; }
    } else if (state === 'D') {
      if (symbol === 0) { writeVal = 1; move = -1; nextState = 'A'; }
      else              { writeVal = 1; move = -1; nextState = 'D'; }
    } else if (state === 'E') {
      if (symbol === 0) { writeVal = 1; move = 1; nextState = 'H'; }
      else              { writeVal = 0; move = -1; nextState = 'A'; }
    }
  }

  // Update counts
  if (tape[headPos] === 0 && writeVal === 1) onesCount++;
  if (tape[headPos] === 1 && writeVal === 0) onesCount--;
  tape[headPos] = writeVal;

  headPos += move;
  if (headPos < 0) headPos = 0;
  if (headPos >= TAPE_SIZE) headPos = TAPE_SIZE - 1;

  state = nextState;
  steps++;
  if (state === 'H') isHalted = true;

  // Snapshot active region for space-time diagram
  if (viewMode === 'spacetime' && steps % Math.max(1, Math.floor(stepsPerFrame / 10)) === 0) {
    const activeSpan = 160;
    const start = Math.max(0, headPos - activeSpan);
    const end = Math.min(TAPE_SIZE, headPos + activeSpan);
    const onesPositions = [];
    for (let k = start; k < end; k++) {
      if (tape[k] === 1) onesPositions.push(k - TAPE_SIZE / 2);
    }
    historyRows.push({
      step: steps,
      head: headPos - TAPE_SIZE / 2,
      ones: onesPositions
    });
    if (historyRows.length > MAX_HISTORY) historyRows.shift();
  }
}

function stepTurmite() {
  if (isHalted) return;
  const idx = turmiteY * gridW + turmiteX;
  const val = grid2D[idx];

  // Langton / Turmite spiral rule
  if (val === 0) {
    turmiteDir = (turmiteDir + 1) % 4; // Turn Right
    grid2D[idx] = 1;
    onesCount++;
  } else {
    turmiteDir = (turmiteDir + 3) % 4; // Turn Left
    grid2D[idx] = 0;
    onesCount--;
  }

  if (turmiteDir === 0) turmiteY--;
  else if (turmiteDir === 1) turmiteX++;
  else if (turmiteDir === 2) turmiteY++;
  else if (turmiteDir === 3) turmiteX--;

  // Wrap around
  if (turmiteX < 0) turmiteX = gridW - 1;
  if (turmiteX >= gridW) turmiteX = 0;
  if (turmiteY < 0) turmiteY = gridH - 1;
  if (turmiteY >= gridH) turmiteY = 0;

  steps++;
}

function draw() {
  if (!isPaused && !isHalted) {
    for (let s = 0; s < stepsPerFrame; s++) {
      if (isHalted) break;
      if (currentBB === 'turmite') stepTurmite();
      else step1D();
    }
  }

  background(11, 15, 25);

  if (currentBB === 'turmite') {
    drawTurmite2D();
  } else if (viewMode === 'spacetime') {
    drawSpaceTime();
  } else {
    drawTapeView();
  }

  updateHud();
}

function drawSpaceTime() {
  push();
  translate(width / 2, 80);

  const rowHeight = Math.max(1, (height - 120) / MAX_HISTORY);
  const cellScale = 2.5;

  noStroke();
  for (let r = 0; r < historyRows.length; r++) {
    const rowData = historyRows[r];
    const y = r * rowHeight;

    // Draw active ones
    fill(56, 189, 248, 200);
    for (const pos of rowData.ones) {
      rect(pos * cellScale, y, cellScale, Math.max(1, rowHeight));
    }

    // Draw head position in red
    fill(239, 68, 68);
    rect(rowData.head * cellScale, y, cellScale * 1.5, Math.max(1, rowHeight));
  }
  pop();
}

function drawTapeView() {
  push();
  translate(width / 2, height / 2);

  const cellWidth = 32;
  const visibleCells = Math.floor(width / cellWidth) + 4;
  const startIdx = headPos - Math.floor(visibleCells / 2);

  // Draw Tape Cells
  for (let i = 0; i < visibleCells; i++) {
    const tapeIdx = startIdx + i;
    if (tapeIdx < 0 || tapeIdx >= TAPE_SIZE) continue;

    const x = (i - Math.floor(visibleCells / 2)) * cellWidth;
    const isHead = tapeIdx === headPos;

    stroke(255, 255, 255, 30);
    strokeWeight(1);
    fill(tape[tapeIdx] === 1 ? color(56, 189, 248, 180) : color(20, 27, 45));
    rect(x - cellWidth / 2, -cellWidth / 2, cellWidth, cellWidth, 4);

    // Cell value
    fill(tape[tapeIdx] === 1 ? 255 : 100);
    noStroke();
    textSize(14);
    textAlign(CENTER, CENTER);
    text(tape[tapeIdx], x, 0);

    // Tape index label
    textSize(9);
    fill(100, 116, 139);
    text(tapeIdx - TAPE_SIZE / 2, x, cellWidth / 2 + 14);
  }

  // Draw Head Indicator Arrow
  fill(239, 68, 68);
  noStroke();
  triangle(0, -cellWidth / 2 - 6, -8, -cellWidth / 2 - 20, 8, -cellWidth / 2 - 20);

  fill(241, 245, 249);
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text(`État : ${state}`, 0, -cellWidth / 2 - 24);

  pop();
}

function drawTurmite2D() {
  push();
  const cellSize = Math.min(width / gridW, height / gridH) * 0.9;
  translate((width - gridW * cellSize) / 2, (height - gridH * cellSize) / 2);

  noStroke();
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      if (grid2D[y * gridW + x] === 1) {
        fill(56, 189, 248);
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Head
  fill(239, 68, 68);
  rect(turmiteX * cellSize, turmiteY * cellSize, cellSize * 2, cellSize * 2);
  pop();
}

function updateHud() {
  const stateEl = document.getElementById('hud-state');
  const stepsEl = document.getElementById('hud-steps');
  const onesEl = document.getElementById('hud-ones');
  const statusEl = document.getElementById('hud-status');

  if (stateEl) stateEl.textContent = state;
  if (stepsEl) stepsEl.textContent = steps.toLocaleString();
  if (onesEl) onesEl.textContent = onesCount.toLocaleString();
  if (statusEl) {
    statusEl.textContent = isHalted ? 'ARRÊTÉ (HALT)' : (isPaused ? 'EN PAUSE' : 'EN COURS');
    statusEl.style.color = isHalted ? '#10b981' : (isPaused ? '#f59e0b' : '#38bdf8');
  }
}

function setupUI() {
  const machineSelect = document.getElementById('machine-select');
  const speedSlider = document.getElementById('speed-slider');
  const speedVal = document.getElementById('speed-val');
  const viewSelect = document.getElementById('view-select');
  const pauseBtn = document.getElementById('pause-btn');
  const stepBtn = document.getElementById('step-btn');
  const resetBtn = document.getElementById('reset-btn');

  if (machineSelect) {
    machineSelect.addEventListener('change', (e) => resetMachine(e.target.value));
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      stepsPerFrame = parseInt(e.target.value, 10);
      if (speedVal) speedVal.textContent = stepsPerFrame;
    });
  }

  if (viewSelect) {
    viewSelect.addEventListener('change', (e) => {
      viewMode = e.target.value;
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseBtn.textContent = isPaused ? '▶ Reprendre' : '⏸ Pause';
      updateHud();
    });
  }

  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      isPaused = true;
      if (pauseBtn) pauseBtn.textContent = '▶ Reprendre';
      if (currentBB === 'turmite') stepTurmite();
      else step1D();
      updateHud();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetMachine(currentBB);
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
