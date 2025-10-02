import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Narrador } from "../../js/library/components/Narrador.js";

export class Game11 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game11"); // Passa o nome da cena para a classe base
    this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
    this.loaded = false;
  }

  create() {
    const background = this.add.image(0, 0, "bgGame").setOrigin(0, 0);

    const legendas = [
      "SOME OS VALORES DOS TRÊS SERVIÇOS PARA \nDESCOBRIR QUANDO SERÁ DEPOSITADO NA CONTA \nDA SRA. PAULA.",
    ];

    const narracoes = [];

    this.narrador = new Narrador(
      this,
      legendas,
      narracoes,
      null,
      null,
      { v1: "personagem_LucaV1", v2: "personagem_LucaV2" },
      false,
      "textframe-luca",
      "Game12",
      {
        prevConfig: { key: "Botao-Previous" },
        nextConfig: { key: "Botao-Next" },
        avancarConfig: { text: "CONTINUAR" },
      }
    );

    super.create(); // manter essa linha pois o super.create() é necessário para que a cena seja criada corretamente. Caso tenha próximas cenas também deve ser chamado o super.create().
  }
}

export default Game11;
