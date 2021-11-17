/**
 * ECE_4525: Project 0, Logo Animation
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 9/2/2021
 *
 * This assignment contains the code for my logo, a robot and assembly line. The letters M, L, and T
 * are all present in the logo and are representative of my initials.
 */


class T {
  /**
   * This class forms the letter T
   */
  constructor(x, y, diameter, angle, r_rate) {
    this.x = x;
    this.y = y;
    this.d = diameter;
    this.angle = angle;
    this.r_rate = r_rate;
  }
  draw() {
    /**
     * Draw the letter T using the angle and trigonometry
     */
    stroke("#FFB7C3");
    strokeWeight(6);
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
  }
  update() {
    /**
     * Update the angle
     */
    this.angle = this.angle + this.r_rate;
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

class M {
  /**
   * This class forms the letter M
   * @param {*} x: The x coordinate of the M
   * @param {*} y: The y coordinate of the M
   * @param {*} diameter: The diameter of the M
   * @param {*} angle: The angle of the M
   * @param {*} r_rate: The rotation rate of the M
   */
  constructor(x, y, diameter, angle, r_rate) {
    this.x = x;
    this.y = y;
    this.d = diameter;
    this.angle = angle;
    this.r_rate = r_rate;
  }
  draw() {
    /**
     * Draw the letter M using the angle and trigonometry
     */
    stroke("#FFB7C3");
    strokeWeight(6);
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
  update() {
    /**
     * Update the angle
     */
    this.angle = this.angle + this.r_rate;
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
  constructor(x, y, diameter, angle, r_rate, letter, color) {
    this.x = x;
    this.y = y;
    this.d = diameter;
    this.inner_d = diameter * 0.5;
    this.angle = angle;
    this.r_rate = r_rate;
    this.color = color;
    if (letter == "M") {
      this.letter = new M(this.x, this.y, this.inner_d, this.angle, this.r_rate)
    }
    else if (letter == "T") {
      this.letter = new T(this.x, this.y, this.inner_d, this.angle, this.r_rate)
    }
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

// Declare variables for the components
var gears = [];
var boxl;
var tread;
var robot;

function setup() {
  /**
   * Setup Function, called once
   */
  createCanvas(400, 400);
  var r_rate = PI / 128;
  //var r_rate = 0;
  var offset = 15;
  tread = new Tread(100, 280, 300, 280, 115, 20);
  gears.push(new Gear(100, 280, 115, 0, r_rate, "M", "#369861"))
  gears.push(new Gear(300, 280, 115, 0, r_rate, "T", "#369861"))
  var box_size = 40;
  var box_start_y = 280 - 115 - offset + box_size / 2;
  boxl = new Box(100, box_start_y, box_size, "gray", 0);
  robot = new Bot();
}

function draw() {
  /**
   * Draw the components
   */
  background("#BCF4F5");
  robot.draw();
  tread.draw();
  boxl.draw();
  var arc = boxl.update();
  for (var i = 0; i < gears.length; i++) {
    gears[i].draw();
    gears[i].update();
  }
  robot.update(arc);
}
