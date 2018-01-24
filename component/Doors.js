import SimpleTarget from '../utils/SimpleTarget.js';

import Motor from './Motor.js';
import ProximitySensor from './ProximitySensor.js';

const privates = new WeakMap;

export default class Doors extends SimpleTarget {

  static get CLOSED() { return 0; }
  static get OPENED() { return 1; }

  constructor() {
    super();
    const motor = new Motor;
    const sensor = new ProximitySensor;
    motor.on('rotating', this);
    sensor.on('proximity', this);
    privates.set(this, {motor, sensor, status: Doors.CLOSED});
  }

  get status() {
    return privates.get(this).status;
  }

  open() {
    const info = privates.get(this);
    if (info.status === Doors.OPENED) return;
    // start moving doors outward
    info.motor.rotate(1);
  }

  close() {
    const info = privates.get(this);
    if (info.status === Doors.CLOSED) return;
    // be sure nobody gets chopped while closing
    info.sensor.activate();
    // start moving doors inward
    info.motor.rotate(-1);
  }

  onproximity() { this.open(); }

  onrotating(event) {
    const info = privates.get(this);
    info.status = Math.max(
      Doors.CLOSED,
      Math.min(
        Doors.OPENED,
        info.status + event.detail
      )
    );
    this.signal('moving');
    switch (info.status) {
      case Doors.CLOSED:
      case Doors.OPENED:
        // sensor not needed anymore
        info.sensor.deactivate();
        // and the motor can stop
        info.motor.stop();
        // notify the doors status changed
        this.signal('changed');
        break;
    }
  }
}
