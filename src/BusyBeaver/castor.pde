/*
 * Busy Beaver (Castor Affairé) - Machine de Turing
 * Par Philippe Guglielmetti (Dr. Goulu)
 * 
 * Simulation des champions du Castor Affairé (Busy Beaver BB(2), BB(3), BB(4), BB(5))
 * avec visualisation spatio-temporelle du ruban.
 */

int tapeSize = 1000;
int[] tape;
int headPos;
char state = 'A';
int steps = 0;
int onesCount = 0;
int currentBB = 4; // 2, 3, 4, 5
boolean halted = false;

int stepsPerFrame = 5;
int row = 0;

void setup() {
  size(800, 600);
  background(15, 23, 42);
  resetMachine(currentBB);
}

void resetMachine(int bb) {
  currentBB = bb;
  tape = new int[tapeSize];
  headPos = tapeSize / 2;
  state = 'A';
  steps = 0;
  onesCount = 0;
  halted = false;
  row = 0;
  background(15, 23, 42);
}

// Transition table: returns [writeVal, moveDir (-1 or 1), nextState]
int[] stepTuring() {
  if (halted) return null;
  int symbol = tape[headPos];
  int writeVal = 0;
  int move = 0;
  char nextState = 'H';

  if (currentBB == 2) {
    // BB(2): 6 steps, 4 ones
    if (state == 'A') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else             { writeVal = 1; move = -1; nextState = 'B'; }
    } else if (state == 'B') {
      if (symbol == 0) { writeVal = 1; move = -1; nextState = 'A'; }
      else             { writeVal = 1; move = 1; nextState = 'H'; }
    }
  } else if (currentBB == 3) {
    // BB(3): 21 steps, 6 ones
    if (state == 'A') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else             { writeVal = 1; move = 1; nextState = 'H'; }
    } else if (state == 'B') {
      if (symbol == 0) { writeVal = 0; move = 1; nextState = 'C'; }
      else             { writeVal = 1; move = 1; nextState = 'B'; }
    } else if (state == 'C') {
      if (symbol == 0) { writeVal = 1; move = -1; nextState = 'C'; }
      else             { writeVal = 1; move = -1; nextState = 'A'; }
    }
  } else if (currentBB == 4) {
    // BB(4): 107 steps, 13 ones
    if (state == 'A') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else             { writeVal = 1; move = -1; nextState = 'B'; }
    } else if (state == 'B') {
      if (symbol == 0) { writeVal = 1; move = -1; nextState = 'A'; }
      else             { writeVal = 0; move = -1; nextState = 'C'; }
    } else if (state == 'C') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'H'; }
      else             { writeVal = 1; move = -1; nextState = 'D'; }
    } else if (state == 'D') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'D'; }
      else             { writeVal = 0; move = 1; nextState = 'A'; }
    }
  } else if (currentBB == 5) {
    // BB(5) Champion: 47,176,870 steps, 4098 ones
    if (state == 'A') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'B'; }
      else             { writeVal = 1; move = -1; nextState = 'C'; }
    } else if (state == 'B') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'C'; }
      else             { writeVal = 1; move = 1; nextState = 'B'; }
    } else if (state == 'C') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'D'; }
      else             { writeVal = 0; move = -1; nextState = 'E'; }
    } else if (state == 'D') {
      if (symbol == 0) { writeVal = 1; move = -1; nextState = 'A'; }
      else             { writeVal = 1; move = -1; nextState = 'D'; }
    } else if (state == 'E') {
      if (symbol == 0) { writeVal = 1; move = 1; nextState = 'H'; }
      else             { writeVal = 0; move = -1; nextState = 'A'; }
    }
  }

  // Apply action
  if (tape[headPos] == 0 && writeVal == 1) onesCount++;
  if (tape[headPos] == 1 && writeVal == 0) onesCount--;
  tape[headPos] = writeVal;

  headPos += move;
  if (headPos < 0) headPos = 0;
  if (headPos >= tapeSize) headPos = tapeSize - 1;

  state = nextState;
  steps++;
  if (state == 'H') halted = true;

  return new int[]{writeVal, move, (int)nextState};
}

void draw() {
  if (!halted) {
    for (int s = 0; s < stepsPerFrame; s++) {
      if (halted) break;

      // Draw space-time row
      float cellW = (float)width / tapeSize;
      int startIdx = max(0, headPos - 150);
      int endIdx = min(tapeSize, headPos + 150);

      for (int i = startIdx; i < endIdx; i++) {
        if (tape[i] == 1) {
          stroke(56, 189, 248);
          point(width/2 + (i - tapeSize/2)*3, row % (height - 80) + 70);
        }
      }

      // Draw head position
      stroke(239, 68, 68);
      point(width/2 + (headPos - tapeSize/2)*3, row % (height - 80) + 70);

      stepTuring();
      row++;
    }
  }

  // Top Status Bar
  fill(15, 23, 42);
  noStroke();
  rect(0, 0, width, 60);

  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text("Castor Affairé BB(" + currentBB + ") | État: " + state + " | Pas: " + steps + " | Uns (Σ): " + onesCount + (halted ? " [ARRÊT]" : " [EN COURS]"), 20, 20);
  text("Touches: '2', '3', '4', '5' pour changer de BB | 'R' pour réinitialiser", 20, 42);
}

void keyPressed() {
  if (key == '2') resetMachine(2);
  else if (key == '3') resetMachine(3);
  else if (key == '4') resetMachine(4);
  else if (key == '5') resetMachine(5);
  else if (key == 'r' || key == 'R') resetMachine(currentBB);
}
