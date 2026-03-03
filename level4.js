// ============================================================
// YOU ARE BEING OPTIMIZED — LEVEL 4: EXPRESSION (CLIMAX)
// ============================================================

var state = "TITLE";
var stateTimer = 0;
var globalFrame = 0;
var titleFadeIn = 0;
var inputField, submitBtn;
var userText = "";
var takeoverPhase = "ERASE";
var takeoverCharIndex = 0;
var takeoverTimer = 0;
var systemText = "";
var eraseSpeed = 40;
var retypeSpeed = 55;
var fakeCursorStartX=0,fakeCursorStartY=0;
var fakeCursorX=0,fakeCursorY=0;
var fakeCursorTargetX=0,fakeCursorTargetY=0;
var fakeCursorVisible=false;
var cursorAnimStart=0;
var feedContainer;
var feedStartTime=0;
var feedDuration=60000;
var feedBuilt=false;
var feedScrollY=0;
var goodbyeTimer=0;
var feedAnimFrame=null;

var DENSE_CHARS = "@#%&WMBNK0X896$43?!|:;,.  ";

// YOUR EXACT ORDER — 14 specified, then rest randomized
var IMAGE_ORDER = [
  "image copy 2.png",
  "image copy 3.png",
  "image copy 5.png",
  "image copy 4.png",
  "image copy 6.png",
  "image copy 14.png",
  "image copy 9.png",
  "image copy 23.png",
  "image copy 20.png",
  "image copy 17.png",
  "image copy 12.png",
  "image copy.png",
  "image copy 7.png",
  "image.png"
];

var REPLACE = {
  "happy":"content","happiest":"most satisfactory","ecstatic":"adequate",
  "excited":"engaged","exciting":"notable","thrilled":"acknowledged",
  "wonderful":"acceptable","amazing":"standard","awesome":"noted",
  "incredible":"functional","fantastic":"within parameters","great":"satisfactory",
  "beautiful":"visually processed","gorgeous":"aesthetically standard",
  "brilliant":"sufficient","perfect":"optimal","joyful":"stable",
  "delightful":"tolerable","blissful":"regulated","overjoyed":"status: positive",
  "sad":"suboptimal","depressed":"below baseline","miserable":"underperforming",
  "heartbroken":"system disrupted","devastated":"critically suboptimal",
  "lonely":"unconnected","crying":"fluid response","painful":"flagged",
  "hurt":"impacted","suffering":"processing error","grief":"data loss",
  "angry":"elevated","furious":"over threshold","mad":"irregular",
  "frustrated":"encountering friction","annoyed":"mildly flagged",
  "rage":"peak irregularity","hate":"strong negative index",
  "disgusted":"incompatible","irritated":"experiencing noise",
  "love":"preference","loved":"preferred","loving":"favorable",
  "adore":"rate highly","cherish":"retain","passionate":"invested",
  "romantic":"pair-bonded","intimate":"proximate",
  "scared":"alert-state","afraid":"risk-aware","terrified":"maximum alert",
  "anxious":"pre-processing","nervous":"anticipatory","worried":"monitoring",
  "panic":"system overload","fear":"threat detection",
  "very":"marginally","extremely":"somewhat","so":"moderately",
  "really":"nominally","absolutely":"approximately","totally":"partially",
  "deeply":"measurably","truly":"reportedly","never":"infrequently",
  "always":"often","forever":"for a duration",
  "magical":"unusual","enchanting":"atypical","dreamy":"low-resolution",
  "wild":"unstructured","crazy":"non-standard","insane":"outside parameters",
  "intense":"elevated-input","overwhelming":"beyond buffer",
  "best":"most adequate","worst":"least adequate",
  "family":"user group","friends":"network nodes","friend":"contact",
  "mother":"primary caregiver","father":"secondary caregiver",
  "myself":"this user","my":"the assigned","mine":"allocated",
  "freedom":"permitted range","dream":"projected scenario",
  "hope":"pending expectation","believe":"assume",
  "soul":"user core","heart":"central process","spirit":"operating state",
  "alive":"active","dead":"inactive","death":"termination",
  "dancing":"rhythmic movement","singing":"vocal output",
  "laughing":"response pattern","smile":"positive indicator",
  "remember":"access stored data","memory":"stored data",
  "memories":"archived data","forget":"purge","good":"adequate",
  "bad":"suboptimal","nice":"acceptable","terrible":"non-compliant",
  "horrible":"critically flagged","cool":"noted","fun":"stimulation event",
  "boring":"low-engagement","interesting":"attention-worthy",
  "weird":"anomalous","strange":"non-standard input",
  "think":"compute","thought":"computation","feel":"register",
  "feeling":"signal","felt":"registered","feelings":"signals",
  "want":"request","need":"require","wish":"submit query",
  "like":"prefer","dislike":"deprioritize",
  "care":"allocate attention","miss":"flag absence",
  "enjoy":"process positively","experience":"input session",
  "peaceful":"low-activity","calm":"idle","emotional":"data-heavy",
  "real":"verified","human":"biological user","people":"users","person":"user",
  "life":"runtime","world":"environment","nature":"default state",
  "music":"audio content","art":"visual content",
  "meaningful":"high-priority","special":"flagged",
  "unique":"non-duplicate","creative":"generative",
  "pain":"negative signal","pleasure":"positive signal",
  "lost":"unlocated","found":"located",
  "safe":"within parameters","trust":"grant access",
  "kind":"compliant","strong":"high-capacity",
  "vulnerable":"exposed","connection":"link",
  "together":"co-located","alone":"single-instance",
  "silence":"zero input","voice":"audio output",
  "eyes":"optical sensors","face":"front display","body":"hardware",
  "sleep":"standby","child":"sub-user","children":"sub-users",
  "born":"initialized","die":"terminate"
};

var CAPTIONS = [
  "user #38291 — optimized expression","user #10477 — sentiment corrected",
  "user #62830 — tone standardized","user #95012 — identity processed",
  "user #44738 — expression compliant","user #71923 — emotional baseline achieved",
  "user #20384 — vocabulary normalized","user #83621 — subjectivity removed"
];

var STILL_WATCHING = [
  "are you still watching?","are you still there?","your attention is required",
  "don't look away","session still active","continue viewing to complete optimization",
  "please remain engaged","your participation is mandatory",
  "content tailored for you — keep watching","we noticed you stopped scrolling",
  "engagement metrics declining — resume viewing","this content was selected for you",
  "scroll to continue your experience","you haven't finished yet",
  "your session will not end until you view all content","we're still here","look closely"
];

var METRICS = [
  "EMOTIONAL RANGE COMPRESSED BY 73%","VOCABULARY COMPLEXITY: REDUCED TO BASELINE",
  "SENTIMENT ANALYSIS: NEUTRALIZED","EXPRESSION INDEX: WITHIN ACCEPTABLE PARAMETERS",
  "PERSONAL IDENTIFIERS: REMOVED","SUBJECTIVITY SCORE: 0.02",
  "EMOTIONAL VARIANCE: SMOOTHED","AUTHENTICITY INDEX: RECALIBRATED",
  "TONE: STANDARDIZED FOR PROCESSING","IDENTITY MARKERS: STRIPPED",
  "USER COMPLIANCE: 98.4%","ORIGINALITY QUOTIENT: BELOW THRESHOLD"
];

// ============================================================
function buildFullImageList() {
  // Start with your exact 14 in order
  var list = IMAGE_ORDER.slice();
  // Collect remaining
  var remaining = [];
  for (var i = 2; i <= 45; i++) {
    var name = "image copy " + i + ".png";
    if (IMAGE_ORDER.indexOf(name) === -1) remaining.push(name);
  }
  // Shuffle remaining
  for (var i = remaining.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = remaining[i]; remaining[i] = remaining[j]; remaining[j] = t;
  }
  // Append
  for (var i = 0; i < remaining.length; i++) list.push(remaining[i]);
  return list;
}

function buildSystemText(original) {
  var tokens = original.match(/[a-zA-Z'-]+|[^a-zA-Z'-]+/g) || [];
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    var tok = tokens[i];
    if (!/[a-zA-Z]/.test(tok)) { result.push(tok); continue; }
    var lower = tok.toLowerCase();
    var cap = tok[0] === tok[0].toUpperCase() && tok[0] !== tok[0].toLowerCase();
    if (REPLACE[lower]) {
      var rep = REPLACE[lower];
      if (cap) rep = rep.charAt(0).toUpperCase() + rep.slice(1);
      result.push(rep);
    } else {
      result.push(tok);
    }
  }
  var out = result.join("");
  if (out === original) out = "the user reports an input session. status: adequate. no further data required.";
  return out;
}

// ============================================================
// SETUP
// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Schibsted Grotesk");
  stateTimer = millis();
  noCursor();

  inputField = createElement("textarea");
  inputField.attribute("placeholder", "type here...");
  inputField.attribute("maxlength", "500");
  inputField.style("font-family", "'Schibsted Grotesk',sans-serif");
  inputField.style("font-size", "15px");
  inputField.style("color", "#000");
  inputField.style("background", "transparent");
  inputField.style("border", "none");
  inputField.style("border-bottom", "1px solid rgba(0,0,0,0.12)");
  inputField.style("outline", "none");
  inputField.style("resize", "none");
  inputField.style("line-height", "1.65");
  inputField.style("letter-spacing", "0.02em");
  inputField.style("display", "none");
  inputField.style("opacity", "0");
  inputField.style("transition", "opacity 0.6s ease");
  positionInput();

  submitBtn = createButton("submit");
  submitBtn.style("font-family", "'Schibsted Grotesk',sans-serif");
  submitBtn.style("font-size", "11px");
  submitBtn.style("color", "rgba(0,0,0,0.3)");
  submitBtn.style("background", "transparent");
  submitBtn.style("border", "1px solid rgba(0,0,0,0.1)");
  submitBtn.style("padding", "8px 32px");
  submitBtn.style("cursor", "pointer");
  submitBtn.style("letter-spacing", "0.1em");
  submitBtn.style("display", "none");
  submitBtn.style("opacity", "0");
  submitBtn.style("transition", "opacity 0.5s ease");
  submitBtn.mousePressed(onSubmit);
  positionSubmit();
}

function positionInput() {
  var fw = min(460, width * 0.55);
  inputField.style("width", fw + "px");
  inputField.style("height", "110px");
  inputField.position(width / 2 - fw / 2, height / 2 - 20);
}
function positionSubmit() {
  submitBtn.position(width / 2 - 38, height / 2 + 115);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionInput();
  positionSubmit();
}

// ============================================================
// TITLE
// ============================================================
function drawTitle() {
  background(255);
  titleFadeIn = min(titleFadeIn + 0.01, 1);
  textFont("Schibsted Grotesk"); textAlign(CENTER, CENTER); noStroke();
  var word = "EXPRESSION";
  var sz = max(12, min(width, height) * 0.018); textSize(sz);
  for (var i = 0; i < 35; i++) {
    var cx = width/2 + sin(i*1.7 + globalFrame*0.003) * width*0.35;
    var cy = height/2 + cos(i*2.3 + globalFrame*0.004) * height*0.35;
    fill(0, titleFadeIn * 0.1 * 255);
    text(word.charAt(i % word.length), cx, cy);
  }
  var el = millis() - stateTimer;
  if (el > 800) {
    var a = min((el-800)/1200, 1) * 0.35 * titleFadeIn;
    fill(0, a*255); textSize(max(11, min(width,height)*0.013));
    text("click to begin", width/2, height/2);
  }
}

// ============================================================
// TYPING
// ============================================================
function showTypingUI() {
  inputField.style("display","block"); submitBtn.style("display","block");
  setTimeout(function(){
    inputField.style("opacity","1"); submitBtn.style("opacity","1");
    inputField.elt.focus();
  }, 400);
}
function drawTyping() {
  background(255); textFont("Schibsted Grotesk"); textAlign(CENTER,CENTER); noStroke();
  fill(0, 0.25*255); textSize(max(11, min(width,height)*0.013));
  text("how did you find this experience?", width/2, height/2 - 80);
}
function onSubmit() {
  if (state !== "TYPING") return;
  userText = inputField.value().trim();
  if (userText.length < 3) userText = "I felt something I can't really describe. It was weird and kind of beautiful.";
  systemText = buildSystemText(userText);
  inputField.attribute("readonly","true");
  inputField.style("cursor","default");
  submitBtn.style("opacity","0.15");
  submitBtn.style("pointer-events","none");
  takeoverPhase = "ERASE";
  takeoverCharIndex = userText.length;
  takeoverTimer = millis();
  state = "TAKEOVER"; stateTimer = millis();
}

// ============================================================
// TAKEOVER
// ============================================================
function drawTakeover() {
  background(255); textFont("Schibsted Grotesk"); noStroke();
  fill(0, 0.12*255); textSize(9); textAlign(CENTER,CENTER);
  var now = millis();
  if (takeoverPhase === "ERASE") {
    text("REFINING RESPONSE", width/2, height/2-80);
    if (now - takeoverTimer > eraseSpeed) {
      takeoverTimer = now;
      if (takeoverCharIndex > 0) { takeoverCharIndex--; inputField.elt.value = userText.substring(0,takeoverCharIndex) + "\u258C"; }
      else { inputField.elt.value = "\u258C"; takeoverPhase = "WAIT"; takeoverTimer = now; }
    }
  } else if (takeoverPhase === "WAIT") {
    text("REFINING RESPONSE", width/2, height/2-80);
    inputField.elt.value = (Math.floor(now/400)%2===0) ? "\u258C" : "";
    if (now - takeoverTimer > 1200) { takeoverPhase = "RETYPE"; takeoverCharIndex = 0; takeoverTimer = now; }
  } else if (takeoverPhase === "RETYPE") {
    text("OPTIMIZED OUTPUT", width/2, height/2-80);
    if (now - takeoverTimer > retypeSpeed) {
      takeoverTimer = now;
      if (takeoverCharIndex < systemText.length) { takeoverCharIndex++; inputField.elt.value = systemText.substring(0,takeoverCharIndex) + "\u258C"; }
      else { inputField.elt.value = systemText; takeoverPhase = "PAUSE_BEFORE_CURSOR"; takeoverTimer = now; }
    }
  } else if (takeoverPhase === "PAUSE_BEFORE_CURSOR") {
    text("OPTIMIZED OUTPUT", width/2, height/2-80);
    if (now - takeoverTimer > 1000) {
      submitBtn.style("display","block"); submitBtn.style("opacity","1"); submitBtn.style("pointer-events","none");
      fakeCursorStartX = width/2; fakeCursorStartY = height/2 + 80;
      fakeCursorTargetX = width/2; fakeCursorTargetY = height/2 + 129;
      fakeCursorX = fakeCursorStartX; fakeCursorY = fakeCursorStartY;
      fakeCursorVisible = true; cursorAnimStart = now; takeoverPhase = "CURSOR_MOVE";
    }
  } else if (takeoverPhase === "CURSOR_MOVE") {
    text("SUBMITTING", width/2, height/2-80);
    var t = Math.min((now - cursorAnimStart)/900, 1);
    t = t<0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    fakeCursorX = fakeCursorStartX + (fakeCursorTargetX - fakeCursorStartX)*t;
    fakeCursorY = fakeCursorStartY + (fakeCursorTargetY - fakeCursorStartY)*t;
    drawFakeCursor(fakeCursorX, fakeCursorY);
    if (t >= 1) { takeoverPhase = "CURSOR_CLICK"; cursorAnimStart = now; }
  } else if (takeoverPhase === "CURSOR_CLICK") {
    text("SUBMITTING", width/2, height/2-80);
    drawFakeCursor(fakeCursorTargetX, fakeCursorTargetY);
    var el2 = now - cursorAnimStart;
    if (el2 < 150) { submitBtn.style("border-color","rgba(0,0,0,0.4)"); submitBtn.style("color","rgba(0,0,0,0.6)"); }
    else if (el2 < 400) { submitBtn.style("border-color","rgba(0,0,0,0.1)"); submitBtn.style("color","rgba(0,0,0,0.3)"); }
    else if (el2 > 600) { fakeCursorVisible = false; submitBtn.style("opacity","0"); inputField.style("opacity","0"); takeoverPhase = "FADE_OUT"; cursorAnimStart = now; }
  } else if (takeoverPhase === "FADE_OUT") {
    if (now - cursorAnimStart > 800) { 
      inputField.style("display","none"); 
      submitBtn.style("display","none"); 
      // Hide p5 canvas before switching to feed
      var cnv = document.querySelector("canvas[style*='position']");
      if (!cnv) cnv = document.querySelector("canvas");
      if (cnv) cnv.style.display = "none";
      state = "FEED"; 
      stateTimer = millis(); 
      feedBuilt = false; 
      buildFeedDOM(); 
    }
  }
}

function drawFakeCursor(cx, cy) {
  if (!fakeCursorVisible) return;
  push(); fill(0,180); noStroke();
  beginShape(); vertex(cx,cy); vertex(cx,cy+16); vertex(cx+5,cy+12);
  vertex(cx+10,cy+18); vertex(cx+12,cy+16); vertex(cx+7,cy+10); vertex(cx+12,cy+8);
  endShape(CLOSE); pop();
}

// ============================================================
// PRELOAD ALL IMAGES — fixed for local file server
// ============================================================
var preloadedImages = {};
var preloadCount = 0;
var preloadTotal = 0;
var allImageNames = [];

function preloadAllImages(callback) {
  allImageNames = buildFullImageList();
  preloadTotal = allImageNames.length;
  preloadCount = 0;

  console.log("Starting preload of", preloadTotal, "images");

  if (preloadTotal === 0) {
    console.warn("No images in list!");
    callback();
    return;
  }

  var allLoaded = function() {
    if (preloadCount >= preloadTotal) {
      console.log("Preload finished. Loaded:", Object.keys(preloadedImages).length, "images");
      callback();
    }
  };

  for (var i = 0; i < allImageNames.length; i++) {
    (function(name, idx) {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function() {
        console.log("Loaded image", idx, ":", name);
        preloadedImages[name] = img;
        preloadCount++;
        allLoaded();
      };
      img.onerror = function(e) {
        console.log("Failed to load image", idx, ":", name, e);
        preloadCount++;
        allLoaded();
      };
      var src = "videos/" + name.replace(/ /g, "%20");
      console.log("Loading:", src);
      img.src = src;
    })(allImageNames[i], i);
  }
}

// ============================================================
// CONVERT IMAGE TO ASCII GRID (done once per image)
// Same exact approach as level 2 webcam
// ============================================================
function imageToAsciiGrid(img, cols, rows) {
  var c = document.createElement("canvas");
  c.width = cols; c.height = rows;
  var ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, cols, rows);
  var px = ctx.getImageData(0, 0, cols, rows).data;
  var grid = [];
  for (var r = 0; r < rows; r++) {
    grid[r] = [];
    for (var co = 0; co < cols; co++) {
      var idx = (r * cols + co) * 4;
      var bright = px[idx]*0.299 + px[idx+1]*0.587 + px[idx+2]*0.114;
      var normalized = bright / 255;
      var ci = Math.floor(normalized * (DENSE_CHARS.length - 1));
      ci = Math.max(0, Math.min(DENSE_CHARS.length - 1, ci));
      var ch = DENSE_CHARS.charAt(ci);
      grid[r][co] = ch;
    }
  }
  return grid;
}

// Render grid to canvas with flicker
function renderGrid(grid, canvas, cols, rows, cw, ch, frame) {
  var ctx = canvas.getContext("2d");
  var s = 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = (ch * s) + "px monospace";
  ctx.textBaseline = "top";
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (grid[r][c] === " ") continue;
      var flicker = 0.85 + Math.random() * 0.15;
      var shimmer = Math.sin(frame * 0.05 + r * 0.4 + c * 0.25) * 0.06;
      var a = Math.max(0.08, Math.min(0.92, flicker + shimmer));
      ctx.fillStyle = "rgba(0,0,0," + a.toFixed(2) + ")";
      ctx.fillText(grid[r][c], c * cw * s, r * ch * s);
    }
  }
}

// ============================================================
// BUILD FEED — TikTok style: centered card, autoscroll between images
// ============================================================
var cardData = []; // { grid, canvas, cols, rows, cw, ch, frame }
var currentCardIndex = 0;

function buildFeedDOM() {
  if (feedBuilt) return;
  feedBuilt = true;
  cardData = [];
  currentCardIndex = 0;

  // Kill p5 canvas immediately
  var cnv = document.querySelector("canvas");
  if (cnv) {
    cnv.style.display = "none !important";
    cnv.style.visibility = "hidden !important";
    cnv.style.pointerEvents = "none !important";
    cnv.style.width = "0px !important";
    cnv.style.height = "0px !important";
  }

  // Container — full viewport, white bg
  feedContainer = document.createElement("div");
  feedContainer.id = "fc";
  feedContainer.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;";
  document.body.appendChild(feedContainer);

  // X button
  var xBtn = document.createElement("div");
  xBtn.innerHTML = "\u2715";
  xBtn.style.cssText = "position:fixed;top:20px;right:24px;z-index:10010;width:32px;height:32px;border-radius:50%;border:1px solid rgba(0,0,0,0.15);color:rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;font-size:14px;cursor:pointer;background:rgba(255,255,255,0.9);font-family:'Schibsted Grotesk',sans-serif;";
  xBtn.onclick = function(e) { e.stopPropagation(); showXPopup(); };
  document.body.appendChild(xBtn);

  // Progress bar
  var prog = document.createElement("div");
  prog.id = "fp";
  prog.style.cssText = "position:fixed;top:0;left:0;height:2px;background:rgba(0,0,0,0.12);z-index:10010;width:0%;transition:width 0.5s linear;";
  document.body.appendChild(prog);

  // Popup layer
  var popups = document.createElement("div");
  popups.id = "fpop";
  popups.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10020;";
  document.body.appendChild(popups);

  // Caption overlay
  var captionOverlay = document.createElement("div");
  captionOverlay.id = "fcap";
  captionOverlay.style.cssText = "position:fixed;bottom:40px;left:50%;transform:translateX(-50%);z-index:10005;text-align:center;";
  document.body.appendChild(captionOverlay);

  // Preload then build
  preloadAllImages(function() {
    var cardW = Math.min(500, window.innerWidth - 40);
    var cardH = Math.round(cardW * 0.56);
    var cw = 7, ch = 11;
    var cols = Math.floor(cardW / cw);
    var rows = Math.floor(cardH / ch);

    var loadedCount = 0;
    for (var i = 0; i < allImageNames.length; i++) {
      var name = allImageNames[i];
      var img = preloadedImages[name];
      if (!img) continue;
      loadedCount++;

      var cv = document.createElement("canvas");
      cv.width = cardW * 2;
      cv.height = cardH * 2;
      cv.style.cssText = "display:none;width:" + cardW + "px;height:" + cardH + "px;border:1px solid rgba(0,0,0,0.1);";

      try {
        var grid = imageToAsciiGrid(img, cols, rows);
        renderGrid(grid, cv, cols, rows, cw, ch, 0);
        cardData.push({ grid: grid, canvas: cv, cols: cols, rows: rows, cw: cw, ch: ch, frame: 0, caption: CAPTIONS[i % CAPTIONS.length], likes: Math.random()*500+10 });
        feedContainer.appendChild(cv);
      } catch (e) {
        console.error("Error converting image:", name, e);
      }
    }
    
    // Show first card
    if (cardData.length > 0) {
      cardData[0].canvas.style.display = "block";
      updateCaption(0);
    }

    // Start animation & scroll loops
    requestAnimationFrame(animateCards);
  });

  feedStartTime = Date.now();
  feedScrollY = 0;
  requestAnimationFrame(scrollFeed);
}

// Update caption for current card
function updateCaption(idx) {
  if (idx >= cardData.length) return;
  var cap = document.getElementById("fcap");
  if (!cap) return;
  var d = cardData[idx];
  cap.innerHTML = "<div style=\"font-size:8px;color:rgba(0,0,0,0.12);letter-spacing:0.05em;font-family:'Schibsted Grotesk',sans-serif;\"><div>" + d.caption + "</div><div>" + d.likes.toFixed(1) + "K</div></div>";
}

// Single animation loop for all cards
function animateCards() {
  if (state !== "FEED") return;
  var d = cardData[currentCardIndex];
  if (d) {
    d.frame++;
    if (d.frame % 10 === 0) {
      renderGrid(d.grid, d.canvas, d.cols, d.rows, d.cw, d.ch, d.frame);
    }
  }
  requestAnimationFrame(animateCards);
}

// ============================================================
// AUTOSCROLL — smooth snap to next image every N ms
// ============================================================
function scrollFeed() {
  if (state !== "FEED") return;
  var elapsed = Date.now() - feedStartTime;
  var imagesPerScroll = 3000; // 3 sec per image
  var nextCardIdx = Math.floor(elapsed / imagesPerScroll);

  // Update card display
  if (nextCardIdx !== currentCardIndex && nextCardIdx < cardData.length) {
    cardData[currentCardIndex].canvas.style.display = "none";
    currentCardIndex = nextCardIdx;
    cardData[currentCardIndex].canvas.style.display = "block";
    updateCaption(currentCardIndex);
  }

  var bar = document.getElementById("fp");
  if (bar) bar.style.width = (Math.min(elapsed / feedDuration, 1) * 100) + "%";

  if (elapsed >= feedDuration || currentCardIndex >= cardData.length) {
    cleanupFeed();
    state = "GOODBYE"; stateTimer = millis(); goodbyeTimer = millis();
    var cnv = document.querySelector("canvas");
    if (cnv) cnv.style.display = "block";
    return;
  }
  feedAnimFrame = requestAnimationFrame(scrollFeed);
}

function cleanupFeed() {
  if (feedAnimFrame) cancelAnimationFrame(feedAnimFrame);
  cardData = [];
  var ids = ["fc","fp","fpop","fcap"];
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.remove();
  }
  // Also remove X button
  var btns = document.querySelectorAll("div");
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].innerHTML === "\u2715" && btns[i].style.position === "fixed") btns[i].remove();
  }
}

function showXPopup() {
  var msgs = ["you can't leave yet","session in progress","content requires your attention",
    "navigation disabled","please continue viewing","exit is not available",
    "your session is being recorded","you agreed to this","closing is not an option","please remain engaged"];
  var popups = document.getElementById("fpop");
  if (!popups) return;
  var p = document.createElement("div");
  p.style.cssText = "position:absolute;right:" + (20+Math.random()*60) + "px;top:" + (40+Math.random()*50) + "px;font-size:10px;color:rgba(0,0,0,0.35);font-family:'Schibsted Grotesk',sans-serif;opacity:0;transition:opacity 0.3s;pointer-events:none;letter-spacing:0.03em;";
  p.textContent = msgs[Math.floor(Math.random() * msgs.length)];
  popups.appendChild(p);
  setTimeout(function(){ p.style.opacity = "1"; }, 30);
  setTimeout(function(){ p.style.opacity = "0"; setTimeout(function(){ p.remove(); }, 400); }, 2200);
}

// ============================================================
// GOODBYE
// ============================================================
function drawGoodbye() {
  background(255);
  var elapsed = millis() - goodbyeTimer;
  var fadeIn = constrain(elapsed / 2000, 0, 1);
  textFont("Schibsted Grotesk"); textAlign(CENTER, CENTER); noStroke();
  fill(0, fadeIn * 0.35 * 255); textSize(max(13, min(width,height) * 0.018));
  text("see you soon", width/2, height/2);
}

// ============================================================
// DRAW
// ============================================================
function draw() {
  globalFrame++;
  switch (state) {
    case "TITLE": drawTitle(); break;
    case "TYPING": drawTyping(); break;
    case "TAKEOVER": drawTakeover(); break;
    case "FEED": break; // Feed is DOM-based, not p5-drawn
    case "GOODBYE": drawGoodbye(); break;
  }
  if (state === "TITLE" || state === "GOODBYE") {
    stroke(0,50); strokeWeight(0.8); noFill();
    line(mouseX-10, mouseY, mouseX+10, mouseY);
    line(mouseX, mouseY-10, mouseX, mouseY+10);
    noStroke(); fill(0,50); ellipse(mouseX, mouseY, 2.5, 2.5);
  }
}

function mousePressed() {
  if (state === "TITLE") { state = "TYPING"; stateTimer = millis(); showTypingUI(); }
}
function keyPressed() {
  if (state === "FEED" || state === "TAKEOVER") { if (keyCode === ESCAPE) { showXPopup(); return false; } }
  return true;
}
