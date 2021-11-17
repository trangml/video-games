class PlayerBot {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, color = "#4ABB77", face_color = "#2D3142", arm_color = "#2C9886") {
        this.position = new p5.Vector(x, y);
        this.velocity = new p5.Vector(0, 0);
        this.acceleration = new p5.Vector(0, 0);
        this.force = new p5.Vector(0, 0);
        this.center_offset = size / 2;
        this.size = size;
        this.color = color;
        this.angle = 0;
        this.scalar = size / 230;
        this.r_arm = 60 * this.scalar;
        this.l_arm = 60 * this.scalar;
        this.face_color = face_color;
        this.arm_color = arm_color;
        this.position.y_delta = 0;
        this.position.x_delta = 0;
        this.currFrameCount = frameCount;
        this.walkForward = 0;
        this.walkBackward = 0;
        this.jump = 0;
        this.speed = 2.2;
        this.bounce = 0;
    }
    drawTop() {
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        noStroke();
        fill(this.color);
        var offset = -230 / 2 * this.scalar
        rect(offset, offset, 230 * this.scalar, 200 * this.scalar, 70 * this.scalar); // Body
        fill(this.face_color);
        rect(30 * this.scalar + offset, 30 * this.scalar + offset, 170 * this.scalar, 100 * this.scalar, 20 * this.scalar); // Face
        fill(this.color);
        rect(80 * this.scalar + offset, 100 * this.scalar + offset, 70 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // mouth
        circle(70 * this.scalar + offset, 65 * this.scalar + offset, 50 * this.scalar); //left eye
        circle(160 * this.scalar + offset, 65 * this.scalar + offset, 50 * this.scalar); //right eye
        fill(this.arm_color);
        circle(50 * this.scalar + offset, 190 * this.scalar + offset, 80 * this.scalar); //left arm
        circle(180 * this.scalar + offset, 190 * this.scalar + offset, 80 * this.scalar); //right arm
        pop();

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
    updateArm(arc) {
        /**
         * Update the arm position based on if it is arcing
         */
        if (arc) {
            // if we are throwing the box
            if (this.r_arm > 25) {
                // until a certain limit
                this.r_arm = this.r_arm - 2; // raise the arm
            }
        }
        else {
            // if the box has landed
            if (this.r_arm < 59) {
                // until a certain limit
                this.r_arm = this.r_arm + 2; // lower the arm
            }
        }
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
        if (this.bounce === 1) {
            this.applyForce(bounceForce);
            this.bounce = 0;
        }
        this.applyForce(gravity);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);


        // put a terminal velocity limit
        if (this.velocity.y > 7) {
            this.velocity.y = 7;
        }
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
                    if (object.obj === 0) {
                        object.is_active = false;
                        score++;
                    }
                    else if (object.obj === 2 || object.obj === 1) {
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
                    if (object.obj === 0) {
                        object.is_active = false;
                        score++;
                    }
                    else if (object.obj === 2 || object.obj === 1) {
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
        object_offset = 10;
        var bottom_y = this.position.y + this.size + object_offset;
        var top_y = this.position.y - object_offset;
        var left_x = this.position.x - object_offset;
        var right_x = this.position.x + this.size + object_offset;
        for (var i = 0; i < game.enemies.length; i++) {
            if (game.enemies[i].is_active) {
                if (!(right_x < game.enemies[i].position.x + 10 || game.enemies[i].position.x + 10 < left_x || bottom_y < game.enemies[i].position.y + 10 || game.enemies[i].position.y + 10 < top_y)) {
                    if (game.enemies[i].position.y > this.position.y) {
                        game.enemies[i].is_active = false;
                        game.enemies[i].deathAnimation = 1;
                        enemiesKilled += 1;
                        this.bounce = 1;
                        return false;
                    }
                    return true;
                }
            }
        }
        return false;
    }
}