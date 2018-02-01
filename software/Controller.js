import Action from './Action.js';
import SignalTarget from './SignalTarget.js';

import Doors from '../hardware/Doors.js';
import LightButton from '../hardware/LightButton.js';

// private properties are handled by this WeakMap
const privates = new WeakMap;

// trap utilities to avoid external
// interferences/polyfills/pollution
const {assign, freeze} = Object;

// a controller is in charge of orchestrating
// the elevator functionality as a whole.
export default class Controller extends SignalTarget {

  constructor(elevator, doors, panels) {
    super();

    // let's assume by contract doorsPanel
    // is mandatory at index 0
    const floor = Math.min.apply(
      Math,
      panels[0].buttons
                .filter(isFloor)
                .map(Action.asFloor)
    );

    // store private variables
    privates.set(this, {
      doors,
      elevator,
      panels,
      queue: [],
      state: {floor, moving: false},
      timer: 0
    });

    // listen to all panels buttons
    panels.forEach(addPanelPress, this);

    // listen to doors too and propagate events
    doors
      .on('changed', this)
      .on('changed', propagate(this, 'doors'))
      .on('moving', propagate(this, 'doors'));

      // same goes for the elevator
    elevator
      .on('changed', this)
      .on('changed', propagate(this, 'elevator'))
      .on('moving', propagate(this, 'elevator'));

  }

  // a state is exposed as read-only (unique) object
  get state() {
    return freeze(assign({}, privates.get(this).state));
  }

  // every event should eventually clear the timer
  // that scheduled doors closing and next action
  // this is why handleEvent is redefined,
  // to intercept all possible registered events.
  handleEvent(event) {
    const info = privates.get(this);

    // clear any waiting timer
    if (info.timer) {
      clearTimeout(info.timer);
      info.timer = 0;
    }

    // then analyze the action
    switch (event.type) {
      case 'press':
        this.onButtonPress(event);
        break;
      case 'changed':
        if (event.currentTarget === info.doors) {
          this.onDoorsChanged(event);
        } else {
          this.onElevatorChanged(event);
        }
        break;
    }
  }

  onButtonPress(event) {
    const button = event.detail;
    const info = privates.get(this);
    // if the button is about changing level/floor
    if (isFloor(button)) {
      // find out which one
      const floor = Action.asFloor(button.symbol);
      // be sure it's not already in the queue
      if (!info.queue.includes(floor)) {
        // in such case push it through
        info.queue.push(floor);
        // light eah button related to this floor on
        switchButton(info.panels, button.symbol, LightButton.ON);
        // verify doors state
        switch (info.doors.status) {
          // if opened, close them and let the event follow up
          case Doors.OPENED:
            info.doors.close();
            break;
          // if the lift has closed doors
          case Doors.CLOSED:
            // and the elevator is not moving
            if (!info.state.moving) {
              // signal a doors change to trigger doors close logic
              info.doors.signal('changed');
            }
            break;
        }
      }
    } else {
      // turn on the light for an instant
      if (button instanceof LightButton) {
        button.switch(LightButton.ON);
        setTimeout(() => button.switch(LightButton.OFF), 300);
      }
      // find out what to do
      switch (button.symbol) {
        case Action.ALARM:
          alert('ALARM ALARM');
          break;
        // if it's about opening doors
        case Action.OPEN_DOORS:
          // in case these are already opened
          if (info.doors.status === Doors.OPENED) {
            // prepare for the next action, if any
            prepareNextAction(info);
          }
          // otherwise if the elevator is not moving
          else if (!info.state.moving) {
            // ask to open doors
            info.doors.open();
          }
          break;
        // if it's about clsing doors
        case Action.CLOSE_DOORS:
          // just invoke it and let the rest
          // of the events flow
          info.doors.close();
          break;
      }
    }
  }

  onDoorsChanged(event) {
    const doors = event.currentTarget;
    const info = privates.get(this);
    switch (doors.status) {
      case Doors.OPENED:
        prepareNextAction(info);
        break;
      case Doors.CLOSED:
        if (info.queue.length) {
          const level = info.queue[0];
          if (level === Action.asFloor(info.state.floor.symbol)) {
            info.queue.shift();
            info.doors.open();
          } else {
            info.state.moving = true;
            info.elevator.reach(level);
          }
        }
        break;
    }
  }

  onElevatorChanged(event) {
    const info = privates.get(this);
    info.state.moving = false;
    info.state.floor = info.queue.shift();
    switchButton(
      info.panels,
      Action.asSymbol(info.state.floor),
      LightButton.OFF
    );
    info.doors.open();
  }

}

function addPanelPress(panel) {
  // attach all panel events to this controller
  panel.on('press', this);
}

function isFloor(button) {
  // true if a button is associated to a floor
  return Action.asFloor(button.symbol) !== -1;
}

function prepareNextAction(info) {
  // if there is something to do
  if (info.queue.length) {
    // setup a timer to do it once doors are closed
    info.timer = setTimeout(() => info.doors.close(), 1000);
  }
}

function propagate(controller, prefix) {
  // re-signal events for UI sake. Pass parts around too
  return event => {
    controller.signal(`${prefix}:${event.type}`, event.currentTarget);
  };
}

// find every button of every panel
// that is related to a certain symbol
// and switch its state on or off
function switchButton(panels, symbol, state) {
  for (const panel of panels) {
    for (const button of panel.buttons) {
      if (button.symbol === symbol) {
        if (button instanceof LightButton) {
          button.switch(state);
        }
      }
    }
  }
}
