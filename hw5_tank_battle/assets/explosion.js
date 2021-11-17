class Explosion {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
    star(x, y, radius1, radius2, npoints) {
        let angle = TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        beginShape();
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * radius2;
            let sy = y + sin(a) * radius2;
            vertex(sx, sy);
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }
    draw() {
        noStroke();
        fill("orange")
        push();
        translate(this.x, this.y);
        this.star(0, 0, this.size / 2, this.size, 8);
        pop();
    }
}