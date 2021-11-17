class objectObj {
    constructor(x, y, o) {
        this.x = x;
        this.y = y;
        this.obj = o;
        this.is_active = true;
    }
}

class GameObj {
    constructor(images, obstacle = null, obstacle2 = null) {
        this.tilemap = [
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
            "w-------e-------------------b-----------e------------------w",
            "w----w--b---w---e--w------w----w-----w----w------w----w----w",
            "w--w------w-------w----------w-----w--------w-b------------w",
            "w-----w---------e----------w-------------------w---e-w-----w",
            "w--------w------------w-------b---w--------e-------w-------w",
            "w----w------w----b--------w---w------w-------w----------w--w",
            "w--w------------w--------e------w--e------w----w-----b-----w",
            "w-------e-w-------------w------w-----b-w-------------w-----w",
            "w----w-----------e-----b--------e----------------------w---w",
            "w----b--------------w-----------w-----------------w--------w",
            "w----------w--b---w-------b----------w--w------e-----w-----w",
            "w------w-------------------w------b----------w-------------w",
            "w--w---------e---------------------------------b----e------w",
            "w----------------w-----------b-----------------------------w",
            "w--b-w--e-----------e-------w---e----------w--------w------w",
            "w------w-----b-w-----------------w----------bw--------w----w",
            "w-w-------w-------w-----w-----w--------w---------w---e--w-bw",
            "wb------------e---------b------------e---------------------w",
            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
        ]

        this.obstacle = obstacle;
        this.obstacle2 = obstacle2;
        this.gameOver = -1;
        this.score = 0;
        this.currFrame = 0;
        this.objects = [];
        this.enemies = [];
        this.images = images;
        this.angle = 0;
        this.direction = 1;
        this.xCor = -800;
        this.start_time = millis();
    }  // gameObj constructor


    initialize() {
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                switch (this.tilemap[i][j]) {
                    case 'w': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 2));
                        break;
                    case 'x': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 2));
                        break;
                    case 'b': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 1));
                        break;
                    case 'e': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 3));
                        this.enemies.push(new EnemyBot(j * 20 + 10, i * 20 + 10, 20));
                        break;
                    case 'f': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 3));
                        this.enemies.push(new EnemyBot(j * 20, i * 20, 20, PI / 2));
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
        rect(width / 2 - 25 + 100, 3, 50, 14);
        fill("white");
        text("Score: " + game.score, width / 2 + 100, 10);
        fill(backColor);
        rect(width / 2 - 25 - 100, 3, 50, 14);
        fill("white");
        var time = floor((millis() - this.start_time) / 1000)
        text("Time: " + time, width / 2 - 100, 10);
    }
    drawBackground() {
        for (var i = 0; i < this.objects.length; i++) {
            var obj = this.objects[i];
            if (obj.is_active) {
                if (obj.obj === 1) {
                    push();
                    translate(obj.x, obj.y);
                    rotate(this.angle);
                    image(this.images[0], -10, -10, 20, 20);
                    pop();
                }
                else if (obj.obj === 2) {
                    image(this.images[1], obj.x - 10, obj.y - 10, 20, 20);
                }
            }
        }
        // draw the enemies
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].is_active) {
                this.enemies[i].drawTop();
                this.enemies[i].move();
            }
        }
        // update rotation
        this.angle += this.direction * PI / 900;
        if (this.angle > PI / 9 || this.angle < -PI / 9) {
            this.direction = -1 * this.direction;
        }
    }
}  // gameObj