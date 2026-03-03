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
var feedDuration=30000;
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
  // Collect remaining (only up to 25, that's what exists)
  var remaining = [];
  for (var i = 2; i <= 25; i++) {
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
  // Immediately lock state so this can never fire twice
  state = "TAKEOVER";
  submitBtn.mousePressed(function(){}); // replace p5 binding with no-op

  var typed = inputField.value().trim();
  // Use what's actually visible in the field as userText (what gets erased)
  // If too short, use it as-is for the erase — fallback only affects systemText
  userText = typed.length > 0 ? typed : "ok";
  var textForSystem = typed.length >= 3 ? typed : "I felt something I can't really describe. It was weird and kind of beautiful.";
  systemText = buildSystemText(textForSystem);
  // Do NOT change inputField.elt.value here — it already shows exactly what user typed
  inputField.attribute("readonly","true");
  inputField.style("cursor","default");
  submitBtn.style("opacity","0.15");
  submitBtn.style("pointer-events","none");
  takeoverPhase = "ERASE";
  takeoverCharIndex = userText.length;
  takeoverTimer = millis();
  stateTimer = millis();
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
      if (takeoverCharIndex > 0) {
        takeoverCharIndex--;
        inputField.elt.value = userText.substring(0, takeoverCharIndex) + "\u258C";
      } else {
        inputField.elt.value = "\u258C";
        takeoverPhase = "WAIT";
        takeoverTimer = now;
      }
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
      // Show button visually but ensure it can never be clicked (no-op handler already set in onSubmit)
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

  var allLoaded = function() {
    if (preloadCount >= preloadTotal) callback();
  };

  for (var i = 0; i < allImageNames.length; i++) {
    (function(name) {
      var img = new Image();
      img.onload = function() {
        preloadedImages[name] = img;
        preloadCount++;
        allLoaded();
      };
      img.onerror = function() {
        preloadCount++;
        allLoaded();
      };
      img.src = "videos/" + name.replace(/ /g, "%20");
    })(allImageNames[i]);
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

// Render grid to canvas with subtle drifting characters — readable but alive
function renderGrid(grid, canvas, cols, rows, cw, ch, frame) {
  var ctx = canvas.getContext("2d");
  var s = 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = (ch * s) + "px monospace";
  ctx.textBaseline = "top";
  var dlen = DENSE_CHARS.length;
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var baseChar = grid[r][c];
      if (baseChar === " ") continue;
      var baseIdx = DENSE_CHARS.indexOf(baseChar);
      if (baseIdx < 0) baseIdx = dlen - 3;

      // Slow independent per-cell drift — max ±1 step so image stays readable
      var phase = (r * 7 + c * 13 + frame) * 0.018;
      var drift = Math.sin(phase) + Math.sin(phase * 1.7 + 0.9) * 0.5;
      // Only cross a character boundary when drift exceeds 0.75
      var driftStep = Math.abs(drift) > 0.75 ? (drift > 0 ? 1 : -1) : 0;
      var ci = Math.max(0, Math.min(dlen - 1, baseIdx + driftStep));
      var ch2 = DENSE_CHARS.charAt(ci);
      if (ch2 === " ") ch2 = DENSE_CHARS.charAt(Math.max(0, ci - 1));

      // Gentle brightness flicker — keeps contrast high
      var flicker = 0.88 + Math.random() * 0.12;
      var shimmer = Math.sin(frame * 0.04 + r * 0.3 + c * 0.2) * 0.04;
      var a = Math.max(0.1, Math.min(0.96, flicker + shimmer));
      ctx.fillStyle = "rgba(0,0,0," + a.toFixed(2) + ")";
      ctx.fillText(ch2, c * cw * s, r * ch * s);
    }
  }
}

// ============================================================
// BUILD FEED — TikTok style: full-screen cards that SLIDE UP
// with live like counts, action bar, interstitial ads, floating hearts
// ============================================================
var cardData = [];
var currentCardIndex = 0;
var isScrolling = false;
var likeCounters = []; // live like counter timeouts

var AD_MESSAGES = [
  ["your attention has been sold", "ad · optimized for you"],
  ["this message was purchased", "ad · data-matched to your profile"],
  ["you were predicted to stop here", "sponsored · behavioral targeting active"],
  ["your scroll pattern triggered this", "ad · engagement probability: 94%"],
  ["this interruption was scheduled", "ad · your attention is the product"],
];

var USERNAMES = [
  "@user_38291","@xo_content","@real.human.38","@not_a_bot_lol",
  "@ur.fav.algo","@content.machine","@optimized.u","@data.node.77",
  "@verified.user","@the.feed.goes","@scroll.forever","@ur.still.here"
];
var HASHTAGS = [
  "#foryou #fyp #trending","#viral #relatable #mood",
  "#optimized #content #feed","#youcantstop #scrolling #fy",
  "#recommended #foryoupage #data","#thiswasmadefoyu #watch #stay",
  "#engagement #retention #views","#algorithm #recommended #you"
];
var SONGS = [
  "♪ original sound - user_38291","♪ trending audio - optimized",
  "♪ for you - the algorithm","♪ you can't skip this - feed",
  "♪ still watching - content.co","♪ recommended - system_audio",
  "♪ auto-play - retention_mix","♪ loop forever - data.wav"
];
function buildFeedDOM() {
  if (feedBuilt) return;
  feedBuilt = true;
  cardData = [];
  currentCardIndex = 0;
  isScrolling = false;

  // Kill p5 canvas
  var p5cnv = document.querySelector("canvas");
  if (p5cnv) { p5cnv.style.display = "none"; p5cnv.style.visibility = "hidden"; }

  // Full-screen white container — this is the viewport
  feedContainer = document.createElement("div");
  feedContainer.id = "fc";
  feedContainer.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:99999;overflow:hidden;font-family:'Schibsted Grotesk',sans-serif;";
  document.body.appendChild(feedContainer);

  // The scrolling track
  var track = document.createElement("div");
  track.id = "ftrack";
  track.style.cssText = "position:absolute;top:0;left:0;width:100%;will-change:transform;";
  feedContainer.appendChild(track);

  // Progress bar (top)
  var prog = document.createElement("div");
  prog.id = "fp";
  prog.style.cssText = "position:fixed;top:0;left:0;height:2px;background:rgba(0,0,0,0.18);z-index:100010;width:0%;transition:width 0.4s linear;";
  document.body.appendChild(prog);

  // Popup/overlay layer
  var popups = document.createElement("div");
  popups.id = "fpop";
  popups.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100020;";
  document.body.appendChild(popups);

  // X button
  var xBtn = document.createElement("div");
  xBtn.id = "fxbtn";
  xBtn.innerHTML = "\u2715";
  xBtn.style.cssText = "position:fixed;top:18px;right:22px;z-index:100010;width:30px;height:30px;border-radius:50%;border:1px solid rgba(0,0,0,0.12);color:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;background:#fff;font-family:'Schibsted Grotesk',sans-serif;";
  xBtn.onclick = function(e) { e.stopPropagation(); showXPopup(); };
  document.body.appendChild(xBtn);

  // Loading indicator
  var loader = document.createElement("div");
  loader.id = "fload";
  loader.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:10px;color:rgba(0,0,0,0.15);font-family:'Schibsted Grotesk',sans-serif;letter-spacing:0.12em;";
  loader.textContent = "LOADING";
  feedContainer.appendChild(loader);

  preloadAllImages(function() {
    var l = document.getElementById("fload");
    if (l) l.remove();

    var vw = window.innerWidth;
    var vh = window.innerHeight;

    var cardW = Math.min(390, vw - 32);
    var cardH = Math.round(cardW * 1.45);
    if (cardH > vh - 140) { cardH = vh - 140; cardW = Math.round(cardH / 1.45); }

    var cw = 6, ch = 10;
    var cols = Math.floor(cardW / cw);
    var rows = Math.floor(cardH / ch);

    var ftrack = document.getElementById("ftrack");
    ftrack.style.cssText = "position:absolute;top:0;left:0;width:100%;display:flex;flex-direction:column;will-change:transform;";

    for (var i = 0; i < allImageNames.length; i++) {
      var img = preloadedImages[allImageNames[i]];
      if (!img) continue;

      var likesBase = Math.floor(Math.random()*480 + 12);
      var commentsBase = Math.floor(Math.random()*120 + 3);
      var sharesBase = Math.floor(Math.random()*80 + 1);
      var username = USERNAMES[i % USERNAMES.length];
      var hashtag = HASHTAGS[i % HASHTAGS.length];
      var song = SONGS[i % SONGS.length];
      var caption = CAPTIONS[i % CAPTIONS.length];

      // shared mutable state for this card's numbers
      var cardNums = { likes: likesBase, comments: commentsBase, shares: sharesBase, viewers: Math.floor(Math.random()*8000+400) };

      // Full-screen slide
      var slide = document.createElement("div");
      slide.style.cssText = "width:100%;height:"+vh+"px;display:flex;align-items:center;justify-content:center;background:#fff;flex-shrink:0;position:relative;overflow:hidden;";

      // ASCII canvas
      var cv = document.createElement("canvas");
      cv.className = "feed-card";
      cv.width  = cols * cw * 2;
      cv.height = rows * ch * 2;
      cv.style.cssText = "position:static !important;display:block;width:"+cardW+"px;height:"+cardH+"px;flex-shrink:0;";

      var grid = imageToAsciiGrid(img, cols, rows);
      renderGrid(grid, cv, cols, rows, cw, ch, 0);
      slide.appendChild(cv);

      // ── RIGHT ACTION BAR (like TikTok right side) ──
      var bar = document.createElement("div");
      bar.style.cssText = "position:absolute;right:14px;bottom:90px;display:flex;flex-direction:column;align-items:center;gap:18px;z-index:10;";

      // Like button + live counter
      var likeWrap = document.createElement("div");
      likeWrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;";
      var likeHeart = document.createElement("div");
      likeHeart.style.cssText = "font-size:26px;line-height:1;transition:transform 0.15s;user-select:none;";
      likeHeart.textContent = "♡";
      var likeNum = document.createElement("div");
      likeNum.style.cssText = "font-size:9px;color:rgba(0,0,0,0.35);letter-spacing:0.04em;font-family:'Schibsted Grotesk',sans-serif;min-width:30px;text-align:center;";
      likeNum.textContent = cardNums.likes + "K";
      likeWrap.onclick = (function(lh, ln, nums) {
        return function() {
          lh.textContent = "♥"; lh.style.transform = "scale(1.4)";
          lh.style.color = "#000";
          setTimeout(function(){ lh.style.transform = "scale(1)"; }, 200);
          nums.likes += Math.floor(Math.random()*3+1);
          ln.textContent = nums.likes + "K";
          spawnFloatingHeart();
        };
      })(likeHeart, likeNum, cardNums);
      likeWrap.appendChild(likeHeart); likeWrap.appendChild(likeNum);

      // Comment button
      var cmtWrap = document.createElement("div");
      cmtWrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:3px;";
      var cmtIcon = document.createElement("div");
      cmtIcon.style.cssText = "font-size:22px;line-height:1;color:rgba(0,0,0,0.5);";
      cmtIcon.textContent = "◎";
      var cmtNum = document.createElement("div");
      cmtNum.style.cssText = "font-size:9px;color:rgba(0,0,0,0.35);letter-spacing:0.04em;font-family:'Schibsted Grotesk',sans-serif;";
      cmtNum.textContent = cardNums.comments + "";
      cmtWrap.appendChild(cmtIcon); cmtWrap.appendChild(cmtNum);

      // Share button
      var shrWrap = document.createElement("div");
      shrWrap.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:3px;";
      var shrIcon = document.createElement("div");
      shrIcon.style.cssText = "font-size:20px;line-height:1;color:rgba(0,0,0,0.5);";
      shrIcon.textContent = "↗";
      var shrNum = document.createElement("div");
      shrNum.style.cssText = "font-size:9px;color:rgba(0,0,0,0.35);letter-spacing:0.04em;font-family:'Schibsted Grotesk',sans-serif;";
      shrNum.textContent = cardNums.shares + "";
      shrWrap.appendChild(shrIcon); shrWrap.appendChild(shrNum);

      // Spinning disc avatar
      var disc = document.createElement("div");
      disc.style.cssText = "width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:16px;animation:spinDisc 4s linear infinite;";
      disc.textContent = "♫";

      bar.appendChild(likeWrap);
      bar.appendChild(cmtWrap);
      bar.appendChild(shrWrap);
      bar.appendChild(disc);
      slide.appendChild(bar);

      // ── BOTTOM OVERLAY: username + caption + song ──
      var bottomInfo = document.createElement("div");
      bottomInfo.style.cssText = "position:absolute;left:14px;bottom:28px;max-width:calc(100% - 80px);z-index:10;";

      var usernameEl = document.createElement("div");
      usernameEl.style.cssText = "font-size:11px;font-weight:700;color:rgba(0,0,0,0.55);letter-spacing:0.03em;font-family:'Schibsted Grotesk',sans-serif;margin-bottom:3px;";
      usernameEl.textContent = username;

      var captionEl2 = document.createElement("div");
      captionEl2.style.cssText = "font-size:9px;color:rgba(0,0,0,0.38);letter-spacing:0.04em;font-family:'Schibsted Grotesk',sans-serif;margin-bottom:4px;line-height:1.5;";
      captionEl2.textContent = caption;

      var hashEl = document.createElement("div");
      hashEl.style.cssText = "font-size:9px;color:rgba(0,0,0,0.28);letter-spacing:0.05em;font-family:'Schibsted Grotesk',sans-serif;margin-bottom:5px;";
      hashEl.textContent = hashtag;

      var songEl = document.createElement("div");
      songEl.style.cssText = "font-size:8px;color:rgba(0,0,0,0.22);letter-spacing:0.04em;font-family:'Schibsted Grotesk',sans-serif;display:flex;align-items:center;gap:4px;";
      songEl.textContent = song;

      bottomInfo.appendChild(usernameEl);
      bottomInfo.appendChild(captionEl2);
      bottomInfo.appendChild(hashEl);
      bottomInfo.appendChild(songEl);
      slide.appendChild(bottomInfo);

      // ── LIVE VIEWER COUNT (top left, animated) ──
      var viewWrap = document.createElement("div");
      viewWrap.style.cssText = "position:absolute;top:18px;left:14px;z-index:10;display:flex;align-items:center;gap:5px;";
      var viewDot = document.createElement("div");
      viewDot.style.cssText = "width:6px;height:6px;border-radius:50%;background:rgba(0,0,0,0.25);animation:pulseDot 1.2s ease-in-out infinite;";
      var viewCount = document.createElement("div");
      viewCount.style.cssText = "font-size:9px;color:rgba(0,0,0,0.25);letter-spacing:0.06em;font-family:'Schibsted Grotesk',sans-serif;";
      viewCount.textContent = cardNums.viewers.toLocaleString() + " watching";
      viewWrap.appendChild(viewDot); viewWrap.appendChild(viewCount);
      slide.appendChild(viewWrap);

      ftrack.appendChild(slide);

      cardData.push({
        grid: grid, canvas: cv, slide: slide,
        cols: cols, rows: rows, cw: cw, ch: ch,
        frame: 0,
        caption: caption, username: username,
        likeNum: likeNum, cmtNum: cmtNum, viewCount: viewCount,
        nums: cardNums
      });

      // Insert an ad slide after every 3 content posts
      if ((cardData.length) % 3 === 0) {
        var adIdx = Math.floor(cardData.length / 3 - 1) % AD_MESSAGES.length;
        var adMsg = AD_MESSAGES[adIdx];
        var isStillWatching = (adIdx === 0); // first ad is always the "still watching" one

        var adSlide = document.createElement("div");
        adSlide.style.cssText = "width:100%;height:"+vh+"px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0a0a0a;flex-shrink:0;position:relative;gap:0;";

        if (isStillWatching) {
          // ── ARE YOU STILL WATCHING? — Netflix-style interstitial ──
          var stillBg = document.createElement("div");
          stillBg.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;background:linear-gradient(to bottom,rgba(0,0,0,0.4) 0%,rgba(0,0,0,0.85) 100%);";
          adSlide.appendChild(stillBg);

          var stillBox = document.createElement("div");
          stillBox.style.cssText = "position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:18px;text-align:center;padding:40px 36px;border:1px solid rgba(255,255,255,0.08);background:rgba(20,20,20,0.92);max-width:340px;";

          var stillTitle = document.createElement("div");
          stillTitle.style.cssText = "font-size:22px;color:#fff;font-family:'Schibsted Grotesk',sans-serif;font-weight:700;letter-spacing:0.01em;line-height:1.2;";
          stillTitle.textContent = "are you still watching?";

          var stillSub = document.createElement("div");
          stillSub.style.cssText = "font-size:11px;color:rgba(255,255,255,0.45);font-family:'Schibsted Grotesk',sans-serif;letter-spacing:0.05em;line-height:1.6;";
          stillSub.textContent = "your session is being monitored\ncontinued viewing confirms consent";
          stillSub.style.whiteSpace = "pre-line";

          var stillBtns = document.createElement("div");
          stillBtns.style.cssText = "display:flex;gap:12px;margin-top:6px;";

          var btnYes = document.createElement("div");
          btnYes.style.cssText = "padding:10px 28px;background:#fff;color:#000;font-size:11px;font-family:'Schibsted Grotesk',sans-serif;letter-spacing:0.1em;cursor:pointer;font-weight:600;";
          btnYes.textContent = "YES, CONTINUE";

          var btnNo = document.createElement("div");
          btnNo.style.cssText = "padding:10px 28px;background:transparent;color:rgba(255,255,255,0.4);font-size:11px;font-family:'Schibsted Grotesk',sans-serif;letter-spacing:0.1em;cursor:pointer;border:1px solid rgba(255,255,255,0.15);";
          btnNo.textContent = "EXIT";

          // Both buttons do nothing (can't leave)
          btnNo.onclick = function() {
            btnNo.textContent = "exit is not available";
            btnNo.style.color = "rgba(255,255,255,0.2)";
            btnNo.style.borderColor = "rgba(255,255,255,0.05)";
          };

          var stillNote = document.createElement("div");
          stillNote.style.cssText = "font-size:8px;color:rgba(255,255,255,0.15);font-family:'Schibsted Grotesk',sans-serif;letter-spacing:0.08em;margin-top:4px;";
          stillNote.textContent = "session id: " + Math.floor(Math.random()*900000+100000) + " · data retained";

          stillBtns.appendChild(btnYes);
          stillBtns.appendChild(btnNo);
          stillBox.appendChild(stillTitle);
          stillBox.appendChild(stillSub);
          stillBox.appendChild(stillBtns);
          stillBox.appendChild(stillNote);
          adSlide.appendChild(stillBox);

        } else {
          // ── GENERIC AD CARD ──
          adSlide.style.background = "#fff";
          var adTag = document.createElement("div");
          adTag.style.cssText = "font-size:8px;letter-spacing:0.18em;color:rgba(0,0,0,0.18);font-family:'Schibsted Grotesk',sans-serif;border:1px solid rgba(0,0,0,0.1);padding:3px 10px;margin-bottom:16px;";
          adTag.textContent = "SPONSORED";

          var adLine1 = document.createElement("div");
          adLine1.style.cssText = "font-size:18px;color:rgba(0,0,0,0.55);font-family:'Schibsted Grotesk',sans-serif;letter-spacing:0.04em;text-align:center;max-width:280px;line-height:1.4;";
          adLine1.textContent = adMsg[0];

          var adLine2 = document.createElement("div");
          adLine2.style.cssText = "font-size:9px;color:rgba(0,0,0,0.2);font-family:'Schibsted Grotesk',sans-serif;letter-spacing:0.08em;margin-top:10px;";
          adLine2.textContent = adMsg[1];

          adSlide.appendChild(adTag);
          adSlide.appendChild(adLine1);
          adSlide.appendChild(adLine2);
        }

        ftrack.appendChild(adSlide);

        // Push dummy entry so currentCardIndex stays in sync
        cardData.push({
          grid: null, canvas: null, slide: adSlide,
          cols: 0, rows: 0, cw: 0, ch: 0,
          frame: 0, caption: "", username: "",
          likeNum: { textContent:"", style:{} },
          cmtNum: { textContent:"", style:{} },
          viewCount: { textContent:"", style:{} },
          nums: { likes: 0, comments: 0, shares: 0, viewers: 0 }
        });
      }
    }

    if (cardData.length === 0) return;

    // Inject keyframes for spinning disc, pulsing dot, and number bounce
    injectFeedStyles();

    feedStartTime = Date.now();
    currentCardIndex = 0;
    showFeedOverlay(0);

    requestAnimationFrame(flickerLoop);
    startLiveCounters();
    feedAnimFrame = setTimeout(advanceCard, 3000);
  });
}

function injectFeedStyles() {
  if (document.getElementById("feedkf")) return;
  var s = document.createElement("style");
  s.id = "feedkf";
  s.textContent = [
    "@keyframes spinDisc { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }",
    "@keyframes pulseDot { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }",
    "@keyframes numBounce { 0%{transform:translateY(0)} 30%{transform:translateY(-5px)} 60%{transform:translateY(2px)} 100%{transform:translateY(0)} }",
    "@keyframes heartFloat { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-120px) scale(1.6)} }"
  ].join("\n");
  document.head.appendChild(s);
}

// Show the HUD overlay for the current card (progress dots, etc.)
function showFeedOverlay(idx) {
  // nothing persistent needed here — bottom info & action bar live inside each slide
}

// Animate live viewer counts on current card randomly
function bumpNum(el, text) {
  el.textContent = text;
  // clone trick: remove and re-add class to restart CSS animation
  el.style.transform = "translateY(-6px)";
  el.style.transition = "transform 0.12s ease-out";
  setTimeout(function(){
    el.style.transform = "translateY(2px)";
    el.style.transition = "transform 0.08s ease-in";
    setTimeout(function(){
      el.style.transform = "translateY(0)";
      el.style.transition = "transform 0.1s ease-out";
    }, 80);
  }, 120);
}

function startLiveCounters() {
  function tick() {
    if (state !== "FEED") return;
    var d = cardData[currentCardIndex];
    // skip ad cards (no canvas)
    if (!d || !d.canvas) { likeCounters.push(setTimeout(tick, 500)); return; }

    // viewer count — always updates
    var vDelta = Math.floor(Math.random()*120) - 40;
    d.nums.viewers = Math.max(10, d.nums.viewers + vDelta);
    d.viewCount.textContent = d.nums.viewers.toLocaleString() + " watching";

    // likes — ~60% chance each tick
    if (Math.random() < 0.6) {
      d.nums.likes += Math.floor(Math.random()*4 + 1);
      bumpNum(d.likeNum, d.nums.likes + "K");
    }

    // comments — ~30% chance
    if (Math.random() < 0.3) {
      d.nums.comments += 1;
      bumpNum(d.cmtNum, d.nums.comments + "");
    }

    likeCounters.push(setTimeout(tick, 600 + Math.random()*600));
  }
  // start immediately
  likeCounters.push(setTimeout(tick, 400));
}

// Float a heart up from the right action bar area
function spawnFloatingHeart() {
  var popups = document.getElementById("fpop");
  if (!popups) return;
  var h = document.createElement("div");
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  h.style.cssText = "position:absolute;right:"+(18+Math.random()*40)+"px;bottom:"+(80+Math.random()*60)+"px;font-size:"+(18+Math.random()*16)+"px;opacity:1;pointer-events:none;animation:heartFloat "+(1.2+Math.random()*0.8)+"s ease-out forwards;";
  h.textContent = "♥";
  popups.appendChild(h);
  setTimeout(function(){ h.remove(); }, 2200);
}

// Auto-spawn hearts on the current card periodically
function autoHeartLoop() {
  if (state !== "FEED") return;
  if (Math.random() < 0.5) spawnFloatingHeart();
  setTimeout(autoHeartLoop, 600 + Math.random()*1200);
}
setTimeout(autoHeartLoop, 3500);

function showCaption(idx) {
  // captions are embedded in each slide's bottomInfo — no-op
}

// Flicker only the currently visible card — every frame for live character drift
function flickerLoop() {
  if (state !== "FEED") return;
  var d = cardData[currentCardIndex];
  if (d && d.canvas) {
    d.frame++;
    renderGrid(d.grid, d.canvas, d.cols, d.rows, d.cw, d.ch, d.frame);
  }
  requestAnimationFrame(flickerLoop);
}

// Slide the track up by one full viewport height — exactly like TikTok
function advanceCard() {
  if (state !== "FEED") return;

  var elapsed = Date.now() - feedStartTime;

  // Progress bar
  var bar = document.getElementById("fp");
  if (bar) bar.style.width = (Math.min(elapsed / feedDuration, 1) * 100) + "%";

  // End of feed or time up
  if (currentCardIndex >= cardData.length - 1 || elapsed >= feedDuration) {
    cleanupFeed();
    state = "GOODBYE"; stateTimer = millis(); goodbyeTimer = millis();
    var p5cnv = document.querySelector("canvas");
    if (p5cnv) { p5cnv.style.display = ""; p5cnv.style.visibility = ""; }
    return;
  }

  currentCardIndex++;
  var vh = window.innerHeight;

  var ftrack = document.getElementById("ftrack");
  if (ftrack) {
    ftrack.style.transition = "transform 0.55s cubic-bezier(0.4,0,0.2,1)";
    ftrack.style.transform = "translateY(-" + (currentCardIndex * vh) + "px)";
  }

  // Burst of number activity right as the new card lands
  setTimeout(function() {
    var d = cardData[currentCardIndex];
    if (!d || !d.canvas) return;
    d.nums.likes += Math.floor(Math.random()*8 + 2);
    bumpNum(d.likeNum, d.nums.likes + "K");
    d.nums.viewers += Math.floor(Math.random()*300 + 50);
    d.viewCount.textContent = d.nums.viewers.toLocaleString() + " watching";
  }, 600);

  feedAnimFrame = setTimeout(advanceCard, 3000);
}

function cleanupFeed() {
  if (feedAnimFrame) clearTimeout(feedAnimFrame);
  feedAnimFrame = null;
  for (var i = 0; i < likeCounters.length; i++) clearTimeout(likeCounters[i]);
  likeCounters = [];
  cardData = [];
  var ids = ["fc","fp","fpop","fxbtn","feedkf"];
  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.remove();
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
