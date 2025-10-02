import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game13 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game13");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.UI_DEPTH = 500;
    this.MODAL_DEPTH = 100000;
    this.OVERLAY_ALPHA = 0.85;

    this.overlay = null;
    this.modalConcluido = null;
  }

  create() {
    const background = this.add.image(0, 0, "saldofinal").setOrigin(0, 0);

    const marca = ColorManager.getCurrentMarca(this);
    const colorsBlue = ColorManager.getColors(marca, ColorManager.BLUE);

    const btFinalizar = new Button(this, {
      text: "FINALIZAR",
      showIcon: false,
      colors: colorsBlue,
    });
    this.add.existing(btFinalizar);
    btFinalizar.setDepth(this.UI_DEPTH);

    btFinalizar.x =
      background.x + (background.width - btFinalizar.width) / 2 + 465;
    btFinalizar.y = 700;

    this.createConcluidoModal(background, colorsBlue);

    btFinalizar.on("buttonClick", () => {
      this.showConcluidoModal();
    });

    super.create();
  }

  createConcluidoModal(bg, btnColors) {
    const w = Math.max(bg.displayWidth, this.cameras.main.width);
    const h = Math.max(bg.displayHeight, this.cameras.main.height);

    this.overlay = this.add
      .rectangle(0, 0, w, h, 0x000000, this.OVERLAY_ALPHA)
      .setOrigin(0, 0)
      .setDepth(this.MODAL_DEPTH)
      .setScrollFactor(0)
      .setVisible(false)
      .setInteractive({ useHandCursor: false });

    this.modalConcluido = this.add
      .container(0, 0)
      .setDepth(this.MODAL_DEPTH + 1)
      .setScrollFactor(0)
      .setVisible(false);

    const cx = bg.x + bg.displayWidth / 2;
    const cy = bg.y + bg.displayHeight / 2;

    const imgModal = this.add.image(cx, cy, "modal_concluido").setOrigin(0.5);
    this.modalConcluido.add(imgModal);

    const btInicio = new Button(this, {
      text: "INÍCIO",
      showIcon: false,
      colors: btnColors,
    });
    this.add.existing(btInicio);
    this.modalConcluido.add(btInicio);

    btInicio.x = imgModal.x - 110;
    btInicio.y = imgModal.y + imgModal.displayHeight * 0.2;

    btInicio.on("buttonClick", () => {
      this.scene.start("Capa");
    });
  }

  showConcluidoModal() {
    this.overlay?.setVisible(true);
    this.modalConcluido?.setVisible(true);

    this.input.setTopOnly(true);
  }

  hideConcluidoModal() {
    this.modalConcluido?.setVisible(false);
    this.overlay?.setVisible(false);
    this.input.setTopOnly(false);
  }
}

export default Game13;
