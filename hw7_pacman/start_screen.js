/**
 * This file contains the code for the start screen. The start screen holds the instructions for playing
 */
class StartScreenObj {
    constructor(backsplash) {
        this.background_color = "#091540";
        this.font_color = "#ABD2FA";
        this.x = 0;
        this.y = 0;
        this.player = new PlayerBot(-15, -15, 30);
        this.enemy = new EnemyBot(315, 315, 30);
        this.enemy.dir = UP;
        this.backsplash = backsplash
        this.x_offset = random(-40, 0);
        this.y_offset = random(-40, 0);
        this.angle = PI / 6;
        this.x_dir = cos(this.angle);
        this.y_dir = sin(this.angle);
    }
    draw() {
        noStroke();
        image(this.backsplash, this.x_offset, this.y_offset, width + 40, height + 40);
        var backColor = color(this.background_color);
        backColor.setAlpha(230);
        fill(backColor);
        rect(this.x + 30, this.y + 20, width - 60, height - 60);
        fill("#3D518C")
        rect(this.x + 30, this.y + 20, width - 60, 80);
        fill(this.font_color);
        textFont('Impact');
        textSize(32);
        text("Pac-Man", this.x + width / 2, this.y + 60);
        textSize(12);
        var inst_strs = [
            "Play the Classic game of Pac-Man!",
            "Navigate the maze and eat pellets.",
            "",
            "Move around using the arrow or WASD keys.",
            "Avoid the ghosts!",
            "Collect all the pellets to win!",
            "",
            "Click to Begin the Game!",
        ]
        for (var i = 0; i < inst_strs.length; i++) {
            text(inst_strs[i], this.x + width / 2, this.y + 120 + 20 * i);
        }
        push();
        translate(110, 330);
        this.player.draw();
        pop();
        this.enemy.draw();
        fill(this.font_color);
        text("PAC-MAN", 95, 340)
        text("Ghost", 315, 340)
        text("Pellets", width / 2, 340)
        fill("white")
        for (var i = 0; i < 5; i++) {
            circle(width / 2 - 40 + 20 * i, 315, 6)
        }
    }
    move() {
        this.player.update();
        if (frameCount % 60 === 0) {
            // Randomly change the enemy direction every 60 frames
            this.enemy.dir = int(random(0, 5))
        }
        var speed = 0.1;
        this.x_offset += speed * this.x_dir;
        if (this.x_offset > 1 || this.x_offset < -41) {
            this.x_dir = -this.x_dir;
        }
        this.y_offset += speed * this.y_dir;
        if (this.y_offset > 1 || this.y_offset < -41) {
            this.y_dir = -this.y_dir;
        }
    }
}