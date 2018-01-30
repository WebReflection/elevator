import SimpleTarget from '../software/SimpleTarget.js';

// just like its doors, an elevator moves through a motor
import BiggerMotor from './BiggerMotor.js';

// private properties are handled by this WeakMap
const privates = new WeakMap;

export default class Elevator extends SimpleTarget {

  constructor() {
    super();

    // setup the motor
    const motor = new BiggerMotor;
    motor.on('rotating', this);
  
    // the level is used as distance between 0
    // and the next floor to reach
    privates.set(this, {motor, level: 0, status: 0});
  }

  // a read only property to know where is the elevator
  get status() {
    return privates.get(this).status;
  }

  // instead of open/close, an elevator
  // simply reaches a new level
  reach(level) {
    const info = privates.get(this);
    info.level = level;
    info.motor.rotate(level < 0 ? -1 : 1);
  }

  // while moving, calculate when it's time to stop.
  // note: this is not how it actually works for real
  onrotating(event) {
    const info = privates.get(this);
    info.status += event.detail;
    // just signal that it's moving
    this.signal('moving');
    // and whenever it reached the previous or next floor
    if (
      (event.detail < 0 && info.status <= info.level) ||
      (event.detail > 0 && info.status >= info.level)
    ) {
      // stop the motor
      info.motor.stop();
      // reset status
      info.status = 0;
      // and signal the change
      this.signal('changed');
    }
  }
}
