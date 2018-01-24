import HyperTarget from '../utils/HyperTarget.js';

export default class Panel extends HyperTarget {
  constructor(buttons) {
    super();
    this.queue = new Set;
    this.buttons = buttons.map(asButtonListener, this);
  }

  handleEvent(event) {
    this[`on${event.type}`](event);
    this.signal(new Event('change'));
  }

  onactivate(event) {
    this.queue.add(event.currentTarget);
  }

  ondeactivate(event) {
    this.queue.delete(event.currentTarget);
  }
}

function asButtonListener(button) {
  button.on('activate', this);
  button.on('deactivate', this);
  return button;
}
