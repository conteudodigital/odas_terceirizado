import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";

export class Capa extends BaseCena {
  constructor(controladorDeCenas) {
    super("Capa");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;
    this.currentNarracao = null;
  }

  create() {
    const background = this.add.image(0, 0, "bg-capa").setOrigin(0, 0);

    const titulo = this.add.image(0, 0, "titulo").setOrigin(0, 0);
    titulo.x = background.x + (background.width - titulo.width) / 2;
    titulo.y = 320;

    const btNarra = this.add
      .image(0, 0, "narracao_icon")
      .setInteractive({ useHandCursor: true });
    btNarra.setOrigin(0.5);
    btNarra.x = titulo.x + titulo.width / 2;
    btNarra.y = titulo.y - 60;

    btNarra.on("pointerdown", () => {
      if (!this.currentNarracao) {
        this.currentNarracao = this.sound.add("NA001");
      }
      if (this.currentNarracao.isPlaying) {
        this.currentNarracao.stop();
      }
      this.currentNarracao.play();
    });

    this.events.on("shutdown", () => {
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        this.currentNarracao.stop();
      }
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const btIniciar = new Button(this, {
      text: "INICIAR",
      showIcon: true,
      colors,
    });

    btIniciar.x = background.x + (background.width - btIniciar.width) / 2;
    btIniciar.y = 782;

    btIniciar.on("buttonClick", () => this.controladorDeCenas.proximaCena());

    super.create();
  }
}
