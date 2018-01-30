import {bind} from 'https://unpkg.com/hyperhtml?module';
import Doors from '../hardware/Doors.js';
import {leak} from '../hacks/leakySensor.js';
import Button from '../hardware/Button.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {
    // there are two doors
    const doors = new Doors;
    // (with a leaky sensor !!!)
    const sensor = leak;
    // that communicates when it detects movements
    sensor.on('proximity', () => console.log('movement detected'));

    // doors are controlled by two buttons
    const opener = new Button('⇤⇥');
    const closer = new Button('⇥⇤');

    // each button does one thing:
    // it sends a signal when you press it
    opener.on('press', openDoors);
    closer.on('press', closeDoors);

    // whenever doors finish opening or closing
    // inform the used about the status
    doors.on('changed', () => {
      switch (doors.status) {
        case Doors.OPENED:
          console.log('doors opened');
          break;
        case Doors.CLOSED:
          console.log('doors closed');
          break;
      }
    });

    // while doors are opening or closing
    // update any visual indicator (i.e. progress)
    doors.on('moving', update);
    update();

    // to update the view, simply use hyperHTML.bind(el)
    function update() {
      bind(document.body)`
      <div class=sensor onmouseover=${detect}/>
      <div class=left style=${`margin-left:${-doors.status * 50}%`} />
      <div class=right style=${`margin-right:${-doors.status * 50}%`} />
      <progress value=${doors.status * 100} max=100 />
      <div class=panel>
        <button onclick=${pressOpener}>${opener.symbol}</button>
        <button onclick=${pressCloser}>${closer.symbol}</button>
      </div>`;
    }

    // when DOM buttons are clicked, mechanic buttons are pressed
    function pressOpener() { opener.press(); }
    function pressCloser() { closer.press(); }

    // doors can either open or close
    function openDoors() { doors.open(); }
    function closeDoors() {
      doors.close();
      // easter egg: "the fly"
      //  ~10% of the times doors
      //  will re-open again by themselves
      //  through the leaky sensor
      if (Math.random() < .1) {
        setTimeout(() => {
          console.log('a fly passed by');
          detect();
        }, 500);
      }
    }

    // simulating the (leaky) proximity sensor detection
    function detect() {
      sensor.detect();
    }
  },
  // setup on DOMContentLoaded only once
  // if the event gets dispatched again nothing will happen
  // a safer elevator for modern browsers
  {once: true}
);