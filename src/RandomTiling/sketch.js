/**
 * Random Tiling
 * By Philippe Guglielmetti, aka Dr. Goulu (2011)
 * https://openprocessing.org/@Goulu/40422
 * 
 * Inspired by Paul Bourke (http://paulbourke.net/texture_colour/randomtile/)
 * Ported to p5.js with modern features and full OpenProcessing compatibility.
 */

// Shape type constants
const SHAPE_CIRCLE = 0;
const SHAPE_STAR = 10; // 5-pointed regular star (10 alternating vertices)
const SHAPE_TRIANGLE = 3;
const SHAPE_SQUARE = 4;
const SHAPE_PENTAGON = 5;
const SHAPE_HEXAGON = 6;

let c = 1.1; // Power-law exponent
let n = SHAPE_CIRCLE; // Active shape type
let polys = [];
let maxArea = 0;
let currentIndex = 1;
let isPaused = false;
let triesPerFrame = 5000;
let shapesPlaced = 0;

function g(i) {
  return Math.pow(i, -c);
}

function riemannZeta() {
  let s = 0;
  for (let i = 1; g(i) > 1e-6; i++) {
    s += g(i);
  }
  return s;
}

function angle2D(x1, y1, x2, y2) {
  let dtheta = Math.atan2(y2, x2) - Math.atan2(y1, x1);
  while (dtheta > Math.PI) dtheta -= 2 * Math.PI;
  while (dtheta < -Math.PI) dtheta += 2 * Math.PI;
  return dtheta;
}

function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  const eps = 1e-9;
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (Math.abs(numera) < eps && Math.abs(numerb) < eps && Math.abs(denom) < eps) {
    return true;
  }
  if (Math.abs(denom) < eps) {
    return false;
  }

  const mua = numera / denom;
  const mub = numerb / denom;
  if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
    return false;
  }
  return true;
}

class Poly {
  constructor(pts, area) {
    this.pts = pts; // 0 for circle, 10 for star, 3..n for regular polygon
    this.area = area;
    this.cx = 0;
    this.cy = 0;
    this.phi = 0;

    if (pts < 3) {
      // Circle
      this.cr = Math.sqrt(area / Math.PI);
    } else if (pts === 10) {
      // Pentagram (5-pointed star)
      let t = 2 * Math.sin(Math.PI / 5);
      t = (5 * t * t / 4) * (Math.tan((3 * Math.PI) / 10) - Math.tan(Math.PI / 5));
      this.cr = Math.sqrt(area / t);
    } else {
      // Regular n-gon
      this.cr = Math.sqrt((2 * area) / (pts * Math.sin((2 * Math.PI) / pts)));
    }
  }

  randomize(pmin, pmax) {
    this.cx = random(this.cr, width - this.cr);
    this.cy = random(this.cr, height - this.cr);
    this.phi = random(pmin, pmax);
  }

  x(i) {
    let r = this.cr;
    if (this.pts === 10 && i % 2 === 1) {
      r /= 2.5; // Inner radius for 5-pointed star
    }
    return this.cx + r * Math.cos(this.phi + (i * 2 * Math.PI) / this.pts);
  }

  y(i) {
    let r = this.cr;
    if (this.pts === 10 && i % 2 === 1) {
      r /= 2.5;
    }
    return this.cy + r * Math.sin(this.phi + (i * 2 * Math.PI) / this.pts);
  }

  draw() {
    if (this.pts < 3) {
      ellipse(this.cx, this.cy, 2 * this.cr, 2 * this.cr);
    } else {
      beginShape();
      for (let i = 0; i < this.pts; i++) {
        vertex(this.x(i), this.y(i));
      }
      endShape(CLOSE);
    }
  }

  contains(x, y) {
    const d2 = (x - this.cx) ** 2 + (y - this.cy) ** 2;
    if (d2 > this.cr ** 2) return false;
    if (this.pts < 3) return true;

    let angle = 0;
    for (let i = 0; i < this.pts; i++) {
      angle += angle2D(
        this.x(i) - x,
        this.y(i) - y,
        this.x((i + 1) % this.pts) - x,
        this.y((i + 1) % this.pts) - y
      );
    }
    return Math.abs(angle) >= Math.PI;
  }

  intersects(p) {
    const d = Math.sqrt((p.cx - this.cx) ** 2 + (p.cy - this.cy) ** 2);
    if (d > p.cr + this.cr) return false;

    // Check if points of p are inside this shape
    for (let i = 0; i < p.pts; i++) {
      if (this.contains(p.x(i), p.y(i))) return true;
    }
    if (this.pts < 3) return true;

    // Check if points of this shape are inside p
    for (let i = 0; i < this.pts; i++) {
      if (p.contains(this.x(i), this.y(i))) return true;
    }

    // Check edge intersections
    for (let i = 0; i < this.pts; i++) {
      for (let j = 0; j < p.pts; j++) {
        if (
          lineIntersect(
            this.x(i),
            this.y(i),
            this.x((i + 1) % this.pts),
            this.y((i + 1) % this.pts),
            p.x(j),
            p.y(j),
            p.x((j + 1) % p.pts),
            p.y((j + 1) % p.pts)
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }
}

function checkIntersection(p) {
  for (let i = 0; i < polys.length; i++) {
    if (polys[i].contains(p.cx, p.cy)) return true;
  }
  for (let i = 0; i < polys.length; i++) {
    if (p.intersects(polys[i])) return true;
  }
  return false;
}

function resetSketch() {
  background(5, 8, 20);
  polys = [];
  maxArea = (width * height) / riemannZeta();
  currentIndex = 1;
  shapesPlaced = 0;
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  // Safely attach to parent element only if it exists (for local HTML and OpenProcessing)
  const container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }

  noStroke();
  resetSketch();
}

function draw() {
  if (isPaused) return;

  // Place multiple smaller shapes per frame as size decreases
  const shapesThisFrame = currentIndex < 20 ? 1 : Math.min(10, Math.floor(currentIndex / 15) + 1);

  for (let s = 0; s < shapesThisFrame; s++) {
    const shapeArea = maxArea * g(currentIndex);
    if (shapeArea < 1) break;

    const p = new Poly(n, shapeArea);
    let placed = false;

    for (let trial = 0; trial < triesPerFrame; trial++) {
      p.randomize(0, Math.PI);
      if (!checkIntersection(p)) {
        colorMode(HSB, 100);
        fill((currentIndex * 1.5) % 100, 85, 95);
        p.draw();
        polys.push(p);
        shapesPlaced++;
        placed = true;
        break;
      }
    }

    currentIndex++;
    if (!placed && currentIndex > 1000) {
      // Don't waste too much time if density is very high
      break;
    }
  }
}

function keyPressed() {
  if (key === '0') { n = SHAPE_CIRCLE; resetSketch(); }
  else if (key === '1') { n = SHAPE_STAR; resetSketch(); }
  else if (key === '3') { n = SHAPE_TRIANGLE; resetSketch(); }
  else if (key === '4') { n = SHAPE_SQUARE; resetSketch(); }
  else if (key === '5') { n = SHAPE_PENTAGON; resetSketch(); }
  else if (key === '6') { n = SHAPE_HEXAGON; resetSketch(); }
  else if (key === ' ') { isPaused = !isPaused; }
  else if (key === 'r' || key === 'R') { resetSketch(); }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetSketch();
}
