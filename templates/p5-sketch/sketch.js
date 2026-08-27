/**
 * {{TITLE}}
 * Created with p5.js
 */

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('sketch-container');
  background(18, 18, 24);
}

function draw() {
  background(18, 18, 24, 25);

  translate(width / 2, height / 2);

  const t = frameCount * 0.02;
  const radius = min(width, height) * 0.25;

  stroke(100, 200, 255, 200);
  strokeWeight(2);
  noFill();

  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.1) {
    const r = radius + sin(a * 6 + t) * 30;
    const x = r * cos(a);
    const y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(18, 18, 24);
}
