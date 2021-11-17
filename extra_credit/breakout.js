// initialization of bricks
// ball.draw includes update coordinates
// simple collision detection with paddle
// bounding box collision detection with bricks
// nesting function in checkCollision (must assign self to this)
var currFrameCount = 0;

class brickObj {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hit = 0;
  }

  draw() {
    fill(255, 0, 0);
    rect(this.x, this.y, 20, 10);
  }
  update() {
    if (this.hit === 1) {
      this.y = this.y + 0.5;
    }
  }
}

class ballObj {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xDir = round(random(1, 2));
    this.yDir = round(random(1, 2));
  }

  draw() {
    fill(0, 4, 255);
    rect(this.x, this.y, 8, 8);
    this.x += this.xDir;
    this.y += this.yDir;

    if (this.x < 0) {
      this.xDir = round(random(1, 2));
    }
    else if (this.x > 392) {
      this.xDir = -round(random(1, 2));
    }
    if (this.y < 0) {
      this.yDir = round(random(1, 2));
    }
    else if (this.y > 372) {
      if (dist(this.x, 0, paddle.x, 0) < 44) {
        this.yDir = -round(random(1, 2));
      }
      else {
        gameOver = true;
      }
    }
  }  // draw

  checkCollision() {
    var self = this;

    ///// EXPERIMENT /////
    function checkCollideBrick(brick) {
      var collide = false;
      if (((self.x > brick.x) && (self.x < (brick.x + 20)) && (self.y >
        brick.y) && (self.y < (brick.y + 10))) ||
        (((self.x + 8) > brick.x) && ((self.x + 8) < (brick.x + 20)) &&
          (self.y > brick.y) && (self.y < (brick.y + 10))) ||
        ((self.x > brick.x) && (self.x < (brick.x + 20)) && ((self.y + 8) >
          brick.y) && ((self.y + 9) < (brick.y + 10))) ||
        (((self.x + 8) > brick.x) && ((self.x + 8) < (brick.x + 20)) &&
          ((self.y + 8) > brick.y) && ((self.y + 8) < (brick.y + 10)))) {
        collide = true;
      }

      return (collide);
    }

    if ((this.y > 29)) {
      var i = 0;
      var brickHit = 0;
      //if (currFrameCount < (frameCount - 10)) {
        currFrameCount = frameCount;
        while ((i < bricks.length) && (brickHit === 0)) {
          if (checkCollideBrick(bricks[i])) {
            if (bricks[i].hit === 1 && (this.y > 70)) {
              //don't do a collision
            }
            else {
              bricks[i].hit = 1;
              brickHit = 1;
              this.yDir = -this.yDir;
              score++;
            }
          }
          i++;
       // }
      }
    }  // checkCollideBrick
  }  // checkCollision
}  // ballObj

class paddleObj {
  constructor(x) {
    this.x = x;
  }

  draw() {
    fill(255, 0, 0);
    this.x = mouseX;
    rect(this.x - 40, 380, 80, 10);
  }
}

var score = 0;
var gameOver = false;
var paddle;
var ball;
var bricks = [];

function setup() {
  paddle = new paddleObj(200);
  ball = new ballObj(0, 80);

  // initialize the bricks
  var x = 0;
  var y = 30;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 20; j++) {
      bricks.push(new brickObj(x, y));
      x += 20;
    }
    x = 0;
    y += 10;
  }

  createCanvas(400, 400);
}

function draw() {
  if (gameOver === false) {
    background(169, 232, 242);
    for (var j = 0; j < bricks.length; j++) {
      bricks[j].draw();
    }
    ball.draw();
    ball.checkCollision();
    paddle.draw();

    for (var j = 0; j < bricks.length; j++) {
      bricks[j].update();
    }
    fill(255, 0, 0);
    text(score, 370, 10);
  }
  else {
    fill(255, 0, 0);
    textSize(40);
    text("Game Over", 100, 200);
  }
}