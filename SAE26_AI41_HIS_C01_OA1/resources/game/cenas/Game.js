// game.js
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game");
    this.controladorDeCenas = controladorDeCenas;

    /** @type {string[]} */
    this._bgKeys = ["dialogo_intro", "dialogo_intro_1"];
    this._bgIndex = 0;

    /** @type {Phaser.GameObjects.Image|null} */ this.background = null;
    /** @type {Phaser.GameObjects.Image|null} */ this.btPrev = null;
    /** @type {Phaser.GameObjects.Image|null} */ this.btNext = null;

    this.loaded = false;

    this.LAYOUT = {
      navY: 950,
      prevX: 315,
      nextX: 1150,
      skipMargin: 175,
      skipY: 45,
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
      } else {
        this._skip();
      }
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const btPular = new Button(this, {
      text: "PULAR",
      showIcon: false,
      colors: colors,
    });
    this.add.existing(btPular);

    btPular.x =
      this.background.x +
      this.background.width -
      btPular.width / 2 -
      this.LAYOUT.skipMargin;
    btPular.y = this.LAYOUT.skipY;

    btPular.on("buttonClick", () => this._skip());

    this._applyBg();

    super.create(); // manter
  }

  _applyBg() {
    this.background.setTexture(this._bgKeys[this._bgIndex]);
    this.btPrev.setVisible(this._bgIndex > 0);
  }

  _skip() {
    this.scene.start("Game1");
  }
}

export default Game;
