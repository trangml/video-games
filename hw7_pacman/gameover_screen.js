/**
 * This file contains the logic for the gameover screens. It has both the win and loss screen
 */
var confettis = [];
var colors = ["#5dd9c1", "#acfcd9", "#b084cc", "#665687", "#190933"];
var colors = ["#083d77", "#ebebd3", "#f4d35e", "#ee964b", "#f95738"];
function confetti() {
    // initialize coordinates
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(4, 9);
    this.color = color(random(0, 360), random(0, 360), random(0, 360));

    this.radius = sqrt(random(pow(width / 2, 2)));

    this.update = function (time) {
        // x position follows a circle
        let w = 0.6; // angular speed
        let angle = w * time + this.initialangle;
        this.posX = width / 2 + this.radius * sin(angle);

        this.posY += pow(this.size, 0.5);

        if (this.posY > height) {
            let index = confettis.indexOf(this);
            confettis.splice(index, 1);
        }
    };

    this.display = function () {
        fill(this.color);
        ellipse(this.posX, this.posY, this.size);
    };
}

class GameOverScreenObj {
    constructor(backsplash) {
        this.background_color = "#091540";
        this.font_color = "#ABD2FA";
        this.x = 0;
        this.y = 0;
        this.player = new PlayerBot(0, 0, 60);
        this.dead_player = new PlayerBot(-15, -15, 30, "white", "gray", "gray");
        this.enemy = new EnemyBot(0, 0, 60);
        this.enemy.dir = LEFT
        this.backsplash = backsplash;
        this.x_offset = random(-30, -5);
        this.y_offset = random(-30, -5);
        this.y_hop = random(-10, 0);
        this.angle = PI / 6;
        this.x_dir = cos(PI / 6);
        this.y_dir = sin(PI / 6);
    }
    statsText() {
        /**
         * This function draws the stats text on the screen
         */
        fill(this.font_color);
        textFont('Monospace')
        textFont('Impact')
        textSize(12);
        var inst_strs = [
            "Score: " + score,
            "Time: " + game.time,
        ]
        for (var i = 0; i < inst_strs.length; i++) {
            text(inst_strs[i], this.x + width / 2 - 50 + 100 * i, this.y + 330);
        }
    }
    victory() {
        /**
         * This function draws the victory screen
         */
        noStroke();
        image(this.backsplash, this.x_offset, this.y_offset, width + 40, height + 40);
        // Confetti code modified from https://p5js.org/examples/simulate-snowflakes.html
        // draw confetti
        let t = frameCount / 60; // update time

        // create a random number of snowflakes each frame
        for (let i = 0; i < random(2); i++) {
            confettis.push(new confetti()); // append snowflake object
        }

        var backColor = color(this.background_color);
        backColor.setAlpha(230);
        fill(backColor);
        rect(this.x + 30, this.y + 20, width - 60, height - 60);
        fill("#3D518C")
        rect(this.x + 30, this.y + 20, width - 60, 80);
        for (let flake of confettis) {
            flake.update(t); // update snowflake position
            flake.display(); // draw snowflake
        }
        fill(this.font_color);
        textFont('Monospace')
        textFont('Impact')
        textSize(32);
        text("VICTORY!", this.x + width / 2, this.y + 60);
        textSize(12);
        var inst_strs = [
            "You collected all the pellets!",
            "",
            "Click to Play Again!",
        ]
        for (var i = 0; i < inst_strs.length; i++) {
            text(inst_strs[i], this.x + width / 2, this.y + 120 + 20 * i);
        }
        push();
        translate(width / 2, 270 + this.y_hop);
        this.player.drawHappyEyes();
        pop();
    }
    loss() {
        /**
         * This function draws the loss screen
         */
        noStroke();
        image(this.backsplash, this.x_offset, this.y_offset, width + 40, height + 40);
        var backColor = color(this.background_color);
        backColor.setAlpha(230);
        fill(backColor);
        rect(this.x + 30, this.y + 20, width - 60, height - 60);
        fill("#3D518C")
        rect(this.x + 30, this.y + 20, width - 60, 80);
        fill(this.font_color);
        textFont('Monospace')
        textFont('Impact')
        textSize(32);
        text("GAME OVER", this.x + width / 2, this.y + 60);
        textSize(12);
        var inst_strs = [
            "You were caught by a Ghost!",
            "Try better next time!",
            "",
            "Click to Try Again!",
        ]
        for (var i = 0; i < inst_strs.length; i++) {
            text(inst_strs[i], this.x + width / 2, this.y + 120 + 20 * i);
        }
        push();
        translate(width / 2, 270);
        this.enemy.draw();
        pop();
        push();
        translate(width / 2 + 50, 290 + this.y_hop / 2.5);

        var rotation = random(-1, 1);
        rotate(PI / 40 * rotation);
        this.dead_player.drawDeadEyes();
        pop();
    }
    draw(scr) {
        /**
         * Draw based on the score
         */
        if (scr === maxScore) {
            this.victory();
        }
        else {
            this.loss();
        }
        this.statsText();
    }
    move() {
        /**
         * Move the screen components
         */
        if (frameCount % 30 === 0) {
            this.enemy.dir = int(random(1, 5))
        }
        var speed = .1;
        this.x_offset += speed * this.x_dir;
        if (this.x_offset > 0 || this.x_offset < -40) {
            this.x_dir = -this.x_dir;
        }
        this.y_offset += speed * this.y_dir;
        if (this.y_offset > 0 || this.y_offset < -40) {
            this.y_dir = -this.y_dir;
        }
        var hop_speed = 3
        this.y_hop += hop_speed * sin(this.angle)
        if (this.y_hop > 0 || this.y_hop < -40) {
            this.angle = (this.angle + PI / 2) % (2 * PI);
        }

    }
}