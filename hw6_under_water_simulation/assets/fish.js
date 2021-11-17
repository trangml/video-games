class Fish {
    /**
     * This class contains the logic for fish wandering, drawing, and collision.
     */
    constructor(x, y, size, color, angle, speed, wanderType = 0) {
        this.step = new p5.Vector(0, 0);
        this.position = new p5.Vector(0, 0);
        this.size = size;
        this.scale = this.size / 400;
        this.position.x = x;
        this.position.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.image;

        // wander variables
        this.wanderAngle = random(PI / 2, 3 * PI / 2);
        this.wanderDist = random(100, 140);
        this.wt = wanderType;
    }
    wander() {
        /**
         * Wander code adapted from class notes
         */
        switch (this.wt) {
            case 0:
                this.step.set(this.speed * cos(this.wanderAngle), this.speed * sin(this.wanderAngle));
                this.position.add(this.step);
                break;
            case 1:
                this.step.set(this.speed * cos(this.wanderAngle), this.speed * sin(this.wanderAngle));
                this.position.add(this.step);
                this.wanderAngle += random(-PI / 6, PI / 6);
                break;
        }
        this.wanderDist--;
        if (this.wanderDist < 0) {
            this.wanderDist = random(70, 100);
            this.wanderAngle = random(PI / 2, 3 * PI / 2);
        }
    }
    draw() {
        //Override this
    }
    drawImage() {
        /**
         * Draw the image of the fish to the screen in the correct position
         */
        image(this.image, this.position.x, this.position.y, this.size, this.size);
    }
    update() {
        /**
         * Update the fish position by wandering then checking collisions
         */
        this.wander();
        this.checkCollision();
    }
    checkCollision() {
        /**
         * Check for collision with the boundaries and with the rock
         */
        if (this.position.x < -this.size) {
            this.position.x = width + this.size / 5;
            this.wanderDist = random(80, 100);
            this.wanderAngle = random(3.5 * PI / 4, 4.5 * PI / 4);
        }
        if (this.position.x > width + this.size) {
            this.position.x = - this.size / 2;
        }
        if (this.position.y < this.size / 2) {
            this.position.y = this.size / 2;
            this.wanderDist = random(70, 100);
            this.wanderAngle = random(PI / 2, PI);
        }
        if (this.position.y > height - this.size / 2) {
            this.position.y = height - this.size / 2;
            this.wanderDist = random(70, 100);
            this.wanderAngle = random(PI, 3 * PI / 2);
        }

        if (!(this.position.x + this.size / 2 < rock.x - rock.size / 2 || rock.x + rock.size / 2 < this.position.x - this.size / 2 || this.position.y + this.size / 2 < rock.y - rock.size / 2 || rock.y + rock.size / 2 < this.position.y - this.size / 2)) {
            if (this.position.x < width + this.size / 6) {
                bubbleCol.isTouched();
            }
        }
    }
}