/*
 * Random Tiling
 * By Philippe Guglielmetti, aka Dr. Goulu (2011)
 * https://openprocessing.org/@Goulu/40422
 * https://drgoulu.com/2011/10/03/pavages-aleatoires/
 * 
 * Inspired by Paul Bourke (http://paulbourke.net/texture_colour/randomtile/)
 * 
 * Updated for modern Processing (3.x / 4.x) & OpenProcessing
 */

float c = 1.1;
int n = 0; // 0=circles, 10=stars, 3=triangles, 4=squares, 5=pentagons, 6=hexagons
float totalArea;
int currentIndex = 1;
int maxTrials = 5000;
ArrayList<Poly> polys;

float g(int idx) {
  return pow(idx, -c);
}

float riemannZeta() {
  float s = 0;
  for (int idx = 1; g(idx) > 1E-6; idx++) {
    s += g(idx);
  }
  return s;
}

float angle2D(float x1, float y1, float x2, float y2) {
  float dtheta = atan2(y2, x2) - atan2(y1, x1);
  while (dtheta > PI) dtheta -= 2 * PI;
  while (dtheta < -PI) dtheta += 2 * PI;
  return dtheta;
}

boolean lineIntersect(float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4) {
  float eps = 1e-9;
  float denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  float numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  float numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (abs(numera) < eps && abs(numerb) < eps && abs(denom) < eps) {
    return true; // Coincident lines
  }
  if (abs(denom) < eps) {
    return false; // Parallel lines
  }

  float mua = numera / denom;
  float mub = numerb / denom;
  if (mua < 0 || mua > 1 || mub < 0 || mub > 1) {
    return false;
  }
  return true; // Segment intersection
}

class Poly {
  int pts; // Number of vertices (0 or <3 = circle, 10 = 5-pointed star)
  float area, phi;
  float cx, cy;
  float cr; // Circumscribed circle radius

  Poly(int nPoints, float a) {
    area = a;
    pts = nPoints;
    if (pts < 3) {
      cr = sqrt(area / PI);
    } else if (pts == 10) {
      // Regular pentagram / 5-pointed star
      float t = 2 * sin(PI / 5.0);
      t = (5 * t * t / 4.0) * (tan(3 * PI / 10.0) - tan(PI / 5.0));
      cr = sqrt(area / t);
    } else {
      // Regular n-gon
      cr = sqrt(2 * area / (pts * sin(2 * PI / pts)));
    }
  }

  void randomize(float pmin, float pmax) {
    cx = random(cr, width - cr);
    cy = random(cr, height - cr);
    phi = random(pmin, pmax);
  }

  float getX(int ptIndex) {
    float r = cr;
    if (pts == 10 && ptIndex % 2 == 1) {
      r = r / 2.5; // Inner radius for star
    }
    return cx + r * cos(phi + ptIndex * 2 * PI / pts);
  }

  float getY(int ptIndex) {
    float r = cr;
    if (pts == 10 && ptIndex % 2 == 1) {
      r = r / 2.5;
    }
    return cy + r * sin(phi + ptIndex * 2 * PI / pts);
  }

  void drawShape() {
    if (pts < 3) {
      ellipse(cx, cy, 2 * cr, 2 * cr);
    } else {
      beginShape();
      for (int k = 0; k < pts; k++) {
        vertex(getX(k), getY(k));
      }
      endShape(CLOSE);
    }
  }

  boolean contains(float x, float y) {
    float d2 = sq(x - cx) + sq(y - cy);
    if (d2 > sq(cr)) return false;
    if (pts < 3) return true; // Inside bounding circle for circle poly

    float angle = 0;
    for (int k = 0; k < pts; k++) {
      angle += angle2D(
        getX(k) - x,
        getY(k) - y,
        getX((k + 1) % pts) - x,
        getY((k + 1) % pts) - y
      );
    }
    return abs(angle) >= PI;
  }

  boolean intersects(Poly other) {
    float d = dist(this.cx, this.cy, other.cx, other.cy);
    if (d > this.cr + other.cr) return false;

    // Check if any vertex of 'other' is inside 'this'
    for (int k = 0; k < other.pts; k++) {
      if (this.contains(other.getX(k), other.getY(k))) return true;
    }
    if (pts < 3) return true;

    // Check if any vertex of 'this' is inside 'other'
    for (int k = 0; k < pts; k++) {
      if (other.contains(this.getX(k), this.getY(k))) return true;
    }

    // Check if any edges intersect
    for (int k = 0; k < pts; k++) {
      for (int j = 0; j < other.pts; j++) {
        if (lineIntersect(
          this.getX(k), this.getY(k),
          this.getX((k + 1) % pts), this.getY((k + 1) % pts),
          other.getX(j), other.getY(j),
          other.getX((j + 1) % other.pts), other.getY((j + 1) % other.pts)
        )) {
          return true;
        }
      }
    }
    return false;
  }
}

boolean checkCollision(Poly p) {
  for (Poly existing : polys) {
    if (existing.contains(p.cx, p.cy)) return true;
  }
  for (Poly existing : polys) {
    if (p.intersects(existing)) return true;
  }
  return false;
}

void restart() {
  background(0, 0, 40); // Dark navy background
  polys = new ArrayList<Poly>();
  totalArea = (width * height) / riemannZeta();
  currentIndex = 1;
}

void setup() {
  size(800, 600);
  smooth();
  noStroke();
  restart();
}

void draw() {
  // Adaptive placement count: place more small shapes per frame
  int shapesThisFrame = (currentIndex < 25) ? 1 : min(12, (currentIndex / 20) + 1);

  for (int s = 0; s < shapesThisFrame; s++) {
    float shapeArea = totalArea * g(currentIndex);
    if (shapeArea < 1.0) {
      noLoop(); // Reached sub-pixel resolution
      break;
    }

    Poly p = new Poly(n, shapeArea);
    boolean placed = false;

    for (int trial = 0; trial < maxTrials; trial++) {
      p.randomize(0, PI);
      if (!checkCollision(p)) {
        colorMode(HSB, 100);
        fill((currentIndex * 1.6) % 100, 85, 95);
        p.drawShape();
        polys.add(p);
        placed = true;
        break;
      }
    }

    currentIndex++;
    if (!placed && currentIndex > 1200) {
      // Space is very dense, continue smoothly
      break;
    }
  }
}

void keyPressed() {
  if (key == '0') { n = 0; restart(); loop(); }       // Circles
  else if (key == '1') { n = 10; restart(); loop(); }  // Stars
  else if (key == '3') { n = 3; restart(); loop(); }   // Triangles
  else if (key == '4') { n = 4; restart(); loop(); }   // Squares
  else if (key == '5') { n = 5; restart(); loop(); }   // Pentagons
  else if (key == '6') { n = 6; restart(); loop(); }   // Hexagons
  else if (key == ' ' || key == 'r' || key == 'R') {
    restart();
    loop();
  }
}