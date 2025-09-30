import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game4 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game4");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    /** @type {Phaser.GameObjects.Image | null} */
    this.backgroundBlur = null;
    /** @type {Phaser.GameObjects.Image | null} */
    this.modalAtv = null;
    /** @type {Button | null} */
    this.btAvancar = null;

    this._stage = 0;
  }

  create() {
    const background = this.add.image(0, 0, "bgGame").setOrigin(0, 0);
    this.backgroundBlur = background;

    const modal = this.add
      .image(0, 0, "modal_atv_feedback_atv3")
      .setOrigin(0, 0);
    this.modalAtv = modal;
    this._centerModal(modal);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.YELLOW);

    const btAvancar = new Button(this, {
      text: "AVANÇAR",
      showIcon: false,
      colors: colors,
    });
    this.btAvancar = btAvancar;
    this._placeButtonRelativeToModal(btAvancar, modal);

    btAvancar.on("buttonClick", () => {
      if (this._stage === 0) {
        this._swapModal("modal_atv_feedback_atv4");
        this._stage = 1;
      } else {
        this.scene.start("Game5");
      }
    });

    super.create(); // manter
  }

  /**
   * Centraliza o modal na tela.
   * @param {Phaser.GameObjects.Image} image
   */
  _centerModal(image) {
    image.x = (this.scale.width - image.width) / 2;
    image.y = (this.scale.height - image.height) / 2;
  }

  /**
   * Posiciona o botão abaixo (ou sobre a base) do modal.
   * Ajuste o offsetY conforme o layout do seu PNG.
   * @param {Button} button
   * @param {Phaser.GameObjects.Image} modal
   */
  _placeButtonRelativeToModal(button, modal) {
    const offsetY = -225; // como no seu exemplo; ajuste se necessário
    button.x = (this.scale.width - button.width) / 2;
    button.y = modal.y + modal.height + offsetY;
  }

  /**
   * Troca o modal atual por outro (instantâneo, sem tween)
   * @param {string} newKey chave da texture (ex.: "modal_atv_feedback_atv4")
   */
  _swapModal(newKey) {
    if (!this.modalAtv) return;

    this.modalAtv.destroy();

    const newModal = this.add.image(0, 0, newKey).setOrigin(0, 0);
    this.modalAtv = newModal;
    this._centerModal(newModal);

    if (this.btAvancar) {
      this._placeButtonRelativeToModal(this.btAvancar, newModal);

      this.children.bringToTop(this.btAvancar);
    }
  }
}

export default Game4;
