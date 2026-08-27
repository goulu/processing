let tspLines, tourLines;
let x, y, j;
let side = 500;
let ox = -1;
let oy = -1;
let index = 1;

function preload() {
  tspLines = loadStrings('mona-lisa100K.tsp');
  tourLines = loadStrings('monalisa_5757191.tour');
}

function setup() {
  let canvas = createCanvas(side, side);
  let container = document.getElementById('sketch-container');
  if (container) {
    canvas.parent(container);
  }

  background(255);
  stroke(0);

  x = new Int32Array(tspLines.length - 7);
  y = new Int32Array(tspLines.length - 7);
  let center = 0;
  let i = 0;
  for (let l = 6; l < tspLines.length; l++) {
    let pieces = tspLines[l].trim().split(/\s+/);
    if (pieces.length === 3) {
      x[i] = parseInt(pieces[1], 10);
      y[i] = parseInt(pieces[2], 10);
      if (Math.abs(x[i] - 10000) < 50 && Math.abs(y[i] - 10000) < 50) {
        center = i;
      }
      i += 1;
    }
  }

  j = new Int32Array(tourLines.length - 5);
  i = 0;
  index = 1;
  for (let l = 5; l < tourLines.length - 1; l++) {
    let lineStr = tourLines[l].trim();
    if (!lineStr || lineStr === 'EOF' || lineStr === '-1') break;
    j[i] = parseInt(lineStr, 10) - 1;
    if (j[i] === center) {
      index = i;
    }
    i += 1;
  }

  let startIdx = index > 0 ? index - 1 : 0;
  ox = Math.floor((x[j[startIdx]] * side) / 20000);
  oy = Math.floor(side - (y[j[startIdx]] * side) / 20000);
}

function draw() {
  if (!x || !j || x.length === 0) return;

  for (let i = 0; i < 200; i++) {
    let nx = Math.floor((x[j[index]] * side) / 20000);
    let ny = Math.floor(side - (y[j[index]] * side) / 20000);
    line(ox, oy, nx, ny);
    ox = nx;
    oy = ny;
    index = (index + 1) % x.length;
  }
}
