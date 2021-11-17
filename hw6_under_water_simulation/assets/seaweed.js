
class Seaweed {
    /**
     * This file contains the seaweed
     */
    constructor(x, y, size, dir = -1, color = "green") {
        this.start_pt = new p5.Vector(x, y);
        this.x = x;
        this.y = y;
        this.size = size;
        this.scale = this.size / 400;
        this.color = color;
        this.dir = dir;
        this.speed = 5;
        this.top_dir = -1;
        this.top_speed = 1;
        // three points of the bezier curve that move
        this.ctrl1_pt = new p5.Vector(this.dir * 100, -100);
        this.ctrl2_pt = new p5.Vector(-this.dir * 100, -200);
        this.final_pt = new p5.Vector(this.dir * 10, -300)
    }
    draw() {
        push();
        translate(this.start_pt.x, this.start_pt.y)
        scale(this.scale)
        stroke(this.color);
        strokeWeight(10);
        fill(this.color);
        bezier(0, 0, this.ctrl1_pt.x, this.ctrl1_pt.y, this.ctrl2_pt.x, this.ctrl2_pt.y, this.final_pt.x, this.final_pt.y);
        pop();
    }
    update() {
        /**
         * Change the location of the control points
         */
        if (this.ctrl1_pt.x > 100 || this.ctrl1_pt.x < -100) {
            this.dir *= -1;
        }
        this.ctrl1_pt.x += this.dir * this.speed;
        this.ctrl2_pt.x -= this.dir * this.speed;
        if (this.final_pt.x > 20 || this.final_pt.x < -20) {
            this.top_dir *= -1;
        }
        this.final_pt.x += this.top_dir * this.top_speed;
    }
}
