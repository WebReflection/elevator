import {bind} from 'https://unpkg.com/hyperhtml?module';
import Doors from '../component/Doors.js';
import {leak} from '../hacks/leakySensor.js';
import Button from '../component/Button.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    // there are two doors
    const doors = new Doors;
    // (with a leaky sensor !!!)
    const sensor = leak;  // used to test it

    // doors are controlled by two buttons
    const opener = new Button('⇤⇥');
    const closer = new Button('⇥⇤');

    // each button does one thing:
    // it sends a signal once pressed.
    opener.addEventListener('activate', openDoors);
    closer.addEventListener('activate', closeDoors);

    // whenever doors finish opening or closing
    // buttons that triggered actions should lose focus
    doors.addEventListener('change', resetDoors);

    // while doors are opening or closing
    // update any visual indicator (i.e. progress)
    doors.addEventListener('moving', update);
    update();

    // to update the view, simply use hyperHTML.bind(el)
    function update() {
      bind(document.body)`
      <div class=left style=${`margin-left:${-doors.status * 50}%`} />
      <div class=right style=${`margin-right:${-doors.status * 50}%`} />
      <progress value=${doors.status * 100} max=100 />
      <div class=sensor onmouseover=${detect}/>
      <div class=panel>
        <button onclick=${pressOpener}>${opener.symbol}</button>
        <button onclick=${pressCloser}>${closer.symbol}</button>
      </div>`;
    }

    // each button deactivate the other once pressed
    function pressOpener() {
      closer.deactivate();
      opener.activate();
    }

    function pressCloser() {
      opener.deactivate();
      closer.activate();
    }

    // doors can either open or close
    function openDoors() {
      doors.open();
    }

    function closeDoors() {
      doors.close();
      // easter egg: "the fly"
      //  ~10% of the times doors
      //  will re-open again by themselves
      if (Math.random() < .1) {
        setTimeout(detect, 500);
      }
    }

    // the leaked sensor resets doors state
    // and signals something has been detected
    function detect() {
      resetDoors();
      sensor.detect();
    }

    // once doors are either opened or closed
    // no opening/closing button should be active
    // and no element on DOM should be selected
    function resetDoors() {
      closer.deactivate();
      opener.deactivate();
      document.activeElement.blur();
    }
  },
  // setup on DOMContentLoaded only once
  // if the event gets dispatched again nothing will happen
  // a safer elevator for modern browsers
  {once: true}
);