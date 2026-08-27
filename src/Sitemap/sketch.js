/**
 * Sitemap: Web Crawler and Force-Directed Graph Visualization
 * Ported to p5.js from Processing sketch by Marcel Salathé & Philippe Guglielmetti (Dr. Goulu)
 */

let nodes = [];
let links = [];
let pagesByUrl = new Map();
let isPaused = false;
let autoZoom = true;
let draggedNode = null;
let hoveredNode = null;

let repulsionStrength = 2500;
let restLength = 45;
let springStrength = 0.2;
let damping = 0.85;

// Camera / Centroid Smoother
let cameraPos = { x: 0, y: 0, zoom: 1 };
let targetCamera = { x: 0, y: 0, zoom: 1 };

class Node {
  constructor(url, label, isRoot = false) {
    this.url = url;
    this.label = label || url.replace(/^https?:\/\//, '');
    this.x = (Math.random() - 0.5) * 100;
    this.y = (Math.random() - 0.5) * 100;
    this.vx = 0;
    this.vy = 0;
    this.fx = 0;
    this.fy = 0;
    this.incomingCount = 1;
    this.isRoot = isRoot;
    this.isFixed = false;
    this.radius = isRoot ? 16 : 10;
    this.color = this.assignColor();
  }

  assignColor() {
    if (this.isRoot) return color(239, 68, 68); // Red for Root
    if (this.url.includes('/category/') || this.url.includes('/tag/')) return color(59, 130, 246); // Blue
    if (this.url.includes('/p5js') || this.url.includes('/processing')) return color(236, 72, 153); // Pink
    if (this.url.endsWith('.pde') || this.url.endsWith('.js')) return color(245, 158, 11); // Yellow/Amber
    return color(34, 197, 94); // Green
  }

  updateRadius() {
    this.radius = Math.min(26, (this.isRoot ? 16 : 9) + Math.sqrt(this.incomingCount) * 2.5);
  }
}

class Link {
  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.weight = 1;
  }
}

function addLink(sourceUrl, targetUrl) {
  let source = pagesByUrl.get(sourceUrl);
  let target = pagesByUrl.get(targetUrl);

  if (!source) {
    source = new Node(sourceUrl);
    pagesByUrl.set(sourceUrl, source);
    nodes.push(source);
  }
  if (!target) {
    target = new Node(targetUrl);
    pagesByUrl.set(targetUrl, target);
    nodes.push(target);
  }

  // Check if link exists
  const existing = links.find(
    (l) =>
      (l.source === source && l.target === target) ||
      (l.source === target && l.target === source)
  );

  if (existing) {
    existing.weight++;
  } else {
    links.push(new Link(source, target));
  }

  target.incomingCount++;
  target.updateRadius();
}

function loadPreset(name) {
  nodes = [];
  links = [];
  pagesByUrl.clear();

  if (name === 'drgoulu') {
    const root = 'http://drgoulu.com';
    const rootNode = new Node(root, 'drgoulu.com', true);
    pagesByUrl.set(root, rootNode);
    nodes.push(rootNode);

    const categories = [
      'Sciences', 'Physique', 'Informatique', 'Maths', 'Processing', 'Cosmologie', 'Philosophie'
    ];
    categories.forEach((cat) => {
      const catUrl = `${root}/category/${cat.toLowerCase()}`;
      addLink(root, catUrl);

      // Add articles in categories
      for (let i = 1; i <= 3; i++) {
        const artUrl = `${catUrl}/article-${i}`;
        addLink(catUrl, artUrl);
        // Inter-links between articles
        if (Math.random() < 0.3) {
          const randomCat = `${root}/category/${categories[Math.floor(Math.random() * categories.length)].toLowerCase()}`;
          addLink(artUrl, randomCat);
        }
      }
    });
  } else if (name === 'processing') {
    const p5Root = 'https://p5js.org';
    const procRoot = 'https://processing.org';

    addLink(p5Root, 'https://p5js.org/reference');
    addLink(p5Root, 'https://p5js.org/examples');
    addLink(p5Root, 'https://p5js.org/learn');
    addLink(procRoot, 'https://processing.org/reference');
    addLink(procRoot, 'https://processing.org/tutorials');
    addLink(procRoot, p5Root);

    const sketches = ['Galaxy', 'NBody', 'RandomTiling', 'Sitemap'];
    sketches.forEach((sk) => {
      const url = `processing://${sk}`;
      addLink(procRoot, url);
      addLink(p5Root, `p5js://${sk}`);
    });
  } else if (name === 'tree') {
    const root = 'https://root.site';
    const rootNode = new Node(root, 'Root Node', true);
    pagesByUrl.set(root, rootNode);
    nodes.push(rootNode);

    function buildBranch(parent, depth) {
      if (depth <= 0) return;
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        const childUrl = `${parent.url}/sub-${depth}-${i}`;
        addLink(parent.url, childUrl);
        const childNode = pagesByUrl.get(childUrl);
        buildBranch(childNode, depth - 1);
      }
    }
    buildBranch(rootNode, 3);
  } else {
    // Complex network
    for (let i = 0; i < 22; i++) {
      const u1 = `https://site.org/page-${i}`;
      const u2 = `https://site.org/page-${(i + 1 + Math.floor(Math.random() * 4)) % 22}`;
      addLink(u1, u2);
    }
  }

  targetCamera = { x: 0, y: 0, zoom: 1 };
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  const container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }
  loadPreset('drgoulu');
  setupUI();
  setupInteractions();
}

function updatePhysics() {
  if (isPaused) return;

  // 1. Reset forces
  for (const n of nodes) {
    n.fx = 0;
    n.fy = 0;
  }

  // 2. Coulomb repulsion between all node pairs
  for (let i = 0; i < nodes.length; i++) {
    const n1 = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const n2 = nodes[j];
      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const distSq = dx * dx + dy * dy + 100;
      const dist = Math.sqrt(distSq);

      const force = repulsionStrength / distSq;
      const fx = force * (dx / dist);
      const fy = force * (dy / dist);

      n1.fx -= fx;
      n1.fy -= fy;
      n2.fx += fx;
      n2.fy += fy;
    }
  }

  // 3. Hooke Spring forces for links
  for (const link of links) {
    const dx = link.target.x - link.source.x;
    const dy = link.target.y - link.source.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const displacement = dist - restLength;
    const force = displacement * springStrength;

    const fx = force * (dx / dist);
    const fy = force * (dy / dist);

    link.source.fx += fx;
    link.source.fy += fy;
    link.target.fx -= fx;
    link.target.fy -= fy;
  }

  // 4. Center pull force (gravity towards origin)
  for (const n of nodes) {
    n.fx -= n.x * 0.005;
    n.fy -= n.y * 0.005;
  }

  // 5. Integrate velocity and update position
  for (const n of nodes) {
    if (n === draggedNode) continue; // Mouse overrides physics

    n.vx = (n.vx + n.fx) * damping;
    n.vy = (n.vy + n.fy) * damping;

    n.x += n.vx;
    n.y += n.vy;
  }
}

function updateCameraCentroid() {
  if (!autoZoom || nodes.length === 0) return;

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;

  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    maxX = Math.max(maxX, n.x);
    minY = Math.min(minY, n.y);
    maxY = Math.max(maxY, n.y);
  }

  const spanX = maxX - minX + 100;
  const spanY = maxY - minY + 100;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const targetZoom = Math.min(
    (width * 0.8) / Math.max(spanX, 100),
    (height * 0.8) / Math.max(spanY, 100),
    1.8
  );

  targetCamera.x = centerX;
  targetCamera.y = centerY;
  targetCamera.zoom = targetZoom;

  // Smooth interpolation
  cameraPos.x += (targetCamera.x - cameraPos.x) * 0.05;
  cameraPos.y += (targetCamera.y - cameraPos.y) * 0.05;
  cameraPos.zoom += (targetCamera.zoom - cameraPos.zoom) * 0.05;
}

function draw() {
  background(11, 15, 25);
  updatePhysics();
  updateCameraCentroid();

  push();
  translate(width / 2, height / 2);
  scale(cameraPos.zoom);
  translate(-cameraPos.x, -cameraPos.y);

  // Draw Edges / Springs
  stroke(255, 255, 255, 60);
  strokeWeight(1.5 / cameraPos.zoom);
  for (const link of links) {
    const s = link.source;
    const t = link.target;
    line(s.x, s.y, t.x, t.y);
  }

  // Draw Nodes
  hoveredNode = null;
  const mouseWorldX = (mouseX - width / 2) / cameraPos.zoom + cameraPos.x;
  const mouseWorldY = (mouseY - height / 2) / cameraPos.zoom + cameraPos.y;

  for (const n of nodes) {
    const d = Math.hypot(n.x - mouseWorldX, n.y - mouseWorldY);
    const isHovered = d < n.radius;
    if (isHovered) hoveredNode = n;

    // Node body
    noStroke();
    if (isHovered || n === draggedNode) {
      fill(255, 255, 255, 80);
      ellipse(n.x, n.y, n.radius * 2 + 8, n.radius * 2 + 8);
    }

    fill(n.color);
    ellipse(n.x, n.y, n.radius * 2, n.radius * 2);

    // Label if large enough or hovered
    if (isHovered || cameraPos.zoom > 0.8 || n.isRoot) {
      fill(241, 245, 249, 220);
      textSize(11 / Math.max(cameraPos.zoom, 0.6));
      textAlign(CENTER, TOP);
      text(n.label, n.x, n.y + n.radius + 3);
    }
  }

  pop();

  updateHoverCard(mouseX, mouseY);
}

function updateHoverCard(mx, my) {
  const card = document.getElementById('hover-card');
  if (!card) return;

  if (hoveredNode) {
    card.style.display = 'block';
    card.style.left = `${mx + 15}px`;
    card.style.top = `${my + 15}px`;
    card.innerHTML = `<strong>${hoveredNode.label}</strong><br/><span style="color:#94a3b8;font-size:0.75rem">${hoveredNode.url}</span><br/><span style="color:#4ade80;font-size:0.72rem">Liens entrants : ${hoveredNode.incomingCount}</span>`;
  } else {
    card.style.display = 'none';
  }
}

function setupUI() {
  const presetSelect = document.getElementById('preset-select');
  const repulsionSlider = document.getElementById('repulsion-slider');
  const lengthSlider = document.getElementById('length-slider');
  const autoZoomCb = document.getElementById('auto-zoom');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const addNodeBtn = document.getElementById('add-node-btn');

  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => loadPreset(e.target.value));
  }

  if (repulsionSlider) {
    repulsionSlider.addEventListener('input', (e) => {
      repulsionStrength = parseFloat(e.target.value);
    });
  }

  if (lengthSlider) {
    lengthSlider.addEventListener('input', (e) => {
      restLength = parseFloat(e.target.value);
    });
  }

  if (autoZoomCb) {
    autoZoomCb.addEventListener('change', (e) => {
      autoZoom = e.target.checked;
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
      const preset = document.getElementById('preset-select').value;
      loadPreset(preset);
    });
  }

  if (addNodeBtn) {
    addNodeBtn.addEventListener('click', () => {
      const randomParent = nodes[Math.floor(Math.random() * nodes.length)];
      if (randomParent) {
        const id = nodes.length + 1;
        addLink(randomParent.url, `https://custom.page/node-${id}`);
      }
    });
  }
}

function setupInteractions() {
  const container = document.getElementById('sketch-container');

  container.addEventListener('mousedown', (e) => {
    const mouseWorldX = (e.clientX - width / 2) / cameraPos.zoom + cameraPos.x;
    const mouseWorldY = (e.clientY - height / 2) / cameraPos.zoom + cameraPos.y;

    for (const n of nodes) {
      if (Math.hypot(n.x - mouseWorldX, n.y - mouseWorldY) < n.radius) {
        draggedNode = n;
        return;
      }
    }

    // Click in empty space: add new linked node
    if (nodes.length > 0) {
      const nearest = nodes.reduce((best, cur) => {
        const d = Math.hypot(cur.x - mouseWorldX, cur.y - mouseWorldY);
        return d < best.dist ? { node: cur, dist: d } : best;
      }, { node: null, dist: Infinity });

      if (nearest.node) {
        const id = nodes.length + 1;
        const newUrl = `https://page.custom/item-${id}`;
        addLink(nearest.node.url, newUrl);
        const newNode = pagesByUrl.get(newUrl);
        if (newNode) {
          newNode.x = mouseWorldX;
          newNode.y = mouseWorldY;
        }
      }
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (draggedNode) {
      const mouseWorldX = (e.clientX - width / 2) / cameraPos.zoom + cameraPos.x;
      const mouseWorldY = (e.clientY - height / 2) / cameraPos.zoom + cameraPos.y;
      draggedNode.x = mouseWorldX;
      draggedNode.y = mouseWorldY;
      draggedNode.vx = 0;
      draggedNode.vy = 0;
    }
  });

  window.addEventListener('mouseup', () => {
    draggedNode = null;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
