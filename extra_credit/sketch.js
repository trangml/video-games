var backgroundColour, nodeColour, edgeColour;
var nodeSize = 8;

var node0 = [-100, -100, -100];
var node1 = [-100, -100, 100];
var node2 = [-100, 100, -100];
var node3 = [-100, 100, 100];
var node4 = [100, -100, -100];
var node5 = [100, -100, 100];
var node6 = [100, 100, -100];
var node7 = [100, 100, 100];
var nodes = [node0, node1, node2, node3, node4, node5, node6, node7];

var nNode0 = [-100, 0, 0];
var nNode0b = [-200, 0, 0];
var nVec0 = [nNode0, nNode0b];
var nNode1 = [100, 0, 0];
var nNode1b = [200, 0, 0];
var nVec1 = [nNode1, nNode1b];
var nNode2 = [0, 0, -100];
var nNode2b = [0, 0, -200];
var nVec2 = [nNode2, nNode2b];
var nNode3 = [0, 0, 100];
var nNode3b = [0, 0, 200];
var nVec3 = [nNode3, nNode3b];
var nNode4 = [0, -100, 0];
var nNode4b = [0, -200, 0];
var nVec4 = [nNode4, nNode4b];
var nNode5 = [0, 100, 0];
var nNode5b = [0, 200, 0];
var nVec5 = [nNode5, nNode5b];
var vecs = [nVec0, nVec1, nVec2, nVec3, nVec4, nVec5];

var face0 = [0, 1, 3, 2]; // left
var face1 = [4, 5, 7, 6]; // right
var face2 = [0, 2, 6, 4]; // back
var face3 = [1, 3, 7, 5]; // front
var face4 = [0, 1, 5, 4]; // bottom
var face5 = [2, 3, 7, 6]; // top
var faces = [face0, face1, face2, face3, face4, face5];

var edge0 = [0, 1];
var edge1 = [1, 3];
var edge2 = [3, 2];
var edge3 = [2, 0];
var edge4 = [4, 5];
var edge5 = [5, 7];
var edge6 = [7, 6];
var edge7 = [6, 4];
var edge8 = [0, 4];
var edge9 = [1, 5];
var edge10 = [2, 6];
var edge11 = [3, 7];
var edges = [edge0, edge1, edge2, edge3, edge4, edge5, edge6, edge7, edge8, edge9, edge10, edge11];

// Rotate shape around the z-axis
var rotateZ3D = function (theta) {
  var sinTheta = sin(theta);
  var cosTheta = cos(theta);

  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    var x = node[0];
    var y = node[1];
    node[0] = x * cosTheta - y * sinTheta;
    node[1] = y * cosTheta + x * sinTheta;
  }
  for (var n = 0; n < vecs.length; n++) {
    var nNodes = vecs[n];
    var node1 = nNodes[0];
    var node2 = nNodes[1];
    var x = node1[0];
    var y = node1[1];
    var xb = node2[0];
    var yb = node2[1];
    node1[0] = x * cosTheta - y * sinTheta;
    node1[1] = y * cosTheta + x * sinTheta;
    node2[0] = xb * cosTheta - yb * sinTheta;
    node2[1] = yb * cosTheta + xb * sinTheta;
  }
};

var rotateY3D = function (theta) {
  var sinTheta = sin(theta);
  var cosTheta = cos(theta);

  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    var x = node[0];
    var z = node[2];
    node[0] = x * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + x * sinTheta;
  }
  for (var n = 0; n < vecs.length; n++) {
    var nNodes = vecs[n];
    var node1 = nNodes[0];
    var node2 = nNodes[1];
    var x = node1[0];
    var z = node1[2];
    var xb = node2[0];
    var zb = node2[2];
    node1[0] = x * cosTheta - z * sinTheta;
    node1[2] = z * cosTheta + x * sinTheta;
    node2[0] = xb * cosTheta - zb * sinTheta;
    node2[2] = zb * cosTheta + xb * sinTheta;
  }
};

var rotateX3D = function (theta) {
  var sinTheta = sin(theta);
  var cosTheta = cos(theta);

  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    var y = node[1];
    var z = node[2];
    node[1] = y * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + y * sinTheta;
  }
  for (var n = 0; n < vecs.length; n++) {
    var nNodes = vecs[n];
    var node1 = nNodes[0];
    var node2 = nNodes[1];
    var z = node1[2];
    var y = node1[1];
    var zb = node2[2];
    var yb = node2[1];
    node1[1] = y * cosTheta - z * sinTheta;
    node1[2] = z * cosTheta + y * sinTheta;
    node2[1] = yb * cosTheta - zb * sinTheta;
    node2[2] = zb * cosTheta + yb * sinTheta;
  }
};

var faceColor;
function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  backgroundColour = color(255, 255, 255);
  nodeColour = color(40, 168, 107);
  edgeColour = color(34, 68, 204);
  faceColor = color("yellow");

  ///// EXPERIMENT: Comment out below /////
  //rotateZ3D(30);
  //rotateY3D(30);
  //rotateX3D(30);
}

var draw = function () {
  background(backgroundColour);
  push();
  translate(200, 200);

  // Draw edges
  stroke(edgeColour);
  for (var e = 0; e < edges.length; e++) {
    var n0 = edges[e][0];
    var n1 = edges[e][1];
    var node0 = nodes[n0];
    var node1 = nodes[n1];
    line(node0[0], node0[1], node1[0], node1[1]);
  }

  // Draw nodes
  fill(nodeColour);
  noStroke();
  for (var n = 0; n < nodes.length; n++) {
    var node = nodes[n];
    ellipse(node[0], node[1], nodeSize, nodeSize);
  }
  // Draw faces
  fill(faceColor);
  for (var i = 0; i < vecs.length; i++) {
    var nNodes = vecs[i];
    var normZ = nNodes[1][2] - nNodes[0][2];
    if (normZ > 0) {
      var nodeIds = faces[i];
      beginShape();
      vertex(nodes[nodeIds[0]][0], nodes[nodeIds[0]][1]);
      vertex(nodes[nodeIds[1]][0], nodes[nodeIds[1]][1]);
      vertex(nodes[nodeIds[2]][0], nodes[nodeIds[2]][1]);
      vertex(nodes[nodeIds[3]][0], nodes[nodeIds[3]][1]);
      endShape(CLOSE);
    }
  }
  pop();
  noFill();
};

mouseDragged = function () {
  rotateY3D(mouseX - pmouseX);
  rotateX3D(mouseY - pmouseY);
};
