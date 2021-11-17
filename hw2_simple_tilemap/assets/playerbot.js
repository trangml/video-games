class PlayerBot {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, color = "#4ABB77", face_color = "#2D3142", arm_color = "#2C9886") {
        this.x = x;
        this.y = y;
        this.center_offset = size / 2;
        this.size = size;
        this.color = color;
        this.angle = 0;
        this.scalar = size / 230;
        this.r_arm = 60 * this.scalar;
        this.l_arm = 60 * this.scalar;
        this.face_color = face_color;
        this.arm_color = arm_color;
        this.y_delta = 0;
        this.x_delta = 0;
    }
    drawTop() {
        noStroke();
        fill(this.color);
        rect(this.x, this.y, 230 * this.scalar, 200 * this.scalar, 70 * this.scalar); // Body
        fill(this.face_color);
        rect(this.x + 30 * this.scalar, this.y + 30 * this.scalar, 170 * this.scalar, 100 * this.scalar, 20 * this.scalar); // Face
        fill(this.color);
        rect(this.x + 80 * this.scalar, this.y + 100 * this.scalar, 70 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // mouth
        circle(this.x + 70 * this.scalar, this.y + 65 * this.scalar, 50 * this.scalar); //left eye
        circle(this.x + 160 * this.scalar, this.y + 65 * this.scalar, 50 * this.scalar); //right eye
        fill(this.arm_color);
        circle(this.x + 50 * this.scalar, this.y + 190 * this.scalar, 80 * this.scalar); //left arm
        circle(this.x + 180 * this.scalar, this.y + 190 * this.scalar, 80 * this.scalar); //right arm
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
    move() {
        var movement_speed = 2;
        if (keyArray[LEFT_ARROW]) {
            //this.x -= movement_speed;
            this.x_delta = -movement_speed;
        }
        if (keyArray[RIGHT_ARROW]) {
            //this.x += movement_speed;
            this.x_delta = movement_speed;
        }
        if (keyArray[UP_ARROW]) {
            //this.y -= movement_speed;
            this.y_delta = -movement_speed;
        }
        if (keyArray[DOWN_ARROW]) {
            //this.y += movement_speed;
            this.y_delta = movement_speed;
        }
    }
    checkCollision() {
        var collided_x = false;
        var collided_y = false;
        // check if we will collide if we move in the x direction
        var object_offset = 9;
        var bottom_y = this.y + this.size + object_offset;
        var top_y = this.y - object_offset;
        var left_x = this.x - object_offset + this.x_delta;
        var right_x = this.x + this.size + object_offset + this.x_delta;
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (!(right_x < game.objects[i].x || game.objects[i].x < left_x || bottom_y < game.objects[i].y || game.objects[i].y < top_y)) {
                    if (game.objects[i].obj === 1) {
                        game.objects[i].is_active = false;
                        score++;
                    }
                    else if (game.objects[i].obj === 2) {
                        collided_x = true;
                    }

                }
            }
        }
        // check if we will collide if we move in the y direction
        var object_offset = 9;
        var bottom_y = this.y + this.size + object_offset + this.y_delta;
        var top_y = this.y - object_offset + this.y_delta;
        var left_x = this.x - object_offset;
        var right_x = this.x + this.size + object_offset;
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (!(right_x < game.objects[i].x || game.objects[i].x < left_x || bottom_y < game.objects[i].y || game.objects[i].y < top_y)) {
                    if (game.objects[i].obj === 1) {
                        game.objects[i].is_active = false;
                        score++;
                    }
                    else if (game.objects[i].obj === 2) {
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
        var bottom_y = this.y + this.size + object_offset;
        var top_y = this.y - object_offset;
        var left_x = this.x - object_offset;
        var right_x = this.x + this.size + object_offset;
        for (var i = 0; i < game.enemies.length; i++) {
            if (!(right_x < game.enemies[i].x + 10 || game.enemies[i].x + 10 < left_x || bottom_y < game.enemies[i].y + 10 || game.enemies[i].y + 10 < top_y)) {
                return true;
            }
        }
        return false;
    }
}