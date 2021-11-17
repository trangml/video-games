/**
 * This Class represents a crate object.
 */
class Crate {
    constructor(x, y, size, color = "#cd9777", back_color = "#9d6b53") {
        this.x = x;
        this.y = y;
        this.size = size;
        this.outline = size / 40;
        this.offset = size / 2;
        this.back_color = back_color;
        this.color = color;
    }
    /**
     * This draws a crate with an x in the middle and two screws
     */
    draw(x = this.x, y = this.y) {
        stroke("black");
        strokeWeight(this.outline);
        fill(this.back_color);
        square(x, y, this.size); // outer crate shape
        // fill out the square and the planks within the crate
        var plank_width = this.size / 6;
        fill(this.color);
        var slant_plank_width = cos(-PI / 4) * this.size / 6;
        beginShape(TESS);
        vertex(x + slant_plank_width, y)
        vertex(x, y + slant_plank_width)
        vertex(x + this.size - slant_plank_width, y + this.size)
        vertex(x + this.size, y + this.size - slant_plank_width)
        endShape(TESS); // diagonal top left to bottom right
        beginShape(TESS);
        vertex(x + slant_plank_width, y + this.size)
        vertex(x, y + this.size - slant_plank_width)
        vertex(x + this.size - slant_plank_width, y)
        vertex(x + this.size, y + slant_plank_width)
        endShape(TESS); // diagonal top right to bottom left
        rect(x, y, plank_width, this.size); // left plank
        rect(x + this.size - plank_width, y, plank_width, this.size); // right plank
        rect(x, y, this.size, plank_width); // top plank
        rect(x, y + this.size - plank_width, this.size, plank_width); // bottom plank
    }
}