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
      "OLÁ! \nVOCÊ ESTÁ PREPARADO PARA UM DESAFIO?",
      "VOCÊ VERÁ TRÊS IMAGENS QUE SÃO BEM \nDIFERENTES ENTRE SI.",
      "UMA DESSAS IMAGENS ESTÁ EM UM MUSEU FAMOSO. \nOUTRA VALE MILHÕES DE REAIS. \nA TERCEIRA VOCÊ JÁ PODE TER VISTO NA INTERNET.",
      "SERÁ QUE CONSEGUIMOS DIZER O QUE É ARTE \nSOMENTE OLHANDO PARA UMA IMAGEM? \nAFINAL, O QUE É ARTE?",
    ];

    const narracoes = [];

    this.narrador = new Narrador(
      this,
      legendas,
      narracoes,
      null,
      null,
      { v1: "personagem-ana-v2", v2: "personagem-ana-v1" },
      true,
      "textframe-Ana",
      "Game1"
    );

    super.create();
  }
}

export default Game;
