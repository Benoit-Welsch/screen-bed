import {createReadStream} from 'fs';
import {Window} from '../window/window';
import {Color, Element} from '../window/Element';

export class Time extends Window {
  interval: NodeJS.Timeout | undefined;

  constructor() {
    super(64, 32);
    Element.loadPNG(createReadStream('./asset/bg/sakura-bg.png')).then(bg => {
      this.addLayer(bg, 0, 0, 0);
      const time = this.getTimeElement();
      this.addLayer(time, 1, 15, 7);
      this.merge();
      this.interval = setInterval(() => {
        this.layer[1].element = this.getTimeElement();
        this.merge();
      }, 1000);
    });
  }

  private getTimeElement() {
    const now = new Date();
    const addZero = (n: number) => (n < 10 ? '0' + n : n);

    const h = addZero(now.getHours());
    const m = addZero(now.getMinutes());

    return Element.fromString(h + ':' + m, new Color(8, 124, 124));
  }
}
