import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game");
    this.controladorDeCenas = controladorDeCenas;

    /** @type {string[]} */
    this._bgKeys = ["bgDialogo1", "bgDialogo2"];
    this._bgIndex = 0;

    /** @type {Phaser.GameObjects.Image|null} */ this.background = null;
    /** @type {Phaser.GameObjects.Image|null} */ this.btPrev = null;
    /** @type {Phaser.GameObjects.Image|null} */ this.btNext = null;
    /** @type {Button|null} */ this.btComecar = null;

    this.loaded = false;

    this.LAYOUT = {
      navY: 950,
      prevX: 315,
      nextX: 1150,
      skipMargin: 175,
      skipY: 45,
      comecarX: 1025,
      comecarY: 895,
    };

    this.SFX = { click: "click", volume: 0.6 };
  }

  playS(key, opts = {}) {
    try {
      this.sound.play(key, { volume: this.SFX.volume, ...opts });
    } catch (e) {}
  }

  create() {
    this.background = this.add
      .image(0, 0, this._bgKeys[this._bgIndex])
      .setOrigin(0, 0);

    this.btPrev = this.add
      .image(this.LAYOUT.prevX, this.LAYOUT.navY, "Botao-Previous")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.btNext = this.add
      .image(this.LAYOUT.nextX, this.LAYOUT.navY, "Botao-Next")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    [this.btPrev, this.btNext].forEach((btn) => {
      btn.on("pointerover", () => btn.setScale(1.04));
      btn.on("pointerout", () => btn.setScale(1));
    });

    this.btPrev.on("pointerdown", () => {
      this.playS(this.SFX.click);
      if (this._bgIndex > 0) {
        this._bgIndex--;
        this._applyBg();
      }
    });

    this.btNext.on("pointerdown", () => {
      this.playS(this.SFX.click);
      if (this._bgIndex < this._bgKeys.length - 1) {
        this._bgIndex++;
        this._applyBg();
      }
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.YELLOW);
    const colors2 = ColorManager.getColors(marca, ColorManager.BLUE);

    const btPular = new Button(this, {
      text: "SKIP",
      showIcon: false,
      colors: colors2,
    });
    this.add.existing(btPular);

    btPular.x =
      this.background.x +
      this.background.width -
      btPular.width / 2 -
      this.LAYOUT.skipMargin;
    btPular.y = this.LAYOUT.skipY;

    btPular.on("buttonClick", () => {
      this.playS(this.SFX.click);
      this._goNextScene();
    });

    this.btComecar = new Button(this, {
      text: "GO",
      showIcon: false,
      colors: colors,
    });
    this.add.existing(this.btComecar);

    this.btComecar.x = this.LAYOUT.comecarX;
    this.btComecar.y = this.LAYOUT.comecarY;
    this.btComecar.setVisible(false);

    this.btComecar.on("buttonClick", () => {
      this.playS(this.SFX.click);
      this._goNextScene();
    });

    this._applyBg();

    super.create();
  }

  _applyBg() {
    this.background.setTexture(this._bgKeys[this._bgIndex]);

    const isFirst = this._bgIndex === 0;
    const isLast = this._bgIndex === this._bgKeys.length - 1;

    this.btPrev.setVisible(!isFirst);
    this.btNext.setVisible(!isLast);
    this.btComecar.setVisible(isLast);

    if (isLast) {
      this.btComecar.setPosition(this.LAYOUT.comecarX, this.LAYOUT.comecarY);
    }
  }

  _goNextScene() {
    this.scene.start("Game1");
  }
}

export default Game;
