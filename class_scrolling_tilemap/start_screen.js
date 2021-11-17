class StartScreenObj {
    constructor() {
        this.background_color = "grey";
        this.font_color = "#FFB7C3";
        this.x = 0;
        this.y = 0;
    }
    draw() {
        noStroke();
        fill(this.background_color);
        rect(this.x, this.y, width, height);
        fill(this.font_color);
        textSize(32);
        text("Welcome to Mech-Tech", this.x + 20, this.y + 20);
    }
}