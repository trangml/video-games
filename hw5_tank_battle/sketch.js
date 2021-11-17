/**
 * ECE_4525: Project 5, Tank Battle
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 10/12/2021
 *
 * This assignment contains the code for my tank battle game, "Tank-Tech"
 * In this game, the blue player tank must eliminate the enemy red tanks without getting hit
 * The game is played with keyboard inputs
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

function keyPressed() {
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    player.turnRight = 1;
  }
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    player.turnLeft = 1;
  }
  if ((keyCode === UP_ARROW) || (keyCode === 87)) {
    player.moveForward = 1;
  }
  if ((keyCode === DOWN_ARROW) || (keyCode === 83)) {
    player.moveBackward = 1;
  }
  if (keyCode === 32) {
    player.fire = 1;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    player.turnRight = 0;
  }
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    player.turnLeft = 0;
  }
  if ((keyCode === UP_ARROW) || (keyCode === 87)) {
    player.moveForward = 0;
  }
  if ((keyCode === DOWN_ARROW) || (keyCode === 83)) {
    player.moveBackward = 0;
  }
  if (keyCode === 32) {
    player.fire = 0;
    if (gameState === "GameOver") {
      if (gameOverScreen.currFrameCount < (frameCount - 30)) {
        restartGame();
      }
    }
    if (gameState === "StartScreen") {
      restartGame();
    }
  }
}

function restartGame() {
  score = 0;
  enemiesKilled = 0;
  player = new PlayerTank(200, 200, 20);
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
    }
    if (gameState === "GameOver") {
      restartGame();
    }
  }
}
var images = []

function gen_area_noise(x, y, width, height, k) {
  translate(x, y);
  var greenColor = color("#074728")
  var brownColor = color("#855921")
  var brownColor = color("#e7ba7f")
  for (var i = 0; i < width; i += k) {
    for (var j = 0; j < height; j += k) {
      var c = noise(0.008 * i, 0.008 * j);
      fill(lerpColor(brownColor, greenColor, c));
      noStroke();
      rect(i, j, k, k);
    }
  }
}
function mapClip() {
  gen_area_noise(0, 0, width, height, 1);
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
  setupLogo();
  mapClip();
  player = new PlayerTank(200, 200, 20);
  game = new GameObj(images);
  gameState = "Logo";
  game.initialize();
  game.gameOver = 0;
  startScreen = new StartScreenObj(backgroundClip());
  gameOverScreen = new GameOverScreenObj(backgroundClip());
  twoDegrees = PI / 90;
  oneDegree = PI / 180;
  thirtyDegrees = PI / 6;
  angle179 = PI - oneDegree;
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
      game.drawBackground();
      player.draw();
      // if the game has started, then check for control inputs
      player.update();
      player.checkCollision();
      if (player.is_dead || score === 5) {
        gameState = "GameOver"
        gameOverScreen.start_timer = true;
      }
      game.score = score * 100;
      game.enemiesKilled = enemiesKilled;
      game.drawScore();
      break;
    case "GameOver":
      gameOverScreen.draw(score);
      gameOverScreen.move();
      break;
  }
  // fill("black")
  // text(frameRate(), width, 50)
}
