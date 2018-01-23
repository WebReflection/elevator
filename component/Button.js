import EventTarget from '../utils/EventTarget.js';

export default class Button extends EventTarget {
  constructor(symbol) {
    super();
    this.active = false;
    this.symbol = symbol;
  }

  activate() {
    if (this.active) return;
    this.active = true;
    this.dispatchEvent(new Event('activate'));
  }

  deactivate() {
    if (!this.active) return;
    this.active = false;
    this.dispatchEvent(new Event('deactivate'));
  }
}
