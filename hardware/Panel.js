import SignalTarget from '../software/SignalTarget.js';

// a panel is a convenient intermediate layer that could
// group one or more buttons together and be mounted
// either externally or internally the elevator
export default class Panel extends SignalTarget {

  constructor(buttons) {
    super();
    // each button signal will trigger the panel
    this.buttons = buttons.map(asPressEvent, this);
  }

  // delegate the press signal to whoever is listening
  onpress(event) {
    this.signal('press', event.currentTarget);
  }

}

// helper function to map every button
function asPressEvent(button) {
  return button.on('press', this);
}
