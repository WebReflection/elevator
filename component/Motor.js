import HyperTarget from '../utils/HyperTarget.js';

export default class Motor extends HyperTarget {
  constructor() {
    super();
    this.rotating = 0;
    this.speed = 0.01;
  }

  rotate(direction) {
    if (this.rotating) this.stop();
    this.rotating = setInterval(
      rotateTheMotor,
      1000/60,
      this,
      direction < 0 ? -this.speed : +this.speed
    );
  }

  stop() {
    clearInterval(this.rotating);
    this.rotating = 0;
  }
}

function rotateTheMotor(motor, speed) {
  motor.signal('rotating', speed);
}
