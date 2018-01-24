import SimpleTarget from '../utils/SimpleTarget.js';

// the most basic Button ever does one thing and one thing only:
// when you press it, it sends a signal that it's being pressed
export default class Button extends SimpleTarget {
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }

  // while in the Internet of Things world you'll have
  // a physical way to press such button, we need a
  // synthetic alternative to simulate actual pressing.
  press() { this.signal('press'); }
}
