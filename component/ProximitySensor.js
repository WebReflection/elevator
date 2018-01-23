import EventTarget from '../utils/EventTarget.js';

export default class ProximitySensor extends EventTarget {

  constructor() { super().active = false; }

  activate() { this.active = true; }

  deactivate() { this.active = false; }

  detect() { if (this.active) this.dispatchEvent(new Event('proximity')); }

}
