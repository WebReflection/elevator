import SimpleTarget from '../utils/SimpleTarget.js';

// when active, a proximity sensor is capable of signaling
// whenever someone, or something, is around
export default class ProximitySensor extends SimpleTarget {

  constructor() { super().active = false; }

  // a sensor can be either active or inactive
  activate() { this.active = true; }
  deactivate() { this.active = false; }

  // and once an object gets closer, it signals its proximity
  detect() { if (this.active) this.signal('proximity'); }

}
