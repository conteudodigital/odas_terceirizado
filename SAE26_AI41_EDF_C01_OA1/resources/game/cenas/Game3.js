import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game3 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game3");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.DEPTH = {
      BG: -9999,
      UI: 10,
    };
  }

  create() {
    const background = this.add
      .image(0, 0, "dialogo2_1")
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.BG);

    const marca = ColorManager.getCurrentMarca(this);
    const colorsBlue = ColorManager.getColors(marca, ColorManager.BLUE);
    const colorsYellow = ColorManager.getColors(marca, ColorManager.YELLOW);

    const btIniciar = new Button(this, {
      text: "COMEÇAR",
      showIcon: false,
      colors: colorsBlue,
    });
    this.add.existing(btIniciar);
    btIniciar.setDepth(this.DEPTH.UI);

    btIniciar.x = background.x + (background.width - btIniciar.width) / 2 + 50;
    btIniciar.y = 884;

    btIniciar.on("buttonClick", () => {
      this.scene.start("Game4");
    });

    const btPular = new Button(this, {
      text: "PULAR",
      showIcon: false,
      colors: colorsYellow,
    });
    this.add.existing(btPular);
    btPular.setDepth(this.DEPTH.UI);

    btPular.x = background.x + (background.width - btPular.width) / 2 + 785;
    btPular.y = 40;

    btPular.on("buttonClick", () => {
      this.scene.start("Game4");
    });

    super.create();
  }
}

export default Game3;
