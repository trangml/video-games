class wanderState {
    constructor() {
        this.wanderDist = 0;
        this.direction = 0;
    }

    ///// EXPERIMENT /////
    execute(me) {
        if (this.wanderDist <= 0) {
            this.wanderDist = random(30, 40);
            this.direction = random(0, 1);
            if (this.direction >= 0.5) {
                me.walkBackward = 1;
                me.walkForward = 0;
            }
            else {
                me.walkForward = 1;
                me.walkBackward = 0;
            }

        }
        this.wanderDist--;
        me.update();
        me.checkCollision();
        if (dist(me.position.x, me.position.y, player.position.x, player.position.y) < 120) {
            me.changeState(1);
        }
    }
}  // wanderState

class chaseState {
    constructor() {
        this.direction = 0;
    }

    ///// EXPERIMENT /////
    execute(me) {
        if (player.position.y > me.position.y) {
            if (player.position.x < me.position.x) {
                me.walkForward = 0;
                me.walkBackward = 1;
            }
            else {
                me.walkForward = 1;
                me.walkBackward = 0;
            }
        }
        else if ((me.velocity.y <= gravity.y) && me.jump === 0) {
            me.jump = 2;
        }
        me.update();
        me.checkCollision();
        if (dist(me.position.x, me.position.y, player.position.x, player.position.y) > 120) {
            me.changeState(0);
        }
    }
}  // chaseState


class EnemyBot {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, angle = 0, color = "#F42C04", face_color = "#2D3142", arm_color = "#E2856E") {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);
        this.acceleration = new p5.Vector(0, 0);
        this.force = new p5.Vector(0, 0.1);
        this.state = [new wanderState(), new chaseState()]
        this.currState = 0;
        this.size = size;
        this.center_offset = size / 2;
        this.color = color;
        this.angle = angle;
        this.scalar = size / 230;
        this.r_arm = 60 * this.scalar;
        this.l_arm = 60 * this.scalar;
        this.face_color = face_color;
        this.arm_color = arm_color;
        this.is_active = true;
        this.step = new p5.Vector(0, -1);
        this.position.x_delta = 0;
        this.position.y_delta = 0;
        this.scalar_offset = -230 / 2 * this.scalar;
        this.scale = 1;
        this.speed = 0.7;
        this.deathAnimation = 0;
    }
    changeState(x) {
        this.currState = x;
    }
    drawTop(x = this.position.x, y = this.position.y) {
        push();
        translate(x, y);
        //shearX(this.shear)
        scale(1, y = this.scale)
        noStroke();
        fill(this.color);
        rect(this.scalar_offset, this.scalar_offset, 230 * this.scalar, 230 * this.scalar, 100 * this.scalar); // Body
        // Draw horns
        beginShape();
        vertex(this.scalar_offset, this.scalar_offset);
        vertex(this.scalar_offset + 100 * this.scalar, this.scalar_offset + 50 * this.scalar);
        vertex(this.scalar_offset + 50 * this.scalar, this.scalar_offset + 100 * this.scalar);
        endShape();
        beginShape();
        vertex(this.scalar_offset + 230 * this.scalar, this.scalar_offset);
        vertex(this.scalar_offset + 130 * this.scalar, this.scalar_offset + 50 * this.scalar);
        vertex(this.scalar_offset + 180 * this.scalar, this.scalar_offset + 100 * this.scalar);
        endShape();
        fill(this.face_color);
        rect(this.scalar_offset + 30 * this.scalar, this.scalar_offset + 30 * this.scalar, 170 * this.scalar, 100 * this.scalar, 20 * this.scalar); // Face
        fill(this.color);
        rect(this.scalar_offset + 80 * this.scalar, this.scalar_offset + 100 * this.scalar, 70 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // mouth
        //circle(x + 70 * this.scalar, y + 65 * this.scalar, 50 * this.scalar); //left eye
        push();
        translate(this.scalar_offset + 70 * this.scalar, this.scalar_offset + 45 * this.scalar)
        rotate(PI / 4)
        rect(0, 0, 40 * this.scalar, 20 * this.scalar)
        pop();
        push();
        translate(this.scalar_offset + 175 * this.scalar, this.scalar_offset + 57 * this.scalar)
        rotate(PI / 4)
        rect(0, 0, -20 * this.scalar, 40 * this.scalar)
        pop();
        fill(this.arm_color);
        circle(this.scalar_offset + 50 * this.scalar, this.scalar_offset + 200 * this.scalar, 100 * this.scalar); //left eye
        circle(this.scalar_offset + 180 * this.scalar, this.scalar_offset + 200 * this.scalar, 100 * this.scalar); //right eye
        pop();
    }
    drawDeath() {
        this.drawTop()
        if (this.deathAnimation >= 0.2) {
            this.counter = 0;
            this.scale = this.deathAnimation;
            this.deathAnimation -= 0.06;
            this.position.y += 0.6;
        }
        if (this.deathAnimation <= 0.2) {
            this.counter++;
            if (this.counter == 30) {
                this.deathAnimation = 0;
            }
        }
    }
    draw() {
        /**
         * Draw the robot
         */
        noStroke();
        fill(this.color);
        rect(this.position.x, this.position.y, 100 * this.scalar, 50 * this.scalar, 30 * this.scalar); // Head
        rect(this.position.x + 40 * this.scalar, this.position.y + 35 * this.scalar, 20 * this.scalar, 50 * this.scalar, 30 * this.scalar); // Neck
        rect(this.position.x - 10 * this.scalar, this.position.y + 70 * this.scalar, 120 * this.scalar, 120 * this.scalar, 30 * this.scalar, 30 * this.scalar, 50 * this.scalar, 50 * this.scalar); // Body
        rect(this.position.x + 30 * this.scalar, this.position.y + 200 * this.scalar, 40 * this.scalar, 20 * this.scalar, 30 * this.scalar); // Tail
        rect(this.position.x + 40 * this.scalar, this.position.y + 230 * this.scalar, 20 * this.scalar, 20 * this.scalar, 30 * this.scalar); // Tail x2

        fill(this.face_color);
        rect(this.position.x + 10 * this.scalar, this.position.y + 5 * this.scalar, 80 * this.scalar, 40 * this.scalar, 20 * this.scalar); // Face
        rect(this.position.x + 20 * this.scalar, this.position.y + 100 * this.scalar, 60 * this.scalar, 35 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // Body Plate
        fill(this.color);
        rect(this.position.x + 45 * this.scalar, this.position.y + 35 * this.scalar, 10 * this.scalar, 5 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // mouth

        circle(this.position.x + 30 * this.scalar, this.position.y + 25 * this.scalar, 20 * this.scalar); //left eye
        circle(this.position.x + 70 * this.scalar, this.position.y + 25 * this.scalar, 20 * this.scalar); //right eye
        fill(this.arm_color);
        rect(this.position.x - 30 * this.scalar, this.position.y + 90 * this.scalar, 30 * this.scalar, this.l_arm, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // left arm
        rect(this.position.x + 100 * this.scalar, this.position.y + 90 * this.scalar, 30 * this.scalar, this.r_arm, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // right arm
    }
    applyForce(force) {
        this.acceleration.add(force);
    }
    applyVelocity(vel) {
        this.velocity.add(vel);
    }

    ///// EXPERIMENT /////
    update() {
        this.acceleration.set(0, 0);
        if (this.walkForward === 1) {
            //this.position.x += this.speed;
            this.position.x_delta = this.speed;
        }
        if (this.walkBackward === 1) {
            //this.position.x -= this.speed;
            this.position.x_delta = -this.speed;
        }
        if (this.jump === 2) {
            this.applyForce(jumpForce);
            this.jump = 1;
        }
        this.applyForce(gravity);
        //this.applyForce(this.force);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);


        // put a terminal velocity limit
        if (this.velocity.y > 7) {
            this.velocity.y = 7;
        }
    }
    move() {
        this.state[this.currState].execute(this);
    }
    checkCollision() {
        var collided_x = false;
        var collided_y = false;
        // check if we will collide if we move in the x direction
        var object_offset = 9;
        var bottom_y = this.position.y + this.center_offset + object_offset;
        var top_y = this.position.y - this.center_offset - object_offset;
        var left_x = this.position.x - this.center_offset + this.position.x_delta - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset + this.position.x_delta;
        for (var i = 0; i < game.objects.length; i++) {
            var object = game.objects[i];
            if (object.is_active) {
                if (!(right_x < object.x || object.x < left_x || bottom_y < object.y || object.y < top_y)) {
                    if (object.obj === 2 || object.obj === 1) {
                        if (this.velocity.y === gravity.y) {
                            collided_x = true;
                        }
                    }

                }
            }
        }
        // Now check for bounds
        if (this.position.x > 790) {
            this.position.x = 790;
        }
        else if (this.position.x < 10) {
            this.position.x = 10;
        }
        if (!collided_x) {
            this.position.x += this.position.x_delta;
        }
        // check if we will collide if we move in the y direction
        var object_offset = 10;
        var bottom_y = this.position.y + this.center_offset + this.position.y_delta + object_offset;
        var top_y = this.position.y - this.center_offset + this.position.y_delta - object_offset;
        var left_x = this.position.x - this.center_offset - object_offset;
        var right_x = this.position.x + this.center_offset + object_offset;
        for (var i = 0; i < game.objects.length; i++) {
            var object = game.objects[i];
            if (object.is_active) {
                if (!(right_x < object.x || object.x < left_x || bottom_y < object.y || object.y < top_y)) {
                    if (object.obj === 2 || object.obj === 1) {
                        if (this.velocity.y >= 0) {
                            if (object.y - 11 > this.position.y) {
                                collided_y = true;
                                this.position.y = object.y - 10 - this.center_offset
                                this.velocity.y = 0;
                                this.jump = 0;
                            }
                        }
                    }

                }
            }
        }
        if (!collided_y) {
            this.position.y += this.position.y_delta;
        }
        this.position.x_delta = 0;
        this.position.y_delta = 0;
    }
}