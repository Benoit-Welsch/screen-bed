import Screen, {Pixel} from '../screen';
import {renderPixels, fonts} from 'js-pixel-fonts';
import {createReadStream} from 'fs';

class Window {
  screen: Screen;
  constructor() {
    this.screen = new Screen();
  }
}

export class Time extends Window {
  constructor() {
    super();
    Pixel.loadPNG(createReadStream('./asset/bg/sakura-bg.png')).then(bg => {
      this.screen.insertPixel(bg.pixels, 0, 0);
    });
  }

  run() {
    setInterval(() => {
      const now = new Date();
      const addZero = (n: number) => (n < 10 ? '0' + n : n);

      const h = addZero(now.getHours());
      const m = addZero(now.getMinutes());

      const time = renderPixels(h + ':' + m, fonts.sevenPlus);
      this.screen.wipe(15, 7, time[0].length + 15, time.length + 7);
      this.screen.insertText(15, 7, time, new Pixel(8, 124, 124));
    }, 1000);
  }
}
