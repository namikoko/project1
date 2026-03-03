// ============================================================
// YOU ARE BEING OPTIMIZED — LEVEL 1: CALIBRATION
// ============================================================

let state = "TITLE";
let stateTimer = 0;
let globalFrame = 0;

let trackingData = {
  mousePositions: [], clickTimes: [], wordClicked: null,
  timeToFirstMove: null, timeToFirstClick: null,
  totalMouseDistance: 0, lastMouseX: 0, lastMouseY: 0,
  enteredAt: null, clickedWords: [], dwellTimes: {},
  nearWord: null, nearWordStart: null,
};

// --- TITLE ---
let titleLetters = [];
let titleFadeIn = 0;

// --- WORDS ---
let wordSets = [
  ["FAST", "PRECISE", "VARIABLE", "STABLE"],
  ["QUIET", "DYNAMIC", "CONTROLLED", "OPEN"],
  ["CENTRALIZED", "DISTRIBUTED", "SHARED", "IRRELEVANT"],
  ["IMMEDIATE", "DELAYED", "CONTINUOUS", "MINIMAL"],
  ["OBSERVED", "ANONYMOUS", "GUIDED", "INDEPENDENT"],
];
let setLabels = [
  "PREFERENCE:",
  "ENVIRONMENT:",
  "CONTROL:",
  "FEEDBACK:",
  "YOU ENGAGE BEST WHEN:",
];
let currentSetIndex = 0;
let letterBodies = [];
let hoveredWord = null;
let hoverScale = {};
let dissolving = false;
let dissolveTimer = 0;
let promptTimer = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Schibsted Grotesk");
  trackingData.enteredAt = millis();
  stateTimer = millis();
  buildTitleLetters();
  noCursor();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (state === "TITLE") buildTitleLetters();
  if (state === "WORDS" || state === "NEXT_SET") buildLetterBodies(wordSets[currentSetIndex]);
}

// ============================================================
// TITLE — Letters that MOVE and react to cursor
// ============================================================
function buildTitleLetters() {
  titleLetters = [];
  let word = "CALIBRATION";
  let letterSize = max(14, min(width, height) * 0.024);
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
        homeX: homeX, homeY: homeY,
        x: homeX + random(-200, 200),
        y: homeY + random(-200, 200),
        vx: random(-0.5, 0.5), vy: random(-0.5, 0.5),
        size: letterSize,
        col: c, row: r,
        drift: random(0.3, 1.2),
        driftPhase: random(TWO_PI),
      });
    }
  }
}

function drawTitleScreen() {
  background(255);
  titleFadeIn = min(titleFadeIn + 0.015, 1);

  let waveOffset = globalFrame * 0.012;
  textAlign(CENTER, CENTER);
  noStroke();

  for (let letter of titleLetters) {
    // Drift toward home with gentle oscillation
    let driftX = sin(globalFrame * 0.008 + letter.driftPhase) * letter.drift * 2;
    let driftY = cos(globalFrame * 0.006 + letter.driftPhase * 1.3) * letter.drift * 1.5;

    let dx = (letter.homeX + driftX) - letter.x;
    let dy = (letter.homeY + driftY) - letter.y;
    letter.vx += dx * 0.006;
    letter.vy += dy * 0.006;

    // Cursor repulsion — letters push away from mouse
    let mx = letter.x - mouseX;
    let my = letter.y - mouseY;
    let mouseDist = sqrt(mx * mx + my * my);
    let repelRadius = 150;
    if (mouseDist < repelRadius && mouseDist > 0) {
      let force = map(mouseDist, 0, repelRadius, 8, 0);
      letter.vx += (mx / mouseDist) * force;
      letter.vy += (my / mouseDist) * force;
    }

    // Damping
    letter.vx *= 0.88;
    letter.vy *= 0.88;

    // Apply velocity
    letter.x += letter.vx;
    letter.y += letter.vy;

    // Wave opacity
    let wave = sin(waveOffset + (letter.col + letter.row) * 0.25);
    let baseAlpha = map(wave, -1, 1, 0.03, 0.85);

    // Center focus
    let cdx = letter.homeX - width / 2;
    let cdy = letter.homeY - height / 2;
    let centerDist = sqrt(cdx * cdx + cdy * cdy);
    let maxDist = sqrt(width * width + height * height) / 2;
    let centerFocus = constrain(map(centerDist, 0, maxDist, 1.1, 0.2), 0, 1);

    let alpha = constrain(baseAlpha * centerFocus, 0.02, 1) * titleFadeIn;

    fill(0, alpha * 255);
    textSize(letter.size);
    text(letter.char, letter.x, letter.y);
  }

  // Prompt — always centered on screen
  let elapsed = millis() - stateTimer;
  if (elapsed > 800) {
    let pAlpha = min((elapsed - 800) / 1000, 1) * 0.4;
    let pulse = map(sin(globalFrame * 0.04), -1, 1, 0.6, 1);
    fill(0, pAlpha * pulse * 255);
    textSize(max(11, min(width, height) * 0.013));
    textAlign(CENTER, CENTER);
    text("click anywhere to begin", width / 2, height / 2);
  }
}

// ============================================================
// WORD CIRCLES
// ============================================================
function buildLetterBodies(words) {
  letterBodies = [];
  hoverScale = {};
  promptTimer = millis();

  let letterSize = max(22, min(width, height) * 0.035);
  let spacing = letterSize * 1.65;
  let circleR = letterSize * 1.5;

  // Calculate positions dynamically based on word lengths
  // 4 quadrants with proper centering and clamping
  let positions = [
    { x: width * 0.28, y: height * 0.25 },
    { x: width * 0.72, y: height * 0.25 },
    { x: width * 0.28, y: height * 0.72 },
    { x: width * 0.72, y: height * 0.72 },
  ];

  for (let w = 0; w < words.length; w++) {
    let word = words[w];
    let baseX = positions[w].x;
    let baseY = positions[w].y;
    let totalWidth = (word.length - 1) * spacing;
    let sx = baseX - totalWidth / 2;

    // Clamp so letters never go off screen
    let pad = circleR + 10;
    if (sx < pad) sx = pad;
    if (sx + totalWidth > width - pad) sx = width - pad - totalWidth;

    hoverScale[word] = 0;

    for (let i = 0; i < word.length; i++) {
      letterBodies.push({
        char: word[i], word: word, wordIndex: w,
        homeX: sx + i * spacing + random(-4, 4),
        homeY: baseY + random(-6, 6),
        x: sx + i * spacing + random(-4, 4),
        y: baseY + random(-6, 6),
        vx: 0, vy: 0,
        size: letterSize,
        baseCircleSize: circleR,
        circleSize: circleR,
        angle: random(-0.25, 0.25),
        homeAngle: random(-0.25, 0.25),
        stretchX: 0, stretchY: 0,
        alpha: 0, targetAlpha: 255,
        letterIndex: i,
      });
    }
  }
}

function updateLetterBodies() {
  hoveredWord = null;
  for (let b of letterBodies) {
    let d = dist(mouseX, mouseY, b.x, b.y);
    if (d < b.baseCircleSize * 2.5) { hoveredWord = b.word; break; }
  }

  for (let word in hoverScale) {
    hoverScale[word] = lerp(hoverScale[word], word === hoveredWord ? 1 : 0, 0.08);
  }

  let currentNearWord = null;
  for (let b of letterBodies) {
    b.alpha = lerp(b.alpha, b.targetAlpha, 0.04);
    let wordHover = hoverScale[b.word] || 0;
    b.circleSize = lerp(b.baseCircleSize, b.baseCircleSize * 1.35, wordHover);

    let dx = mouseX - b.x, dy = mouseY - b.y;
    let d = sqrt(dx * dx + dy * dy);
    let influenceRadius = b.baseCircleSize * 3.5;

    if (d < influenceRadius && d > 0) {
      let force = map(d, 0, influenceRadius, 1, 0); force *= force;
      let stretchMult = b.word === hoveredWord ? 1.2 : 0.6;
      b.stretchX = lerp(b.stretchX, dx * force * stretchMult, 0.12);
      b.stretchY = lerp(b.stretchY, dy * force * stretchMult, 0.12);
      b.x = lerp(b.x, b.x + dx * force * 0.025, 0.3);
      b.y = lerp(b.y, b.y + dy * force * 0.025, 0.3);
      currentNearWord = b.word;
    } else {
      b.stretchX = lerp(b.stretchX, 0, 0.06);
      b.stretchY = lerp(b.stretchY, 0, 0.06);
      b.x = lerp(b.x, b.homeX, 0.03);
      b.y = lerp(b.y, b.homeY, 0.03);
    }
  }

  if (currentNearWord !== trackingData.nearWord) {
    if (trackingData.nearWord && trackingData.nearWordStart) {
      let elapsed = millis() - trackingData.nearWordStart;
      if (!trackingData.dwellTimes[trackingData.nearWord]) trackingData.dwellTimes[trackingData.nearWord] = 0;
      trackingData.dwellTimes[trackingData.nearWord] += elapsed;
    }
    trackingData.nearWord = currentNearWord;
    trackingData.nearWordStart = millis();
  }
}

function drawLetterBodies() {
  for (let b of letterBodies) {
    if (b.alpha < 1) continue;
    let stretchMag = sqrt(b.stretchX * b.stretchX + b.stretchY * b.stretchY);
    let wordHover = hoverScale[b.word] || 0;
    push();
    if (stretchMag > 3) {
      stroke(0, b.alpha); strokeCap(ROUND);
      let tw = map(stretchMag, 3, 150, b.circleSize * 0.85, b.circleSize * 0.45);
      strokeWeight(tw);
      line(b.x, b.y, b.x + b.stretchX, b.y + b.stretchY);
      noStroke(); fill(0, b.alpha);
      ellipse(b.x + b.stretchX, b.y + b.stretchY, tw * 0.75, tw * 0.75);
    }
    noStroke(); fill(0, b.alpha);
    ellipse(b.x, b.y, b.circleSize, b.circleSize);
    fill(255, b.alpha); textAlign(CENTER, CENTER);
    textSize(b.size * (1 + wordHover * 0.15)); textStyle(BOLD);
    text(b.char, b.x, b.y - 2); textStyle(NORMAL);
    pop();
  }

  let timeSinceWords = millis() - promptTimer;
  if (timeSinceWords > 1500 && !dissolving) {
    let pFadeIn = min((timeSinceWords - 1500) / 1000, 1);
    let pFadeHover = hoveredWord ? 0.4 : 1;
    let pulse = map(sin(globalFrame * 0.035), -1, 1, 0.7, 1);
    fill(0, pFadeIn * pFadeHover * pulse * 0.28 * 255);
    noStroke(); textAlign(CENTER, CENTER);
    textSize(max(13, min(width, height) * 0.016));
    text(setLabels[currentSetIndex] || "SELECT", width / 2, height / 2);
  }
}

function dissolveLetters() {
  for (let b of letterBodies) {
    b.vx += random(-0.5, 0.5); b.vy += random(-0.8, -0.2);
    b.x += b.vx; b.y += b.vy;
    b.targetAlpha = max(0, b.targetAlpha - 2.5);
    b.circleSize *= 0.997;
  }
}

// ============================================================
// CLICK
// ============================================================
function mousePressed() {
  if (trackingData.timeToFirstClick === null)
    trackingData.timeToFirstClick = millis() - trackingData.enteredAt;

  if (state === "TITLE") {
    state = "TRANSITION"; stateTimer = millis();
    trackingData.clickTimes.push({ time: millis(), x: mouseX, y: mouseY, state: "TITLE" });
    return;
  }

  if (state === "WORDS" || state === "NEXT_SET") {
    let clickedWord = null;
    for (let b of letterBodies) {
      if (dist(mouseX, mouseY, b.x, b.y) < b.circleSize * 1.2) { clickedWord = b.word; break; }
    }
    trackingData.clickTimes.push({ time: millis(), x: mouseX, y: mouseY, word: clickedWord, set: currentSetIndex });
    if (clickedWord) {
      trackingData.clickedWords.push({ word: clickedWord, time: millis(), set: currentSetIndex });
      dissolving = true; dissolveTimer = millis();
    }
  }
}

function mouseMoved() {
  if (trackingData.timeToFirstMove === null)
    trackingData.timeToFirstMove = millis() - trackingData.enteredAt;
  let d = dist(mouseX, mouseY, trackingData.lastMouseX, trackingData.lastMouseY);
  trackingData.totalMouseDistance += d;
  trackingData.lastMouseX = mouseX; trackingData.lastMouseY = mouseY;
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
      let tAlpha = 0;
      if (elapsed < 1200) tAlpha = map(elapsed, 0, 600, 0, 0.25);
      else tAlpha = map(elapsed, 1200, 2200, 0.25, 0);
      tAlpha = constrain(tAlpha, 0, 0.25);
      fill(0, tAlpha * 255);
      textAlign(CENTER, CENTER);
      textSize(max(10, min(width, height) * 0.013));
      text("recording", width / 2, height / 2);
      if (elapsed >= 2500) {
        state = "WORDS";
        buildLetterBodies(wordSets[currentSetIndex]);
      }
      break;

    case "WORDS":
    case "NEXT_SET":
      background(255);
      updateLetterBodies();
      drawLetterBodies();
      if (dissolving) {
        dissolveLetters();
        if (millis() - dissolveTimer > 2500) {
          dissolving = false;
          currentSetIndex++;
          if (currentSetIndex < wordSets.length) {
            state = "NEXT_SET";
            buildLetterBodies(wordSets[currentSetIndex]);
          } else {
            // === CONNECT TO LEVEL 2 ===
            state = "ENDING";
            stateTimer = millis();
          }
        }
      }
      fill(0, 20); textAlign(RIGHT, BOTTOM); textSize(9);
      text((currentSetIndex + 1) + " / " + wordSets.length, width - 20, height - 16);
      break;

    case "ENDING":
      background(255);
      let endElapsed = millis() - stateTimer;
      let endAlpha = constrain(endElapsed / 1500, 0, 0.3);
      fill(0, endAlpha * 255);
      textAlign(CENTER, CENTER);
      textSize(max(10, min(width, height) * 0.013));
      text("calibration complete", width / 2, height / 2);

      if (endElapsed > 3000) {
        // Save tracking data and redirect to Level 2
        localStorage.setItem("level1Data", JSON.stringify(trackingData));
        window.location.href = "level2.html";
      }
      break;
  }

  // Cursor
  stroke(0, hoveredWord ? 120 : 50); strokeWeight(1); noFill();
  line(mouseX - 12, mouseY, mouseX + 12, mouseY);
  line(mouseX, mouseY - 12, mouseX, mouseY + 12);
  noStroke(); fill(0, hoveredWord ? 120 : 50);
  ellipse(mouseX, mouseY, 3, 3);

  // DOM log
  let el = document.getElementById("system-log");
  if (!el) {
    el = document.createElement("div"); el.id = "system-log"; el.style.display = "none";
    document.body.appendChild(el);
    let ind = document.createElement("div"); ind.id = "system-indicator";
    ind.style.cssText = "position:fixed;bottom:12px;left:12px;font-family:'Schibsted Grotesk',sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;opacity:0.06;pointer-events:none;color:#000;";
    ind.textContent = "system active";
    document.body.appendChild(ind);
  }
  el.setAttribute("data-state", state);
  el.setAttribute("data-words", JSON.stringify(trackingData.clickedWords.map(w => w.word)));
}
