
class GameObj {
    constructor(images) {
        this.tilemap = [
            "--------------------",
            "--------------------",
            "--e-----------------",
            "--------------------",
            "-----------------e--",
            "--------------------",
            "--------------------",
            "--------------------",
            "--------------------",
            "--------------------",
            "--------------------",
            "--------------------",
            "-----------------e--",
            "--------------------",
            "--------------------",
            "----e---------------",
            "--------------------",
            "--------------------",
            "----------e---------",
            "--------------------",
        ]

        this.gameOver = -1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.currFrame = 0;
        this.enemies = [];
        this.images = images;
        this.direction = 1;
        this.start_time = millis();
        this.time = 0;
    }  // gameObj constructor


    initialize() {
        var id = 0;
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                switch (this.tilemap[i][j]) {
                    case 'e':
                        this.enemies.push(new EnemyTank(j * 20 + 10, i * 20 + 10, 20, id));
                        id++;
                        break;
                }
            }
        }
    }
    drawScore() {
        textSize(8);
        noStroke();
        textFont('Monospace');
        var backColor = color("#091540");
        backColor.setAlpha(190);
        fill(backColor);
        rect(width / 2 - 25, 3, 50, 14);
        fill("white");
        text("Score: " + game.score, width / 2, 10);
        fill(backColor);
        rect(width / 2 - 25 - 100, 3, 50, 14);
        fill("white");
        this.time = floor((millis() - this.start_time) / 1000)
        text("Time: " + this.time, width / 2 - 100, 10);

        fill(backColor);
        rect(width / 2 - 25 + 100, 3, 50, 14);
        fill("white");
        text("Killed: " + game.enemiesKilled, width / 2 + 100, 10);
    }
    drawBackground() {
        image(this.images[0], 0, 0, width, height);
        // draw the enemies
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].is_active) {
                this.enemies[i].draw();
                this.enemies[i].move();
            }
            else {
                this.enemies[i].drawDeath();
            }
        }
        // update rotation
        this.angle += this.direction * PI / 900;
        if (this.angle > PI / 9 || this.angle < -PI / 9) {
            this.direction = -1 * this.direction;
        }
    }
}  // gameObj