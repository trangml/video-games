class StartScreenObj {
    constructor(backsplash) {
        this.background_color = "#091540";
        this.font_color = "#ABD2FA";
        this.x = 0;
        this.y = 0;
        this.player = new PlayerTank(-15, -15, 30);
        this.enemy = new EnemyTank(315, 315, 30);
        this.enemy.angle = PI;
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
        text("Tank-Tech", this.x + width / 2, this.y + 60);
        textSize(12);
        var inst_strs = [
            "Destroy the enemy tanks by hitting them with missiles!",
            "Avoid getting hit by enemy missiles!",
            "Beware, the tanks will avoid your missiles",
            "Try to fool them into committing friendly fire!",
            "Defeat all the enemies to win!",
            "",
            "Move around using the arrow or WASD keys, and",
            "shoot missiles using space.",
            "Click or hit space to begin the game!",
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
        text("You", 95, 340)
        text("Enemy Tank", 315, 340)
    }
    move() {
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