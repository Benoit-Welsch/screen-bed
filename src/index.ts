import web from './web';
import {
  LedMatrix,
  GpioMapping,
  LedMatrixUtils,
  PixelMapperType,
} from 'rpi-led-matrix';
import {Time} from './window/time';

//web();

const matrix = new LedMatrix(
  {
    ...LedMatrix.defaultMatrixOptions(),
    rows: 32,
    cols: 64,
    hardwareMapping: GpioMapping.AdafruitHat,
    pixelMapperConfig: LedMatrixUtils.encodeMappers({
      type: PixelMapperType.U,
    }),
  },
  {
    ...LedMatrix.defaultRuntimeOptions(),
    gpioSlowdown: 2,
  }
);

const pixels = new Time();

pixels.run();

matrix.afterSync((mat, dt, t) => {
  pixels.screen.forEach((p, x, y) => {
    matrix.fgColor({r: p.r, g: p.g, b: p.b}).setPixel(x, y);
  });

  setTimeout(() => matrix.sync(), 0);
});

// Get it started
matrix.sync();
