import Screen from "../screen";

export class Window {
  screen: Screen;
  layer = {
    bg: new Screen(),
    time: new Screen(),
  };
  constructor() {
    this.screen = new Screen();
  }
}
