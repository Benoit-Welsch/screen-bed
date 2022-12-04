import * as mocha from 'mocha';
import * as chai from 'chai';

import {Element, Color} from './Element';

const expect = chai.expect;
describe('Test Color obj', () => {
  const color = new Color(0, 0, 0);

  it('Should set a RGB value', () => {
    expect(color.setRGB(1, 2, 3)).to.deep.include({
      r: 1,
      g: 2,
      b: 3,
    });
  });

  it('Should make a deep copy', () => {
    expect(color.copy()).to.not.eq(color);
  });

  it('Should set a HEX based color', () => {
    expect(color.setHex('#ffffff')).to.deep.include({
      r: 255,
      g: 255,
      b: 255,
    });
  });

  it('Should combine two color together', () => {
    const color1 = color.setRGB(20, 20, 20);
    const color2 = new Color(78, 54, 98);

    const color3 = Color.combine(color1, color2);
    expect(color3).to.deep.include({
      r: 49,
      g: 37,
      b: 59,
    });
  });
});

describe('Test Element obj', () => {
  const element = new Element(64, 32);

  it('Should return the width and height', () => {
    expect(element.width).to.be.eq(64);
    expect(element.height).to.be.eq(32);
  });

  it('Should set and get a color', () => {
    const c = new Color(20, 20, 20);
    element.set(11, 22, c);

    expect(element.get(11, 22)).to.be.eq(c);
    expect(element[22][11]).to.be.eq(c);
    expect(element[11][22]).to.not.eq(c);
  });

  it('Should make a deep copy', () => {
    const e2 = element.copy();
    expect(element).to.not.eq(e2);
    expect(e2).to.be.eq(e2);
  });

  it('Should crop', () => {
    const c = new Color(20, 20, 20);
    const c2 = new Color(4, 4, 4);

    const startX = 10,
      startY = 10,
      stopX = 20,
      stopY = 30;

    element.set(startX, startX, c);
    element.set(startX + startX / 2, startX + startX / 2, c);
    element.set(stopX - 1, stopY - 1, c);
    element.set(startX - 1, startY - 1, c2);
    element.set(stopX, stopY, c2);

    element.crop(startX, startY, stopX, stopY);

    // Check lenght
    expect(element.width).to.be.eq(stopX - startX);
    expect(element.height).to.be.eq(stopY - startY);
    expect(element.width).to.not.eq(stopY - startY);
    expect(element.height).to.not.eq(stopX - startX);

    // Check if pixel are correct
    expect(element.get(0, 0)).to.be.eq(c);
    expect(element.get(5, 5)).to.be.eq(c);
    expect(element.get(element.width - 1, element.height - 1)).to.be.eq(c);

    // Check if color c2 is not present i new Element
    element.forEach(row => row.forEach(p => expect(p).to.not.eq(c2)));
  });

  // it('Should crop from center', () => {
  //   element.cropFromCenter(4, 4);
  //   expect(element.width).to.be.eq(4);
  //   expect(element.height).to.be.eq(4);
  // });
});
