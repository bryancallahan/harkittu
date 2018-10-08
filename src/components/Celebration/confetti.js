export default class Confetti {

  // Inspired by the fantastic work of Jack Rugile 
  //  (https://jackrugile.com/, https://codepen.io/jackrugile/).

  constructor(cw, ch) {
    this.init(cw, ch);
  }

  rand(a, b) {
    return Math.random() * (b - a + 1) + a;
  }

  init(cw, ch) {
    this.cw = cw;
    this.ch = ch;
    this.x = 20;
    this.y = 10;

    // this.vx = (this.rand(0, 100) - 50) / 12;
    this.vx = (this.rand(0, this.ch) - 0) / 6;
    // this.vy = -(this.rand(50, 100)) / 9;
    this.vy = -(this.rand(50, 100)) / 14;
    this.lightness = this.rand(0, 50);

    this.r = this.rand(0, 200);
    this.g = this.rand(0, 200);
    this.b = this.rand(0, 200);

    this.alpha = 0.1;
    this.fade = 0.015;
    this.scale = 1.0;
    this.growth = 0.08;
    this.rotation = this.rand(0, Math.PI * 2);
    this.spin = (this.rand(0, 100) - 50) / 300;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += .15 * this.scale;
    if (this.alpha < 1) {
      this.alpha += this.fade;
    }
    this.scale += this.growth;
    this.rotation += this.spin;
    if (this.y - 30 >= this.ch) {
      this.init(this.cw, this.ch);
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.rotate(this.rotation);

    ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
    ctx.beginPath();
    ctx.fillRect(0, 0, 2, 2);
    ctx.fill();

    ctx.font = '18px Open Sans';
    ctx.fillText('😄', 10, 20);

    // ctx.font = '18px Indie Flower';
    // ctx.fillText('😊', 10, 20);
    // ctx.fillText('😃', 10, 20);
    // ctx.fillText('🎉', 10, 20);
    // ctx.fillText('😊', 10, 20);
    // ctx.fillText('Yay!', 10, 20);

    // If open and closed before? many times? 😗 -> 😬
    // If it's been open for long time? 😳
    // Other good options:  😄  😊  😁  😀  💥  👍  🎉

    ctx.restore();
  }
}