class EnemyBot {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, angle = 0, color = "#F42C04", face_color = "#2D3142", arm_color = "#E2856E") {
        this.x = x;
        this.y = y;
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
        this.x_delta = 0;
        this.y_delta = 0;
        this.scalar_offset = -230 / 2 * this.scalar;
    }
    drawTop(x = this.x, y = this.y) {
        push();
        translate(x, y);
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
    draw() {
        /**
         * Draw the robot
         */
        noStroke();
        fill(this.color);
        rect(this.x, this.y, 100 * this.scalar, 50 * this.scalar, 30 * this.scalar); // Head
        rect(this.x + 40 * this.scalar, this.y + 35 * this.scalar, 20 * this.scalar, 50 * this.scalar, 30 * this.scalar); // Neck
        rect(this.x - 10 * this.scalar, this.y + 70 * this.scalar, 120 * this.scalar, 120 * this.scalar, 30 * this.scalar, 30 * this.scalar, 50 * this.scalar, 50 * this.scalar); // Body
        rect(this.x + 30 * this.scalar, this.y + 200 * this.scalar, 40 * this.scalar, 20 * this.scalar, 30 * this.scalar); // Tail
        rect(this.x + 40 * this.scalar, this.y + 230 * this.scalar, 20 * this.scalar, 20 * this.scalar, 30 * this.scalar); // Tail x2

        fill(this.face_color);
        rect(this.x + 10 * this.scalar, this.y + 5 * this.scalar, 80 * this.scalar, 40 * this.scalar, 20 * this.scalar); // Face
        rect(this.x + 20 * this.scalar, this.y + 100 * this.scalar, 60 * this.scalar, 35 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // Body Plate
        fill(this.color);
        rect(this.x + 45 * this.scalar, this.y + 35 * this.scalar, 10 * this.scalar, 5 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // mouth

        circle(this.x + 30 * this.scalar, this.y + 25 * this.scalar, 20 * this.scalar); //left eye
        circle(this.x + 70 * this.scalar, this.y + 25 * this.scalar, 20 * this.scalar); //right eye
        fill(this.arm_color);
        rect(this.x - 30 * this.scalar, this.y + 90 * this.scalar, 30 * this.scalar, this.l_arm, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // left arm
        rect(this.x + 100 * this.scalar, this.y + 90 * this.scalar, 30 * this.scalar, this.r_arm, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // right arm
    }
    update(arc) {
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
    move() {
        var speed = 1.9;
        if (dist(this.x, this.y, player.x, player.y) < 120) {
            this.step.set(player.x - this.x, player.y - this.y);
            this.step.normalize();
            this.angle = this.step.heading() + PI / 2;
            this.x_delta = speed * this.step.x;
            this.y_delta = speed * this.step.y;
            this.checkCollision();
        }
    }
    checkCollision() {
        var collided_x = false;
        var collided_y = false;
        // check if we will collide if we move in the x direction
        var object_offset = 9;
        var bottom_y = this.y + this.center_offset + object_offset;
        var top_y = this.y - this.center_offset - object_offset;
        var left_x = this.x - this.center_offset + this.x_delta - object_offset;
        var right_x = this.x + this.center_offset + object_offset + this.x_delta;
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (!(right_x < game.objects[i].x || game.objects[i].x < left_x || bottom_y < game.objects[i].y || game.objects[i].y < top_y)) {
                    if (game.objects[i].obj === 2) {
                        collided_x = true;
                    }

                }
            }
        }
        // check if we will collide if we move in the y direction
        var object_offset = 9;
        var bottom_y = this.y + this.center_offset + this.y_delta + object_offset;
        var top_y = this.y - this.center_offset + this.y_delta - object_offset;
        var left_x = this.x - this.center_offset - object_offset;
        var right_x = this.x + this.center_offset + object_offset;
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (!(right_x < game.objects[i].x || game.objects[i].x < left_x || bottom_y < game.objects[i].y || game.objects[i].y < top_y)) {
                    if (game.objects[i].obj === 2) {
                        collided_y = true;
                    }

                }
            }
        }
        if (!collided_y && !collided_x) {
            if (this.y_delta != 0 && this.x_delta != 0) {
                this.x_delta = this.x_delta * .5;
                this.y_delta = this.y_delta * .5;
            }
        }
        if (!collided_x) {
            this.x += this.x_delta;
        }
        if (!collided_y) {
            this.y += this.y_delta;
        }
        this.x_delta = 0;
        this.y_delta = 0;
    }
}