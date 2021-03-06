var state = 0;
var balloonBlown = false;
var vol = 0;
var blowCount = 0;
var lowthr = 0.01;
var hithr = 0.5;
var hitrigger = false;

var title;
var subtitle;
var startButton;
var backButton;
var backButton2;
var instructions;

var ref;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  ref = Math.max(windowWidth, windowHeight);
  textFont('Baloo Bhaijaan');
  mic = new p5.AudioIn();
  title = new textObject('Breathe', windowWidth / 2, windowHeight / 4, CENTER, ref / 15);
  subtitle = new textObject('Try it on your mobile phone', windowWidth / 2, windowHeight / 3, CENTER, ref / 35);
  startButton = new textObject('Start', windowWidth / 2, 3 * windowHeight / 4, CENTER, ref / 35);
  backButton = new textObject('Back', 4 * windowWidth / 5, 7 * windowHeight / 8, CENTER, ref / 35);
  backButton2 = new textObject('Back', windowWidth / 2, 3 * windowHeight / 4, CENTER, ref / 35);
  instructions = new textObject('Blow on your microphone to help this balloon grow!', windowWidth / 2, windowHeight / 4, ref / 35);
  infos = new textObject('Well done! You just wasted 5ml of water! The average human consumes 0.5l of water a day, just by breathing. Make sure to drink a lot!', windowWidth / 2, windowHeight / 3, ref / 35);
}

function draw() {
  background('#bee9f3');
  switch (state) {
    //Home
    case 0:
      mic.stop();
      drawText(title);
      drawText(subtitle);
      drawText(startButton);
      break;
      //Game
    case 1:
      mic.start();
      if (balloonBlown == false) {
        drawText(backButton);
        drawText(instructions, 3 * windowWidth / 4);
        drawMaxSizeDash();
        checkBalloonBlown();
        drawBalloon();
        vol = mic.getLevel();
        checkThresh(vol);
      } else {
        state = 2;
      }
      break;
      //End Game
    case 2:
      mic.stop();
      drawText(infos, 3 * windowWidth / 4);
      drawText(backButton2);
      break;
      //Defaults to Home
    default:
      drawText(title);
      drawText(subtitle);
      drawText(startButton);
  }
}

function drawText(textObj) {
  var str = textObj.text;
  textAlign(textObj.align);
  textSize(textObj.fontSize);
  fill(255);
  text(str, textObj.posX, textObj.posY);
}

function drawText(textObj, boxW) {
  var str = textObj.text;
  textAlign(textObj.align);
  textSize(textObj.fontSize);
  fill(255);
  text(str, textObj.posX, textObj.posY, boxW);
}

function textObject(_text, _posX, _posY, _align, _fontSize) {
  this.text = _text;
  this.posX = _posX;
  this.posY = _posY;
  this.align = _align;
  this.fontSize = _fontSize;
}

function drawMaxSizeDash() {
  fill('rgba(255, 102, 0, 0.2)');
  var blwidth = width / 20 + 30 * 6;
  var blheight = height / 20 + 30 * 8;
  var blX = width / 2;
  var blY = 3 * height / 4 - blheight / 2;
  ellipse(blX, blY, blwidth, blheight);
}

function drawBalloon() {
  fill('rgba(255, 102, 0, 1)');
  var blwidth = width / 20 + blowCount * 6;
  var blheight = height / 20 + blowCount * 8;
  var blX = width / 2;
  var blY = 3 * height / 4 - blheight / 2;
  ellipse(blX, blY, blwidth, blheight);
  push();
  stroke(1);
  line(blX, blY + blheight / 2, blX, windowHeight);
  pop();
  push();
  noFill();
  stroke(1);
  ellipse(blX, blY, blwidth / 10, blwidth / 6);
  pop();
  push();
  fill(0);
  noStroke();
  ellipse(blX - blwidth / 4, blY - blheight / 4, blwidth / 8, blwidth / 8);
  ellipse(blX + blwidth / 4, blY - blheight / 4, blwidth / 8, blwidth / 8);
  pop();
}

function checkThresh(vol) {
  if (hitrigger == false) {
    if (vol > hithr) {
      hitrigger = true;
      blowCount++;
    }
  } else if (hitrigger == true) {
    if (vol < lowthr) {
      hitrigger = false;
    }
  }
}

function checkBalloonBlown() {
  if (blowCount >= 30) {
    state = 2;
  }
}


function mousePressed() {
  switch (state) {
    case 0:
      var d = dist(mouseX, mouseY, startButton.posX, startButton.posY);
      if (d < 40) {
        state = 1;
      }
      break;
    case 1:
      var d = dist(mouseX, mouseY, backButton.posX, backButton.posY);
      if (d < 10) {
        state = 0;
      }
      break;
    case 2:
      var d = dist(mouseX, mouseY, backButton2.posX, backButton2.posY);
      if (d < 10) {
        state = 0;
      }
    default:
  }
}
