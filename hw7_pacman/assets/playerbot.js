/**
 * This file contains the player pacman class, named PlayerBot
 */
const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;
const STOP = 0;

class PlayerBot {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, color = "#4ABB77", face_color = "#2D3142", arm_color = "#2C9886") {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);
        this.center_offset = size / 2;
        this.size = size;
        this.color = color;
        this.angle = 0;
        this.scalar = size / 20;
        this.face_color = face_color;
        this.arm_color = arm_color;
        this.position.y_delta = 0;
        this.position.x_delta = 0;
        this.currFrameCount = frameCount;
        this.dir = STOP;
        this.speed = 2;
        this.openingRate = 2 * PI / 90;  // 2 degrees
        this.maxAngle = PI / 3;  // 60 degrees
        this.m_angle = 0;
        this.buffered_dir = STOP;
        this.bufferedFrameCount = frameCount;
        this.deathTimer = 0;
        this.maxDeathTimer = 75;
    }
    draw() {
        /**
         * Draw pacman
         */
        push();
        translate(this.position.x, this.position.y);
        noStroke();
        colorMode(HSB);
        fill(frameCount % 360, 100, 100);
        strokeWeight(1);
        stroke(360)

        switch (this.dir) {
            case UP:
                rotate(-PI / 2);
                arc(0, 0, this.size, this.size, this.m_angle, TWO_PI - this.m_angle);
                break;
            case DOWN:
                rotate(PI / 2);
                arc(0, 0, this.size, this.size, this.m_angle, TWO_PI - this.m_angle);
                break;
            case LEFT:
                rotate(-PI);
                arc(0, 0, this.size, this.size, this.m_angle, TWO_PI - this.m_angle);
                break;
            default:
                arc(0, 0, this.size, this.size, this.m_angle, TWO_PI - this.m_angle);
                break;
        }
        pop();

    }
    drawHappyEyes() {
        /**
         * Draw a happy pacman with a trophy
         */
        push();
        translate(this.position.x, this.position.y);
        noStroke();
        colorMode(HSB);
        fill(frameCount % 360, 100, 100);
        strokeWeight(1);
        stroke(360)

        arc(0, 0, this.size, this.size, PI / 12, TWO_PI - PI / 12);
        fill("black")
        stroke(0)
        strokeWeight(2);
        line(0, -this.scalar * 4, -this.scalar * 2, -this.scalar * 4 - this.scalar * 1);
        line(0, -this.scalar * 4, -this.scalar * 2, -this.scalar * 4 + this.scalar * 1);
        stroke("red")
        strokeWeight(3);
        fill("red")
        circle(-this.scalar * 2, -this.scalar * 1, this.scalar * 2);
        noStroke();
        // Make trophy
        fill("yellow")
        arc(0, -this.size, this.size / 2, this.size, 0, PI);
        arc(0, -this.size / 2, this.size / 2, this.size / 6, PI, 0);
        noFill();
        stroke("yellow");
        ellipse(this.size / 4, -3.3 * this.size / 4, this.size / 4, this.size / 4);
        ellipse(-this.size / 4, -3.3 * this.size / 4, this.size / 4, this.size / 4);

        pop();
    }
    drawDeadEyes() {
        /**
         * Draw a dead pacman with a cross
         */
        push();
        translate(this.position.x, this.position.y);
        noStroke();
        // one-step
        colorMode(HSB);
        fill(frameCount % 360, 100, 100);
        strokeWeight(1);
        stroke(360)

        arc(0, 0, this.size, this.size, PI / 12, TWO_PI - PI / 12);
        fill("black")
        stroke(0)
        push();
        translate(0, -this.scalar * 4)
        rotate(PI / 4)
        line(-this.scalar * 2, 0, this.scalar * 2, 0);
        rotate(PI / 2);
        line(-this.scalar * 2, 0, this.scalar * 2, 0);
        pop();
        pop();

    }
    drawDeath() {
        /**
         * Draw the death animation
         */
        push();
        translate(this.position.x, this.position.y);
        strokeWeight(2);
        var colors = ["yellow", "green", "red", "blue", "pink", "orange"]
        for (var i = 0; i < 6; i++) {
            stroke(colors[i]);
            rotate(2 * PI / 6);
            line(0, this.size / 6, 0, this.size / 6 + this.size / 2.4 * this.deathTimer / this.maxDeathTimer);
        }
        pop();
    }
    updateDelta(dir) {
        /**
         * Update the delta of the pacman
         */
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
    updateDeath() {
        /**
         * Update the death animation
         */
        this.m_angle += this.openingRate;
        if (this.m_angle <= PI / 90) {
            this.openingRate = -this.openingRate;
        }
        if (this.m_angle > PI) {
            this.deathTimer++;
        }
        return this.deathTimer === this.maxDeathTimer;
    }
    update() {
        /**
         * Update pacman's position
         */
        this.m_angle += this.openingRate;
        if ((this.m_angle > this.maxAngle) || (this.m_angle <= PI / 90)) {
            this.openingRate = -this.openingRate;
        }
        this.updateDelta(this.dir);
        if (this.buffered_dir === STOP) {
            this.bufferedFrameCount = frameCount;
        }
        else {
            if (frameCount - this.bufferedFrameCount > 10) {
                this.buffered_dir = STOP;
            }
        }
    }

    checkWallCollision() {
        /**
         * Check if we will collide with a wall
         */
        var collided = false;
        // check if we will collide if we move
        var object_offset = 10;
        var bottom_y = this.position.y + this.center_offset + this.position.y_delta + object_offset;
        var top_y = this.position.y - this.center_offset + this.position.y_delta - object_offset;
        var left_x = this.position.x - this.center_offset + this.position.x_delta - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset + this.position.x_delta;
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (!(right_x < game.objects[i].x || game.objects[i].x < left_x || bottom_y < game.objects[i].y || game.objects[i].y < top_y)) {
                    if (game.objects[i].obj === 1) {
                        if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 4) {
                            game.objects[i].is_active = false;
                            score++;
                        }
                    }
                    else if (game.objects[i].obj === 2) {
                        collided = true;
                    }
                }
            }
        }
        return collided;
    }

    checkCollision() {
        /**
         * Check if we will collide with anything
         */
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
        // check enemy collision
        for (var i = 0; i < game.enemies.length; i++) {
            if (dist(this.position.x, this.position.y, game.enemies[i].position.x, game.enemies[i].position.y) < 10) {
                return true;
            }
        }
        return false;
    }
}