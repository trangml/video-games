var bubbles = [];
class Bubble {
    /**
     * Bubble object, has one single bubble
     */
    constructor(x, y, size, speed) {
        this.color = "#88bdef"
        this.position = new p5.Vector(x, y)
        this.step = new p5.Vector(0, 0)
        this.size = size;
        this.scale = this.size / 400;
        this.initialangle = random(0, 2 * PI);
        this.radius = sqrt(random(pow(1.4, 2)));
        this.speed = speed;
    }
    draw() {
        noStroke();
        push();
        translate(this.position.x, this.position.y);
        scale(this.scale);
        fill(this.color);
        circle(0, 0, this.size);
        fill("#c9e2f6")
        ellipse(10, 10, 30, 20)
        pop();
    }
    update(time) {
        let w = 0.6; // angular speed
        let angle = w * time + this.initialangle;
        this.position.x += this.radius * sin(angle) - 1;

        // different size bubbles fall at slightly different y speeds
        this.position.y -= (pow(this.size, 0.5) * this.speed + 1);

        // decrease speed with time
        this.speed *= 0.92
        // delete bubble if past end of screen
        if (this.position.y < -this.size) {
            let index = bubbles.indexOf(this);
            bubbles.splice(index, 1);
        }
    }
}
class BubbleColumn {
    /**
     *  Bubble column object, creates a random amount of bubbles and maintains them
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.max_bubble_size = 100;
        this.currFrameCount = 0;
    }
    isTouched() {
        // create a random number of bubbles each frame
        if (this.currFrameCount < frameCount - 15) {
            this.currFrameCount = frameCount;
            for (let i = 0; i < random(6, 12); i++) {
                bubbles.push(new Bubble(this.x, this.y, random(10, this.max_bubble_size), 2)); // append bubble object
            }
        }
    }
    draw() {
        let t = frameCount / 60; // update time
        for (let bub of bubbles) {
            bub.update(t); // update bubble position
            bub.draw(); // draw bubble
        }
    }
}