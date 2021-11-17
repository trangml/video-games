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
            "----------------------------------------",
            "------------be-----------b------------b-",
            "-----------xxx----------xxxx------------",
            "-b-------------------------------b------",
            "-----------b-------bxx---------e--------",
            "---------------x---------------xxxxx----",
            "-----------x--------------------------b-",
            "-xx--------------------b----------------",
            "--------b--------x--------------------x-",
            "-----------------------x-----------b----",
            "-b----x-----e---------e-----------------",
            "--e--------xxx---b----xxx---------xxx---",
            "xxxx-----------------------b------------",
            "--------b------------------------b------",
            "-----------------x-------xxxx-----------",
            "-----------b----------------------------",
            "-----xxx-------xxxxx---b-------xxxxx----",
            "-----------------b----------------------",
            "--e-b------------e---------e------------",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        ]

        this.obstacle = obstacle;
        this.obstacle2 = obstacle2;
        this.gameOver = -1;
        this.score = 0;
        this.enemiesKilled = 0;
        this.currFrame = 0;
        this.objects = [];
        this.enemies = [];
        this.images = images;
        this.angle = 0;
        this.direction = 1;
        this.xCor = -400;
        this.start_time = millis();
        this.time = 0;
    }  // gameObj constructor


    initialize() {
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                switch (this.tilemap[i][j]) {
                    case 'w': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 1));
                        break;
                    case 'x': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 2));
                        break;
                    case 'b': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 0));
                        break;
                    case 'e':
                        this.enemies.push(new EnemyBot(j * 20 + 10, i * 20 + 10, 20));
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
        background("#EFFFFA");
        image(this.images[3], 0, 0, 400, 400);
        image(this.images[3], 400, 0, 400, 400);
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
                    image(this.images[1], obj.x - 10, obj.y - 10, 20, 20);
                }
                else if (obj.obj === 2) {
                    image(this.images[2], obj.x - 10, obj.y - 10, 20, 20);
                }
            }
        }
        // draw the enemies
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].is_active) {
                this.enemies[i].drawTop();
                this.enemies[i].move();
            }
            else {
                if (this.enemies[i].deathAnimation != 0) {
                    this.enemies[i].drawDeath();
                }
            }
        }
        // update rotation
        this.angle += this.direction * PI / 900;
        if (this.angle > PI / 9 || this.angle < -PI / 9) {
            this.direction = -1 * this.direction;
        }
    }
}  // gameObj