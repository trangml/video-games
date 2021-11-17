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
            "wwwwwwwwwwwwwwwwwwww",
            "ww----b---e--bwwwwww",
            "ww-wwww-www-wwwwwwww",
            "wwwwwwwwww--wwwb---w",
            "wwbwwwwwww-wwwwwww-w",
            "ww-wwwwwwb-wwwwwww-w",
            "ww-wwwwwww-bwwwwb--w",
            "ww-wwwwwwwfwwwwwww-w",
            "ww---bwwww-wwwwwwwfw",
            "ww-ww-wwwb---b-----w",
            "ww-ww-www--wwww-ww-w",
            "ww-ww-w---wwwww-ww-w",
            "ww-bw-w-wwwwwww-wb-w",
            "ww-ww----b-e----bw-w",
            "wb-ww--wwwww-bwwww-w",
            "wwf----wwwwwwwwwww-w",
            "ww-ww-wwwwwwwwwwww-w",
            "wwbww-wwwww---ww---w",
            "ww------b---w--b-wbw",
            "wwwwwwwwwwwwwwwwwwww",
        ];

        this.obstacle = obstacle;
        this.obstacle2 = obstacle2;
        this.gameOver = -1;
        this.score = 0;
        this.currFrame = 0;
        this.yCor = -1650;
        this.objects = [];
        this.objectsMap = new Map();
        this.enemies = [];
        this.images = images;
        this.angle = 0;
        this.direction = 1;
    }  // gameObj constructor


    initialize() {
        for (var i = 0; i < this.tilemap.length; i++) {
            for (var j = 0; j < this.tilemap[i].length; j++) {
                switch (this.tilemap[i][j]) {
                    case 'w': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 2));
                        this.objectsMap.set(j * 100 + i, "w");
                        break;
                    case 'x': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 2));
                        break;
                    case 'b': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 1));
                        break;
                    case 'e': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 3));
                        this.enemies.push(new EnemyBot((j * 20) - 10, (i * 20) + 10, 20));
                        break;
                    case 'f': this.objects.push(new objectObj(j * 20 + 10, i * 20 + 10, 3));
                        this.enemies.push(new EnemyBot(j * 20, i * 20, 20, PI / 2));
                        break;
                }
            }
        }
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
            this.enemies[i].drawTop();
            this.enemies[i].move();
        }
        // update rotation
        this.angle += this.direction * PI / 900;
        if (this.angle > PI / 9 || this.angle < -PI / 9) {
            this.direction = -1 * this.direction;
        }
    }
}  // gameObj