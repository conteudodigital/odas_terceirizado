import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Narrador } from "../../js/library/components/Narrador.js";

export class Game3 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game3"); // Passa o nome da cena para a classe base
    this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
    this.loaded = false;
  }

  create() {
    const background = this.add.image(0, 0, "bgGame").setOrigin(0, 0);

    const legendas = [
      "COM AS MOVIMENTAÇÕES ORGANIZADAS, É HORA DE \nCALCULAR O SALDO FINAL DA CONTA DA SRA.\nPAULA.",
      "SOME AS ENTRADAS E SUBTRAIA AS SAÍDAS PARA \nDESCOBRIR O SALDO FINAL.",
    ];

    const narracoes = [];

    this.narrador = new Narrador(
      this,
      legendas,
      narracoes,
      null,
      null,
      { v1: "personagem_LucaV2", v2: "personagem_LucaV1" },
      false,
      "textframe-luca",
      "Game4",
      {
        prevConfig: { key: "Botao-Previous" },
        nextConfig: { key: "Botao-Next" },
        avancarConfig: { text: "CONTINUAR" },
      }
    );

    super.create(); // manter essa linha pois o super.create() é necessário para que a cena seja criada corretamente. Caso tenha próximas cenas também deve ser chamado o super.create().
  }
}

export default Game3;
