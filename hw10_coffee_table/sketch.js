/**
 * ECE_4525: Project 10, 3D Coffee Table
 * Author: Matthew Luu Trang
 * PID: mattluutrang
 * Date: 11/19/2021
 *
 *
 * This assignment is a 3D coffee table game. The coffee table is modeled in 3D using only a
 * wireframe. It can be rotated using the mouse.
 */


// Declare variables for the components

var backgroundColour, nodeColour, edgeColour;

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  backgroundColour = color(255, 255, 255);
  nodeColour = color(40, 168, 107);
  edgeColour = color(34, 68, 204);

  shape1 = createCuboid(-120, -20, -20, 240, 40, 40);
  shape2 = createCuboid(-120, -50, -30, -20, 100, 60);
  shape3 = createCuboid(120, -50, -30, 20, 100, 60);
  shapes = [shape1, shape2, shape3];

  //rotateZ3D(30);
  //rotateY3D(30);
  //rotateX3D(30);
}

var draw = function () {
  background(backgroundColour);
  var nodes, edges;

  push();
  translate(200, 200);
  // Draw edges
  stroke(edgeColour);

  for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
    nodes = shapes[shapeNum].nodes;
    edges = shapes[shapeNum].edges;

    for (var e = 0; e < edges.length; e++) {
      var n0 = edges[e][0];
      var n1 = edges[e][1];
      var node0 = nodes[n0];
      var node1 = nodes[n1];
      line(node0[0], node0[1], node1[0], node1[1]);
    }
  }

  // Draw nodes
  fill(nodeColour);
  noStroke();
  for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
    nodes = shapes[shapeNum].nodes;

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      ellipse(node[0], node[1], nodeSize, nodeSize);
    }
  }
  pop();
};

mouseDragged = function () {
  var dx = mouseX - pmouseX;
  var dy = mouseY - pmouseY;

  for (var shapeNum = 0; shapeNum < shapes.length; shapeNum++) {
    var nodes = shapes[shapeNum].nodes;
    rotateY3D(dx, nodes);
    rotateX3D(dy, nodes);
  }
};
