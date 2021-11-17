class EnemyBot {
    /**
     * This class forms the robot
     */
    constructor(x, y, size, angle = 0, color = "#F42C04", face_color = "#2D3142", arm_color = "#E2856E") {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.angle = angle;
        this.scalar = size / 230;
        this.r_arm = 60 * this.scalar;
        this.l_arm = 60 * this.scalar;
        this.face_color = face_color;
        this.arm_color = arm_color;
    }
    drawTop(x = this.x, y = this.y) {
        noStroke();
        fill(this.color);
        rect(x, y, 230 * this.scalar, 230 * this.scalar, 100 * this.scalar); // Body
        // Draw horns
        beginShape();
        vertex(x, y);
        vertex(x + 100 * this.scalar, y + 50 * this.scalar);
        vertex(x + 50 * this.scalar, y + 100 * this.scalar);
        endShape();
        beginShape();
        vertex(x + 230 * this.scalar, y);
        vertex(x + 130 * this.scalar, y + 50 * this.scalar);
        vertex(x + 180 * this.scalar, y + 100 * this.scalar);
        endShape();
        fill(this.face_color);
        rect(x + 30 * this.scalar, y + 30 * this.scalar, 170 * this.scalar, 100 * this.scalar, 20 * this.scalar); // Face
        fill(this.color);
        rect(x + 80 * this.scalar, y + 100 * this.scalar, 70 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar, 20 * this.scalar); // mouth
        //circle(x + 70 * this.scalar, y + 65 * this.scalar, 50 * this.scalar); //left eye
        push();
        translate(x + 70 * this.scalar, y + 45 * this.scalar)
        rotate(PI / 4)
        rect(0, 0, 40 * this.scalar, 20 * this.scalar)
        pop();
        push();
        translate(x + 175 * this.scalar, y + 57 * this.scalar)
        rotate(PI / 4)
        rect(0, 0, -20 * this.scalar, 40 * this.scalar)
        pop();
        fill(this.arm_color);
        circle(x + 50 * this.scalar, y + 200 * this.scalar, 100 * this.scalar); //left eye
        circle(x + 180 * this.scalar, y + 200 * this.scalar, 100 * this.scalar); //right eye
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
        var speed = 1.8;
        this.x = this.x + speed * cos(this.angle)
        this.y = this.y + speed * sin(this.angle)
        this.checkCollision();
    }
    checkCollision() {
        var object_offset = 8;
        var bottom_y = this.y + this.size + object_offset;
        var top_y = this.y - object_offset;
        var left_x = this.x - object_offset;
        var right_x = this.x + this.size + object_offset;
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (!(right_x < game.objects[i].x || game.objects[i].x < left_x || bottom_y < game.objects[i].y || game.objects[i].y < top_y)) {
                    if (game.objects[i].obj === 2) {
                        this.angle = this.angle + PI
                    }
                }
            }
        }

    }
}