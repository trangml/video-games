class PlayerTank {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, color = "#23a1ea", tread_color = "#ffd700") {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);
        this.acceleration = new p5.Vector(0, 0);
        this.force = new p5.Vector(0, 0);
        this.center_offset = size / 2;
        this.size = size;
        this.color = color;
        this.tread_color = tread_color;
        this.angle = 0;
        this.scalar = size / 30;
        this.scale = size / 90;
        this.position.y_delta = 0;
        this.position.x_delta = 0;
        this.moveForward = 0;
        this.moveBackward = 0;
        this.turnLeft = 0;
        this.turnRight = 0;
        this.fire = 0;
        this.move_speed = 1;
        this.turn_speed = radians(2);
        this.bullets = [new BulletObj(), new BulletObj(), new BulletObj(), new BulletObj(), new BulletObj()];
        this.bulletsIndex = 0;
        this.currFrameCount = frameCount;
        this.is_dead = false;
        this.id = -1;
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
        fill(this.tread_color)
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

    fireBullet() {
        if (this.currFrameCount < (frameCount - 60)) {
            this.currFrameCount = frameCount;
            this.bullets[this.bulletsIndex].fire = 1;
            this.bullets[this.bulletsIndex].id = this.id;
            this.bullets[this.bulletsIndex].color = this.color;
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
            this.angle = (this.angle - this.turn_speed);
            if (this.angle < -PI) {
                this.angle = angle179;
            }
        }
        if (this.turnRight === 1) {
            this.angle = (this.angle + this.turn_speed);
            if (this.angle > PI) {
                this.angle = -angle179;
            }
        }
        if (this.fire === 1) {
            this.fireBullet();
        }
    }

    checkCollision() {
        var collided_x = false;
        var collided_y = false;
        // Check if we collide with the physical body of the enemy tank, and if so, prevent movement
        // check if we will collide if we move in the x direction
        var object_offset = 9;
        var bottom_y = this.position.y + this.center_offset + object_offset;
        var top_y = this.position.y - this.center_offset - object_offset;
        var left_x = this.position.x - this.center_offset + this.position.x_delta - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset + this.position.x_delta;
        for (var i = 0; i < game.enemies.length; i++) {
            if (!(right_x < game.enemies[i].position.x || game.enemies[i].position.x < left_x || bottom_y < game.enemies[i].position.y || game.enemies[i].position.y < top_y)) {
                collided_x = true;
            }
        }
        // check if we will collide if we move in the y direction
        var object_offset = 9;
        var bottom_y = this.position.y + this.center_offset + this.position.y_delta + object_offset;
        var top_y = this.position.y - this.center_offset + this.position.y_delta - object_offset;
        var left_x = this.position.x - this.center_offset - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset;
        for (var i = 0; i < game.enemies.length; i++) {
            if (!(right_x < game.enemies[i].position.x || game.enemies[i].position.x < left_x || bottom_y < game.enemies[i].position.y || game.enemies[i].position.y < top_y)) {
                collided_y = true;
            }
        }
        if (!collided_x) {
            this.position.x += this.position.x_delta;
        }
        if (!collided_y) {
            this.position.y += this.position.y_delta;
        }

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

        this.position.x_delta = 0;
        this.position.y_delta = 0;
        return false;
    }
}