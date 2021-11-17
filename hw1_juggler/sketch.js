/**
 * ECE_4525: Project 1, Juggler
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 9/8/2021
 *
 * This assignment contains the code for the Juggler, which starts with my logo screen, and when the
 * logo screen is clicked, then the game starts. The two letters M and T that are on the gears start
 * to move in random angles at random speeds, and a paddle appears to bounce the letters off. If any
 * letter hits the bottom of the screen, then its a game over, and if you score 20 points you win.
 * Points are scored every time a letter bounces off the paddle
 *
 */



// Declare variables for the components
var gears = [];
var boxl;
var tread;
var robot;
var pad;
var game_start = false;
var game_over = false;
var score = 0;
var keyArray = [];

class Letter {
  /**
   *
   * @param {*} letter: The alphabetical letter to display, either M or T
   * @param {*} x: The x coordinate of the Letter
   * @param {*} y: The y coordinate of the Letter
   * @param {*} diameter: The diameter of the Letter
   * @param {*} angle: The rotational angle of the Letter
   * @param {*} r_rate: The rotational rate of the Letter
   * @param {*} speed: The translation speed of the letter
   * @param {*} t_angle: The translation angle of the letter
   */
  constructor(letter, x, y, diameter, angle, r_rate, speed, t_angle) {
    this.letter = letter
    this.x = x;
    this.y = y;
    this.d = diameter;
    this.angle = angle;
    this.r_rate = r_rate;
    this.speed = speed;
    this.t_angle = t_angle; // translation angle
    this.x_dir = cos(t_angle); // Convert the translation angle into a x direction
    this.y_dir = sin(t_angle); // Convert the translation angle into a y direction
    this.bound_x = this.d / 2 * cos(PI / 4); // Calculate the x dimension borders for the letter
    this.bound_y = this.d / 2 * cos(PI / 4); // Calculate the y dimension border
  }
  draw() {
    /**
     * Draw the letter using the angle and trigonometry
     */
    stroke("#FFB7C3");
    strokeWeight(6);
    if (this.letter === "T") {
      var tr_x = this.x + this.d / 2 * cos(-PI / 4 + this.angle);
      var tr_y = this.y + this.d / 2 * sin(-PI / 4 + this.angle);
      var tl_x = this.x + this.d / 2 * cos(-3 * PI / 4 + this.angle);
      var tl_y = this.y + this.d / 2 * sin(-3 * PI / 4 + this.angle);
      line(tl_x, tl_y, tr_x, tr_y); // Draw the top line of the T
      var b_x = this.x + this.d / 2 * cos(-3 * PI / 2 + this.angle);
      var b_y = this.y + this.d / 2 * sin(-3 * PI / 2 + this.angle);
      var m_x = (tr_x + tl_x) / 2;
      var m_y = (tr_y + tl_y) / 2;
      line(b_x, b_y, m_x, m_y); // Draw the stalk of the T
      this.bound_y = this.d / 2; // Increase the boundary y position because of the stalk of the T
    }
    else if (this.letter === "M") {
      var tr_x = this.x + this.d / 2 * cos(-PI / 4 + this.angle);
      var tr_y = this.y + this.d / 2 * sin(-PI / 4 + this.angle);
      line(this.x, this.y, tr_x, tr_y);
      var tl_x = this.x + this.d / 2 * cos(-3 * PI / 4 + this.angle);
      var tl_y = this.y + this.d / 2 * sin(-3 * PI / 4 + this.angle);
      line(this.x, this.y, tl_x, tl_y);
      var bl_x = this.x + this.d / 2 * cos(-5 * PI / 4 + this.angle);
      var bl_y = this.y + this.d / 2 * sin(-5 * PI / 4 + this.angle);
      line(bl_x, bl_y, tl_x, tl_y);
      var br_x = this.x + this.d / 2 * cos(-7 * PI / 4 + this.angle);
      var br_y = this.y + this.d / 2 * sin(-7 * PI / 4 + this.angle);
      line(br_x, br_y, tr_x, tr_y);
    }
  }
  checkWalls() {
    /**
     * Check if the walls have been hit, and if so, bounce off. If the bottom wall is hit, then game
     * over
     */
    if (this.x < this.bound_x || this.x > (width - this.bound_x)) {
      this.x_dir = -this.x_dir; // Left or right Wall was hit, so reverse X
    }
    if (this.y < this.bound_y) {
      this.y_dir = -this.y_dir; // Top wall was hit, so reverse y
    }
    else if (this.y > (height - this.bound_y)) {
      game_over = true; // bottom wall was hit, so game over
    }
  }
  hitPaddle() {
    /**
     * Do all the logic for if a letter hits a paddle
     */
    if (this.y_dir > 0) {
      // Only if we are heading in the downwards direction do we count as hitting a paddle
      this.y_dir = -this.y_dir;
      score++; // increment the global score variable
      if (score >= 20) {
        game_over = true; // if we reached 20 points, we win
      }
    }
  }
  checkPaddle() {
    /**
     * Check if a letter has hit the paddle
     */
    if (!game_over) {
      // check if any of the corners of the letter are in the bounds of the paddle
      var bottom_y = this.y + this.bound_y;
      var left_x = this.x - this.bound_x;
      var right_x = this.x + this.bound_x;
      if (bottom_y > pad.y && bottom_y < pad.y + pad.height) {
        if (left_x > pad.x && left_x < pad.x + pad.width) {
          this.hitPaddle();
        }
        else if (right_x > pad.x && right_x < pad.x + pad.width) {
          this.hitPaddle();
        }
      }
    }
  }
  update() {
    /**
     * Update the angle and check for motion
     */
    this.angle = this.angle + this.r_rate;
    this.x = this.x + this.speed * this.x_dir
    this.y = this.y + this.speed * this.y_dir
    // if we have some translational speed, then we know we are in the game state, so we should
    // check for walls and the paddle
    if (this.speed != 0) {
      this.checkWalls();
      this.checkPaddle();
    }
  }
}

class L {
  /**
   * This class forms the letter L
   * @param {*} x: The x coordinate of the L
   * @param {*} y: The y coordinate of the L
   * @param {*} diameter: The diameter of the L
   * @param {*} angle: The angle of the L
   * @param {*} r_rate: The rotation rate of the L
   */
  constructor(x, y, diameter) {
    this.x = x;
    this.y = y;
    this.d = diameter;
  }
  draw() {
    /**
     * Draw the letter L
     */
    stroke("#FFB7C3");
    strokeWeight(4);
    var tl_x = this.x + this.d / 2.5;
    var tl_y = this.y + this.d / 3;
    var bl_x = this.x + this.d / 2.5;
    var bl_y = this.y + 2 * this.d / 3;
    line(tl_x, tl_y, bl_x, bl_y); // Draw the vertical line
    var br_x = this.x + 2 * this.d / 3;
    var br_y = this.y + 2 * this.d / 3;
    line(br_x, br_y, bl_x, bl_y); // Draw the horizontal line
  }
  update(x, y) {
    /**
     * Update the position
     */
    this.x = x;
    this.y = y;
  }
}

class Gear {
  /**
   * This class forms a rotating gear with a letter
   * @param {*} x: The x coordinate of the gear
   * @param {*} y: The y coordinate of the gear
   * @param {*} diameter: The diameter of the gear
   * @param {*} angle: The angle of the gear
   * @param {*} r_rate: The rotation rate of the gear
   * @param {*} letter: The letter for the gear
   * @param {*} color: The color of the gear
   */
  constructor(x, y, diameter, angle, r_rate, letter, color, letter_speed, letter_t_angle) {
    this.x = x;
    this.y = y;
    this.d = diameter;
    this.inner_d = diameter * 0.5;
    this.angle = angle;
    this.r_rate = r_rate;
    this.color = color;
    this.letter = new Letter(letter, this.x, this.y, this.inner_d, this.angle, this.r_rate, letter_speed, letter_t_angle)
  }
  draw() {
    /**
     * Draw the gear
     */
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.d); // Outer circle
    var num_spokes = 6;
    var spoke_h = this.d * .5; // spoke height
    for (var i = 0; i < num_spokes; i++) {
      var theta = radians(i * 360 / num_spokes) + this.angle;
      var spk_x = spoke_h * cos(theta) + this.x;
      var spk_y = spoke_h * sin(theta) + this.y;
      circle(spk_x, spk_y, 15); // spoke
    }
    fill("grey");
    circle(this.x, this.y, this.inner_d); // inner circle
  }
  drawLetter() {
    this.letter.draw(); // draw the letter
  }
  update() {
    /**
     * Update the angle and update the letter
     */
    this.angle = this.angle + this.r_rate;
    this.letter.update();
  }
}

class Tread {
  /**
   * This class makes a tread or assembly line that goes through the gears
   * @param {*} x1: The first x coordinate
   * @param {*} y1: The second y coordinate
   * @param {*} x2: The second x coordinate
   * @param {*} y2: The second y coordinate
   * @param {*} diameter: The diameter of the tread
   * @param {*} offset: The offset for the diameter
   */
  constructor(x1, y1, x2, y2, diameter, offset) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.d = diameter;
    this.offset = offset;
    this.color = "black";
  }
  draw() {
    /**
     * Draw the treads
     */
    strokeWeight(10);
    fill("#BCF4F5");
    stroke(this.color);
    arc(this.x1, this.y1, this.d + this.offset, this.d + this.offset, PI / 2, 3 * PI / 2); // Left arc
    arc(this.x2, this.y2, this.d + this.offset, this.d + this.offset, -PI / 2, -3 * PI / 2); // Right arc
    line(this.x1, this.y1 + (this.d + this.offset) / 2, this.x2, this.y2 + (this.d + this.offset) / 2) // bottom line
    line(this.x1, this.y1 - (this.d + this.offset) / 2, this.x2, this.y2 - (this.d + this.offset) / 2) // top line
  }
}

class Box {
  /**
   * This class forms a box
   * @param {*} x: The x coordinate of the box
   * @param {*} y: The y coordinate of the box
   * @param {*} size: The size of the box
   * @param {*} color: The color of the box
   * @param {*} angle: The initial angle of the box
   */
  constructor(x, y, size, color, angle) {
    this.init_y = y
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.angle = angle;
    this.arc = false;
    this.speed = 115 / 2 * PI / 128;
    this.letter = new L(this.x, this.y, this.size);
  }
  draw() {
    /**
     * Draw the box
     */
    noStroke();
    fill(this.color)
    rect(this.x, this.y, this.size, this.size);
    this.letter.draw();
  }
  update() {
    /**
     * Update the position of the box based on the current position and angle
     */
    this.x = this.speed * cos(this.angle) + this.x;
    this.y = this.speed * sin(this.angle) + this.y;
    // if arc, then the box should be moving in an arc
    if (this.arc) {
      this.angle += radians(-3); // increment the angle
      if (this.y > this.init_y) {
        // if the y position has passed the initial starting point, we've landed and should stop arcing
        this.angle = 0;
        this.arc = false;
        this.speed = 115 / 2 * PI / 128;
      }
    }
    if (this.x > 300 - this.size) {
      // if the x position has passed a certain point then we are at the end of the tread, so start arcing
      this.arc = true;
      this.angle = radians(-93)
      this.speed = 115 / 2 * PI * 3 / 128;
    }
    this.letter.update(this.x, this.y);
    return this.arc;
  }
}

class Bot {
  /**
   * This class forms the robot
   */
  constructor() {
    this.x = 150;
    this.y = 50;
    this.color = "#4ABB77";
    this.angle = 0;
    this.r_arm = 60;
    this.l_arm = 60;
  }
  draw() {
    /**
     * Draw the robot
     */
    noStroke();
    fill(this.color);
    rect(this.x, this.y, 100, 50, 30); // Head
    rect(this.x + 40, this.y + 35, 20, 50, 30); // Neck
    rect(this.x - 10, this.y + 70, 120, 120, 30, 30, 50, 50); // Body
    rect(this.x + 30, this.y + 200, 40, 20, 30); // Tail
    rect(this.x + 40, this.y + 230, 20, 20, 30); // Tail x2

    fill("#2D3142");
    rect(this.x + 10, this.y + 5, 80, 40, 20); // Face
    rect(this.x + 20, this.y + 100, 60, 35, 20, 20, 20, 20); // Body Plate
    fill(this.color);
    rect(this.x + 45, this.y + 35, 10, 5, 20, 20, 20, 20); // mouth

    circle(this.x + 30, this.y + 25, 20); //left eye
    circle(this.x + 70, this.y + 25, 20); //right eye
    fill("#2C9886");
    rect(this.x - 30, this.y + 90, 30, this.l_arm, 20, 20, 20, 20); // left arm
    rect(this.x + 100, this.y + 90, 30, this.r_arm, 20, 20, 20, 20); // right arm
  }
  update(arc) {
    /**
     * Update the arm position based on if it is arcing
     */
    if (arc) {
      // if we are throwing the box
      if (this.r_arm > 25) {
        // until a certain limit
        this.r_arm = this.r_arm - 2; // raise the arm
      }
    }
    else {
      // if the box has landed
      if (this.r_arm < 59) {
        // until a certain limit
        this.r_arm = this.r_arm + 2; // lower the arm
      }
    }
  }
}

class PaddleObj {
  /**
   * This class forms the paddle, which can be controlled using the keyboard
   *
   * @param {*} x : x coordinate of the paddle object
   * @param {*} y : y coordinate of the paddle object
   * @param {*} width : width of the paddle object
   */
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = "#2C9886";
    this.height = 10;
    this.speed = 5; // variable that controls the amount that the paddle moves on the screen per step
  }
  draw() {
    /**
     * Draw the paddle on the screen using a rectangle
     */
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.width, this.height, 4);
  }
  move(direction) {
    /**
     * Move the paddle on the screen based on an input direction
     *
     * @param {int} direction
     */
    this.x = this.x + direction * this.speed

    // Check the paddle to make sure it remains in the boundaries of the screen.
    if (this.x < 0) {
      this.x = 0;
    }
    else if (this.x > width - this.width) {
      this.x = width - this.width
    }
  }
}


function keyPressed() {
  /**
   * If a key is pressed, set its value in the array to 1
   */
  keyArray[keyCode] = 1;
}

function keyReleased() {
  /**
   * If the key is released, set its value in the array to 0
   */
  keyArray[keyCode] = 0;
}

function mouseClicked() {
  /**
   * If the mouse is clicked within the canvas, start the game
   */
  if (mouseX < width && mouseY < height) {
    if (!game_start) {
      // set the game start variable
      game_start = true;
      // empty the gears array
      gears.pop();
      gears.pop();
      // Add two new gears that are frozen, with the letter translation speed a random number and
      // a random translation angle
      gears.push(new Gear(100, 280, 115, 0, 0, "M", "black", round(random(1, 4)), random(0, 2 * PI)))
      gears.push(new Gear(300, 280, 115, 0, 0, "T", "black", round(random(1, 4)), random(0, 2 * PI)))
      boxl.speed = 0;
    }
  }
}


function setup() {
  /**
   * Setup Function, called once
   */
  createCanvas(400, 400);
  var r_rate = PI / 128;
  var offset = 15;
  tread = new Tread(100, 280, 300, 280, 115, 20);
  gears.push(new Gear(100, 280, 115, 0, r_rate, "M", "#369861", 0, 0))
  gears.push(new Gear(300, 280, 115, 0, r_rate, "T", "#369861", 0, 0))
  var box_size = 40;
  var box_start_y = 280 - 115 - offset + box_size / 2;
  boxl = new Box(100, box_start_y, box_size, "gray", 0);
  robot = new Bot();
  pad = new PaddleObj(150, 380, 100);
  textSize(32);
}

function draw() {
  /**
   * Draw the components
   */
  background("#BCF4F5");
  // Logo phase
  robot.draw();
  tread.draw();
  boxl.draw();
  var arc = boxl.update();
  for (var i = 0; i < gears.length; i++) {
    gears[i].draw();
    gears[i].update();
  }
  for (var i = 0; i < gears.length; i++) {
    gears[i].drawLetter();
  }
  robot.update(arc);
  if (game_start) {
    // if the game has started, then check for control inputs
    if (keyArray[LEFT_ARROW] === 1) {
      pad.move(-1);
    }
    if (keyArray[RIGHT_ARROW] === 1) {
      pad.move(1);
    }
    pad.draw();
    // Display the score
    text(score, width - 45, 30);
  }
  if (game_over) {
    // If the game is over,
    for (var i = 0; i < gears.length; i++) {
      //freeze the letters
      gears[i].letter.speed = 0;
    }
    // freeze the paddle
    pad.speed = 0;
    if (score === 20) {
      // if the game ended with a score of 20, print victory!
      fill("#2C9886");
      text("VICTORY", 135, 30);
    }
    else {
      // if the game ended without reaching a score of 20, just print game over
      fill("black");
      text("GAME OVER", 100, 30);
    }
  }
}
