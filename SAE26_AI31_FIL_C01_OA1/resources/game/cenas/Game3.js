import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";
import { Narrador } from "../../js/library/components/Narrador.js";

export class Game3 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game3"); // Passa o nome da cena para a classe base
    this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
    this.loaded = false;

    /** @type {Phaser.GameObjects.Image | null} */
    this.backgroundBlur = null;
    /** @type {Phaser.GameObjects.Image | null} */
    this.modalAtv = null;
    /** @type {Button | null} */
    this.btAvancar = null;
    /** @type {Narrador | null} */
    this.narrador = null;
  }

  create() {
    const background = this.add.image(0, 0, "backgroundBlur").setOrigin(0, 0);
    this.backgroundBlur = background;

    const modal_atv_feedback_atv2 = this.add
      .image(0, 0, "modal_atv_feedback_atv2")
      .setOrigin(0, 0);

    this.modalAtv = modal_atv_feedback_atv2;

    modal_atv_feedback_atv2.x =
      (this.scale.width - modal_atv_feedback_atv2.width) / 2;
    modal_atv_feedback_atv2.y =
      (this.scale.height - modal_atv_feedback_atv2.height) / 2;

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const btAvancar = new Button(this, {
      text: "AVANÇAR",
      showIcon: false,
      colors: colors,
    });
    this.btAvancar = btAvancar;

    btAvancar.x = background.x + (background.width - btAvancar.width) / 2;
    btAvancar.y =
      modal_atv_feedback_atv2.y + modal_atv_feedback_atv2.height - 350;

    const legendas = [
      "ÁS VEZES, ELA ESTÁ EM UM MUSEU. OUTRAS \nVEZES, APARECE NO MURO DA SUA RUA.",
      "A ARTE PODE ESTAR EM UM \nDESENHO, UMA DANÇA OU UMA MÚSICA.",
      "A ARTE PODE FAZER VOCÊ SENTIR ALGUMA \nCOISA ESPECIAL... O QUE IMPORTA MESMO É O \nA JEITO COMO A GENTE OLHA PARA ELA.",
      "A ARTE PODE SER COLORIDA, CRIATIVA, \nDIFERENTE E CHEIA DE IMAGINAÇÃO.",
      "CADA PESSOA SE EXPRESSA DE UM JEITO, E O \nMAIS IMPORTANTE É O QUE A ARTE NOS FAZ \nSENTIR E PENSAR.",
      "AGORA, VAMOS CRIAR A NOSSA PRÓPRIA OBRA \nDE ARTE?",
    ];

    const narracoes = [];

    btAvancar.on("buttonClick", () => {
      this._fecharModal();

      if (this.narrador && this.narrador.destroy) {
        this.narrador.destroy();
      }

      this.narrador = new Narrador(
        this,
        legendas,
        narracoes,
        null,
        null,
        { v1: "personagem-ana-v2", v2: "personagem-ana-v1" },
        true,
        "textframe-Ana",
        "Game4"
      );
    });

    super.create(); // manter
  }

  _fecharModal() {
    if (this.btAvancar) {
      this.btAvancar.off("buttonClick");
      this.btAvancar.destroy();
      this.btAvancar = null;
    }
    if (this.modalAtv) {
      this.modalAtv.destroy();
      this.modalAtv = null;
    }
  }
}

export default Game3;
