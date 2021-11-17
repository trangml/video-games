var confettis = [];
var colors = ["#5dd9c1", "#acfcd9", "#b084cc", "#665687", "#190933"];
var colors = ["#083d77", "#ebebd3", "#f4d35e", "#ee964b", "#f95738"];
function confetti() {
    // initialize coordinates
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(2, 5);
    this.color = colors[round(random(0, 4))];

    // radius of snowflake spiral
    // chosen so the snowflakes are uniformly spread out in area
    this.radius = sqrt(random(pow(width / 2, 2)));

    this.update = function (time) {
        // x position follows a circle
        let w = 0.6; // angular speed
        let angle = w * time + this.initialangle;
        this.posX = width / 2 + this.radius * sin(angle);

        // different size snowflakes fall at slightly different y speeds
        this.posY += pow(this.size, 0.5);

        // delete snowflake if past end of screen
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
        this.backsplash = backsplash;
        this.x_offset = random(-30, -5);
        this.y_offset = random(-30, -5);
        this.y_hop = random(-10, 0);
        this.angle = PI / 6;
        this.x_dir = cos(PI / 6);
        this.y_dir = sin(PI / 6);
    }
    victory() {
        noStroke();
        image(this.backsplash, this.x_offset, this.y_offset, width + 40, height + 40);
        // draw confetti
        let t = frameCount / 60; // update time

        // create a random number of snowflakes each frame
        for (let i = 0; i < random(5); i++) {
            confettis.push(new confetti()); // append snowflake object
        }

        // loop through snowflakes with a for..of loop
        for (let flake of confettis) {
            flake.update(t); // update snowflake position
            flake.display(); // draw snowflake
        }
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
        text("VICTORY!", this.x + width / 2, this.y + 60);
        textSize(12);
        var inst_strs = [
            "You collected all the batteries!",
            "You'll live to contemplate existence for another day!",
            "",
            "Click to Play Again!",
        ]
        for (var i = 0; i < inst_strs.length; i++) {
            text(inst_strs[i], this.x + width / 2, this.y + 120 + 20 * i);
        }
        push();
        translate(width / 2, 270 + this.y_hop);
        this.player.drawTop();
        pop();
    }
    loss() {
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
            "You were caught by a Devi-Bot!",
            "Guess you'll make some good spare parts.",
            "",
            "Click to Try Again!",
        ]
        for (var i = 0; i < inst_strs.length; i++) {
            text(inst_strs[i], this.x + width / 2, this.y + 120 + 20 * i);
        }
        push();
        translate(width / 2, 270);
        this.enemy.drawTop();
        pop();
        push();
        translate(width / 2 + 20, 270 + this.y_hop / 2.5);

        var rotation = random(-1, 1);
        rotate(PI);
        rotate(PI / 40 * rotation);
        this.dead_player.drawTop();
        pop();
    }
    draw(scr) {
        if (scr == 20) {
            this.victory();
        }
        else {
            this.loss();
        }
    }
    move() {
        var speed = .1;
        this.x_offset += speed * this.x_dir;
        if (this.x_offset > 0 || this.x_offset < -40) {
            this.x_dir = -this.x_dir;
        }
        this.y_offset += speed * this.y_dir;
        if (this.y_offset > 0 || this.y_offset < -40) {
            this.y_dir = -this.y_dir;
        }
        var hop_speed = 2
        this.y_hop += hop_speed * sin(this.angle)
        if (this.y_hop > 0 || this.y_hop < -40) {
            this.angle = (this.angle + PI / 2) % (2 * PI);
        }

    }
}