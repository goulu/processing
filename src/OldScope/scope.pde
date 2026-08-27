/*
 * OldScope - Vintage CRT Oscilloscope Simulator
 * By Philippe Guglielmetti (Dr. Goulu)
 * 
 * Simulates an analog cathode-ray tube (CRT) oscilloscope with Lissajous figures,
 * time-sweep waveforms, and phosphor persistence.
 */

float fx = 3.0;
float fy = 2.0;
float phase = 0.0;
float phaseSpeed = 0.02;
int mode = 0; // 0=Lissajous X-Y, 1=Sine Y-T, 2=Dual Waveform
int phosphorColor = 0; // 0=Green, 1=Amber, 2=Cyan

void setup() {
  size(700, 700);
  background(10, 15, 10);
  smooth();
}

void drawGrid() {
  stroke(20, 45, 25, 100);
  strokeWeight(1);

  // Subdivisions
  int div = 10;
  float step = width / (float)div;
  for (int i = 0; i <= div; i++) {
    line(i * step, 0, i * step, height);
    line(0, i * step, width, i * step);
  }

  // Central Reticle axes
  stroke(35, 75, 40, 180);
  strokeWeight(1.5);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);

  // Tick marks
  for (float p = 0; p < width; p += step / 5.0) {
    line(p, height / 2 - 3, p, height / 2 + 3);
    line(width / 2 - 3, p, width / 2 + 3, p);
  }
}

void draw() {
  // Phosphor persistence / afterglow decay
  fill(5, 10, 8, 40);
  noStroke();
  rect(0, 0, width, height);

  drawGrid();

  // Set beam color
  if (phosphorColor == 0) {
    stroke(74, 222, 128, 220); // P1 Green phosphor
  } else if (phosphorColor == 1) {
    stroke(251, 191, 36, 220); // Amber phosphor
  } else {
    stroke(56, 189, 248, 220); // Cyan phosphor
  }

  strokeWeight(2);
  noFill();

  float cx = width / 2.0;
  float cy = height / 2.0;
  float r = width * 0.38;

  if (mode == 0) {
    // Lissajous X-Y mode
    beginShape();
    int samples = 800;
    for (int i = 0; i < samples; i++) {
      float t = map(i, 0, samples, 0, TWO_PI);
      float x = cx + r * sin(fx * t + phase);
      float y = cy + r * sin(fy * t);
      vertex(x, y);
    }
    endShape(CLOSE);
  } else if (mode == 1) {
    // Time sweep Y-T mode
    beginShape();
    for (int x = 0; x < width; x += 2) {
      float t = map(x, 0, width, 0, TWO_PI * 4);
      float y = cy + (r * 0.7) * sin(fx * t + phase);
      vertex(x, y);
    }
    endShape();
  } else if (mode == 2) {
    // AM/FM modulated wave
    beginShape();
    for (int x = 0; x < width; x += 2) {
      float t = map(x, 0, width, 0, TWO_PI * 6);
      float carrier = sin(fx * 3 * t + phase);
      float modulator = (1.0 + 0.5 * sin(fy * t));
      float y = cy + (r * 0.6) * carrier * modulator;
      vertex(x, y);
    }
    endShape();
  }

  phase += phaseSpeed;

  // Header stats
  fill(74, 222, 128, 200);
  textSize(13);
  textAlign(LEFT, TOP);
  text("OldScope | Fx: " + nf(fx, 1, 1) + " | Fy: " + nf(fy, 1, 1) + " | Mode: " + (mode == 0 ? "X-Y Lissajous" : (mode == 1 ? "Y-T Wave" : "Modulation")), 20, 20);
}

void keyPressed() {
  if (key == '1') fx = max(1, fx - 0.5);
  else if (key == '2') fx += 0.5;
  else if (key == '3') fy = max(1, fy - 0.5);
  else if (key == '4') fy += 0.5;
  else if (key == 'm' || key == 'M') mode = (mode + 1) % 3;
  else if (key == 'c' || key == 'C') phosphorColor = (phosphorColor + 1) % 3;
  else if (key == ' ') phaseSpeed = (phaseSpeed == 0 ? 0.02 : 0);
}
