import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.etapa = 1;

    this.heroiEscolhido = null;
    this.desafioEscolhido = null;
    this.localEscolhido = null;
  }

  create() {
    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.YELLOW);

    this.background = this.add.image(0, 0, "escolhaHeroiBg").setOrigin(0, 0);
    this.background.setDepth(-1);

    const botoesEscolha = [
      { text: "ESCOLHER", x: 227.5, y: 923 },
      { text: "ESCOLHER", x: 800, y: 923 },
      { text: "ESCOLHER", x: 1352, y: 923 },
    ];

    this.botoes = botoesEscolha.map((config, index) => {
      const btn = new Button(this, {
        text: config.text,
        showIcon: false,
        colors: colors,
      });

      btn.x = config.x;
      btn.y = config.y;

      btn.on("buttonClick", () => this.handleEscolha(index));

      return btn;
    });

    super.create();
  }

  handleEscolha(index) {
    if (this.etapa === 1) {
      this.heroiEscolhido = index;
      console.log(
        `[ETAPA 1] Herói escolhido: ${this.getNomeHeroi(
          index
        )} (index ${index})`
      );

      this.proximaEtapa("escolhaDesafioBg");
      this.etapa = 2;
    } else if (this.etapa === 2) {
      this.desafioEscolhido = index;
      console.log(
        `[ETAPA 2] Desafio escolhido: ${this.getNomeDesafio(
          index
        )} (index ${index})`
      );

      this.proximaEtapa("escolhaLocalBg");
      this.etapa = 3;
    } else if (this.etapa === 3) {
      this.localEscolhido = index;
      console.log(
        `[ETAPA 3] Local escolhido: ${this.getNomeLocal(
          index
        )} (index ${index})`
      );

      const chaveHistoria = this.montarChaveHistoria();
      console.log(`[FINAL] Chave da história: "${chaveHistoria}"`);

      this.registry.set("heroiEscolhido", this.heroiEscolhido);
      this.registry.set("desafioEscolhido", this.desafioEscolhido);
      this.registry.set("localEscolhido", this.localEscolhido);
      this.registry.set("chaveHistoria", chaveHistoria);

      console.log("[REGISTRY] Salvo no registry:", {
        heroiEscolhido: this.registry.get("heroiEscolhido"),
        desafioEscolhido: this.registry.get("desafioEscolhido"),
        localEscolhido: this.registry.get("localEscolhido"),
        chaveHistoria: this.registry.get("chaveHistoria"),
      });

      this.scene.start("Game1");
    }
  }

  proximaEtapa(novoBgKey) {
    if (this.background) this.background.destroy();

    this.background = this.add.image(0, 0, novoBgKey).setOrigin(0, 0);
    this.background.setDepth(-1);

    this.tweens.add({
      targets: this.background,
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: "Power2",
    });
  }

  getNomeHeroi(index) {
    switch (index) {
      case 0:
        return "Rico";
      case 1:
        return "Luna";
      case 2:
        return "Téo";
      default:
        return "Desconhecido";
    }
  }

  getNomeDesafio(index) {
    switch (index) {
      case 0:
        return "salvargato";
      case 1:
        return "protegerlocal";
      case 2:
        return "mistérioesconderijo";
      default:
        return "desafioDesconhecido";
    }
  }

  getNomeLocal(index) {
    switch (index) {
      case 0:
        return "floresta";
      case 1:
        return "cidade";
      case 2:
        return "planeta";
      default:
        return "localDesconhecido";
    }
  }

  montarChaveHistoria() {
    const nomeHeroi = this.getNomeHeroi(this.heroiEscolhido).toLowerCase();
    const nomeDesafio = this.getNomeDesafio(
      this.desafioEscolhido
    ).toLowerCase();
    const nomeLocal = this.getNomeLocal(this.localEscolhido).toLowerCase();

    return `${nomeHeroi}-${nomeDesafio}-${nomeLocal}`;
  }
}

export default Game;
