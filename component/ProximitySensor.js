import SimpleTarget from '../utils/SimpleTarget.js';

export default class ProximitySensor extends SimpleTarget {

  constructor() { super().active = false; }

  activate() { this.active = true; }

  deactivate() { this.active = false; }

  detect() { if (this.active) this.signal('proximity'); }

}
