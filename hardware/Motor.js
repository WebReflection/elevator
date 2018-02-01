import SignalTarget from '../software/SignalTarget.js';

// an elevator doors motor does literally 2 things:
// it opens doors or it closes them.
export default class Motor extends SignalTarget {
  constructor() {
    super();
    // the rotating is used like a flag
    // based on the fact intervals are always
    // integers different from zero
    this.rotating = 0;
    // every motor has also different voltage,
    // power, or speed, which is in this demo
    // the most important for this motor to work.
    this.speed = 0.01;
  }

  // rotate is a public feature/API of the motor
  rotate(direction) {
    // it stops if it was moving already
    if (this.rotating) this.stop();
    // and it starts rotating in a direction
    // which is either clockwise or anticlockwise
    this.rotating = setInterval(
      // per each rotation, a signal is sent
      rotateTheMotor,
      // 60 frames per seconds
      1000/60,
      // to this motor
      this,
      // and with a direction higher or lower than 0
      direction < 0 ? -this.speed : +this.speed
    );
  }

  // a motor should be able to stop at any given time
  stop() {
    clearInterval(this.rotating);
    this.rotating = 0;
  }
}

// and signaling *may* pass through the speed
// even if it could be retrieved by the motor type itself
function rotateTheMotor(motor, speed) {
  motor.signal('rotating', speed);
}
