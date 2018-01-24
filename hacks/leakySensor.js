// make the target class available
import Doors from '../hardware/Doors.js';

// override WeakMap#set
const set = WeakMap.prototype.set;
Object.defineProperty(
  WeakMap.prototype,
  'set',
  {value(self, data) {
    if (self instanceof Doors) {
      leak = data.sensor;
    }
    return set.call(this, self, data);
  }}
);

// and exports the leaky sensor
export let leak;
