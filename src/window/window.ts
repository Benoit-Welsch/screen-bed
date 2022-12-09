import {Color, Element} from './Element';

type Layer = {
  x: number;
  y: number;
  element: Element;
};

export class Window extends Element {
  layer: Layer[] = [];

  constructor(w: number, h: number) {
    super(w, h, new Color(0, 0, 0));
  }

  addLayer(element: Element, layerPosition = -1, x = 0, y = 0) {
    const layer = {x, y, element};
    if (layerPosition === -1) {
      this.layer.push(layer);
    } else {
      this.layer.splice(layerPosition, 0, layer);
    }
    return this;
  }

  merge() {
    this.fillWith(new Color(0, 0, 0));
    this.layer.forEach(l => {
      this.insertIn(l.element, l.x, l.y);
    });
    return this;
  }

  combine() {
    this.layer.forEach(l => {
      l.element.forEach((row, y) => {
        row.forEach((p, x) => {
          this.set(x, y, Color.combine(p, this.get(x, y)));
        });
      });
    });
    return this;
  }
}
