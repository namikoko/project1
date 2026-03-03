// ============================================================
// YOU ARE BEING OPTIMIZED — LEVEL 2: INTERPRETATION
// ============================================================

let state = "TITLE";
let stateTimer = 0;
let globalFrame = 0;

// --- WEBCAM ---
let webcamReady = false;
let captureCanvas;

// --- TITLE ---
let titleLetters = [];
let titleFadeIn = 0;

// --- PORTRAIT ---
// The portrait is a CONTAINED region in the center — NOT full screen
let pCharW, pCharH = 11;
let pCols, pRows;
let pGrid = [];
let portraitAlpha = 0;

// Portrait bounding box in pixel coords (centered on screen)
let pBox = { x: 0, y: 0, w: 0, h: 0 };

// --- DETECTION BOXES ---
let detectionBoxes = [];
let boxSpawnTimer = 0;

const DIAG_LABELS = []; // populated dynamically from level1 data

// 4 WAVES — escalating linguistic domination
const WAVE_1_SIGNALS_SLOW = [
  "RESPONSE LATENCY ABOVE AVERAGE",
  "DELAY PATTERN CONSISTENT",
  "HESITATION REGISTERED",
  "MICRO-PAUSE DETECTED",
];
const WAVE_1_SIGNALS_FAST = [
  "IMPULSE RESPONSE DETECTED",
  "MINIMAL DELIBERATION WINDOW",
  "ACCELERATED DECISION PATTERN",
  "REFLEXIVE SELECTION MODE",
];
const WAVE_1_SIGNALS_MOVE = [
  "MOTOR VARIABILITY OBSERVED",
  "CURSOR DRIFT EXCEEDS BASELINE",
  "EXPLORATION RANGE: ELEVATED",
];
const WAVE_1_SIGNALS_STILL = [
  "REDUCED EXPLORATION RANGE",
  "STATIC ENGAGEMENT MODEL",
  "LOW SPATIAL VARIANCE",
];

const WAVE_2_TRAITS = [
  "TENDENCY TOWARD CONTROL",
  "AVOIDANCE OF UNCERTAINTY",
  "NOVELTY RESISTANCE",
  "LOW RISK TOLERANCE",
  "HIGH VALIDATION SENSITIVITY",
  "SELF-PRESENTATION AWARENESS",
  "PERFORMANCE-ORIENTED INTERACTION",
  "COMPLIANCE-PREFERRED USER",
  "EXTERNAL FEEDBACK RELIANCE",
  "OPTIMIZATION-RECEPTIVE",
];

const WAVE_3_PREDICTIONS = [
  "FUTURE SELECTIONS 72% PREDICTABLE",
  "HIGH PROBABILITY OF PLATFORM DEPENDENCE",
  "ENGAGEMENT RETENTION LIKELY",
  "ADAPTIVE CONTENT SUITABLE",
  "TARGETING MODEL STABLE",
  "PERSONALIZATION YIELD: HIGH",
];

const WAVE_4_CONFIDENCE = [
  "MODEL CONFIDENCE: 87%",
  "INTERPRETATION STABLE",
  "PROFILE COHERENCE CONFIRMED",
  "VARIANCE ACCEPTABLE",
  "CLASSIFICATION LOCKED",
  "PATTERN VERIFIED",
];

// Wave system
let waveLabels = [];  // built from level1 data
let waveIndex = 0;
let waveTimer = 0;
let waveBatch = [];   // current batch to spawn
let waveSpawnIdx = 0;
let totalDuration = 10000; // 10 seconds total

const DENSE_CHARS = "@#%&WMBNK0X896$43?!|:;,.  ";

// --- LEVEL 1 DATA ---
let level1Data = null;

function buildWaves() {
  waveLabels = [];

  // WAVE 1: Signal detection — based on actual Level 1 behavior
  let w1 = [];
  if (level1Data) {
    // Check click speed
    let avgClickTime = 0;
    if (level1Data.clickedWords && level1Data.clickedWords.length > 1) {
      for (let i = 1; i < level1Data.clickedWords.length; i++) {
        avgClickTime += level1Data.clickedWords[i].time - level1Data.clickedWords[i - 1].time;
      }
      avgClickTime /= (level1Data.clickedWords.length - 1);
    }
    if (avgClickTime > 5000 || avgClickTime === 0) {
      w1 = w1.concat(WAVE_1_SIGNALS_SLOW);
    } else {
      w1 = w1.concat(WAVE_1_SIGNALS_FAST);
    }
    // Check mouse movement
    if (level1Data.totalMouseDistance > 3000) {
      w1 = w1.concat(WAVE_1_SIGNALS_MOVE);
    } else {
      w1 = w1.concat(WAVE_1_SIGNALS_STILL);
    }
  } else {
    // No data — use generic signals
    w1 = WAVE_1_SIGNALS_SLOW.concat(WAVE_1_SIGNALS_STILL);
  }
  // Pick 3 from wave 1
  shuffle(w1, true);
  waveLabels.push(w1.slice(0, 3));

  // WAVE 2: Trait assignment — 4 traits
  let w2 = WAVE_2_TRAITS.slice();
  shuffle(w2, true);
  waveLabels.push(w2.slice(0, 4));

  // WAVE 3: Behavioral prediction — 2
  let w3 = WAVE_3_PREDICTIONS.slice();
  shuffle(w3, true);
  waveLabels.push(w3.slice(0, 2));

  // WAVE 4: Confidence assertion — 2
  let w4 = WAVE_4_CONFIDENCE.slice();
  shuffle(w4, true);
  waveLabels.push(w4.slice(0, 2));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Schibsted Grotesk");
  stateTimer = millis();
  noCursor();

  // Measure monospace char width
  push();
  textFont("monospace");
  textSize(pCharH);
  pCharW = textWidth("M");
  pop();

  try {
    let raw = localStorage.getItem("level1Data");
    if (raw) level1Data = JSON.parse(raw);
  } catch (e) {}

  buildTitleLetters();
  initWebcam();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  push();
  textFont("monospace");
  textSize(pCharH);
  pCharW = textWidth("M");
  pop();
  if (state === "TITLE") buildTitleLetters();
  setupPortrait();
}

// ============================================================
// WEBCAM
// ============================================================
function initWebcam() {
  let videoEl = document.getElementById("webcam-video");
  navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } })
    .then(stream => {
      videoEl.srcObject = stream;
      videoEl.play();
      videoEl.addEventListener("loadeddata", () => {
        webcamReady = true;
        captureCanvas = document.createElement("canvas");
        captureCanvas.width = 640;
        captureCanvas.height = 480;
        setupPortrait();
      });
    })
    .catch(err => {
      console.error("Webcam error:", err);
      setupPortrait();
    });
}

// ============================================================
// PORTRAIT GRID — contained center region, ~45% of screen
// ============================================================
function setupPortrait() {
  // Portrait takes about 40% of screen width and 55% of height
  // Leaves clear white space on all sides for detection boxes
  let targetW = width * 0.40;
  let targetH = height * 0.55;

  pCols = floor(targetW / pCharW);
  pRows = floor(targetH / (pCharH + 1));

  // Pixel dimensions of the actual portrait
  let pixW = pCols * pCharW;
  let pixH = pRows * (pCharH + 1);

  // Center it on screen
  pBox.x = (width - pixW) / 2;
  pBox.y = (height - pixH) / 2;
  pBox.w = pixW;
  pBox.h = pixH;

  pGrid = [];
  for (let r = 0; r < pRows; r++) {
    pGrid[r] = [];
    for (let c = 0; c < pCols; c++) {
      pGrid[r][c] = { char: " ", brightness: 255, targetBrightness: 255 };
    }
  }
}

// ============================================================
// TITLE
// ============================================================
function buildTitleLetters() {
  titleLetters = [];
  let word = "INTERPRETATION";
  let letterSize = max(13, min(width, height) * 0.022);
  let colSpacing = letterSize * 1.7;
  let rowSpacing = letterSize * 2.1;
  let cols = floor(width / colSpacing);
  let rows = floor(height / rowSpacing);
  let startX = (width - (cols - 1) * colSpacing) / 2;
  let startY = (height - (rows - 1) * rowSpacing) / 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let idx = (c + r * 3) % word.length;
      titleLetters.push({
        char: word.charAt(idx),
        homeX: startX + c * colSpacing,
        homeY: startY + r * rowSpacing,
        x: startX + c * colSpacing + random(-300, 300),
        y: startY + r * rowSpacing + random(-300, 300),
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
      l.vx += (mx / md) * f;
      l.vy += (my / md) * f;
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

  // Prompt dead center
  let el = millis() - stateTimer;
  if (el > 1000) {
    let a = min((el - 1000) / 1200, 1) * 0.35 * map(sin(globalFrame * 0.035), -1, 1, 0.6, 1);
    fill(0, a * 255);
    textSize(max(11, min(width, height) * 0.013));
    textAlign(CENTER, CENTER);
    text("click to begin interpretation", width / 2, height / 2);
  }
}

// ============================================================
// WEBCAM → PORTRAIT GRID
// ============================================================
function sampleWebcam() {
  if (!webcamReady || !captureCanvas) return;
  let videoEl = document.getElementById("webcam-video");
  let ctx = captureCanvas.getContext("2d");
  ctx.save();
  ctx.translate(captureCanvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(videoEl, 0, 0, captureCanvas.width, captureCanvas.height);
  ctx.restore();

  let imgData = ctx.getImageData(0, 0, captureCanvas.width, captureCanvas.height);
  let px = imgData.data;
  let vW = captureCanvas.width, vH = captureCanvas.height;

  for (let r = 0; r < pRows; r++) {
    for (let c = 0; c < pCols; c++) {
      let vidX = floor(map(c, 0, pCols, 0, vW));
      let vidY = floor(map(r, 0, pRows, 0, vH));
      vidX = constrain(vidX, 0, vW - 1);
      vidY = constrain(vidY, 0, vH - 1);
      let i = (vidY * vW + vidX) * 4;
      let bright = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
      pGrid[r][c].targetBrightness = bright;
    }
  }
}

function updatePortraitGrid() {
  for (let r = 0; r < pRows; r++) {
    for (let c = 0; c < pCols; c++) {
      let cell = pGrid[r][c];
      cell.brightness = lerp(cell.brightness, cell.targetBrightness, 0.15);
      if (cell.brightness > 240) {
        cell.char = " ";
      } else {
        let idx = floor(map(cell.brightness, 0, 240, 0, DENSE_CHARS.length - 1));
        cell.char = DENSE_CHARS.charAt(constrain(idx, 0, DENSE_CHARS.length - 1));
      }
    }
  }
}

function drawPortrait() {
  portraitAlpha = min(portraitAlpha + 0.01, 1);
  textFont("monospace");
  textSize(pCharH);
  noStroke();

  let lineH = pCharH + 1;

  for (let r = 0; r < pRows; r++) {
    for (let c = 0; c < pCols; c++) {
      let ch = pGrid[r][c].char;
      if (ch === " ") continue;
      let flicker = random(0.85, 1);
      fill(0, portraitAlpha * flicker * 255);
      textAlign(LEFT, TOP);
      text(ch, pBox.x + c * pCharW, pBox.y + r * lineH);
    }
  }
  textFont("Schibsted Grotesk");
}

// ============================================================
// DETECTION BOXES — BIG, CLEAN, pointing INTO portrait
// They live in the white space AROUND the portrait
// ============================================================
function spawnDetectionBox(labelText) {
  let margin = 40;

  // SIZE the box to fit the label text
  push();
  textFont("Schibsted Grotesk");
  textSize(14);
  let labelW = textWidth(labelText);
  pop();

  let bw = labelW + 60;  // padding around text
  let bh = 55;
  let bx, by;

  // Spawn in the white space around the portrait
  let zone = floor(random(4));
  switch (zone) {
    case 0: // RIGHT of portrait
      bx = pBox.x + pBox.w + random(margin, margin + 60);
      by = pBox.y + random(0, max(0, pBox.h - bh));
      break;
    case 1: // LEFT of portrait
      bx = pBox.x - bw - random(margin, margin + 60);
      by = pBox.y + random(0, max(0, pBox.h - bh));
      break;
    case 2: // ABOVE portrait
      bx = pBox.x + random(0, max(0, pBox.w - bw));
      by = pBox.y - bh - random(margin, margin + 50);
      break;
    case 3: // BELOW portrait
      bx = pBox.x + random(0, max(0, pBox.w - bw));
      by = pBox.y + pBox.h + random(margin, margin + 50);
      break;
  }

  // Keep on screen
  bx = constrain(bx, 10, width - bw - 10);
  by = constrain(by, 10, height - bh - 10);

  let code = floor(random(10000, 99999));

  // Line target: a point INSIDE the portrait face area
  let lineTargetX = pBox.x + pBox.w * random(0.2, 0.8);
  let lineTargetY = pBox.y + pBox.h * random(0.15, 0.85);

  detectionBoxes.push({
    x: bx, y: by, w: bw, h: bh,
    vx: random(-0.15, 0.15), vy: random(-0.15, 0.15),
    label: labelText, code: code.toString(),
    life: 0, maxLife: random(100, 160),
    lineTargetX, lineTargetY,
  });
}

function updateAndDrawBoxes() {
  // Wave-based spawning — escalates through 4 waves in ~10 seconds
  let portraitElapsed = millis() - waveTimer;

  // Wave timing: 0-2.5s = wave1(3), 2.5-5.5s = wave2(4), 5.5-8s = wave3(2), 8-10s = wave4(2)
  let targetWave = 0;
  if (portraitElapsed < 2500) targetWave = 0;
  else if (portraitElapsed < 5500) targetWave = 1;
  else if (portraitElapsed < 8000) targetWave = 2;
  else targetWave = 3;

  // If we moved to a new wave, load its batch
  if (targetWave !== waveIndex && targetWave < waveLabels.length) {
    waveIndex = targetWave;
    waveBatch = waveLabels[waveIndex].slice();
    waveSpawnIdx = 0;
  }

  // Spawn from current batch with staggered timing
  if (waveBatch.length > 0 && waveSpawnIdx < waveBatch.length) {
    let spawnInterval = 800; // one popup every 800ms
    let waveElapsed = portraitElapsed - [0, 2500, 5500, 8000][waveIndex];
    let expectedSpawns = floor(waveElapsed / spawnInterval) + 1;
    while (waveSpawnIdx < expectedSpawns && waveSpawnIdx < waveBatch.length) {
      spawnDetectionBox(waveBatch[waveSpawnIdx]);
      waveSpawnIdx++;
    }
  }

  for (let i = detectionBoxes.length - 1; i >= 0; i--) {
    let b = detectionBoxes[i];
    b.life++;
    b.x += b.vx;
    b.y += b.vy;

    let fadeIn = min(b.life / 20, 1);
    let fadeOut = b.life > b.maxLife - 50 ? map(b.life, b.maxLife - 50, b.maxLife, 1, 0) : 1;
    let alpha = fadeIn * fadeOut;

    if (alpha <= 0 || b.life > b.maxLife) {
      detectionBoxes.splice(i, 1);
      continue;
    }

    push();

    // ---- CONNECTING LINE from box edge to portrait ----
    stroke(0, alpha * 0.35 * 255);
    strokeWeight(0.8);

    // Find the point on the box edge closest to the target
    let boxCX = b.x + b.w / 2;
    let boxCY = b.y + b.h / 2;
    let angle = atan2(b.lineTargetY - boxCY, b.lineTargetX - boxCX);

    // Start from box edge
    let startX = boxCX + cos(angle) * min(b.w, b.h) * 0.4;
    let startY = boxCY + sin(angle) * min(b.w, b.h) * 0.4;

    line(startX, startY, b.lineTargetX, b.lineTargetY);

    // Small crosshair at target point on the portrait
    let ch = 5;
    stroke(0, alpha * 0.5 * 255);
    strokeWeight(0.8);
    line(b.lineTargetX - ch, b.lineTargetY, b.lineTargetX + ch, b.lineTargetY);
    line(b.lineTargetX, b.lineTargetY - ch, b.lineTargetX, b.lineTargetY + ch);

    // ---- BOX ----
    noFill();
    stroke(0, alpha * 0.7 * 255);
    strokeWeight(1.2);
    rect(b.x, b.y, b.w, b.h);

    // Corner brackets
    let cl = min(b.w, b.h) * 0.15;
    strokeWeight(2);
    stroke(0, alpha * 0.85 * 255);
    line(b.x, b.y, b.x + cl, b.y);
    line(b.x, b.y, b.x, b.y + cl);
    line(b.x + b.w, b.y, b.x + b.w - cl, b.y);
    line(b.x + b.w, b.y, b.x + b.w, b.y + cl);
    line(b.x, b.y + b.h, b.x + cl, b.y + b.h);
    line(b.x, b.y + b.h, b.x, b.y + b.h - cl);
    line(b.x + b.w, b.y + b.h, b.x + b.w - cl, b.y + b.h);
    line(b.x + b.w, b.y + b.h, b.x + b.w, b.y + b.h - cl);

    // ---- LABEL — centered inside box ----
    noStroke();
    fill(0, alpha * 0.85 * 255);
    textAlign(CENTER, CENTER);
    textSize(14);
    textFont("Schibsted Grotesk");
    text(b.label, b.x + b.w / 2, b.y + b.h / 2 - 4);

    // Code at bottom right
    fill(0, alpha * 0.35 * 255);
    textAlign(RIGHT, BOTTOM);
    textSize(9);
    text(b.code, b.x + b.w - 8, b.y + b.h - 5);

    pop();
  }
}

// ============================================================
// CLICK
// ============================================================
function mousePressed() {
  if (state === "TITLE") {
    state = "TRANSITION";
    stateTimer = millis();
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
      text("accessing camera", width / 2, height / 2);
      if (elapsed >= 2500) {
        state = "PORTRAIT";
        stateTimer = millis();
        setupPortrait();
        buildWaves();
        waveTimer = millis();
        waveIndex = 0;
        waveBatch = waveLabels.length > 0 ? waveLabels[0].slice() : [];
        waveSpawnIdx = 0;
      }
      break;

    case "PORTRAIT":
      background(255);

      if (globalFrame % 2 === 0) sampleWebcam();
      updatePortraitGrid();
      drawPortrait();
      updateAndDrawBoxes();

      // Subtle status
      let pE = millis() - stateTimer;
      let prog = constrain(pE / 25000, 0, 1);
      fill(0, 0.06 * 255);
      textAlign(LEFT, BOTTOM); textSize(8);
      textFont("Schibsted Grotesk");
      text("SCAN: " + floor(prog * 100) + "%", 16, height - 14);
      fill(0, 0.04 * 255);
      textAlign(RIGHT, BOTTOM);
      text("F:" + globalFrame, width - 16, height - 14);

      if (level1Data) {
        fill(0, 0.05 * 255);
        textAlign(LEFT, TOP); textSize(7);
        text("L1_DATA: LOADED", 16, 14);
        if (level1Data.clickedWords && level1Data.clickedWords.length > 0) {
          text("SELECTIONS: " + level1Data.clickedWords.map(w => w.word).join(" / "), 16, 26);
        }
      }

      // Redirect to Level 3 after 12 seconds
      if (pE > 12000) {
        window.location.href = "level3.html";
      }
      break;
  }

  // Cursor
  stroke(0, state === "PORTRAIT" ? 40 : 60);
  strokeWeight(0.8); noFill();
  line(mouseX - 10, mouseY, mouseX + 10, mouseY);
  line(mouseX, mouseY - 10, mouseX, mouseY + 10);
  noStroke();
  fill(0, state === "PORTRAIT" ? 40 : 60);
  ellipse(mouseX, mouseY, 2.5, 2.5);
}
