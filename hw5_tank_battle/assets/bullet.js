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
        this.speed = 1.3;
        this.size = 5;
        this.color = "black"
        this.fire = 0;
        this.id = 0;
    }
    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle + PI / 2);
        noStroke();
        fill(this.color);
        circle(0, this.size / 2, this.size);
        rect(-this.size / 2, this.size / 2, this.size, this.size)
        fill("black")
        polygon(0, this.size / 1.5, this.size / 3, 6)
        pop();
    }
    move() {
        this.x = this.x + this.speed * cos(this.angle)
        this.y = this.y + this.speed * sin(this.angle)
        this.checkCollision();
        this.raycast();
    }
    isOutOfBounds(x, y) {
        return x > width + this.size || x < 0 - this.size || y > height + this.size || y < 0 - this.size;
    }
    checkCollision() {
        if (dist(this.x, this.y, player.position.x, player.position.y) < this.size + 10) {
            if (this.id != player.id) {
                this.fire = 0;
                player.is_dead = true
            }
            // implement losing logic
        }
        if (this.isOutOfBounds(this.x, this.y)) {
            this.fire = 0;
        }
        for (var i = 0; i < game.enemies.length; i++) {
            if (dist(this.x, this.y, game.enemies[i].position.x, game.enemies[i].position.y) < this.size + 10) {
                if (this.id != game.enemies[i].id) {
                    this.fire = 0;
                    if (game.enemies[i].is_active) {
                        game.enemies[i].is_active = false;
                        score++;
                        enemiesKilled++;
                    }
                }
            }
        }
    }
    raycast(obstacles = game.enemies) {
        var currX = this.x;
        var currY = this.y;
        var castSpeed = 10;
        while (!this.isOutOfBounds(currX, currY)) {
            currX = currX + castSpeed * cos(this.angle)
            currY = currY + castSpeed * sin(this.angle)
            var id = 0;
            for (let enemy of obstacles) {
                if (id != this.id) {
                    if (enemy.is_active) {
                        if (dist(currX, currY, enemy.position.x, enemy.position.y) < 2 * this.size + 10) {
                            enemy.inMissileTrajectory = true;
                            enemy.targetingMissile = this;
                            return true;
                        }

                    }
                }
                id++;
            }
        }
        return false;
    }
}