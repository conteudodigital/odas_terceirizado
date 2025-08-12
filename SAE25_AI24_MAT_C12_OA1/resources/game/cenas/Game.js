import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Narrador } from "../../js/library/components/Narrador.js";

export class Game extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game");
    this.controladorDeCenas = controladorDeCenas;
  }

  create() {
    // Fundo
    this.add.image(0, 0, "bg-dialogo").setOrigin(0);

    // Marca
    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    // Legendas e narrações
    const subs = [
      "Olá exploradores! tenho uma missão especial para você: participar do Clube dos Investigadores da Natureza!",
      "Nos últimos dias, descobri uma coisa incrível: tenho quatro amigos que fazem parte de um grupo colecionadores... de folhas!",
      "Isso mesmo! Eles encontram folhas de todas as formas, tamanhos e cores durante seus passeios!",
      "Eu achei isso super diferente... mas o que mais me intrigou é... será que elas têm cores diferentes? Será que são muitas? tenho tantas perguntas!",
      "Precisamos organizar as informações direitinho — e é aí que você entra! Topa me ajudar com essa missão de coletar, comparar e registrar dados?",
      "Vamos juntos aprender como fazer uma pesquisa e registrar tudo como verdadeiros cientistas!",
    ];

    const audios = [
      "CH_JU001",
      "CH_JU002",
      "CH_JU003",
      "CH_JU004",
      "CH_JU005",
      "CH_JU006",
    ];

    // Cria narrador com parâmetros opcionais: personagens e botão de pular ativado
    this.dialog = new Narrador(
      this,
      subs,
      audios,
      colors,
      () => this.scene.start("Game1"),
      { v1: "personagem-ju-v1", v2: "personagem-ju-v2" }, // personagens
      true, // botão de pular ativado
      "textframe-Ju" // opcional: frame da HUD, pode omitir se for padrão
    );

    super.create();
  }
}

export default Game;
