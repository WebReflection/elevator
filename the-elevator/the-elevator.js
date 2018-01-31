import {bind, wire} from 'https://unpkg.com/hyperhtml?module';

// software
import Action from '../software/Action.js';
import Controller from '../software/Controller.js';

// hardware
import LightButton from '../hardware/LightButton.js';
import Doors from '../hardware/Doors.js';
import Elevator from '../hardware/Elevator.js';
import Panel from '../hardware/Panel.js';

document.addEventListener(
  'DOMContentLoaded',
  () => {

    // the controller handles doors
    const doors = new Doors;

    // an internal panel (inside the elevator)
    const internalPanel = new Panel([
      new LightButton(Action.THIRD_FLOOR),
      new LightButton(Action.SECOND_FLOOR),
      new LightButton(Action.FIRST_FLOOR),
      new LightButton(Action.GROUND_FLOOR),
      new LightButton(Action.BASEMENT_FLOOR),
      new LightButton(Action.OPEN_DOORS), new LightButton(Action.CLOSE_DOORS),
      new LightButton(Action.ALARM)
    ]);

    // as well as every other external panel
    const panels = [
      // assuming by contract internalPanel
      // is mandatory at index 0 (to simplify the demo)
      internalPanel,
      // then we have at least a panel per floor
      new Panel([new LightButton(Action.THIRD_FLOOR)]),
      new Panel([new LightButton(Action.SECOND_FLOOR)]),
      new Panel([new LightButton(Action.FIRST_FLOOR)]),
      new Panel([new LightButton(Action.GROUND_FLOOR)]),
      new Panel([new LightButton(Action.BASEMENT_FLOOR)])
    ];

    // the controller handles an elevator too
    const elevator = new Elevator;

    // all together
    const controller = new Controller(elevator, doors, panels);

    // render the scenario:
    //  on the left, panels per each floor
    //  in the middle, the elevator
    //  on the right, the internal panel
    bind(document.body)`
      <div class="external">
        ${panels.slice(1).map(createPanel)}
      </div>
      <div class="elevator" data-floor="${Action.asSymbol(0)}">
        <div class="left" />
        <div class="right" />
      </div>
      <div class="internal">
        ${createPanel(panels[0])}
      </div>`;

    // let's setup the UI for demo purpose
    const elevatorUI = document.body.querySelector('.elevator');

    // setup the elevator movement
    controller
      .on('elevator:moving', event => {
        // event.detail.status goes from 0 (basement) to top building floor
        const bottom = innerHeight * event.detail.status / (panels.length - 1);
        elevatorUI.style.bottom = `${bottom}px`;
      })
      .on('elevator:changed', event => {
        // update the internal panel with the current floor
        elevatorUI.dataset.floor =
          Action.asSymbol(event.currentTarget.state.floor);
      });

    // setup doors movement
    setupDoors(controller, {
      left: elevatorUI.querySelector('.left'),
      right: elevatorUI.querySelector('.right')
    });

    // it's all setup 🎉 let's move to the ground floor
    internalPanel.buttons[3].press();

    // define a button that reacts through the hardware
    // changing class per each light switch
    function createButton(button) {
      const press = () => button.press();
      const update = lightClass => wire(button)`
        <button
          class=${'light-button ' + lightClass}
          onclick=${press}
        >
          ${button.symbol}
        </button>`;
      button.on('lighton', () => update('on'));
      button.on('lightoff', () => update('off'));
      return update('off');
    }

    // define a panel with a list of one or more buttons
    function createPanel(panel) {
      return wire(panel)
        `<div class="panel">${
          panel.buttons.map(createButton)
        }</div>`;
    }

    // setup doors, opening and closing together
    function setupDoors(controller, doors) {
      controller.on('doors:moving', event => {
        // event.detail.status goes from 0 to 1, usable as percentage
        const position = -(doors.left.offsetWidth * event.detail.status);
        doors.left.style.left = `${position}px`;
        doors.right.style.right = `${position}px`;
      });
    }

  },

  // setup on DOMContentLoaded only once
  // if the event gets dispatched again nothing will happen
  // a safer elevator for modern browsers
  {once: true}
);