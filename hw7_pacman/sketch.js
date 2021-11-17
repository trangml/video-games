/**
 * ECE_4525: Project 8, PacMan without Power Pellets
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 11/04/2021
 *
 * This assignment contains the code for my implementation of PacMan without the power pellets. In
 * my version of pacman, the player controls a constantly changing color version of pacman and must
 * navigate though the maze to collect the pellets. The player can also lose the game by running
 * into one of four ghosts, which follow the player using A* pathfinding if within a certain
 * distance, and randomly roam if else. Each ghost calculates its path to the player on a different frame.
 *
 */


// Declare variables for the components
var score = 0;
var maxScore = 0;
var enemiesKilled = 0;
var keyArray = [];
var currFrameCount = 0;
var startScreen;
var gameOverScreen;
var gameState;
var player;
var enemies = [];

function keyPressed() {
  /**
   * Handle keyboard press events
   */
  if (keyCode === RIGHT_ARROW || keyCode === 68) {
    player.buffered_dir = RIGHT;
  }
  else if (keyCode === LEFT_ARROW || keyCode === 65) {
    player.buffered_dir = LEFT;
  }
  else if ((keyCode === UP_ARROW) || (keyCode === 87)) {
    player.buffered_dir = UP;
  }
  else if ((keyCode === DOWN_ARROW) || (keyCode === 83)) {
    player.buffered_dir = DOWN;
  }
}


function restartGame() {
  /**
   * Restart the game to its playable state
   */
  score = 0;
  enemiesKilled = 0;
  player = new PlayerBot(370, 370, 18);
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
  /**
   * Draw custom crate characters
   */
  fill(0, 0, 0, 0);
  noStroke();
  var crate = new Crate(200, 200, 60, "#A9BCD0", "#373F51");
  crate.draw();
  images.push(get(200, 200, 60, 60))
  crate = new Crate(200, 200, 60);
  crate.draw();
  images.push(get(200, 200, 60, 60))
}

function backgroundClip() {
  /**
   * Clip the background
   */
  game.drawBackground();
  return get(0, 0, width, height);
}

var logo_duration = 110;

function setup() {
  /**
   * Setup Function, called once
   */
  frameRate(30);
  createCanvas(400, 400);
  customChar();
  setupLogo();
  setupA();
  restartGame();
  gameState = "Logo"
  game.gameOver = 0;
  startScreen = new StartScreenObj(backgroundClip());
  gameOverScreen = new GameOverScreenObj(backgroundClip());
  textAlign(CENTER, CENTER);
}

function draw() {
  /**
   * Draw the components
   */
  background("black");
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
      game.drawBackground();
      player.draw();
      // if the game has started, then check for control inputs
      player.update();

      if (player.checkCollision()) {
        gameState = "GameOverAnimation"
      }
      if (score === this.maxScore) {
        gameState = "GameOver"
      }
      pop();
      game.score = score;
      game.enemiesKilled = enemiesKilled;
      // Display the score
      game.drawScore();
      break;
    case "GameOverAnimation":
      push();
      game.drawDeathBackground();
      if (player.updateDeath()) {
        gameState = "GameOver"
      }
      else {
        if (player.deathTimer === 0) {
          player.draw();
        }
        else {
          player.drawDeath();
        }
      }
      game.drawScore();
      break;
    case "GameOver":
      gameOverScreen.draw(score);
      gameOverScreen.move();
      break;
  }
  // textSize(20);
  // text(frameRate(), width, 50)
  // Game loss
}
