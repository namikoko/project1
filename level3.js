// ============================================================
// YOU ARE BEING OPTIMIZED — LEVEL 3: ATTENTION MANAGEMENT
// ============================================================

let state = "TITLE";
let stateTimer = 0;
let globalFrame = 0;

// --- TITLE ---
let titleLetters = [];
let titleFadeIn = 0;

// --- CROSSWORD ---
const GRID_SIZE = 5;
const SOLUTION = [
  ["M","O","P","",""],
  ["C","H","E","F","S"],
  ["A","I","S","L","E"],
  ["T","O","T","A","L"],
  ["","","O","W","L"],
];
const BLACKS = [
  [false,false,false,true,true],
  [false,false,false,false,false],
  [false,false,false,false,false],
  [false,false,false,false,false],
  [true,true,false,false,false],
];
const CELL_NUMS = [
  [1, 2, 3, 0, 0],
  [4, 0, 0, 5, 6],
  [7, 0, 0, 0, 0],
  [8, 0, 0, 0, 0],
  [0, 0, 9, 0, 0],
];
const CLUES_ACROSS = [
  { num: 1, clue: "Floor-washing tool" },
  { num: 4, clue: "Food Network personalities" },
  { num: 7, clue: "Airplane seating choice" },
  { num: 8, clue: "Bottom figure on a receipt" },
  { num: 9, clue: 'Who goes "Whoo ... whoo ..."' },
];
const CLUES_DOWN = [
  { num: 1, clue: "Exam for a future doctor: Abbr." },
  { num: 2, clue: "Neighbor of Pennsylvania" },
  { num: 3, clue: "Green pasta sauce" },
  { num: 5, clue: "Deficiency" },
  { num: 6, clue: "Put on the market" },
];

let userGrid = [];
let selectedCell = { r: 0, c: 0 };
let direction = "ACROSS";
let cellSize;
let gridOffsetX, gridOffsetY;

// --- TIMER ---
let puzzleStartTime = 0;
let timeLimit = 120000; // 2 minutes
let timerDone = false;

// --- END STATE ---
let resultState = ""; // "WIN" or "LOSE"
let resultTimer = 0;
let resultShown = false;

// --- AD BREAKS ---
let adActive = false;
let adTimer = 0;
let adDuration = 0;
let adCount = 0;
// Fixed schedule: every 30s → at 30s, 60s, 90s, 120s
let adSchedule = [30000, 60000, 90000, 120000];
let adTriggered = [false, false, false, false];
let adSlots = [];
let scatterLetters = [];
let spiderLegs = [];

// --- ATTENTION POPUPS ---
let attentionPopups = [];
let popupTimer = 0;
const ATTENTION_MSGS = [
  "ATTENTION DEVIATION DETECTED",
  "FOCUS VARIANCE REGISTERED",
  "USER ENGAGEMENT: 37%",
  "COGNITIVE LOAD INCREASING",
  "DISTRACTION TOLERANCE: LOW",
  "ATTENTION SPAN BELOW AVERAGE",
  "FOCUS RECALIBRATION REQUIRED",
  "IDLE STATE APPROACHING",
  "ENGAGEMENT DECLINING",
  "OPTIMIZATION WINDOW CLOSING",
  "RESPONSE PATTERN IRREGULAR",
  "SUSTAINED ATTENTION: UNLIKELY",
];

// Realistic ad content — rendered in RED on BLACK
const AD_TEMPLATES = [
  { head: "You're Losing Focus", sub: "Premium Focus supplements — clinically tested", btn: "SHOP NOW" },
  { head: "Your Attention Is Worth $3.42/hr", sub: "See what brands pay for your eyeballs", btn: "LEARN MORE" },
  { head: "⚡ Limited Time Offer", sub: "Upgrade your cognitive performance today", btn: "CLAIM DEAL" },
  { head: "People Like You Also Bought", sub: "Noise-cancelling headphones — 40% off", btn: "VIEW DEALS" },
  { head: "Your Profile Suggests...", sub: "You may benefit from our attention training", btn: "START FREE TRIAL" },
  { head: "Don't Scroll Past This", sub: "97% of users who saw this ad clicked", btn: "JOIN THEM" },
  { head: "Optimized Just For You", sub: "Based on your browsing behavior", btn: "SEE MORE →" },
  { head: "Still Here?", sub: "Your session data has been recorded", btn: "ACCEPT & CONTINUE" },
];

// ============================================================
// SETUP
// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Schibsted Grotesk");
  stateTimer = millis();
  noCursor();

  for (let r = 0; r < GRID_SIZE; r++) {
    userGrid[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      userGrid[r][c] = "";
    }
  }

  buildTitleLetters();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (state === "TITLE") buildTitleLetters();
}

// ============================================================
// TITLE
// ============================================================
function buildTitleLetters() {
  titleLetters = [];
  let word = "ATTENTION";
  let letterSize = max(13, min(width, height) * 0.024);
  let colSpacing = letterSize * 1.8;
  let rowSpacing = letterSize * 2.2;
  let cols = floor(width / colSpacing);
  let rows = floor(height / rowSpacing);
  let startX = (width - (cols - 1) * colSpacing) / 2;
  let startY = (height - (rows - 1) * rowSpacing) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let idx = (c + r * 2) % word.length;
      let homeX = startX + c * colSpacing;
      let homeY = startY + r * rowSpacing;
      titleLetters.push({
        char: word.charAt(idx),
        homeX, homeY,
        x: homeX + random(-300, 300),
        y: homeY + random(-300, 300),
        vx: random(-1, 1), vy: random(-1, 1),
        size: letterSize, col: c, row: r,
        drift: random(0.3, 1.2), driftPhase: random(TWO_PI),
      });
    }
  }
}

function drawTitleScreen() {
  background(255);
  titleFadeIn = min(titleFadeIn + 0.012, 1);
  let waveOff = globalFrame * 0.015;
  textAlign(CENTER, CENTER); noStroke();

  for (let l of titleLetters) {
    let dX = sin(globalFrame * 0.008 + l.driftPhase) * l.drift * 2;
    let dY = cos(globalFrame * 0.006 + l.driftPhase * 1.3) * l.drift * 1.5;
    l.vx += ((l.homeX + dX) - l.x) * 0.006;
    l.vy += ((l.homeY + dY) - l.y) * 0.006;
    let mx = l.x - mouseX, my = l.y - mouseY;
    let md = sqrt(mx * mx + my * my);
    if (md < 180 && md > 0) {
      let f = map(md, 0, 180, 10, 0);
      l.vx += (mx / md) * f; l.vy += (my / md) * f;
    }
    l.vx *= 0.87; l.vy *= 0.87;
    l.x += l.vx; l.y += l.vy;

    let wave = sin(waveOff + (l.col + l.row) * 0.3);
    let base = map(wave, -1, 1, 0.02, 0.8);
    let cd = sqrt(pow(l.homeX - width / 2, 2) + pow(l.homeY - height / 2, 2));
    let maxD = sqrt(width * width + height * height) / 2;
    let cf = constrain(map(cd, 0, maxD, 1.1, 0.15), 0, 1);
    fill(0, constrain(base * cf, 0.02, 1) * titleFadeIn * 255);
    textSize(l.size);
    text(l.char, l.x, l.y);
  }

  let el = millis() - stateTimer;
  if (el > 1000) {
    let a = min((el - 1000) / 1200, 1) * 0.35 * map(sin(globalFrame * 0.035), -1, 1, 0.6, 1);
    fill(0, a * 255);
    textSize(max(11, min(width, height) * 0.013));
    textAlign(CENTER, CENTER);
    text("click to begin", width / 2, height / 2);
  }
}

// ============================================================
// CROSSWORD
// ============================================================
function calcGridLayout() {
  cellSize = min(width * 0.08, height * 0.1, 70);
  let gridW = GRID_SIZE * cellSize;
  let gridH = GRID_SIZE * cellSize;
  gridOffsetX = (width - gridW) / 2;
  gridOffsetY = (height - gridH) / 2 - 20;
}

function drawCrossword() {
  calcGridLayout();

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      let x = gridOffsetX + c * cellSize;
      let y = gridOffsetY + r * cellSize;

      if (BLACKS[r][c]) {
        fill(0); noStroke();
        rect(x, y, cellSize, cellSize);
        continue;
      }

      let isSelected = (r === selectedCell.r && c === selectedCell.c);
      let isInWord = isInSelectedWord(r, c);

      if (isSelected) {
        fill(180, 200, 230); noStroke();
      } else if (isInWord) {
        fill(220, 230, 240); noStroke();
      } else {
        fill(255); noStroke();
      }
      rect(x, y, cellSize, cellSize);

      noFill(); stroke(0); strokeWeight(1);
      rect(x, y, cellSize, cellSize);

      if (CELL_NUMS[r][c] > 0) {
        noStroke();
        fill(80);
        textAlign(LEFT, TOP);
        textSize(cellSize * 0.22);
        textFont("Schibsted Grotesk");
        text(CELL_NUMS[r][c], x + 3, y + 2);
      }

      if (userGrid[r][c]) {
        noStroke();
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(cellSize * 0.55);
        textStyle(BOLD);
        textFont("Schibsted Grotesk");
        text(userGrid[r][c], x + cellSize / 2, y + cellSize / 2 + 2);
        textStyle(NORMAL);
      }
    }
  }

  drawClues();
  drawTimer();
}

function isInSelectedWord(r, c) {
  if (BLACKS[r][c]) return false;
  if (direction === "ACROSS") {
    if (r !== selectedCell.r) return false;
    let startC = selectedCell.c;
    while (startC > 0 && !BLACKS[r][startC - 1]) startC--;
    let endC = selectedCell.c;
    while (endC < GRID_SIZE - 1 && !BLACKS[r][endC + 1]) endC++;
    return c >= startC && c <= endC;
  } else {
    if (c !== selectedCell.c) return false;
    let startR = selectedCell.r;
    while (startR > 0 && !BLACKS[startR - 1][c]) startR--;
    let endR = selectedCell.r;
    while (endR < GRID_SIZE - 1 && !BLACKS[endR + 1][c]) endR++;
    return r >= startR && r <= endR;
  }
}

function drawClues() {
  let clueSize = max(10, min(width, height) * 0.014);
  textFont("Schibsted Grotesk");
  textAlign(LEFT, TOP);
  noStroke();

  let leftX = gridOffsetX - width * 0.22;
  let rightX = gridOffsetX + GRID_SIZE * cellSize + 30;
  let topY = gridOffsetY;
  if (leftX < 20) leftX = 20;

  fill(0, 180);
  textStyle(BOLD);
  textSize(clueSize * 0.85);
  text("ACROSS", leftX, topY);
  textStyle(NORMAL);
  textSize(clueSize * 0.8);
  let cy = topY + clueSize * 1.8;
  for (let cl of CLUES_ACROSS) {
    fill(0, 140);
    text(cl.num + "  " + cl.clue, leftX, cy);
    cy += clueSize * 1.6;
  }

  fill(0, 180);
  textStyle(BOLD);
  textSize(clueSize * 0.85);
  text("DOWN", rightX, topY);
  textStyle(NORMAL);
  textSize(clueSize * 0.8);
  cy = topY + clueSize * 1.8;
  for (let cl of CLUES_DOWN) {
    fill(0, 140);
    text(cl.num + "  " + cl.clue, rightX, cy);
    cy += clueSize * 1.6;
  }
}

function drawTimer() {
  let elapsed = millis() - puzzleStartTime;
  let remaining = max(0, timeLimit - elapsed);
  let mins = floor(remaining / 60000);
  let secs = floor((remaining % 60000) / 1000);
  let timeStr = nf(mins, 1) + ":" + nf(secs, 2);
  if (remaining <= 0) timerDone = true;

  textFont("Schibsted Grotesk");
  textAlign(CENTER, TOP);
  noStroke();
  let urgency = map(remaining, timeLimit, 0, 0, 1);
  let pulse = remaining < 15000 ? map(sin(globalFrame * 0.1), -1, 1, 0.5, 1) : 1;
  fill(0, (0.3 + urgency * 0.5) * pulse * 255);
  textSize(max(18, min(width, height) * 0.028));
  text(timeStr, width / 2, gridOffsetY - 45);
}

// ============================================================
// WIN / LOSE CHECK
// ============================================================
function checkGridFull() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (BLACKS[r][c]) continue;
      if (!userGrid[r][c]) return false;
    }
  }
  return true;
}

function checkWin() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (BLACKS[r][c]) continue;
      if (userGrid[r][c] !== SOLUTION[r][c]) return false;
    }
  }
  return true;
}

function triggerResult(won) {
  resultState = won ? "WIN" : "LOSE";
  resultTimer = millis();
  resultShown = true;
  state = "RESULT";
}

function drawResultScreen() {
  let elapsed = millis() - resultTimer;
  let fadeIn = constrain(elapsed / 1200, 0, 1);

  background(255);

  textFont("Schibsted Grotesk");
  textAlign(CENTER, CENTER);
  noStroke();

  // Main word — CORRECT or INCORRECT
  let alpha = fadeIn * 0.7;
  fill(0, alpha * 255);
  textSize(max(14, min(width, height) * 0.022));
  textStyle(NORMAL);

  if (resultState === "WIN") {
    text("correct", width / 2, height / 2);
  } else {
    text("incorrect", width / 2, height / 2);
  }

  // Redirect to level 4 after 4 seconds
  if (elapsed > 4000) {
    window.location.href = "level4.html";
  }
}

// ============================================================
// AD BREAKS — BLACK bg, RED realistic ads over crossword,
// scattered letters, smiley face, spider webs
// ============================================================
function startAdBreak() {
  adActive = true;
  adTimer = millis();
  adDuration = random(4000, 6000);
  adCount++;

  // Build realistic ad cards (2-4 ads)
  adSlots = [];
  let numAds = floor(random(2, 5));
  for (let i = 0; i < numAds; i++) {
    let tmpl = AD_TEMPLATES[(adCount * 3 + i) % AD_TEMPLATES.length];
    let aw, ah, ax, ay;
    let type = floor(random(3));
    if (type === 0) {
      aw = random(width * 0.4, width * 0.7);
      ah = random(90, 150);
    } else if (type === 1) {
      aw = random(200, 300);
      ah = random(250, 400);
    } else {
      aw = random(280, 400);
      ah = random(200, 320);
    }
    ax = random(30, width - aw - 30);
    ay = random(30, height - ah - 30);
    adSlots.push({
      x: ax, y: ay, w: aw, h: ah,
      head: tmpl.head, sub: tmpl.sub, btn: tmpl.btn,
      delay: i * random(200, 500),
      glitchOff: random(100),
    });
  }

  // Scatter letters — grab all letters from the crossword
  scatterLetters = [];
  calcGridLayout();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (BLACKS[r][c]) continue;
      let letter = userGrid[r][c] || SOLUTION[r][c];
      let homeX = gridOffsetX + c * cellSize + cellSize / 2;
      let homeY = gridOffsetY + r * cellSize + cellSize / 2;
      scatterLetters.push({
        char: letter,
        homeX: homeX, homeY: homeY,
        x: homeX, y: homeY,
        vx: random(-8, 8), vy: random(-8, 8),
        rot: 0, rotSpeed: random(-0.08, 0.08),
        size: cellSize * random(0.4, 0.9),
        alpha: random(100, 255),
      });
    }
  }

  // Build spider legs from center
  spiderLegs = [];
  let cx = width / 2, cy = height / 2;
  let numLegs = 8;
  for (let i = 0; i < numLegs; i++) {
    let angle = (TWO_PI / numLegs) * i + random(-0.2, 0.2);
    let len = random(min(width, height) * 0.25, min(width, height) * 0.5);
    let joints = [];
    let segs = floor(random(4, 8));
    for (let j = 0; j <= segs; j++) {
      let t = j / segs;
      let jx = cx + cos(angle) * len * t + random(-20, 20);
      let jy = cy + sin(angle) * len * t + random(-20, 20);
      joints.push({ x: jx, y: jy });
    }
    spiderLegs.push({ joints: joints, angle: angle });
  }
}

function drawAdBreak() {
  // BLACK background
  background(0);

  let adElapsed = millis() - adTimer;
  let fadeIn = constrain(adElapsed / 300, 0, 1);
  let fadeOut = adElapsed > adDuration - 500 ? constrain(map(adElapsed, adDuration - 500, adDuration, 1, 0), 0, 1) : 1;
  let masterAlpha = fadeIn * fadeOut;

  // === LAYER 1: Crossword ghost underneath in dark red ===
  push();
  calcGridLayout();
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      let x = gridOffsetX + c * cellSize;
      let y = gridOffsetY + r * cellSize;
      if (BLACKS[r][c]) {
        // skip blacks — they blend with bg
        continue;
      }
      noFill();
      stroke(255, 0, 0, masterAlpha * 30);
      strokeWeight(0.5);
      rect(x, y, cellSize, cellSize);

      // Show solution letters very faintly
      let letter = userGrid[r][c] || SOLUTION[r][c];
      if (letter) {
        noStroke();
        fill(255, 0, 0, masterAlpha * 25);
        textAlign(CENTER, CENTER);
        textSize(cellSize * 0.5);
        textFont("Schibsted Grotesk");
        text(letter, x + cellSize / 2, y + cellSize / 2);
      }
    }
  }
  pop();

  // === LAYER 2: Spider web from center ===
  push();
  let cx = width / 2, cy = height / 2;
  stroke(255, 0, 0, masterAlpha * 40);
  strokeWeight(0.8);
  noFill();

  // Radial lines
  for (let leg of spiderLegs) {
    beginShape();
    noFill();
    for (let j of leg.joints) {
      let wobX = j.x + sin(globalFrame * 0.02 + j.x * 0.01) * 3;
      let wobY = j.y + cos(globalFrame * 0.025 + j.y * 0.01) * 3;
      vertex(wobX, wobY);
    }
    endShape();
  }

  // Concentric web rings
  for (let ring = 1; ring <= 5; ring++) {
    let ringR = ring * min(width, height) * 0.07;
    stroke(255, 0, 0, masterAlpha * (50 - ring * 8));
    strokeWeight(0.5);
    beginShape();
    for (let a = 0; a <= TWO_PI + 0.1; a += TWO_PI / 30) {
      let wobble = sin(a * 5 + globalFrame * 0.03) * ringR * 0.08;
      let rx = cx + cos(a) * (ringR + wobble);
      let ry = cy + sin(a) * (ringR + wobble);
      vertex(rx, ry);
    }
    endShape(CLOSE);
  }
  pop();

  // === LAYER 3: Smiley face made of crossword cell outlines ===
  push();
  let faceR = min(width, height) * 0.2;
  let faceCX = width / 2;
  let faceCY = height / 2;
  noFill();
  stroke(255, 0, 0, masterAlpha * 60);
  strokeWeight(1);

  // Face outline — small squares arranged in circle
  let faceBoxSize = cellSize * 0.4;
  for (let a = 0; a < TWO_PI; a += 0.15) {
    let fx = faceCX + cos(a) * faceR;
    let fy = faceCY + sin(a) * faceR;
    rect(fx - faceBoxSize / 2, fy - faceBoxSize / 2, faceBoxSize, faceBoxSize);
  }

  // Left eye
  let eyeR = faceR * 0.15;
  let eyeLX = faceCX - faceR * 0.3;
  let eyeY = faceCY - faceR * 0.2;
  fill(255, 0, 0, masterAlpha * 80);
  noStroke();
  for (let a = 0; a < TWO_PI; a += 0.4) {
    let ex = eyeLX + cos(a) * eyeR;
    let ey = eyeY + sin(a) * eyeR;
    rect(ex - faceBoxSize / 3, ey - faceBoxSize / 3, faceBoxSize * 0.6, faceBoxSize * 0.6);
  }

  // Right eye
  let eyeRX = faceCX + faceR * 0.3;
  for (let a = 0; a < TWO_PI; a += 0.4) {
    let ex = eyeRX + cos(a) * eyeR;
    let ey = eyeY + sin(a) * eyeR;
    rect(ex - faceBoxSize / 3, ey - faceBoxSize / 3, faceBoxSize * 0.6, faceBoxSize * 0.6);
  }

  // Smile arc
  noFill();
  stroke(255, 0, 0, masterAlpha * 70);
  strokeWeight(1);
  let smileR = faceR * 0.55;
  beginShape();
  for (let a = 0.3; a < PI - 0.3; a += 0.1) {
    let sx = faceCX + cos(a) * smileR;
    let sy = faceCY + sin(a) * smileR * 0.7 + faceR * 0.1;
    vertex(sx, sy);
  }
  endShape();
  pop();

  // === LAYER 4: Scattered letters flying everywhere ===
  push();
  textFont("Schibsted Grotesk");
  textStyle(BOLD);
  for (let sl of scatterLetters) {
    // Physics — accelerate outward then slow
    sl.x += sl.vx;
    sl.y += sl.vy;
    sl.vx *= 0.995;
    sl.vy *= 0.995;
    sl.rot += sl.rotSpeed;

    // Wrap
    if (sl.x < -50) sl.x = width + 50;
    if (sl.x > width + 50) sl.x = -50;
    if (sl.y < -50) sl.y = height + 50;
    if (sl.y > height + 50) sl.y = -50;

    let flicker = sin(globalFrame * 0.15 + sl.homeX * 0.1) > -0.5 ? 1 : 0.2;
    noStroke();
    fill(255, 0, 0, masterAlpha * sl.alpha * flicker);
    textSize(sl.size);
    textAlign(CENTER, CENTER);

    push();
    translate(sl.x, sl.y);
    rotate(sl.rot);
    text(sl.char, 0, 0);
    pop();
  }
  textStyle(NORMAL);
  pop();

  // === LAYER 5: Realistic ad cards in RED ===
  for (let ad of adSlots) {
    let localElapsed = adElapsed - ad.delay;
    if (localElapsed < 0) continue;

    let localFade = constrain(localElapsed / 250, 0, 1) * masterAlpha;
    if (localFade <= 0) continue;

    let gx = sin(globalFrame * 0.025 + ad.glitchOff) * 3;
    let gy = cos(globalFrame * 0.02 + ad.glitchOff) * 2;

    // Random glitch jump
    if (random() < 0.03) {
      gx += random(-15, 15);
    }

    push();
    translate(ad.x + gx, ad.y + gy);

    // Card background — very dark red
    fill(20, 0, 0, localFade * 220);
    stroke(255, 0, 0, localFade * 120);
    strokeWeight(1);
    rect(0, 0, ad.w, ad.h);

    // Top accent bar
    noStroke();
    fill(255, 0, 0, localFade * 180);
    rect(0, 0, ad.w, 3);

    // "Ad" badge
    fill(60, 0, 0, localFade * 255);
    noStroke();
    rect(ad.w - 34, 6, 28, 16, 2);
    fill(255, 0, 0, localFade * 200);
    textAlign(CENTER, CENTER);
    textSize(8);
    textFont("Schibsted Grotesk");
    text("Ad", ad.w - 20, 13);

    // Close X
    fill(255, 0, 0, localFade * 120);
    textSize(14);
    textAlign(RIGHT, TOP);
    text("×", ad.w - 40, 4);

    // Headline
    fill(255, 0, 0, localFade * 255);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(min(17, ad.w * 0.055));
    textFont("Schibsted Grotesk");
    text(ad.head, 16, 24);
    textStyle(NORMAL);

    // Subtext
    fill(255, 60, 60, localFade * 180);
    textSize(min(11, ad.w * 0.04));
    text(ad.sub, 16, 48);

    // Image placeholder area
    if (ad.h > 160) {
      let imgY = 70;
      let imgH = ad.h - 140;
      noFill();
      stroke(255, 0, 0, localFade * 50);
      strokeWeight(0.5);
      rect(16, imgY, ad.w - 32, imgH);
      // Play triangle
      noStroke();
      fill(255, 0, 0, localFade * 60);
      let pcx = 16 + (ad.w - 32) / 2;
      let pcy = imgY + imgH / 2;
      triangle(pcx - 12, pcy - 15, pcx - 12, pcy + 15, pcx + 15, pcy);
    }

    // CTA Button
    let btnW = min(140, ad.w * 0.45);
    let btnH = 30;
    let btnX = 16;
    let btnY = ad.h - btnH - 14;
    fill(255, 0, 0, localFade * 220);
    noStroke();
    rect(btnX, btnY, btnW, btnH, 3);
    fill(0, localFade * 255);
    textAlign(CENTER, CENTER);
    textSize(9);
    textStyle(BOLD);
    textFont("Schibsted Grotesk");
    text(ad.btn, btnX + btnW / 2, btnY + btnH / 2);
    textStyle(NORMAL);

    // Stars for larger ads
    if (ad.h > 220 && ad.w > 280) {
      fill(255, 0, 0, localFade * 100);
      textAlign(LEFT, BOTTOM);
      textSize(10);
      text("★★★★☆  4.2  (1,847)", 16, ad.h - 8);
    }

    pop();
  }

  // === Scan lines over everything ===
  noStroke();
  for (let sy = 0; sy < height; sy += 4) {
    fill(0, masterAlpha * random(5, 20));
    rect(0, sy, width, 1);
  }

  // Occasional glitch bar
  if (random() < 0.1) {
    fill(255, 0, 0, masterAlpha * random(10, 40));
    noStroke();
    rect(0, random(height), width, random(2, 12));
  }

  // Skip counter
  let remaining = max(0, adDuration - adElapsed) / 1000;
  noStroke();
  fill(255, 0, 0, masterAlpha * 160);
  textAlign(RIGHT, BOTTOM);
  textSize(10);
  textFont("Schibsted Grotesk");
  text("SKIP IN " + ceil(remaining) + "s", width - 20, height - 15);

  // Ad break label
  fill(255, 0, 0, masterAlpha * 80);
  textAlign(LEFT, TOP);
  textSize(9);
  text("AD BREAK " + adCount + "/4", 15, 15);

  // End ad
  if (adElapsed >= adDuration) {
    adActive = false;
  }
}

// ============================================================
// ATTENTION POPUPS — RED with corner brackets
// ============================================================
function spawnAttentionPopup() {
  let msg = ATTENTION_MSGS[floor(random(ATTENTION_MSGS.length))];

  push();
  textFont("Schibsted Grotesk");
  textSize(12);
  let tw = textWidth(msg);
  pop();

  let pw = tw + 40;
  let ph = 38;

  let px, py;
  let side = floor(random(4));
  switch (side) {
    case 0: px = random(20, width * 0.2); py = random(20, height - ph - 20); break;
    case 1: px = random(width * 0.8, width - pw - 20); py = random(20, height - ph - 20); break;
    case 2: px = random(20, width - pw - 20); py = random(20, height * 0.15); break;
    case 3: px = random(20, width - pw - 20); py = random(height * 0.85, height - ph - 20); break;
  }
  px = constrain(px, 10, width - pw - 10);
  py = constrain(py, 10, height - ph - 10);

  attentionPopups.push({
    msg, x: px, y: py, w: pw, h: ph,
    life: 0, maxLife: random(100, 200),
    vx: random(-0.2, 0.2), vy: random(-0.1, 0.1),
  });
}

function updateAndDrawPopups() {
  if (millis() - popupTimer > random(4000, 8000)) {
    if (attentionPopups.length < 3) spawnAttentionPopup();
    popupTimer = millis();
  }

  for (let i = attentionPopups.length - 1; i >= 0; i--) {
    let p = attentionPopups[i];
    p.life++;
    p.x += p.vx;
    p.y += p.vy;

    let fadeIn = min(p.life / 15, 1);
    let fadeOut = p.life > p.maxLife - 30 ? map(p.life, p.maxLife - 30, p.maxLife, 1, 0) : 1;
    let alpha = fadeIn * fadeOut;

    if (alpha <= 0 || p.life > p.maxLife) {
      attentionPopups.splice(i, 1);
      continue;
    }

    push();
    // Red outlined box
    noFill();
    stroke(255, 0, 0, alpha * 0.3 * 255);
    strokeWeight(0.8);
    rect(p.x, p.y, p.w, p.h);

    // Red corner brackets
    let cl = 6;
    strokeWeight(1.5);
    stroke(255, 0, 0, alpha * 0.6 * 255);
    line(p.x, p.y, p.x + cl, p.y);
    line(p.x, p.y, p.x, p.y + cl);
    line(p.x + p.w, p.y, p.x + p.w - cl, p.y);
    line(p.x + p.w, p.y, p.x + p.w, p.y + cl);

    // Red text
    noStroke();
    fill(255, 0, 0, alpha * 0.55 * 255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textFont("Schibsted Grotesk");
    text(p.msg, p.x + p.w / 2, p.y + p.h / 2);
    pop();
  }
}

// ============================================================
// INPUT
// ============================================================
function mousePressed() {
  if (state === "TITLE") {
    state = "TRANSITION";
    stateTimer = millis();
    return;
  }

  if (state === "PUZZLE" && !adActive) {
    calcGridLayout();
    let gr = floor((mouseY - gridOffsetY) / cellSize);
    let gc = floor((mouseX - gridOffsetX) / cellSize);
    if (gr >= 0 && gr < GRID_SIZE && gc >= 0 && gc < GRID_SIZE && !BLACKS[gr][gc]) {
      if (gr === selectedCell.r && gc === selectedCell.c) {
        direction = direction === "ACROSS" ? "DOWN" : "ACROSS";
      } else {
        selectedCell.r = gr;
        selectedCell.c = gc;
      }
    }
  }
}

function keyPressed() {
  if (state !== "PUZZLE" || adActive) return false;

  if (keyCode === BACKSPACE || keyCode === DELETE) {
    if (userGrid[selectedCell.r][selectedCell.c]) {
      userGrid[selectedCell.r][selectedCell.c] = "";
    } else {
      retreatCursor();
      userGrid[selectedCell.r][selectedCell.c] = "";
    }
    return false;
  }
  if (keyCode === LEFT_ARROW) { direction = "ACROSS"; moveSelection(0, -1); return false; }
  if (keyCode === RIGHT_ARROW) { direction = "ACROSS"; moveSelection(0, 1); return false; }
  if (keyCode === UP_ARROW) { direction = "DOWN"; moveSelection(-1, 0); return false; }
  if (keyCode === DOWN_ARROW) { direction = "DOWN"; moveSelection(1, 0); return false; }
  if (keyCode === TAB) { direction = direction === "ACROSS" ? "DOWN" : "ACROSS"; return false; }

  if (key.length === 1) {
    let k = key.toUpperCase();
    if (k >= "A" && k <= "Z") {
      if (!BLACKS[selectedCell.r][selectedCell.c]) {
        userGrid[selectedCell.r][selectedCell.c] = k;
        advanceCursor();
      }
    }
  }

  return false;
}

function advanceCursor() {
  if (direction === "ACROSS") moveSelection(0, 1);
  else moveSelection(1, 0);
}

function retreatCursor() {
  if (direction === "ACROSS") moveSelection(0, -1);
  else moveSelection(-1, 0);
}

function moveSelection(dr, dc) {
  let nr = selectedCell.r + dr;
  let nc = selectedCell.c + dc;
  while (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
    if (!BLACKS[nr][nc]) {
      selectedCell.r = nr;
      selectedCell.c = nc;
      return;
    }
    nr += dr;
    nc += dc;
  }
}

// ============================================================
// DRAW
// ============================================================
function draw() {
  globalFrame++;

  switch (state) {
    case "TITLE":
      drawTitleScreen();
      break;

    case "TRANSITION":
      background(255);
      let elapsed = millis() - stateTimer;
      let tA = 0;
      if (elapsed < 800) tA = map(elapsed, 0, 800, 0, 0.3);
      else tA = map(elapsed, 800, 2000, 0.3, 0);
      tA = constrain(tA, 0, 0.3);
      fill(0, tA * 255);
      textAlign(CENTER, CENTER);
      textSize(max(10, min(width, height) * 0.013));
      text("focus", width / 2, height / 2);
      if (elapsed >= 2500) {
        state = "PUZZLE";
        puzzleStartTime = millis();
        popupTimer = millis();
      }
      break;

    case "PUZZLE":
      // Check ad schedule — every 30 seconds, exactly 4 times
      let puzzleElapsed = millis() - puzzleStartTime;
      for (let i = 0; i < 4; i++) {
        if (!adTriggered[i] && puzzleElapsed >= adSchedule[i] && !adActive) {
          adTriggered[i] = true;
          startAdBreak();
          break;
        }
      }

      // Check timer expiry → LOSE
      if (timerDone && !resultShown && !adActive) {
        triggerResult(false);
        break;
      }

      // Check win — if grid is full and correct
      if (!resultShown && !adActive && checkGridFull()) {
        if (checkWin()) {
          triggerResult(true);
          break;
        }
      }

      if (adActive) {
        drawAdBreak();
      } else {
        background(255);
        drawCrossword();
        updateAndDrawPopups();
      }
      break;

    case "RESULT":
      drawResultScreen();
      break;
  }

  // Cursor
  if (state === "RESULT") {
    stroke(255, 0, 0, 50); strokeWeight(0.8); noFill();
    line(mouseX - 10, mouseY, mouseX + 10, mouseY);
    line(mouseX, mouseY - 10, mouseX, mouseY + 10);
    noStroke(); fill(255, 0, 0, 50);
    ellipse(mouseX, mouseY, 2.5, 2.5);
  } else if (adActive) {
    stroke(255, 0, 0, 80); strokeWeight(0.8); noFill();
    line(mouseX - 10, mouseY, mouseX + 10, mouseY);
    line(mouseX, mouseY - 10, mouseX, mouseY + 10);
    noStroke(); fill(255, 0, 0, 80);
    ellipse(mouseX, mouseY, 2.5, 2.5);
  } else {
    stroke(0, 50); strokeWeight(0.8); noFill();
    line(mouseX - 10, mouseY, mouseX + 10, mouseY);
    line(mouseX, mouseY - 10, mouseX, mouseY + 10);
    noStroke(); fill(0, 50);
    ellipse(mouseX, mouseY, 2.5, 2.5);
  }
}
