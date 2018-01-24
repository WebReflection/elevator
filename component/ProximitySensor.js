import HyperTarget from '../utils/HyperTarget.js';

export default class ProximitySensor extends HyperTarget {

  constructor() { super().active = false; }

  activate() { this.active = true; }

  deactivate() { this.active = false; }

  detect() { if (this.active) this.signal('proximity'); }

}
