export default class Animator {

  constructor(canvas, feature, onResize) {

    this.canvas = canvas;
    this.Feature = feature;
    this.onResize = (onResize || (() => ([this.canvas.width, this.canvas.height])));

    const [cw, ch] = this.onResize();
    this.canvas.width = cw;
    this.canvas.height = ch;
    this.cw = this.canvas.width;
    this.ch = this.canvas.height;

    this.ctx = this.canvas.getContext('2d');
    this.features = [];
    this.count = 100;
    this.tick = 3;
    this.tickMax = 5;

    this.windowResizeHandler = this.windowResizeHandler.bind(this);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cw, this.ch);
  }

  create() {
    if (this.features.length < this.count) {
      if (this.tick >= this.tickMax) {
        this.features.push(new this.Feature(this.cw, this.ch));
        this.tick = 0;
      } else {
        this.tick++;
      }
    }
  }

  update() {
    for (let i = 0; i < this.features.length; i++) {
      this.features[i].update();
    }
  }

  render() {
    for (let i = 0; i < this.features.length; i++) {
      this.features[i].render(this.ctx);
    }
  }

  windowResizeHandler() {
    window.clearTimeout(this._windowResizeHandlerTimeout);
    this._windowResizeHandlerTimeout = window.setTimeout(() => {

      const [cw, ch] = this.onResize();
      this.canvas.width = cw;
      this.canvas.height = ch;
      this.cw = this.canvas.width;
      this.ch = this.canvas.height;

      this.restart();
    }, 500);
  }

  start() {
    var loop = () => {

      // Draw frame...
      this.clear();
      this.create();
      this.update();
      this.render();

      this._animationFrameRequest = window.requestAnimationFrame(loop);
    };

    this._animationFrameRequest = window.requestAnimationFrame(loop);

    // Add a window resize event listener so we can resize our canvas 
    //  appropriately...
    window.addEventListener('resize', this.windowResizeHandler);
  }

  stop() {
    // Stop the window resize event listener...
    window.removeEventListener('resize', this.windowResizeHandler);

    // Stop the animation...
    if (this._animationFrameRequest) {
      window.cancelAnimationFrame(this._animationFrameRequest);
      this._animationFrameRequest = undefined;
    }

    // Reset the canvas...
    if (this.ctx) {
      this.clear();
    }
  }

  restart() {
    this.stop();
    this.start();
  }
}