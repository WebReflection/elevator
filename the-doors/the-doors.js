import {bind} from 'https://unpkg.com/hyperhtml?module';
import Doors from '../component/Doors.js';
import {leak} from '../hacks/leakySensor.js';

document.addEventListener('DOMContentLoaded', () => {

  const doors = new Doors;
  const sensor = leak;

  doors.addEventListener('moving', update);
  update();

  function update() {
    bind(document.body)`
    <div class=left style=${`margin-left:${-doors.status * 50}%`} />
    <div class=right style=${`margin-right:${-doors.status * 50}%`} />
    <progress value=${doors.status * 100} max=100 />
    <div class=sensor onmouseover=${detect}/>
    <div class=panel>
      <button onclick=${open}>⇤⇥</button>
      <button onclick=${close}>⇥⇤</button>
    </div>`;
  }

  function open() { doors.open(); }

  function detect() { sensor.detect(); }

  function close() {
    doors.close();
    // easter egg
    if (Math.random() < .2) {
      setTimeout(detect, 500);
    }
  }

}, {once: true});