/**
 * ECE_4525: Project 4, FSM and Jumping
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 10/04/2021
 *
 * This assignment contains the code for my tile-map game Mech-Tech. The game involves a robot who
 * must navigate the map and collect batteries. Once all batteries are collected, the game is won.
 * If the player touches a red robot, the player loses.
 * The robot can jump on the enemies heads to kill them.
 */


// Declare variables for the components
var score = 0;
var enemiesKilled = 0;
var keyArray = [];
var currFrameCount = 0;
var startScreen;
var gameOverScreen;
var gameState;
var player;
var enemies = [];
var gravity, walkForce, backForce, jumpForce, bounceForce;

function keyPressed() {
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    player.walkForward = 1;
  }
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    player.walkBackward = 1;
  }
  if (((keyCode === UP_ARROW) || (keyCode === 87)) && (player.jump === 0) && (player.velocity.y <= 0)) {
    player.jump = 2;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    player.walkForward = 0;
  }
  else if (keyCode === LEFT_ARROW || keyCode === 65) {
    player.walkBackward = 0;
  }
}

function restartGame() {
  score = 0;
  enemiesKilled = 0;
  player = new PlayerBot(760, 370, 17);
  game = new GameObj(images);
  gameState = "GameStart";
  game.initialize();
}
function mouseClicked() {
  /**
   * If the mouse is clicked within the canvas, start the game
   */
  if (mouseX < width && mouseY < height) {
    if (gameState === "StartScreen") {
      restartGame();
      gameState = "GameStart"
    }
    if (gameState === "GameOver") {
      restartGame();
    }
  }
}
var images = []

function customChar() {
  fill(0, 0, 0, 0);
  noStroke();
  rect(0, 0, width, height)
  var battery = new Battery(30, 0);
  battery.draw();
  images.push(get(0, 0, 140, 140))

  var crate = new Crate(200, 200, 60, "#A9BCD0", "#373F51");
  //var crate = new Crate(200, 200, 60);
  crate.draw();
  images.push(get(200, 200, 60, 60))
  crate = new Crate(200, 200, 60);
  crate.draw();
  images.push(get(200, 200, 60, 60))

}
function buildingClip() {
  fill(0, 0, 0, 0);
  var buildings = new Buildings();
  buildings.draw();
  images.push(get(0, 0, width, height));
}
function backgroundClip() {
  game.drawBackground();
  return get(0, 0, width, height);
}
var logo_duration = 240;

function setup() {
  /**
   * Setup Function, called once
   */
  createCanvas(400, 400);
  customChar();
  setupLogo();
  buildingClip();
  gravity = new p5.Vector(0, 0.2);
  walkForce = new p5.Vector(0.1, 0);
  backForce = new p5.Vector(-0.1, 0);
  jumpForce = new p5.Vector(0, -6);
  bounceForce = new p5.Vector(0, -3);
  player = new PlayerBot(760, 370, 17);
  game = new GameObj(images);
  gameState = "Logo";
  game.initialize();
  game.gameOver = 0;
  startScreen = new StartScreenObj(backgroundClip());
  gameOverScreen = new GameOverScreenObj(backgroundClip());
  textAlign(CENTER, CENTER);
}

function draw() {
  /**
   * Draw the components
   */
  background("#EFFFFA");
  //#D8DBE2
  // Starting animation logo
  switch (gameState) {
    case "Logo":
      if (currFrameCount < (logo_duration)) {
        currFrameCount = frameCount;
        drawLogo();
      }
      else {
        gameState = "StartScreen";
      }
      break;
    case "StartScreen":
      startScreen.draw();
      startScreen.move();
      break;
    case "GameStart":
      push();
      translate(game.xCor, 0);
      game.drawBackground();
      player.drawTop();
      // if the game has started, then check for control inputs
      player.update();
      if (player.checkCollision() || score === 20) {
        gameState = "GameOver"
      }
      if (player.position.x > 200 && player.position.x < 600) {
        game.xCor = -player.position.x + width / 2
      }
      pop();
      game.score = score;
      game.enemiesKilled = enemiesKilled;
      game.drawScore();
      // Display the score
      //text(score, width - 45, 30);
      break;
    case "GameOver":
      gameOverScreen.draw(score);
      gameOverScreen.move();
      break;
  }
  fill("black")
  //text(frameRate(), width, 50)
  // Game loss
}
