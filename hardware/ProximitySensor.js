import SignalTarget from '../software/SignalTarget.js';

// when active, a proximity sensor is capable of signaling
// whenever someone, or something, is around
export default class ProximitySensor extends SignalTarget {

  // a sensor can be either active or inactive (default)
  constructor() { super().active = false; }

  activate() { this.active = true; }
  deactivate() { this.active = false; }

  // once an object gets closer, the sensor signals its proximity
  // in the real world, a proximity sensor might send more data
  // like, as example, how far is the detected object.
  detect() { if (this.active) this.signal('proximity'); }

}
