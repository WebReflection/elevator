import Button from './Button.js';

// a LightButton is exactly what it says:
// a button with also a light connected to it
export default class LightButton extends Button {

  // the light can be "on" or "off"
  static get ON() { return 'on'; }
  static get OFF() { return 'off'; }

  // the state is very simple:
  // either the button is on or off (default)
  constructor(symbol) {
    super(symbol).state = LightButton.OFF;
  }

  // the light switch is independent of the press signal
  // indeed the button can be switched on without pressing actions
  switch(state) {
    switch(state) {
      case LightButton.ON:
      case LightButton.OFF:
        // same state won't do anything
        if (this.state === state) return;
        // updated state will signal changes
        this.state = state;
        this.signal('light' + state);
        break;
    }
  }
}
