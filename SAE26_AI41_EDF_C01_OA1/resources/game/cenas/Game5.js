import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game5 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game5");
    this.controladorDeCenas = controladorDeCenas;

    this._bgKeys = ["dialogo3_1", "dialogo3_2"];
    this._bgIndex = 0;

    this.bgDialogo = null;
    this.btPrev = null;
    this.btNext = null;
    this.btComecar = null;
    this.btPular = null;

    this._inDialogo = true;
    this.loaded = false;

    this.DEPTH = {
      BG: -9999,
      UI: 10,
    };

    this.LAYOUT = {
      navY: 950,
      prevX: 315,
      nextX: 1150,
      pularYOffset: 40,
      pularXOffsetFromCenter: 785,
      comecarXCenter: 1025,
      comecarY: 900,
    };
  }

  create() {
    this.bgDialogo = this.add
      .image(0, 0, this._bgKeys[0])
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.BG);

    this.btPrev = this.add
      .image(this.LAYOUT.prevX, this.LAYOUT.navY, "Botao-Previous")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(this.DEPTH.UI)
      .setVisible(false);

    this.btNext = this.add
      .image(this.LAYOUT.nextX, this.LAYOUT.navY, "Botao-Next")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(this.DEPTH.UI)
      .setVisible(this._bgKeys.length > 1);

    this.btPrev.on("pointerdown", () => {
      if (!this._inDialogo) return;
      if (this._bgIndex > 0) {
        this._bgIndex--;
        this._applyBg();
      }
    });

    this.btNext.on("pointerdown", () => {
      if (!this._inDialogo) return;
      if (this._bgIndex < this._bgKeys.length - 1) {
        this._bgIndex++;
        this._applyBg();
      }
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colorsBlue = ColorManager.getColors(marca, ColorManager.BLUE);
    const colorsYellow = ColorManager.getColors(marca, ColorManager.YELLOW);

    this.btPular = new Button(this, {
      text: "PULAR",
      showIcon: false,
      colors: colorsYellow,
    });
    this.add.existing(this.btPular);
    this.btPular.setDepth(this.DEPTH.UI);
    this.btPular.x =
      this.bgDialogo.x +
      (this.bgDialogo.width - this.btPular.width) / 2 +
      this.LAYOUT.pularXOffsetFromCenter;
    this.btPular.y = this.LAYOUT.pularYOffset;

    this.btPular.on("buttonClick", () => {
      this.scene.start("Game6");
    });

    this.btComecar = new Button(this, {
      text: "COMEÇAR",
      showIcon: false,
      colors: colorsBlue,
    });
    this.add.existing(this.btComecar);
    this.btComecar.setDepth(this.DEPTH.UI);
    this.btComecar.setVisible(false);
    this.btComecar.x = this.LAYOUT.comecarXCenter - this.btComecar.width / 2;
    this.btComecar.y = this.LAYOUT.comecarY;

    this.btComecar.on("buttonClick", () => {
      this.scene.start("Game6");
    });

    this._applyBg();

    super.create();
  }

  _applyBg() {
    if (!this._inDialogo) return;

    this.bgDialogo.setTexture(this._bgKeys[this._bgIndex]);

    const isFirst = this._bgIndex === 0;
    const isLast = this._bgIndex === this._bgKeys.length - 1;

    this.btPrev.setVisible(!isFirst);
    this.btNext.setVisible(!isLast);
    this.btComecar.setVisible(isLast);
  }
}

export default Game5;
