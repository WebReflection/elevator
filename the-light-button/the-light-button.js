import {bind} from 'https://unpkg.com/hyperhtml?module';
import LightButton from '../component/LightButton.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const button = new LightButton('G');

    button.on('lighton', () => update('on'));
    button.on('lightoff', () => update('off'));
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