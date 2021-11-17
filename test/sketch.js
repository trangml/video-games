class Building {
  constructor(x, y, width, height, color, num_windows = 6) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.height_scale = height / 100;
    this.width_scale = width / 100;
    this.color = color;
    this.num_windows = num_windows;
  }
  draw() {
    push();
    translate(this.x, this.y - this.height);
    fill(this.color);
    rect(0, 0, this.width, this.height);
    var window_height = (this.height - 50 * this.height_scale) / this.num_windows;
    var window_width = (this.width - 20 * this.width_scale);
    fill("#FDE8E9")
    for (var i = 0; i < this.num_windows; i++) {
      rect(10 * this.width_scale, 10 * this.height_scale + window_height * i + 3 * this.height_scale * i, window_width, window_height)
    }
    pop();
  }
}

class Buildings {
  constructor() {
    this.colors = ["#f2f6d0", "#d0e1d4", "#d9d2b6", "#e4be9e", "#71697a"]
    this.buildings = [new Building(0, height, 100, 370, this.colors[0]), new Building(100, height, 150, 390, this.colors[1]), new Building(250, height, 70, 340, this.colors[2], 9), new Building(320, height, 80, 365, this.colors[3])]
  }
  draw() {
    for (var i = 0; i < this.buildings.length; i++) {
      this.buildings[i].draw();
    }
  }
}
var buildings;
function setup() {
  createCanvas(400, 400);
  buildings = new Buildings();
}
function draw() {
  background(0, 255, 0);
  buildings.draw();
}