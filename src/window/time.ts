import {renderPixels, fonts} from 'js-pixel-fonts';
import Screen, {Pixel} from '../screen';
import {createReadStream} from 'fs';
import {Window} from './window';

export class Time extends Window {
  screen = new Screen();

  constructor() {
    super();
    Pixel.loadPNG(createReadStream('./asset/bg/sakura-bg.png')).then(bg => {
      this.screen.insertPixel(bg);
    });
  }

  run() {
    // Get time and update screen
    this.screen.setInterval(function (self) {
      const now = new Date();
      const addZero = (n: number) => (n < 10 ? '0' + n : n);

      const h = addZero(now.getHours());
      const m = addZero(now.getMinutes());

      const time = renderPixels(h + ':' + m, fonts.sevenPlus);
      self.insertText(time, 15, 7, new Pixel(8, 124, 124));
    }, 1000);
  }
}
