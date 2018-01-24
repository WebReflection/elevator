import HyperTarget from '../utils/HyperTarget.js';

import Motor from './Motor.js';
import ProximitySensor from './ProximitySensor.js';

const privates = new WeakMap;

export default class Doors extends HyperTarget {

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
    info.sensor.activate();
    info.motor.rotate(1);
  }

  close() {
    const info = privates.get(this);
    if (info.status === Doors.CLOSED) return;
    info.sensor.activate();
    info.motor.rotate(-1);
  }

  handleEvent(event) {
    switch (event.type) {
      case 'proximity':
        this.open();
        break;
      case 'rotating':
        this.onrotating(event);
        break;
    }
  }

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
        info.sensor.deactivate();
        info.motor.stop();
        this.signal('change');
        break;
    }
  }
}
