/**
 * This file contains the implementation of the Cuboid class, the BigCuboidClass, and the Face class.
 */
var nodeSize = 8;

class Face {
  /**
   * The Face class contains the drawing logic for a singular face of a cubiod, as well as the centroid
   */
  constructor(points, color, normZ) {
    this.points = points;
    this.color = color;
    this.z = normZ;
  }
  getCentroid() {
    /**
     * Returns the combined z value of the points in this face
     */
    var z = 0;
    for (var i = 0; i < this.points.length; i++) {
      z += this.points[i][2];
    }
    return z;
  }
  draw() {
    /**
     * Draws the face
     */
    if (this.color !== "none") {
      //strokeWeight(1);
      stroke(this.color);
      noStroke();
      fill(this.color);
      beginShape();
      for (var i = 0; i < this.points.length; i++) {
        vertex(this.points[i][0], this.points[i][1]);
      }
      endShape(CLOSE);
    }
  }
}

class Cuboid {
  /**
   * The Cuboid contains the logic for drawing a cuboid, as well as the centroid. It has the
   * necessary nodes, edges, normal vectors, and faces.
   */
  constructor(x, y, z, w, h, d, colors = ["red", "green", "yellow", "blue", "purple", "orange"]) {
    if (w < 0) {
      x += w;
      w *= -1;
    }
    if (h < 0) {
      y += h;
      h *= -1;
    }
    if (d < 0) {
      z += d;
      d *= -1;
    }
    this.nodes = [[x, y, z],
    [x, y, z + d],
    [x, y + h, z],
    [x, y + h, z + d],
    [x + w, y, z],
    [x + w, y, z + d],
    [x + w, y + h, z],
    [x + w, y + h, z + d]];
    this.edges = [[0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]];
    this.norm = [[x, y + h / 2, z + d / 2],
    [x + w, y + h / 2, z + d / 2],
    [x + w / 2, y + h / 2, z],
    [x + w / 2, y + h / 2, z + d],
    [x + w / 2, y, z + d / 2],
    [x + w / 2, y + h, z + d / 2]];
    this.normB = [[x - w, y + h / 2, z + d / 2],
    [x + 2 * w, y + h / 2, z + d / 2],
    [x + w / 2, y + h / 2, z - d],
    [x + w / 2, y + h / 2, z + 2 * d],
    [x + w / 2, y - h, z + d / 2],
    [x + w / 2, y + 2 * h, z + d / 2]];
    this.vecs = [this.norm, this.normB];

    // left, right, back, front, bottom, top
    this.faces = [[0, 1, 3, 2],
    [4, 5, 7, 6],
    [0, 2, 6, 4],
    [1, 3, 7, 5],
    [0, 1, 5, 4],
    [2, 3, 7, 6]];

    this.colors = colors;
  }
  draw() {
    /**
     * Draws the cuboid wireframe and shown faces
     */
    var vecs, nodes, edges;
    // Draw edges
    stroke(edgeColour);

    nodes = this.nodes;
    edges = this.edges;
    vecs = this.vecs;

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
    nodes = this.nodes;

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      ellipse(node[0], node[1], nodeSize, nodeSize);
    }
    // Draw faces
    for (var i = 0; i < vecs[0].length; i++) {
      fill(this.colors[i]);
      var normZ = - vecs[1][i][2] + vecs[0][i][2];
      if (normZ > 0) {
        var nodeIds = this.faces[i];
        beginShape();
        vertex(nodes[nodeIds[0]][0], nodes[nodeIds[0]][1]);
        vertex(nodes[nodeIds[1]][0], nodes[nodeIds[1]][1]);
        vertex(nodes[nodeIds[2]][0], nodes[nodeIds[2]][1]);
        vertex(nodes[nodeIds[3]][0], nodes[nodeIds[3]][1]);
        endShape(CLOSE);
      }
    }
  }

  getDrawnFaces() {
    /**
     * Returns the faces of the cuboid that are drawn
     */
    var vecs, nodes, edges;
    nodes = this.nodes;
    edges = this.edges;
    vecs = this.vecs;
    var faces = [];
    for (var i = 0; i < vecs[0].length; i++) {
      var normZ = -vecs[1][i][2] + vecs[0][i][2];
      if (normZ > -3) {
        var nodeIds = this.faces[i];
        var shape = [nodes[nodeIds[0]], nodes[nodeIds[1]], nodes[nodeIds[2]], nodes[nodeIds[3]]];
        faces.push(new Face(shape, this.colors[i], normZ));
      }
    }
    return faces;
  }
  rotateZ3D(theta, nodes = this.nodes, vecs = this.vecs) {
    /**
     * Rotates the cuboid around the z axis
     */
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      var x = node[0];
      var y = node[1];
      node[0] = x * cosTheta - y * sinTheta;
      node[1] = y * cosTheta + x * sinTheta;
    }
    for (var n = 0; n < vecs[0].length; n++) {
      var node1 = vecs[0][n];
      var node2 = vecs[1][n];
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

  rotateY3D(theta, nodes = this.nodes, vecs = this.vecs) {
    /**
     * Rotates the cuboid around the y axis
     */
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      var x = node[0];
      var z = node[2];
      node[0] = x * cosTheta - z * sinTheta;
      node[2] = z * cosTheta + x * sinTheta;
    }
    for (var n = 0; n < vecs[0].length; n++) {
      var node1 = vecs[0][n];
      var node2 = vecs[1][n];
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

  rotateX3D(theta, nodes = this.nodes, vecs = this.vecs) {
    /**
     * Rotates the cuboid around the x axis
     */
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];
      var y = node[1];
      var z = node[2];
      node[1] = y * cosTheta - z * sinTheta;
      node[2] = z * cosTheta + y * sinTheta;
    }
    for (var n = 0; n < vecs[0].length; n++) {
      var node1 = vecs[0][n];
      var node2 = vecs[1][n];
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
};

class BigCuboid {
  /**
   * The BigCuboid class contains a larger cuboid which is then broken down into smaller cuboids
   */
  constructor(x, y, z, w, h, d, colors = ["red", "green", "yellow", "blue", "purple", "orange"]) {
    if (w < 0) {
      x += w;
      w *= -1;
    }
    if (h < 0) {
      y += h;
      h *= -1;
    }
    if (d < 0) {
      z += d;
      d *= -1;
    }
    this.cuboids = [];
    this.scale = 1;
    this.cubeSizeX = w / this.scale;
    this.cubeSizeY = h / this.scale;
    this.cubeSizeZ = d / this.scale;
    this.size = 10
    this.cubeSizeX = this.size;
    this.cubeSizeY = this.size;
    this.cubeSizeZ = this.size;
    var hideOverlap = 2;
    // calculate the visible borders
    var x_bounds = [0, w - this.cubeSizeX]
    var y_bounds = [0, h - this.cubeSizeY]
    var z_bounds = [0, d - this.cubeSizeZ]
    for (var i = 0; i < w; i += this.cubeSizeX) {
      for (var j = 0; j < h; j += this.cubeSizeY) {
        for (var k = 0; k < d; k += this.cubeSizeZ) {
          // if we are on a visible border
          if (x_bounds.indexOf(i) !== -1 || y_bounds.indexOf(j) !== -1 || z_bounds.indexOf(k) !== -1)
            // push a cuboid
            this.cuboids.push(new Cuboid(x + i - hideOverlap, y + j - hideOverlap, z + k - hideOverlap, this.cubeSizeX + hideOverlap, this.cubeSizeY + hideOverlap, this.cubeSizeZ + hideOverlap, colors));

        }
      }
    }
  }
  getDrawnFaces() {
    /**
     * Get the drawn faces for each cuboid
     */
    var faces = [];
    for (var i = 0; i < this.cuboids.length; i++) {
      faces = faces.concat(this.cuboids[i].getDrawnFaces());
    }
    return faces;
  }
  // Rotate shape around the z-axis
  rotateZ3D(theta) {
    for (var i = 0; i < this.cuboids.length; i++) {
      this.cuboids[i].rotateZ3D(theta);
    }
  };
  // Rotate shape around the y-axis
  rotateY3D(theta) {
    for (var i = 0; i < this.cuboids.length; i++) {
      this.cuboids[i].rotateY3D(theta);
    }
  };
  // Rotate shape around the x-axis
  rotateX3D(theta) {
    for (var i = 0; i < this.cuboids.length; i++) {
      this.cuboids[i].rotateX3D(theta);
    }
  };

}