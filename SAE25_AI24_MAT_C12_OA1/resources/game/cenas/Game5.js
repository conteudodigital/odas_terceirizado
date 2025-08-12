import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import SoundManager from "../../js/library/managers/SoundManager.js";

export class Game5 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game5");
    this.controladorDeCenas = controladorDeCenas;

    this.narrationButtonPosition = { x: 250, y: 300 };
    this.startButtonPosition = { x: 650, y: 750 };

    this.currentNarracao = null;
  }

  create() {
    this.add.image(0, 0, "final-game").setOrigin(0);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    this.currentNarracao = SoundManager.play("CH_JU009");

    SoundManager.init(this);
    const btNarra = this.add
      .image(
        this.narrationButtonPosition.x,
        this.narrationButtonPosition.y,
        "narracao_icon"
      )
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    btNarra.on("pointerdown", () => {
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        this.currentNarracao.stop();
      }
      this.currentNarracao = SoundManager.play("CH_JU009");
    });

    this.events.on("shutdown", () => {
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        this.currentNarracao.stop();
      }
    });

    const btStart = new Button(this, {
      text: "INICIO",
      showIcon: false,
      colors,
    });

    btStart.setPosition(this.startButtonPosition.x, this.startButtonPosition.y);

    btStart.on("buttonClick", () => this.scene.start("Capa"));

    super.create();
  }
}

export default Game5;
