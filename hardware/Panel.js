import SimpleTarget from '../utils/SimpleTarget.js';

// a panel is a convenient intermediate layer that could
// group one or more buttons together and be mounted
// either externally or internally
export default class Panel extends SimpleTarget {

  // a panel can be "external" or "internal"
  static get EXTERNAL() { return 'external'; }
  static get INTERNAL() { return 'internal'; }

  constructor(type, buttons) {
    super().type = type;
    // each button signal will trigger the panel
    this.buttons = buttons.map(asPressEvent, this);
    // and the panel can switch buttons on or off
    // if requested by a controller
    this.on('switch', this);
  }

  // delegate the press signal to whoever is listening
  onpress(event) {
    this.signal('press', event.currentTarget);
  }

  // ask the button to switch to a different state
  onswitch(event) {
    const {button, state} = event.detail;
    button.switch(state);
  }
}

// helper function to map every button
function asPressEvent(button) {
  return button.on('press', this);
}
