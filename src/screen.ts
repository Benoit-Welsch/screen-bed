import {ReadStream} from 'fs';
import {Pixel as FontPixel} from 'js-pixel-fonts';
import {PNG} from 'pngjs';

export class Screen extends Array<Array<Pixel>> {
  interval: NodeJS.Timeout | undefined;

  constructor(w = 64, h = 32) {
    super();
    for (let index = 0; index < h; index++) {
      const col = [];
      for (let index = 0; index < w; index++) {
        col.push(new Pixel(0, 0, 0));
      }
      this.push(col);
    }
  }

  get width(): number {
    return this[0].length;
  }

  get height(): number {
    return this.length;
  }

  set(x: number, y: number, color: Pixel) {
    if (y >= this.length || x >= this[0].length)
      throw new Error('Out of bounds');
    this[y][x] = color.copy();
  }

  get(x: number, y: number) {
    return this[y][x];
  }

  crop(startX = 0, startY = 0, endX = this.width, endY = this.height) {
    this.splice(startY, endY);
    this.map(row => row.splice(startX, endX));
    return this;
  }

  wipe(startX = 0, startY = 0, endX = this.width, endY = this.height) {
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.set(x, y, new Pixel());
      }
    }
  }

  // fill(color: Pixel) {
  //   this.forEach((_, x, y) => {
  //     this.set(x, y, color);
  //   });
  // }

  insertPixel(pixels: Pixel[][], offsetX = 0, offsetY = 0) {
    pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (offsetY + y >= this.length || offsetX + x >= this[0].length)
          throw new Error('Out of bounds');
        this.set(offsetX + x, offsetY + y, pixel);
      });
    });
    return this;
  }

  insertText(
    text: FontPixel[][],
    offsetX: number,
    offsetY: number,
    color: Pixel
  ) {
    text.forEach((row, y) =>
      row.forEach((pixel, x) => {
        if (pixel)
          this.set(
            x + offsetX,
            y + offsetY,
            new Pixel(color.r, color.g, color.b, color.a)
          );
      })
    );
    return this;
  }

  forEachFlat(
    f: (p: Pixel, rowIndex: number, columnIndex: number, id: number) => void
  ) {
    this.forEach((r, rowIndex) =>
      r.forEach((p: Pixel, columnIndex: number) =>
        f(p, rowIndex, columnIndex, rowIndex * this[0].length + columnIndex)
      )
    );
  }

  setInterval(f: (screen: this) => void, time: number) {
    f(this);
    this.interval = setInterval(() => {
      f(this);
    }, time);
  }
}

export class Pixel {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
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

  off() {
    this.a = 0;
    return this;
  }

  copy() {
    return new Pixel(this.r, this.g, this.b, this.a);
  }

  static loadSVG(_svg: string) {
    throw new Error('TODO : NOT IMPLEMENTED');
  }

  static loadPNG(png: ReadStream) {
    return new Promise<Screen>((resolve, reject) => {
      png
        .pipe(new PNG())
        .on('parsed', function () {
          const bg = new Screen(this.width, this.height);
          for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
              const idx = (this.width * y + x) << 2;
              const r = this.data[idx];
              const g = this.data[idx + 1];
              const b = this.data[idx + 2];
              const a = this.data[idx + 3];
              bg.set(x, y, new Pixel(r, g, b, a < 20 ? 1 : a / 255));
            }
          }
          resolve(bg);
        })
        .on('error', reject);
    });
  }
}

export default Screen;
