// A* search based on BFS
// need q, inq, and comefrom, and cost as well as fcost in q
// much faster than BFS
// and still achieve shortest path
// collision detection still in effect

var oneDegree, twoDegrees, angle45, angle179;

var tileMap = [
  "                    ",
  "                    ",
  "     wwwwww    w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w         w    ",
  "     w    wwwwww    ",
  "                    ",
  "                    ",
  "                    ",
  "                    "];

var wallObj = function (x, y) {
  this.x = x;
  this.y = y;
};

var qObj = function (x, y) {
  this.x = x;
  this.y = y;
  this.fcost = 0;
};

qObj.prototype.set = function (a, b) {
  this.x = a;
  this.y = b;
};

var graph = [];
var cost = [];
var inq = [];
var comefrom = [];
var path = [];
var q = [];
var pathLen = 0;
var pathFound = 0;
var qLen = 0;
var qStart = 0;

var initialized = 0;
var walls = [];

var initializeTilemap = function () {
  for (var i = 0; i < tileMap.length; i++) {
    for (var j = 0; j < tileMap[i].length; j++) {
      if (tileMap[i][j] === 'w') {
        walls.push(new wallObj(j * 20, i * 20));
        graph[i][j] = -1;
      }
      else {
        graph[i][j] = 0;
      }
    }
  }
};

var displayTilemap = function () {
  fill(0, 0, 255);
  noStroke();
  for (var i = 0; i < walls.length; i++) {
    rect(walls[i].x, walls[i].y, 20, 20);
  }
};

var haltState = function () {
  this.angle = 0;
};

var turnState = function () {
  this.angle = 0;
  this.angleDir = 0;
  this.vec = new p5.Vector(0, 0);
};

var chaseState = function () {
  this.step = new p5.Vector(0, 0);
};

var tankObj = function (x, y) {
  this.position = new p5.Vector(x, y);
  this.state = [new haltState(), new turnState(), new chaseState()];
  this.currState = 0;
  this.angle = 0;
  this.whisker1 = new p5.Vector(0, 0);
  this.whisker2 = new p5.Vector(0, 0);
};

var targetObj = function (x, y) {
  this.x = x;
  this.y = y;
};

var tank, target, targetPos, finalDest;

tankObj.prototype.changeState = function (x) {
  this.currState = x;
};

haltState.prototype.execute = function (me) {

  if (dist(me.position.x, me.position.y, target.x, target.y) < 5) {
    me.changeState(1);
  }
};

turnState.prototype.execute = function (me) {
  this.vec.set(target.x - me.position.x, target.y - me.position.y);
  this.angle = this.vec.heading();
  var angleDiff = abs(this.angle - me.angle);
  if (angleDiff > twoDegrees) {
    if (this.angle > me.angle) {
      this.angleDir = oneDegree;
    }
    else {
      this.angleDir = -oneDegree;
    }
    if (angleDiff > PI) {
      this.angleDir = -this.angleDir;
    }

    me.angle += this.angleDir;
    if (me.angle > PI) {
      me.angle = -angle179;
    }
    else if (me.angle < -PI) {
      me.angle = angle179;
    }
  }
  else {
    me.changeState(2);
  }
};

var findIntersection = function (p) {
  var distance = 0;

  for (var i = 0; i < walls.length; i++) {
    var d = dist(p.x, p.y, walls[i].x + 10, walls[i].y + 10);
    if (d < 20) {
      distance += d;
    }
  }

  if (distance === 0) {
    distance = 100000;
  }

  return (distance);
};

chaseState.prototype.collideWall = function (me) {
  var collide = 0;
  this.step.set(target.x - me.position.x, target.y - me.position.y);
  this.step.normalize();
  this.step.mult(15);
  var ahead = p5.Vector.add(me.position, this.step);
  for (var i = 0; i < walls.length; i++) {
    if (dist(ahead.x, ahead.y, walls[i].x + 10, walls[i].y + 10) < 20) {
      collide = 1;

      me.whisker1.set(this.step.x, this.step.y);
      me.whisker2.set(this.step.x, this.step.y);
      me.whisker1.rotate(angle45);
      me.whisker2.rotate(-angle45);
      me.whisker1.add(me.position);
      me.whisker2.add(me.position);
      var dist1 = findIntersection(me.whisker1);
      var dist2 = findIntersection(me.whisker2);

      if (dist1 > dist2) {
        target.x = me.whisker1.x;
        target.y = me.whisker1.y;
      }
      else {
        target.x = me.whisker2.x;
        target.y = me.whisker2.y;
      }
    }
  }

  return (collide);
};

chaseState.prototype.execute = function (me) {
  if (this.collideWall(me) === 1) {
    me.changeState(1);
  }
  else if (dist(target.x, target.y, me.position.x, me.position.y) > 2) {
    this.step.set(target.x - me.position.x, target.y - me.position.y);
    this.step.normalize();
    me.position.add(this.step);
  }
  else {
    if ((finalDest.x === target.x) && (finalDest.y === target.y)) {
      me.changeState(0);
    }
    else {
      pathLen--;
      if (pathLen > 0) {
        target.x = path[pathLen].x;
        target.y = path[pathLen].y;
      }
      else {
        target.x = finalDest.x;
        target.y = finalDest.y;
      }
      me.changeState(1);
    }
  }
};

tankObj.prototype.draw = function () {
  push();
  translate(this.position.x, this.position.y);
  rotate(this.angle);
  fill(31, 79, 28);
  rect(-10, -10, 20, 20);
  rect(0, -2, 20, 4);
  pop();
};

var initGraph = function (x, y) {
  for (var i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      if (graph[i][j] > 0) {
        graph[i][j] = 0;
      }
      inq[i][j] = 0;
      cost[i][j] = 0;
    }
  }

  graph[x][y] = 1;
};

//////////////////////////////////////////////////////////////////////
var findAStarPath = function (x, y) {
  var i, j, a, b;
  qLen = 0;
  graph[x][y] = 1;
  inq[x][y] = 1;
  q[qLen].set(x, y);
  q[qLen].fcost = 0;
  qLen++;
  pathLen = 0;
  qStart = 0;

  var findMinInQ = function () {
    var min = q[qStart].fcost;
    var minIndex = qStart;
    for (var i = qStart + 1; i < qLen; i++) {
      if (q[i].fcost < min) {
        min = q[i].qStart;
        minIndex = i;
      }
    }
    if (minIndex !== qStart) {  // swap
      var t1 = q[minIndex].x;
      var t2 = q[minIndex].y;
      var t3 = q[minIndex].fcost;
      q[minIndex].x = q[qStart].x;
      q[minIndex].y = q[qStart].y;
      q[minIndex].fcost = q[qStart].fcost;
      q[qStart].x = t1;
      q[qStart].y = t2;
      q[qStart].fcost = t3;
    }
  };

  var setComeFrom = function (a, b, i, j) {
    inq[a][b] = 1;
    comefrom[a][b].set(i, j);
    q[qLen].set(a, b);
    cost[a][b] = cost[i][j] + 10;
    q[qLen].fcost = cost[a][b] + dist(b * 20 + 10, a * 20 + 10, finalDest.x,
      finalDest.y);
    qLen++;
  };

  while ((qStart < qLen) && (pathFound === 0)) {
    findMinInQ();
    i = q[qStart].x;
    j = q[qStart].y;
    graph[i][j] = 1;
    qStart++;

    if ((i === targetPos.x) && (j === targetPos.y)) {
      pathFound = 1;
      path[pathLen].set(j * 20 + 10, i * 20 + 10);
      pathLen++;
    }

    a = i + 1;
    b = j;
    if ((a < 20) && (pathFound === 0)) {
      if ((graph[a][b] === 0) && (inq[a][b] === 0)) {
        setComeFrom(a, b, i, j);
      }
    }
    a = i - 1;
    b = j;
    if ((a >= 0) && (pathFound === 0)) {
      if ((graph[a][b] === 0) && (inq[a][b] === 0)) {
        setComeFrom(a, b, i, j);
      }
    }
    a = i;
    b = j + 1;
    if ((b < 20) && (pathFound === 0)) {
      if ((graph[a][b] === 0) && (inq[a][b] === 0)) {
        setComeFrom(a, b, i, j);
      }
    }
    a = i;
    b = j - 1;
    if ((b >= 0) && (pathFound === 0)) {
      if ((graph[a][b] === 0) && (inq[a][b] === 0)) {
        setComeFrom(a, b, i, j);
      }
    }
  }   // while

  while ((i !== x) || (j !== y)) {
    a = comefrom[i][j].x;
    b = comefrom[i][j].y;
    path[pathLen].set(b * 20 + 10, a * 20 + 10);
    pathLen++;
    i = a;
    j = b;
  }
};

var mouseClicked = function () {
  target.x = mouseX;
  target.y = mouseY;
  finalDest.x = target.x;
  finalDest.y = target.y;
  targetPos.x = floor(finalDest.y / 20);
  targetPos.y = floor(finalDest.x / 20);
  var i = floor(tank.position.y / 20);
  var j = floor(tank.position.x / 20);
  initGraph(i, j);
  pathFound = 0;
  pathLen = 0;
  findAStarPath(i, j);
  pathLen--;
  target.x = path[pathLen].x;
  target.y = path[pathLen].y;
  if (tank.currState !== 1) {
    tank.changeState(1);
  }
};

function setup() {
  createCanvas(400, 400);
  angleMode(RADIANS);
  oneDegree = PI / 180;
  twoDegrees = PI / 90;
  angle179 = PI - oneDegree;
  angle45 = PI / 4;

  graph = new Array(20);
  cost = new Array(20);
  inq = new Array(20);
  comefrom = new Array(20);
  for (var i = 0; i < 20; i++) {
    graph[i] = new Array(20);
    cost[i] = new Array(20);
    inq[i] = new Array(20);
    comefrom[i] = new Array(20);
  }
  for (i = 0; i < 400; i++) {
    path.push(new p5.Vector(0, 0));
    q.push(new qObj(0, 0));
  }
  for (i = 0; i < 20; i++) {
    for (var j = 0; j < 20; j++) {
      comefrom[i][j] = new p5.Vector(0, 0);
    }
  }

  tank = new tankObj(200, 100);
  target = new targetObj(0, 0);
  targetPos = new targetObj(0, 0);
  finalDest = new targetObj(0, 0);

  initialized = 1;
  initializeTilemap();
}

var draw = function () {
  background(255, 255, 255);
  displayTilemap();
  tank.draw();
  tank.state[tank.currState].execute(tank);
  fill(255, 0, 0);
  text("Steps left: " + pathLen, 320, 10);
};
