import {bind, wire} from 'https://unpkg.com/hyperhtml?module';

// software
import Action from '../software/Action.js';
import Controller from '../software/Controller.js';

// hardware
import Button from '../hardware/Button.js';
import Doors from '../hardware/Doors.js';
import Elevator from '../hardware/Elevator.js';
import Panel from '../hardware/Panel.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const doors = new Doors;

    const doorsPanel = new Panel([
      new Button(Action.THIRD_FLOOR),
      new Button(Action.SECOND_FLOOR),
      new Button(Action.FIRST_FLOOR),
      new Button(Action.GROUND_FLOOR),
      new Button(Action.BASEMENT_FLOOR),
      new Button(Action.OPEN_DOORS), new Button(Action.CLOSE_DOORS),
      new Button(Action.ALARM)
    ]);

    const panels = [
      // let's assume by contract doorsPanel
      // is mandatory at index 0
      doorsPanel,
      // then we have a panel per floor
      new Panel([new Button(Action.BASEMENT_FLOOR)]),
      new Panel([new Button(Action.GROUND_FLOOR)]),
      new Panel([new Button(Action.FIRST_FLOOR)]),
      new Panel([new Button(Action.SECOND_FLOOR)]),
      new Panel([new Button(Action.THIRD_FLOOR)])
    ];

    const elevator = new Elevator;

    const controller = new Controller(elevator, doors, panels);

    // it works !!!
    controller.on('doors:moving', console.log);
    controller.on('doors:changed', console.log);
    controller.on('elevator:moving', console.log);
    controller.on('elevator:changed', console.log);

    panels[4].buttons[0].press();
  },
  // setup on DOMContentLoaded only once
  // if the event gets dispatched again nothing will happen
  // a safer elevator for modern browsers
  {once: true}
);