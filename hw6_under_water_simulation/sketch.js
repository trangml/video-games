/**
 * ECE_4525: Project 6, Under Water Simulation
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 10/20/2021
 *
 * This assignment contains the code for my under water simulation, which has sea creatures that are
 * subdivided and wander around the screen, and seaweed made from bezier curves, and a rock that
 * creates bubbles which act as particle systems. The background sand is made using perlin noise and
 * webgl and the water is made using a gradient
 *
 **/


// Constants
const Y_AXIS = 1;
const X_AXIS = 2;

// Initialize Variables
var cols, rows;
var scl = 20;
var w = 700;
var h = 250;
var terrainSmooth = 10.0;
var terrainHeight = 60;
var flying = 0;

var terrain = [];
var fishes = [];
var images = [];

var rock;
var seaweeds = [];

var bubbleCol;

let font;
let c1;
let c2;

let pg;

function screenshotFish() {
  /**
   * Screenshot each fish and store in the image list
   */
  fill(0, 0, 0, 0);
  for (var fish of fishes) {
    fish.draw();
    images.push(get(0, 0, width, height));
    clear();
  }
}

function setup() {
  /**
   * Setup variables
   */
  createCanvas(400, 400);
  // Create background canvas for the 3D sand
  pg = createGraphics(400, 400, WEBGL)

  // Initialize colors for the background gradient
  c1 = color("#1c9ded")
  c2 = color("#1c20ed")


  cols = w / scl;
  rows = h / scl;
  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
  frameRate(15);
  pg.frameRate(15);

  pg.colorMode(HSB);
  colorMode(RGB, 255)
  // Initialize the fishes to get the screenshots first
  fishes = [new Seahorse(200, 200, 400), new Clownfish(200, 200, 400), new Seahorse(200, 200, 400, color = "#9f49d6", angle = 0, speed = 0.5, fin_color = "#d648bc"), new Clownfish(200, 200, 400), new Butterflyfish(200, 200, 400), new Shark(200, 200, 400)];
  screenshotFish();

  // reinitialize fishes in the correct positions
  fishes = [new Seahorse(100, 300, 69), new Clownfish(300, 100, 50), new Seahorse(350, 360, 80, color = "#9f49d6", angle = 0, speed = 0.5, fin_color = "#d648bc"), new Clownfish(330, 130, 60), new Butterflyfish(200, 150, 80), new Shark(300, 200, 230)];
  for (var i = 0; i < fishes.length; i++) {
    fishes[i].image = images[i];
  }
  rock = new Rock(380, 380, 170);
  seaweeds = [new Seaweed(280, 390, 180, 1), new Seaweed(300, 390, 190, 1), new Seaweed(115, 390, 150), new Seaweed(135, 390, 160), new Seaweed(125, 390, 150)]
  bubbleCol = new BubbleColumn(360, 324);
}

function drawFish() {
  /**
   * Draw and update each fish
   */
  for (var fish of fishes) {
    fish.drawImage();
    fish.update();
  }
}

function drawForeground() {
  /**
   * Draw the foreground of the image, including the rock, seaweed, and bubbles.
   */
  fill("#4d3204");
  ellipse(width / 2, height, width, 40); // platform
  for (var seaweed of seaweeds) {
    seaweed.draw();
    seaweed.update();
  }
  rock.draw();
}

function setGradient(x, y, w, h, c1, c2, axis) {
  /**
   * Method to create a gradient from two colors
   *
   * Credit to:
   * https://p5js.org/examples/color-linear-gradient.html
   */
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}
function drawSand() {
  /**
   * Use Perlin noise to create a 3-D terrain, which is then mapped to different colors to represent
   * depth
   * Perlin noise terrain generation credit to:
   *  https://thecodingtrain.com/CodingChallenges/011-perlinnoiseterrain.html
   */
  flying -= 0.005;
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -terrainHeight, terrainHeight);
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  pg.stroke(0)
  pg.strokeWeight(0.1)
  pg.push();
  pg.translate(-w / 2, 50);
  pg.rotateX(PI / 3);
  var yoff = flying;
  for (var y = 0; y < rows - 1; y++) {
    var b = map(y, 0, rows, 0, 255);
    var xoff = 0;
    pg.beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      pg.fill(map(terrain[x][y], -terrainHeight, terrainHeight, 30, 60), 80, b); // In HSB, 30 is reddish, and 60 is more yellow
      pg.vertex(x * scl, y * scl, terrain[x][y]);
      pg.vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
      xoff += 0.2;
    }
    pg.endShape();
    yoff += 0.2;
  }
  pg.pop();
}

function draw() {
  setGradient(0, 0, width, height - 100, c1, c2, Y_AXIS);
  drawSand();
  image(pg, 0, 0);
  push();
  drawForeground();
  bubbleCol.draw();
  drawFish();
  fill("yellow")
  stroke("yellow")
  //text(frameRate(), width / 2, 20)
  pop();
  pg.clear();
}