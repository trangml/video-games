/**
 * ECE_4525: Project 10, 3D Coffee Table
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 11/19/2021
 *
 *
 * This assignment is a 3D coffee table game. The coffee table is modeled in 3D using only a
 * 2D wireframe. It can be rotated using the mouse to change the perspective. The table is made of
 * multiple colors.
 */


// Declare variables for the components
var shape1, shape2, shape3;
var shapes = [];
var browns = [];
var backgroundColour, nodeColour, edgeColour;

function setup() {
  /**
   * Setup the canvas and other variables
   */
  createCanvas(400, 400);
  angleMode(DEGREES);

  // Set up list of colors
  browns = ["#3e2917", "#784d27", "#5b2f08", "#884c18", "#503822", "#623c1b", "#5d2e04"]
  backgroundColour = color(255, 255, 255);
  nodeColour = color(40, 168, 107);
  edgeColour = color(34, 68, 204);

  // create the colors for the tabletop
  var tableColors1 = [browns[0], browns[0], browns[0], browns[0], browns[1], browns[1]];
  var tableColors2 = [browns[0], browns[0], browns[0], browns[0], browns[2], browns[2]];
  // Start with the tabletop, push all the shapes
  shapes.push(new BigCuboid(-140, -50, -70, 70, 10, 70, colors = tableColors1),
    new BigCuboid(-140, -50, 0, 70, 10, 70, colors = tableColors2),
    new BigCuboid(-70, -50, -70, 70, 10, 70, colors = tableColors2),
    new BigCuboid(-70, -50, 0, 70, 10, 70, colors = tableColors1),
    new BigCuboid(0, -50, -70, 70, 10, 70, colors = tableColors1),
    new BigCuboid(0, -50, 0, 70, 10, 70, colors = tableColors2),
    new BigCuboid(70, -50, -70, 70, 10, 70, colors = tableColors2),
    new BigCuboid(70, -50, 0, 70, 10, 70, colors = tableColors1),
  )

  // Create the colors for the legs
  var legs1 = [browns[4], browns[0], browns[5], browns[0], "none", browns[3]];
  var legs2 = [browns[4], browns[0], browns[0], browns[5], "none", browns[3]];
  var legs3 = [browns[0], browns[4], browns[0], browns[5], "none", browns[3]];
  var legs4 = [browns[0], browns[4], browns[5], browns[0], "none", browns[3]];
  // Add the legs
  shapes.push(new BigCuboid(-140, -40, -70, 20, 100, 20, colors = legs1),
    new BigCuboid(-140, -40, 70, 20, 100, -20, colors = legs2),
    new BigCuboid(140, -40, 70, -20, 100, -20, colors = legs3),
    new BigCuboid(140, -40, -70, -20, 100, 20, colors = legs4),
  )

  // add the inner walls
  var wall1 = [browns[3], browns[3], browns[3], browns[3], "none", browns[6]];
  shapes.push(new BigCuboid(-120, -40, -60, 2 * 120, 10, 10, colors = wall1),
    new BigCuboid(-120, -40, 60, 2 * 120, 10, -10, colors = wall1),
    new BigCuboid(130, -40, -50, -10, 10, 100, colors = wall1),
    new BigCuboid(-130, -40, -50, 10, 10, 100, colors = wall1),
  )
  // add the lower shelf
  var shelfColors = [browns[0], browns[0], browns[0], browns[0], browns[1], browns[6]];
  shapes.push(new BigCuboid(-120, 20, -50, 2 * 120, 10, 100, colors = shelfColors))
}

function drawBackground() {
  /**
   * Draw the background grid
   */
  background(backgroundColour);
  fill("lightgrey")
  noStroke();
  for (var i = 0; i < 20; i++) {
    var count = i % 2;
    for (var j = 0; j < 20; j++) {
      if (count % 2 == 0) {
        rect(i * 20, j * 20, 20, 20);
      }
      count++;
    }
  }
}
var draw = function () {
  /**
   * Draws the screen
   */
  drawBackground();
  // move to the center of the screen
  push();
  translate(200, 200);
  var faces = [];
  // Get the list of all the faces that are drawn
  for (var i = 0; i < shapes.length; i++) {
    faces = faces.concat(shapes[i].getDrawnFaces());
  }
  // Sort the faces by their average z centroid, furthest to closest
  faces = faces.sort(function (a, b) {
    if (a.getCentroid() < b.getCentroid()) return 1; else return -1;
  });

  // Draw each face in order
  for (var i = 0; i < faces.length; i++) {
    faces[i].draw();
  }
  pop();
};

mouseDragged = function () {
  /**
   * If the mouse is dragged, rotate the table
   */
  var dx = mouseX - pmouseX;
  var dy = mouseY - pmouseY;

  for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
    shapes[shapeNum].rotateX3D(dy);
    shapes[shapeNum].rotateY3D(dx);
  }
};
