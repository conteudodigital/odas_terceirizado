import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Narrador } from "../../js/library/components/Narrador.js";
import { NarradorWImg } from "../../js/library/components/NarradorWImg.js";
import SoundManager from "../../js/library/managers/SoundManager.js";

export class Game3 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game3");
    this.controladorDeCenas = controladorDeCenas;
  }

  create() {
    this.add.image(0, 0, "bg-dialogo").setOrigin(0);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    super.create();

    SoundManager.play("feedback-positivo");

    const sub1 = [
      "Muito bem! Agora que temos as quantidades de folhas organizadas por cor, É HORA DE MONTAR NOSSO GRÁFICO!",
    ];

    const dialogs = ["CH_JU007"];

    const onFinishParte1 = () => {
      this.iniciarNarracaoComImagens(colors);
    };

    this.dialog1 = new Narrador(
      this,
      sub1,
      dialogs,
      colors,
      onFinishParte1,
      {
        v1: "personagem-ju-v1",
        v2: "personagem-ju-v2",
      },
      false,
      "textframe-Ju"
    );
  }

  iniciarNarracaoComImagens(colors) {
    const sequence = [
      {
        texto: "Para isso, confira na tabela a quantidade de folhas.",
        imagem: "grafico-exemplo",
        pos: { x: 300, y: 375 },
        delay: 0,
      },
      {
        texto:
          "Para isso, confira na tabela a quantidade de folhas. Depois, clique em editar.",
        imagem: "grafico-exemplo2",
        pos: { x: 750, y: 275 },
        delay: 5000,
      },
      {
        texto:
          "Para isso, confira na tabela a quantidade de folhas. Depois, clique em editar. E adicione a quantidade que cada amigo tem!",
        imagem: "grafico-exemplo3",
        pos: { x: 1100, y: 350 },
        delay: 7000,
      },
    ];

    const onFinishParte2 = () => {
      console.log("NarradorWImg finalizado!");
      this.scene.start("Game4");
    };

    new NarradorWImg(
      this,
      sequence,
      "CH_JU008",
      colors,
      onFinishParte2,
      {
        v1: "personagem-ju-v1",
        v2: "personagem-ju-v1",
      },
      true,
      "textframe-Ju"
    );
  }
}

export default Game3;
