/**
 * This file contains the main GameObj class, which is the class which holds the tilemap and the
 * game enemies.
 */
class objectObj {
    constructor(x, y, o) {
        this.x = x;
        this.y = y;
        this.obj = o;
        this.is_active = true;
        this.deathAnimation = 0;
    }
}

class GameObj {
    constructor(images, obstacle = null, obstacle2 = null) {
        this.tilemap = [
            "wwwwwwwwwwwwwwwwwwww",
            "w------------------w",
            "w-www-wwww-www-www-w",
            "w-www-wwww-www-www-w",
            "w-www-wwww-www-www-w",
            "w------------------w",
            "wwwww-w-wwwww-w-wwww",
            "wwwww-w---w---w-wwww",
            "wwwww-www w www-wwww",
            "wwwww-    e    -wwww",
            "w-----wwww wwww----w",
            "w-www-w ee  e w-ww-w",
            "w-www-wwwwwwwww-ww-w",
            "w-www-----------ww-w",
            "w-----wwwwwwwww----w",
            "w-www-wwwwwwwww-ww-w",
            "w---w-----------ww-w",
            "w-w-www-wwwwww-www-w",
            "w----------------- w",
            "wwwwwwwwwwwwwwwwwwww",
        ]

        this.obstacle = obstacle;
        this.obstacle2 = obstacle2;
        this.gameOver = -1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.currFrame = 0;
        this.objects = [];
        this.enemies = [];
        this.graph = [];

        this.images = images;
        this.angle = 0;
        this.direction = 1;
        this.start_time = millis();
        this.time = 0;
        this.enemyColors = ["red", "orange", "pink", "cyan"];
        this.enemyUpdateFrames = [0, 5, 10, 15];
    }  // gameObj constructor


    initialize() {
        /**
         * Initialize the tilemap
         */
        this.graph = new Array(20);
        for (var i = 0; i < 20; i++) {
            this.graph[i] = new Array(20);
        }
        maxScore = 0;
        var en_ix = 0
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                switch (this.tilemap[i][j]) {
                    case '-': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 1));
                        maxScore++;
                        this.graph[i][j] = 0;
                        graph[i][j] = 0;
                        break;
                    case 'w': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 2));
                        this.graph[i][j] = -1;
                        graph[i][j] = -1;
                        break;
                    case 'x': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 2));
                        break;
                    case 'e':
                        this.enemies.push(new EnemyBot(j * 20 + 10, i * 20 + 10, 20, this.enemyColors[en_ix], this.enemyUpdateFrames[en_ix]));
                        en_ix++;
                        this.graph[i][j] = 0;
                        graph[i][j] = 0;
                        break;
                    default:
                        this.graph[i][j] = 0;
                        graph[i][j] = 0;
                        break;
                }
            }
        }
    }
    drawScore() {
        /**
         * Draw the scores at the top
         */
        textSize(8);
        noStroke();
        textFont('Monospace');
        var backColor = color("#091540");
        backColor.setAlpha(190);
        fill(backColor);
        rect(width / 2 - 25 + 50, 3, 50, 14);
        fill("white");
        text("Score: " + game.score, width / 2 + 50, 10);
        fill(backColor);
        rect(width / 2 - 25 - 50, 3, 50, 14);
        fill("white");
        this.time = floor((millis() - this.start_time) / 1000)
        text("Time: " + this.time, width / 2 - 50, 10);
    }
    drawBackground() {
        /**
         * Draw the background for the game
         */
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.is_active) {
                if (obj.obj === 1) {
                    // If pellets
                    fill("white")
                    circle(obj.x, obj.y, 4);
                }
                else if (obj.obj === 2) {
                    // If walls
                    image(this.images[0], obj.x - 10, obj.y - 10, 20, 20);
                }
            }
        }
        // draw the enemies
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw();
            this.enemies[i].move();
        }
    }
    drawDeathBackground() {
        /**
         * Draw the background for when the player dies
         */
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.is_active) {
                if (obj.obj === 0) {
                    push();
                    translate(obj.x, obj.y);
                    rotate(this.angle);
                    image(this.images[0], -10, -10, 20, 20);
                    pop();
                }
                else if (obj.obj === 1) {
                    fill("white")
                    circle(obj.x, obj.y, 4);
                }
                else if (obj.obj === 2) {
                    image(this.images[0], obj.x - 10, obj.y - 10, 20, 20);
                }
            }
        }
    }
}  // gameObj