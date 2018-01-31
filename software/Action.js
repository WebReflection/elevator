// every button has a meaning
const symbols = {
  ALARM: '🔔',
  CLOSE_DOORS: '▷│◁',
  OPEN_DOORS: '◁│▷',
  BASEMENT_FLOOR: 'S',
  GROUND_FLOOR: 'G',
  FIRST_FLOOR: '1',
  SECOND_FLOOR: '2',
  THIRD_FLOOR: '3'
  // ... and so on ...
};

// and every meaning could be a floor
const proto = {
  asFloor(symbol) {
    switch (symbol) {
      // floor simply cover a range, from 0 to X
      case symbols.BASEMENT_FLOOR: return 0;
      case symbols.GROUND_FLOOR:   return 1;
      case symbols.FIRST_FLOOR:    return 2;
      case symbols.SECOND_FLOOR:   return 3;
      case symbols.THIRD_FLOOR:    return 4;
      default: return -1;
    }
  },
  asSymbol(floor) {
    for (const key in this) {
      if (this.asFloor(this[key]) === floor) {
        return this[key];
      }
    }
  }
};

export default Object.freeze(Object.setPrototypeOf(symbols, proto));
