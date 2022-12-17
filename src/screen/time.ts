import {createReadStream} from 'fs';
import {Window} from '../window/window';
import {Color, Element} from '../window/Element';

export class Time extends Window {
  interval: NodeJS.Timeout | undefined;
  bg = new Color(0, 0, 0);

  constructor() {
    super(64, 32);

    const fn = () => {
      const time = this.getTimeElement().scale(2);
      this.fillWith(this.bg);
      this.insertIn(
        time,
        this.width / 2 - time.width / 2,
        this.height / 2 - time.height / 2
      );
    };

    fn();

    this.interval = setInterval(() => {
      fn();
    }, 1000);
  }

  private getTimeElement() {
    const now = new Date();
    const addZero = (n: number) => (n < 10 ? '0' + n : n);

    const h = addZero(now.getHours());
    const m = addZero(now.getMinutes());

    return Element.fromString(h + ':' + m, new Color(8, 124, 124));
  }
}

export default Time;
