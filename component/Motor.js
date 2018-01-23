import EventTarget from '../utils/EventTarget.js';

export default class Motor extends EventTarget {
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

function rotateTheMotor(motor, detail) {
  motor.dispatchEvent(new CustomEvent('rotating', {detail}));
}
