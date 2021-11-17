class Battery {
    constructor(x, y) {
        this.x = x;
        this.y = y + 10;
        this.base_color = "black";
        this.top_color = "#fad643";
        //this.top_color = "yellow";
        this.contact_color = "silver";
    }
    draw() {
        var width = 70;
        var height = 120;
        var round = 10;
        noStroke();
        fill(this.base_color);
        rect(this.x, this.y, width, height, round);
        fill(this.top_color);
        var top_height = 40;
        rect(this.x, this.y, width, top_height, round, round, 0, 0);
        // Begin bolt
        beginShape(TESS);
        var start_bolt_height = 1.1 * top_height;
        var bolt_height = 1.7 * top_height;
        vertex(this.x + width / 2 + 15, this.y + start_bolt_height);
        vertex(this.x + width / 2 - 20, this.y + start_bolt_height + bolt_height / 2 + 10);
        vertex(this.x + width / 2, this.y + start_bolt_height + bolt_height / 2 + 5);
        vertex(this.x + width / 2 - 15, this.y + start_bolt_height + bolt_height);
        vertex(this.x + width / 2 + 20, this.y + start_bolt_height + bolt_height / 2 - 10);
        vertex(this.x + width / 2, this.y + start_bolt_height + bolt_height / 2 - 5);
        endShape(CLOSE);
        // End bolt
        fill(this.base_color);
        var plus_start = 5;
        var plus_width = width / 9;
        var plus_size = top_height - 2 * plus_width;
        rect(this.x + 4 * plus_width, this.y + plus_start, plus_width, plus_size);
        rect(this.x + 4 * plus_width - plus_size / 2 + plus_width / 2, this.y + plus_start + plus_size / 2 - plus_width / 2, plus_size, plus_width);
        fill(this.contact_color);
        rect(this.x + width / 3, this.y - 10, width / 3, 10, 10, 10, 0, 0); // make the top part of the battery
    }
}