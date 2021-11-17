function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

class BulletObj {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.speed = 6;
        this.size = 5;
        this.color = "gray"
        this.fire = 0;
    }
    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        noStroke();
        fill(this.color);
        polygon(0, 0, this.size, 6);
        fill("black");
        circle(0, 0, this.size / 2);
        pop();
    }
    move() {
        this.x = this.x + this.speed * cos(this.angle)
        this.y = this.y + this.speed * sin(this.angle)
        this.checkCollision();
    }
    checkCollision() {
        for (var i = 0; i < game.objects.length; i++) {
            if (game.objects[i].is_active) {
                if (dist(this.x, this.y, game.objects[i].x, game.objects[i].y) < this.size + 10) {
                    if (game.objects[i].obj === 2) {
                        this.fire = 0;
                    }

                }
            }
        }
        for (var i = 0; i < game.enemies.length; i++) {
            if (game.enemies[i].is_active) {
                if (dist(this.x, this.y, game.enemies[i].x, game.enemies[i].y) < this.size + 10) {
                    this.fire = 0;
                    game.enemies[i].is_active = false;
                }
            }
        }
    }
}