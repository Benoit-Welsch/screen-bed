import {LedMatrix, GpioMapping} from 'rpi-led-matrix';
import {Time} from './time';

const matrix = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 32,
    cols: 64,
    hardwareMapping: GpioMapping.AdafruitHat,
    brightness: 75,
    limitRefreshRateHz: 75,
  },
  {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 2,
  }
);

const time = new Time();

matrix.afterSync(() => {
  time.forEach((row, y) => {
    row.forEach((p, x) => {
      matrix.fgColor({r: p.r, g: p.g, b: p.b}).setPixel(x, y);
    });
  });

  setTimeout(() => matrix.sync(), 0);
});

// Get it started
matrix.sync();
