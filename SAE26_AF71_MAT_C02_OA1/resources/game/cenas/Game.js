import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Narrador } from "../../js/library/components/Narrador.js";

export class Game extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game"); // Passa o nome da cena para a classe base
    this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
    this.loaded = false;
  }

  create() {
    const background = this.add.image(0, 0, "bgGame").setOrigin(0, 0);

    const legendas = [
      "VOCÊ FOI CONTRATADO COMO CONSULTOR \nFINANCEIRO DA SRA. PAULA.",
      "ELA ENVIOU O EXTRATO BANCÁRIO DELA E \nPRECISA DE AJUDA PARA ORGANIZAR OS GASTOS.",
    ];

    const narracoes = [];

    this.narrador = new Narrador(
      this,
      legendas,
      narracoes,
      null,
      null,
      { v1: "personagem_LucaV2", v2: "personagem_LucaV1" },
      true,
      "textframe-luca",
      "Game1",
      {
        prevConfig: { key: "Botao-Previous" },
        nextConfig: { key: "Botao-Next" },
        avancarConfig: { text: "VAMOS LÁ" },
      }
    );

    super.create(); // manter essa linha pois o super.create() é necessário para que a cena seja criada corretamente. Caso tenha próximas cenas também deve ser chamado o super.create().
  }
}

export default Game;
