import EventTarget from '../utils/EventTarget.js';

export default class Panel extends EventTarget {
  constructor(buttons) {
    super();
    this.queue = new Set;
    this.buttons = buttons.map(asButtonListener, this);
  }

  handleEvent(event) {
    this[`on${event.type}`](event);
    this.dispatchEvent(new Event('change'));
  }

  onactivate(event) {
    this.queue.add(event.currentTarget);
  }

  ondeactivate(event) {
    this.queue.delete(event.currentTarget);
  }
}

function asButtonListener(button) {
  button.addEventListener('activate', this);
  button.addEventListener('deactivate', this);
  return button;
}
