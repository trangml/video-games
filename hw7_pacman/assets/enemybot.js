/**
 * This class contains the code for the enemy and the enemy states. The enemy consists of the
 * ghosts, and the wander and chase states. The chase state is based off the A* Implementation from
 * the class notes, and has been modified to work for multiple enemies.
 */

const CHASE_DIST = 150;
const CHASE_FREQ = 30;

//////////////////////////////////////////////////////////////////////
/**
 * A* Implementation from class notes
 */
var qObj = function (x, y) {
    this.x = x;
    this.y = y;
    this.fcost = 0;
};

qObj.prototype.set = function (a, b) {
    this.x = a;
    this.y = b;
};

//A* Variables
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
var target = new p5.Vector(0, 0);
var targetPos = new p5.Vector(0, 0);
var finalDest = new p5.Vector(0, 0);
var seeker, target, targetPos, finalDest;

var initializeTilemap = function () {
    /**
     * Initialize the graph to copy the gameObj
     */
    graph = game.graph;
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

class wanderState {
    /**
     * Wandering state for the enemy
     */
    constructor() {
        this.wanderDist = 0;
        this.direction = 0;
    }

    calcNewDir(me) {
        /**
         * Come up with new direction and buffered direction.
         */
        this.wanderDist = random(20, 35);
        var collided = true;
        while (collided && me.buffered_dir !== STOP) {
            this.direction = int(random(1, 5));
            me.updateDelta(this.direction);
            collided = me.checkWallCollision();
            me.dir = this.direction;
        }
        if (me.dir === 1 || me.dir === 2) {
            this.buff_direction = int(random(3, 5));
        }
        else {
            this.buff_direction = int(random(1, 3));
        }
        me.buffered_dir = this.buff_direction;
    }
    execute(me) {
        /**
         * Execute the wander state
         */
        if (this.wanderDist <= 0) {
            this.calcNewDir(me);
        }
        this.wanderDist--;
        me.update();
        me.checkCollision();
        if (dist(me.position.x, me.position.y, player.position.x, player.position.y) < CHASE_DIST) {
            me.changeState(1);
            seeker = me;
            targetAcquired();
        }
    }
}  // wanderState

class chaseState {
    /**
     * This class holds the logic for the chase state which uses the
     */
    constructor(chaseFrame) {
        this.direction = 0;
        this.finalDest = createVector(0, 0);
        this.targetPos = createVector(0, 0);
        this.step = new p5.Vector(0, 0);
        this.path = [];
        this.target = new p5.Vector(0, 0);
        this.pathLen = 0;
        this.chaseFrame = chaseFrame;
    }
}  // chaseState

chaseState.prototype.execute = function (me) {
    // if too far go back to wandering
    if (dist(me.position.x, me.position.y, player.position.x, player.position.y) >= CHASE_DIST) {
        me.changeState(0);
    }
    else {
        // if the framecount is on the correct frame then calculate the path
        if (frameCount % CHASE_FREQ === this.chaseFrame) {
            seeker = me;
            targetAcquired();
        }
        // follow the path
        if (dist(this.target.x, this.target.y, me.position.x, me.position.y) > 1) {
            this.step.set(this.target.x - me.position.x, this.target.y - me.position.y);
            this.step.normalize();
            this.step.mult(me.speed);
            if (this.step.x > 0.5) {
                me.dir = RIGHT;
            }
            else if (this.step.x < -0.5) {
                me.dir = LEFT;
            }
            else if (this.step.y > 0.5) {
                me.dir = DOWN;
            }
            else if (this.step.y < -0.5) {
                me.dir = UP;
            }
            me.position.add(this.step);
        }
        else {
            if ((this.finalDest.x === this.target.x) && (this.finalDest.y === this.target.y)) {
                me.changeState(0);
            }
            else {
                this.pathLen--;
                if (this.pathLen > 0) {
                    this.target.x = this.path[this.pathLen].x;
                    this.target.y = this.path[this.pathLen].y;
                }
                else {
                    this.target.x = this.finalDest.x;
                    this.target.y = this.finalDest.y;
                }
            }
        }
    }
};

const deepcopy = (inObject) => {
    /**
     * Deep copy method
     *
     * Credit to :
     * https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
     */
    let outObject, value, key
    if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}
    for (key in inObject) {
        value = inObject[key]
        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepcopy(value)
    }
    return outObject
}

function copyToSeekerState(state) {
    /**
     * Deepcopy the variables to the specific enemy state
     */
    state.target = deepcopy(target);
    state.path = deepcopy(path);
    state.pathLen = deepcopy(pathLen);
    state.finalDest = deepcopy(finalDest);
}

var targetAcquired = function () {
    /**
     * Calculate the target and a path to it
     */
    target.x = player.position.x;
    target.y = player.position.y;
    finalDest.x = target.x;
    finalDest.y = target.y;
    targetPos.x = floor(finalDest.y / 20);
    targetPos.y = floor(finalDest.x / 20);
    var i = floor(seeker.position.y / 20);
    var j = floor(seeker.position.x / 20);
    initGraph(i, j);
    pathFound = 0;
    pathLen = 0;
    findAStarPath(i, j);
    if (pathLen > 0) {
        pathLen--;
        target.x = path[pathLen].x;
        target.y = path[pathLen].y;
        if (pathLen > 0) {
            var ai1 = dist(seeker.position.x, seeker.position.y, path[pathLen - 1].x, path[pathLen - 1].y);
            var ii1 = dist(target.x, target.y, path[pathLen - 1].x, path[pathLen - 1].y);
            if (ii1 > ai1) {
                pathLen--;
                target.x = path[pathLen].x;
                target.y = path[pathLen].y;
            }
        }
        copyToSeekerState(seeker.state[1]);
    }
    else {
        seeker.changeState(0);
    }
};

function setupA() {
    /**
     * Setup the A* algorithm
     */
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
}

class EnemyBot {
    /**
     * This class forms the enemy
     */
    constructor(x, y, size, color = "#F42C04", chaseFrame = 5) {
        this.position = new p5.Vector(x, y);
        this.state = [new wanderState(), new chaseState(chaseFrame)]
        this.currState = 0;
        this.size = size;
        this.center_offset = size / 2;
        this.color = color;
        this.scalar = size / 130;
        this.is_active = true;
        this.step = new p5.Vector(0, -1);
        this.position.x_delta = 0;
        this.position.y_delta = 0;
        this.chaseFrame = chaseFrame;
        this.scalar_offset = -100 / 2 * this.scalar;
        this.speed = 2;
        this.deathAnimation = 0;
        this.dir = STOP;
        this.buffered_dir = STOP;
        this.bufferedFrameCount = frameCount;
    }
    changeState(x) {
        this.currState = x;
    }
    draw() {
        /**
         * Draw the ghost
         */
        push();
        translate(this.position.x, this.position.y - 2);
        scale(this.scalar);
        noStroke();
        fill(this.color);
        circle(0, 0, 100);
        rect(-50, 0, 100, 50, 0, 0, 10, 10);
        if (this.dir === STOP || frameCount % 10 >= 5) {
            var feet = 42;
            triangle(-50, feet, -50, feet + 30, -25, feet);
            triangle(-25, feet, -15, feet + 30, 0, feet);
            triangle(25, feet, 15, feet + 30, 0, feet);
            triangle(50, feet, 50, feet + 30, 25, feet);
        }
        else {
            var feet = 42;
            triangle(-50, feet, -40, feet + 30, -25, feet);
            triangle(-25, feet, -5, feet + 30, 0, feet);
            triangle(25, feet, 5, feet + 30, 0, feet);
            triangle(50, feet, 40, feet + 30, 25, feet);
        }
        fill(255, 255, 255);
        ellipse(-18, 0, 35, 40);
        ellipse(18, 0, 35, 40);
        fill(0, 50, 255);

        var l_eye_x = -22;
        var l_eye_y = 3;
        var r_eye_x = 12;
        var r_eye_y = 3;
        // Change direction of the eyes based on what way we are moving
        switch (this.dir) {
            case RIGHT:
                l_eye_x = -12;
                r_eye_x = 22;
                break;
            case UP:
                l_eye_x = -17;
                r_eye_x = 17;
                l_eye_y = -7;
                r_eye_y = -7;
                break;
            case DOWN:
                l_eye_x = -17;
                r_eye_x = 17;
                l_eye_y = 7;
                r_eye_y = 7;
                break;
        }
        ellipse(l_eye_x, l_eye_y, 15, 17);
        ellipse(r_eye_x, r_eye_y, 15, 17);
        pop();
    }
    update() {
        this.updateDelta(this.dir);
        if (this.buffered_dir === STOP) {
            this.bufferedFrameCount = frameCount;
        }
    }
    updateDelta(dir) {
        /**
         * Update the movement deltas based on the direction
         */
        this.position.x_delta = 0;
        this.position.y_delta = 0;
        switch (dir) {
            case UP:
                this.position.y_delta = -this.speed;
                break;
            case DOWN:
                this.position.y_delta = this.speed;
                break;
            case LEFT:
                this.position.x_delta = -this.speed;
                break;
            case RIGHT:
                this.position.x_delta = this.speed;
                break;
            case STOP:
                this.position.y_delta = 0;
                this.position.x_delta = 0;
                break;
        }
    }
    move() {
        this.state[this.currState].execute(this);
    }
    checkWallCollision() {
        var collided = false;
        // check if we will collide if we move
        var object_offset = 9.5;
        var bottom_y = this.position.y + this.center_offset + this.position.y_delta + object_offset;
        var top_y = this.position.y - this.center_offset + this.position.y_delta - object_offset;
        var left_x = this.position.x - this.center_offset + this.position.x_delta - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset + this.position.x_delta;
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (!(right_x < game.objects[i].x || game.objects[i].x < left_x || bottom_y < game.objects[i].y || game.objects[i].y < top_y)) {
                    if (game.objects[i].obj === 2) {
                        collided = true;
                    }
                }
            }
        }
        return collided;
    }

    checkCollision() {
        var collided = this.checkWallCollision();
        if (!collided) {
            this.position.x += this.position.x_delta;
            this.position.y += this.position.y_delta;
        }
        this.position.x_delta = 0;
        this.position.y_delta = 0;
        // check for buffered direction
        if (this.buffered_dir !== STOP) {
            this.updateDelta(this.buffered_dir);
            var collided = this.checkWallCollision();
            if (!collided) {
                this.dir = this.buffered_dir;
                this.buffered_dir = STOP;
            }
        }

        this.position.x_delta = 0;
        this.position.y_delta = 0;
        return collided;
    }
}