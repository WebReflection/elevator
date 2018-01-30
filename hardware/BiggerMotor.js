import Motor from './Motor.js';

// an Elevator Motor is just a Motor
// with more power. In this case just more speed.
export default class BiggerMotor extends Motor {
  constructor() {
    super().speed = 0.05;
  }
}
