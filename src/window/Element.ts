import {ReadStream} from 'node:fs';
import {PNG} from 'pngjs';

export class Color {
  r: number;
  g: number;
  b: number;

  constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  setRGB(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  setHex(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) throw new Error('Invalid HEX color');
    this.r = parseInt(result[1], 16);
    this.g = parseInt(result[2], 16);
    this.b = parseInt(result[3], 16);
    return this;
  }

  copy() {
    return new Color(this.r, this.g, this.b);
  }

  static combine(c1: Color, c2: Color) {
    return new Color(
      Math.round((c1.r + c2.r) / 2),
      Math.round((c1.g + c2.g) / 2),
      Math.round((c1.b + c2.b) / 2)
    );
  }
}

export class Element extends Array<Array<Color>> {
  constructor(w: number, h: number) {
    super(h);
    for (let y = 0; y < h; y++) {
      const line = [];
      for (let x = 0; x < w; x++) {
        line.push(new Color(0, 0, 0));
      }
      this[y] = line;
    }
  }

  get width() {
    return this[0].length;
  }

  get height() {
    return this.length;
  }

  set(x: number, y: number, c: Color) {
    if (y >= this.length || x >= this[0].length)
      throw new Error('Out of bound');
    this[y][x] = c;
    return this;
  }

  get(x: number, y: number) {
    if (y >= this.length || x >= this[0].length)
      throw new Error('Out of bound');
    return this[y][x];
  }

  copy() {
    const copy = new Element(this.width, this.height);
    this.forEach((row, y) => {
      row.forEach((p, x) => copy.set(x, y, p));
    });
    return copy;
  }

  crop(startX: number, startY: number, stopX: number, stopY: number) {
    if (startX >= stopX || startY >= stopY)
      throw new Error('Invalid crop position');
    this.splice(stopY, this.width - stopY);
    this.splice(0, startY);
    this.forEach((c, i) => {
      this[i] = this[i].slice(startX, stopX);
    });
    return this;
  }

  cropFromCenter(w: number, h: number) {
    this.crop(
      (this.width - w) / 2,
      (this.height - h) / 2,
      (this.width + w) / 2,
      (this.height + h) / 2
    );
    const element = new Element(w, h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        element.set(
          x,
          y,
          this.get((this.width - w) / 2 + x, (this.height - h) / 2 + y)
        );
      }
    }
    return this;
  }

  static loadPNG(png: ReadStream) {
    return new Promise<Element>((resolve, reject) => {
      png
        .pipe(new PNG())
        .on('parsed', function () {
          const bg = new Element(this.width, this.height);
          for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
              const idx = (this.width * y + x) << 2;
              const r = this.data[idx];
              const g = this.data[idx + 1];
              const b = this.data[idx + 2];
              bg.set(x, y, new Color(r, g, b));
            }
          }
          resolve(bg);
        })
        .on('error', reject);
    });
  }
}