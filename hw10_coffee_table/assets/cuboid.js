var nodeSize = 8;

var createCuboid = function (x, y, z, w, h, d) {
    var nodes = [[x, y, z],
    [x, y, z + d],
    [x, y + h, z],
    [x, y + h, z + d],
    [x + w, y, z],
    [x + w, y, z + d],
    [x + w, y + h, z],
    [x + w, y + h, z + d]];
    var edges = [[0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]];
    var norm = [[x, y + h / 2, z + d / 2],
    [x + w, y + h / 2, z + d / 2],
    [x + w / 2, y + h / 2, z],
    [x + w / 2, y + h / 2, z + d],
    [x + w / 2, y, z + d / 2],
    [x + w / 2, y + h, z + d / 2]];
    var normB = [[x - w, y + h / 2, z + d / 2],
    [x + 2 * w, y + h / 2, z + d / 2],
    [x + w / 2, y + h / 2, z - d],
    [x + w / 2, y + h / 2, z + 2 * d],
    [x + w / 2, y - h, z + d / 2],
    [x + w / 2, y + h, z + d / 2]];
    var vecs = [norm, normB];

    // left, right, back, front, bottom, top
    var faces = [[0, 1, 3, 2],
    [4, 5, 7, 6],
    [0, 2, 6, 4],
    [1, 3, 7, 5],
    [0, 1, 5, 4],
    [2, 3, 7, 6]];

    var colors = ["red", "green", "yellow", "blue", "purple", "orange"]

    return { 'nodes': nodes, 'edges': edges };
};

var shape1, shape2, shape3;
var shapes = [];

// Rotate shape around the z-axis
var rotateZ3D = function (theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
};

var rotateY3D = function (theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
};

var rotateX3D = function (theta, nodes) {
    var sinTheta = sin(theta);
    var cosTheta = cos(theta);

    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
};