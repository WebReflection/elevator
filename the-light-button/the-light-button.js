import {bind} from 'https://unpkg.com/hyperhtml?module';
import LightButton from '../hardware/LightButton.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {

    // there is one button
    const button = new LightButton('G');

    // whenever it switches on or off, it sends a signal
    button.on('lighton', () => update('on'));
    button.on('lightoff', () => update('off'));

    // by default, the button has the light switched off
    update('off');

    function update(lightClass) {
      bind(document.body)`
      <button
        class=${'light-button ' + lightClass}
        onclick=${toggleLight}
      >${button.symbol}</button>`;
    }

    // this function is in charge of switching
    // the button light on or off
    function toggleLight() {
      switch (button.state) {
        case LightButton.ON:
          button.switch(LightButton.OFF);
          console.log('light off');
          break;
        case LightButton.OFF:
          button.switch(LightButton.ON);
          console.log('light on');
          break;
      }
    }
  },
  // setup on DOMContentLoaded only once
  // if the event gets dispatched again nothing will happen
  // a safer elevator for modern browsers
  {once: true}
);