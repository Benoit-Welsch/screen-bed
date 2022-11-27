import {ReadStream} from 'fs';
import {Pixel as FontPixel} from 'js-pixel-fonts';
import {PNG} from 'pngjs';

export class Screen {
  pixels: Pixel[][];

  constructor(w = 64, h = 32) {
    const row = [];
    for (let index = 0; index < h; index++) {
      const col = [];
      for (let index = 0; index < w; index++) {
        col.push(new Pixel(0, 0, 0));
      }
      row.push(col);
    }
    this.pixels = row;
  }

  get width(): number {
    return this.pixels[0].length;
  }

  get height(): number {
    return this.pixels.length;
  }

  set(x: number, y: number, pixel: Pixel) {
    if (y >= this.pixels.length || x >= this.pixels[0].length)
      throw new Error('Out of bounds');
    this.pixels[Math.round(y)][Math.round(x)] = pixel;
  }

  get(x: number, y: number) {
    return this.pixels[y][x];
  }

  wipe(startX = 0, startY = 0, endX = this.width, endY = this.height) {
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.get(x, y).off();
      }
    }
  }

  fill() {
    this.forEach(p => {
      p.setHex('#ffffff');
    });
  }

  insertPixel(pixels: Pixel[][], offsetX = 0, offsetY = 0) {
    pixels.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (
          offsetY + y >= this.pixels.length ||
          offsetX + x >= this.pixels[0].length
        )
          throw new Error('Out of bounds');
        this.set(offsetX + x, offsetY + y, pixel);
      });
    });
  }

  insertText(
    offsetX: number,
    offsetY: number,
    text: FontPixel[][],
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
  }

  forEach(
    f: (p: Pixel, rowIndex: number, columnIndex: number, id: number) => void
  ) {
    this.pixels.forEach((r, rowIndex) =>
      r.forEach((p: Pixel, columnIndex: number) =>
        f(
          p,
          rowIndex,
          columnIndex,
          rowIndex * this.pixels[0].length + columnIndex
        )
      )
    );
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
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;
    return this;
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
          const idx = (this.width * 0 + 0) << 2;
          console.log(this.data[idx + 3]);
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
