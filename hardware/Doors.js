import SignalTarget from '../software/SignalTarget.js';

// modern elevator doors have at least one motor
import Motor from './Motor.js';
// and one sensor to avoid chopping people while doors close
import ProximitySensor from './ProximitySensor.js';

// private properties are handled by this WeakMap
const privates = new WeakMap;

export default class Doors extends SignalTarget {

  // doors can be either closed or opened
  static get CLOSED() { return 0; }
  static get OPENED() { return 1; }

  constructor() {
    super();
    // setup motor and sensor for these doors
    const motor = new Motor;
    const sensor = new ProximitySensor;
    // update doors position while motor is rotating
    motor.on('rotating', this);
    // react on proximity sensor signals
    sensor.on('proximity', this);
    // these are internal features nobody else
    // should handle, granting doors functionality integrity.
    privates.set(this, {motor, sensor, status: Doors.CLOSED});
  }

  // a read only property to know if doors are opened or closed
  get status() {
    return privates.get(this).status;
  }

  // a public API to open doors
  open() {
    const info = privates.get(this);
    // if already opened, nothing happens
    if (info.status === Doors.OPENED) return;
    // otherwise move doors through the motor
    info.motor.rotate(1);
  }

  // same API goes for closing doors
  close() {
    const info = privates.get(this);
    // if laready closed, nothing happens
    if (info.status === Doors.CLOSED) return;
    // otherwise be sure nobody gets chopped while closing
    info.sensor.activate();
    // and start moving doors through the motor
    info.motor.rotate(-1);
  }

  // whenever the sensor signals proximity
  // the doors.open() method is invoked
  onproximity() { this.open(); }

  // while the motor is rotaing
  onrotating(event) {
    const info = privates.get(this);
    // update the status between 0 and 1
    info.status = Math.max(
      Doors.CLOSED,
      Math.min(
        Doors.OPENED,
        info.status + event.detail
      )
    );
    // signal to a visual panels or other hardware
    // that doors are moving
    this.signal('moving');
    // and if status is now opened or closed
    switch (info.status) {
      case Doors.CLOSED:
      case Doors.OPENED:
        // stop the sensor
        info.sensor.deactivate();
        // and stop the motor
        info.motor.stop();
        // notify whatever needs it that doors status changed
        // this is the equivalent of a `.then(...)` after
        // doors have finished opening or closing
        this.signal('changed');
        break;
    }
  }
}
