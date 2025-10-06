import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game5 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game5");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    /** @type {Phaser.GameObjects.Image} */ this.background = null;
    /** @type {Phaser.GameObjects.Image} */ this.popup = null;
    /** @type {Phaser.GameObjects.Image} */ this.btClosePopUp = null;
    /** @type {Button} */ this.btAvancar = null;

    /** @type {string[]} */
    this._popupKeys = ["popUpIntro4_1", "popUpIntro4_2", "popUpIntro4_3"];
    /** @type {number} */
    this._popupIndex = 0;

    this._BTN_ADV_OFFSET_X = -195;
    this._BTN_ADV_OFFSET_Y = -175;

    this._CLOSE_OFFSET_X = -100;
    this._CLOSE_OFFSET_Y = 30;
  }

  create() {
    this.background = this.add
      .image(0, 0, "bgIntro4")
      .setOrigin(0, 0)
      .setDepth(0)
      .setScrollFactor(0);

    this.popup = this.add
      .image(0, 0, this._popupKeys[this._popupIndex])
      .setOrigin(0.5)
      .setDepth(2)
      .setScrollFactor(0);

    this.btClosePopUp = this.add
      .image(0, 0, "button_fechar")
      .setOrigin(0.5)
      .setDepth(5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    this.btAvancar = new Button(this, {
      text: "AVANÇAR",
      showIcon: true,
      colors,
    });
    this.add.existing(this.btAvancar);
    this.btAvancar.setDepth(5);
    this.btAvancar.setScrollFactor?.(0);

    this.btClosePopUp.on("pointerup", () => this._goToGame4());
    this.btAvancar.on("buttonClick", () => this._nextPopupOrFinish());

    this.scale?.on?.("resize", this.updateLayout, this);
    this.updateLayout();

    super.create();
  }

  _nextPopupOrFinish() {
    if (this._popupIndex < this._popupKeys.length - 1) {
      this._popupIndex++;
      this._applyPopupTexture();
      this.updateLayout();
    } else {
      this._goToGame4();
    }
  }

  _goToGame4() {
    this.scene.start("Game6");
  }

  _applyPopupTexture() {
    const key = this._popupKeys[this._popupIndex];
    if (this.popup?.setTexture) {
      this.popup.setTexture(key);
      if (this.popup.width === 0 || this.popup.height === 0) {
        this.popup.setSize(this.popup.displayWidth, this.popup.displayHeight);
      }
    }
  }

  updateLayout() {
    if (!this.popup) return;

    const cam = this.cameras.main;
    const cx = cam.midPoint.x;
    const cy = cam.midPoint.y;

    this.popup.setPosition(cx, cy);

    const pw = this.popup.displayWidth || this.popup.width || 0;
    const ph = this.popup.displayHeight || this.popup.height || 0;

    if (this.btAvancar && this.btAvancar.visible) {
      this.btAvancar.x = cx + this._BTN_ADV_OFFSET_X;
      this.btAvancar.y = cy + ph / 2 + this._BTN_ADV_OFFSET_Y;
    }

    if (this.btClosePopUp && this.btClosePopUp.visible) {
      this.btClosePopUp.x =
        cx +
        pw / 2 +
        this._CLOSE_OFFSET_X +
        (this.btClosePopUp.displayWidth || 0) / 2;
      this.btClosePopUp.y =
        cy -
        ph / 2 +
        this._CLOSE_OFFSET_Y +
        (this.btClosePopUp.displayHeight || 0) / 2;
    }
  }

  shutdown() {
    this.scale?.off?.("resize", this.updateLayout, this);
  }

  destroy() {
    this.shutdown();
    super.destroy();
  }
}

export default Game5;
