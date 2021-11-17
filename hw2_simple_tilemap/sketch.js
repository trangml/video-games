/**
 * ECE_4525: Project 2, Simple Game with Tilemap
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 9/17/2021
 *
 * This assignment contains the code for my tile-map game Mech-Tech. The game involves a robot who
 * must navigate the map and collect batteries. Once all batteries are collected, the game is won.
 * If the player touches a red robot, the player loses.
 *
 */


// Declare variables for the components
var score = 0;
var keyArray = [];
var currFrameCount = 0;
var startScreen;
var gameOverScreen;
var gameState;
var player;
var enemies = [];

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
function restartGame() {
  score = 0;
  player = new PlayerBot(40, 40, 17);
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
  player = new PlayerBot(40, 40, 17);
  game = new GameObj(images);
  gameState = "Logo";
  //gameState = "GameStart";
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
      game.drawBackground();
      player.drawTop();
      // if the game has started, then check for control inputs
      player.move();
      if (player.checkCollision() || score === 20) {
        gameState = "GameOver"
      }
      // Display the score
      //text(score, width - 45, 30);
      break;
    case "GameOver":
      gameOverScreen.draw(score);
      gameOverScreen.move();
      break;
  }
  // Game loss
}
