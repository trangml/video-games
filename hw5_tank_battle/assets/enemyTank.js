var angle179;
var thirtyDegrees;
var twoDegrees;
var oneDegree;
var chaseDist = 140;

class fireState {
    constructor() {
        this.angle = 0;
        this.angleDir = 0;
        this.vec = new p5.Vector(0, 0);
    }

    execute(me) {
        if (me.inMissileTrajectory) {
            me.changeState(1);
            me.fire = 0;
        }
        else {
            this.vec.set(player.position.x - me.position.x, player.position.y - me.position.y);
            this.angle = this.vec.heading();
            var angleDiff = abs(this.angle - me.angle);
            if (angleDiff < twoDegrees) {
                if (dist(me.position.x, me.position.y, player.position.x, player.position.y) > chaseDist) {
                    me.changeState(3);
                    me.fire = 0;
                }
                else {
                    me.fire = 1;
                }
            }
            else {
                me.changeState(2);
                me.fire = 0;
            }
        }
    }
}

class evadeState {
    constructor() {
        this.angle = 0;
        this.angleDir = 0;
        this.vec = new p5.Vector(0, 0);
        this.currFrameCount = frameCount;
    }

    execute(me) {
        if (me.targetingMissile == null) {
            me.moveForward = 0;
            me.inMissileTrajectory = false;
            me.changeState(0);
            return;
        }
        else {
            this.angle = me.targetingMissile.angle;
            var angleDiff = abs(this.angle - me.angle);
            var modAngleDiff = angleDiff % PI;
            if (modAngleDiff < 1.2 * thirtyDegrees || modAngleDiff > PI - 1.2 * thirtyDegrees) {
                var slope = tan(this.angle);
                var y_pred = slope * (me.position.x - me.targetingMissile.x) + me.targetingMissile.y;
                if (y_pred > me.position.y) {
                    // we are above the line of the bullet
                    this.angleDir = -3 * oneDegree;
                }
                else if (y_pred < me.position.y) {
                    // we are above the line of the bullet
                    this.angleDir = 3 * oneDegree;
                }
                me.angle += this.angleDir;
                if (me.angle > PI) {
                    me.angle = -angle179;
                }
                else if (me.angle < -PI) {
                    me.angle = angle179;
                }
                this.currFrameCount = frameCount;
            }
            else {
                me.moveForward = 1;
                if (!me.targetingMissile.raycast([me])) {
                    me.inMissileTrajectory = false;
                    me.targetingMissile = null;
                    me.moveForward = 0;
                    me.changeState(0);
                }
            }
        }
    }
}

class turnState {
    constructor() {
        this.angle = 0;
        this.angleDir = 0;
        this.vec = new p5.Vector(0, 0);
    }
    execute(me) {
        if (me.inMissileTrajectory) {
            me.changeState(1);
        }
        else {
            this.vec.set(player.position.x - me.position.x, player.position.y - me.position.y);
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
                me.changeState(0);
            }
        }
    }
}

class chaseState {
    constructor() {
        this.angle = 0;
        this.angleDir = 0;
        this.vec = new p5.Vector(0, 0);
        this.step = new p5.Vector(0, 0);
    }
    execute(me) {
        if (me.inMissileTrajectory) {
            me.changeState(1);
            me.moveForward = 0;
        }
        else {
            this.vec.set(player.position.x - me.position.x, player.position.y - me.position.y);
            this.angle = this.vec.heading();
            var angleDiff = abs(this.angle - me.angle);
            if (angleDiff <= twoDegrees) {
                if (dist(player.position.x, player.position.y, me.position.x, me.position.y) > chaseDist) {
                    me.moveForward = 1;
                }
                else {
                    me.moveForward = 0;
                    me.changeState(0);
                }
            }
            else {
                me.moveForward = 0;
                me.changeState(2);
            }
        }
    }
}


class EnemyTank {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, id, angle = 0, color = "#F42C04") {
        this.position = new p5.Vector(x, y);
        this.size = size;
        this.center_offset = size / 2;
        this.color = color;
        this.angle = angle;
        this.scalar = size / 30;
        this.scale = size / 90;
        this.is_active = true;
        this.position.x_delta = 0;
        this.position.y_delta = 0;
        this.speed = 0.7;
        this.deathAnimation = 0;
        this.inMissileTrajectory = 0;
        this.targetingMissile = null;
        this.state = [new fireState(), new evadeState(), new turnState(), new chaseState()];
        this.currState = 3;
        this.prevState = 3;
        this.move_speed = 1;
        this.turn_speed = radians(1);
        this.bullets = [new BulletObj(), new BulletObj(), new BulletObj(), new BulletObj(), new BulletObj()];
        this.bulletsIndex = 0;
        this.moveForward = 0;
        this.moveBackward = 0;
        this.turnLeft = 0;
        this.turnRight = 0;
        this.fire = 0;
        this.id = id;
        this.currFrameCount = frameCount;
    }
    changeState(x) {
        this.prevState = this.currState;
        this.currState = x;
    }
    drawBullets() {
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].fire) {
                this.bullets[i].move();
                this.bullets[i].draw();
            }
        }
    }
    draw(x = this.position.x, y = this.position.y) {
        push()
        translate(x, y)
        rotate(this.angle)
        scale(this.scale)

        strokeWeight(3)
        stroke("#270a0a");
        fill("#ffd700")
        rect(-43, -40, 86, 15, 5)
        rect(-43, 25, 86, 15, 5)
        strokeWeight(1)
        for (var i = 0; i < 6; i++) {
            line(-30 + i * 10, -40, -30 + i * 10, 40)

        }
        strokeWeight(3)
        stroke(0);
        fill(this.color)
        rect(-40, -25, 80, 50, 10)
        strokeWeight(2)
        rect(-20, -20, 40, 40, 13, 15, 15, 13)
        strokeWeight(2)
        rect(20, -10, 10, 20, 0, 20, 20, 0)

        ellipse(47, 0, 10, 20)
        rect(30, -7, 15, 14)
        circle(0, 0, 15)
        pop()
        this.drawBullets();
    }
    drawDeath(x = this.position.x, y = this.position.y) {
        push()
        translate(x, y)
        rotate(this.angle)
        scale(this.scale)

        strokeWeight(3)
        stroke("#270a0a");
        fill("#646428")
        rect(-43, -40, 86, 15, 5)
        rect(-43, 25, 86, 15, 5)
        strokeWeight(1)
        for (var i = 0; i < 6; i++) {
            line(-30 + i * 10, -40, -30 + i * 10, 40)

        }
        strokeWeight(3)
        stroke(0);
        fill("gray")
        rect(-40, -25, 80, 50, 10)
        strokeWeight(2)
        rect(-20, -20, 40, 40, 13, 15, 15, 13)
        strokeWeight(2)
        rect(20, -10, 10, 20, 0, 20, 20, 0)

        ellipse(47, 0, 10, 20)
        rect(30, -7, 15, 14)
        circle(0, 0, 15)
        pop()
        this.drawBullets();
    }
    fireBullet() {
        if (this.currFrameCount < (frameCount - 75)) {
            this.currFrameCount = frameCount;
            this.bullets[this.bulletsIndex].fire = 1;
            this.bullets[this.bulletsIndex].color = this.color;
            this.bullets[this.bulletsIndex].id = this.id;
            this.bullets[this.bulletsIndex].x = this.position.x + this.center_offset * cos(this.angle);
            this.bullets[this.bulletsIndex].y = this.position.y + this.center_offset * sin(this.angle);
            this.bullets[this.bulletsIndex].angle = this.angle;
            this.bulletsIndex++;
            if (this.bulletsIndex > 4) {
                this.bulletsIndex = 0;
            }
        }
    }
    ///// EXPERIMENT /////
    update() {
        if (this.moveForward === 1) {
            this.position.x_delta = this.move_speed * cos(this.angle);
            this.position.y_delta = this.move_speed * sin(this.angle);
        }
        if (this.moveBackward === 1) {
            //this.position.x -= this.speed;
            this.position.x_delta = -this.move_speed * cos(this.angle);
            this.position.y_delta = -this.move_speed * sin(this.angle);
        }
        if (this.turnLeft === 1) {
            this.angle -= this.turn_speed;
        }
        if (this.turnRight === 1) {
            this.angle += this.turn_speed;
        }
        if (this.fire === 1) {
            this.fireBullet();
        }
    }
    move() {
        this.state[this.currState].execute(this);
        this.update();
        this.checkCollision();
    }
    checkCollision() {
        var collided_x = false;
        var collided_y = false;
        // check if we will collide if we move in the x direction
        // Now check for bounds
        var object_offset = 9;
        var bottom_y = this.position.y + this.center_offset + object_offset;
        var top_y = this.position.y - this.center_offset - object_offset;
        var left_x = this.position.x - this.center_offset + this.position.x_delta - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset + this.position.x_delta;
        for (var i = 0; i < game.enemies.length; i++) {
            if (i != this.id) {
                if (!(right_x < game.enemies[i].position.x || game.enemies[i].position.x < left_x || bottom_y < game.enemies[i].position.y || game.enemies[i].position.y < top_y)) {
                    collided_x = true;
                }
            }
        }
        // check if collide with the player
        if (!(right_x < player.position.x || player.position.x < left_x || bottom_y < player.position.y || player.position.y < top_y)) {
            collided_x = true;
        }
        // check if we will collide if we move in the y direction
        var object_offset = 9;
        var bottom_y = this.position.y + this.center_offset + this.position.y_delta + object_offset;
        var top_y = this.position.y - this.center_offset + this.position.y_delta - object_offset;
        var left_x = this.position.x - this.center_offset - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset;
        for (var i = 0; i < game.enemies.length; i++) {
            if (i != this.id) {
                if (!(right_x < game.enemies[i].position.x || game.enemies[i].position.x < left_x || bottom_y < game.enemies[i].position.y || game.enemies[i].position.y < top_y)) {
                    collided_y = true;
                }
            }
        }
        // check if collide with the player
        if (!(right_x < player.position.x || player.position.x < left_x || bottom_y < player.position.y || player.position.y < top_y)) {
            collided_y = true;
        }
        if (!collided_x) {
            this.position.x += this.position.x_delta;
        }
        if (!collided_y) {
            this.position.y += this.position.y_delta;
        }
        this.position.x_delta = 0;
        this.position.y_delta = 0;

        if (this.position.x > width - this.center_offset) {
            this.position.x = width - this.center_offset;
        }
        else if (this.position.x < this.center_offset) {
            this.position.x = this.center_offset;
        }
        if (this.position.y > height - this.center_offset) {
            this.position.y = height - this.center_offset;
        }
        else if (this.position.y < this.center_offset) {
            this.position.y = this.center_offset;
        }
    }
}