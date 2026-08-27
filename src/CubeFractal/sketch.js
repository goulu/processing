/**
 * 3D Cube Fractal
 * Ported to p5.js from Processing sketch by Philippe Guglielmetti (Dr. Goulu)
 * Inspired by "CrystalCubes" by Stinging Eyes (2008)
 */

let maxDepth = 4;
let scaleFactor = 0.42;
let baseSize = 90;
let autoRotate = true;
let drawEdges = true;
let palette = 'crystal';
let rotAngle = 0;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);

  const container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }

  setupUI();
}

function draw() {
  background(4, 4, 10);

  // Enable PeasyCam-style 3D mouse orbit control
  orbitControl(1.5, 1.5, 0.1);

  if (autoRotate) {
    rotAngle += 0.008;
    rotateY(rotAngle);
    rotateX(rotAngle * 0.4);
  }

  // Setup lighting environment
  setupLighting();

  // Draw 3D Recursive Fractal
  drawFractal(0, 0, 0, baseSize, scaleFactor, maxDepth);
}

function setupLighting() {
  shininess(12.0);

  if (palette === 'crystal') {
    directionalLight(160, 160, 255, -1, -0.5, -0.8);
    pointLight(140, 80, 255, 150, -120, 200);
    ambientLight(70, 30, 140);
    specularMaterial(220, 200, 255);
    if (drawEdges) stroke(168, 85, 247, 200);
    else noStroke();
  } else if (palette === 'emerald') {
    directionalLight(120, 255, 180, -1, -0.5, -0.8);
    pointLight(50, 220, 140, 150, -120, 200);
    ambientLight(20, 80, 50);
    specularMaterial(180, 255, 220);
    if (drawEdges) stroke(52, 211, 153, 200);
    else noStroke();
  } else if (palette === 'gold') {
    directionalLight(255, 220, 120, -1, -0.5, -0.8);
    pointLight(255, 180, 50, 150, -120, 200);
    ambientLight(100, 70, 20);
    specularMaterial(255, 240, 180);
    if (drawEdges) stroke(245, 158, 11, 200);
    else noStroke();
  } else if (palette === 'cyan') {
    directionalLight(120, 230, 255, -1, -0.5, -0.8);
    pointLight(56, 189, 248, 150, -120, 200);
    ambientLight(20, 60, 100);
    specularMaterial(180, 240, 255);
    if (drawEdges) stroke(56, 189, 248, 200);
    else noStroke();
  } else if (palette === 'ruby') {
    directionalLight(255, 120, 140, -1, -0.5, -0.8);
    pointLight(239, 68, 68, 150, -120, 200);
    ambientLight(100, 20, 40);
    specularMaterial(255, 180, 190);
    if (drawEdges) stroke(244, 63, 94, 200);
    else noStroke();
  }

  if (drawEdges) {
    strokeWeight(1.0);
  }
}

function drawFractal(x, y, z, s, f, l) {
  push();
  translate(x, y, z);
  box(s);

  l--;
  if (l > 0) {
    const ox = -s / 2;
    const oy = -s / 2;
    const oz = -s / 2;
    const nextS = s * f;

    // 8 corner child cubes
    drawFractal(ox, oy, oz, nextS, f, l);
    drawFractal(ox + s, oy, oz, nextS, f, l);
    drawFractal(ox, oy + s, oz, nextS, f, l);
    drawFractal(ox + s, oy + s, oz, nextS, f, l);
    drawFractal(ox, oy, oz + s, nextS, f, l);
    drawFractal(ox + s, oy, oz + s, nextS, f, l);
    drawFractal(ox, oy + s, oz + s, nextS, f, l);
    drawFractal(ox + s, oy + s, oz + s, nextS, f, l);
  }
  pop();
}

function setupUI() {
  const depthSlider = document.getElementById('depth-slider');
  const depthVal = document.getElementById('depth-val');
  const factorSlider = document.getElementById('factor-slider');
  const factorVal = document.getElementById('factor-val');
  const paletteSelect = document.getElementById('palette-select');
  const autoRotateCb = document.getElementById('auto-rotate');
  const drawEdgesCb = document.getElementById('draw-edges');
  const resetCamBtn = document.getElementById('reset-cam-btn');

  if (depthSlider) {
    depthSlider.addEventListener('input', (e) => {
      maxDepth = parseInt(e.target.value, 10);
      if (depthVal) depthVal.textContent = maxDepth;
    });
  }

  if (factorSlider) {
    factorSlider.addEventListener('input', (e) => {
      scaleFactor = parseFloat(e.target.value);
      if (factorVal) factorVal.textContent = scaleFactor.toFixed(2);
    });
  }

  if (paletteSelect) {
    paletteSelect.addEventListener('change', (e) => {
      palette = e.target.value;
    });
  }

  if (autoRotateCb) {
    autoRotateCb.addEventListener('change', (e) => {
      autoRotate = e.target.checked;
    });
  }

  if (drawEdgesCb) {
    drawEdgesCb.addEventListener('change', (e) => {
      drawEdges = e.target.checked;
    });
  }

  if (resetCamBtn) {
    resetCamBtn.addEventListener('click', () => {
      camera(0, 0, (height / 2) / Math.tan(Math.PI / 6), 0, 0, 0, 0, 1, 0);
      rotAngle = 0;
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
