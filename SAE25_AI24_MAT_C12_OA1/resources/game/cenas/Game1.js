import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { NarradorSup } from "../../js/library/components/NarradorSup.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;
  }

  create() {
    this.add.image(0, 0, "bg-jogo-fase1").setOrigin(0);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);
    const colorsDisabled = ColorManager.getColors(marca, ColorManager.GRAY);

    // Verifica quais personagens já foram preenchidos no registry
    const leafColection = this.registry.get("colecaoFolhas") || {};
    const filled = Object.entries(leafColection)
      .filter(([_, dados]) => dados.verde > 0 || dados.amarela > 0)
      .map(([nome]) => nome);

    const characters = [
      {
        key: "personagem-gabe",
        keyCinza: "personagem-gabe-inativo",
        label: "GABE",
      },
      {
        key: "personagem-bia",
        keyCinza: "personagem-bia-inativo",
        label: "BIA",
      },
      {
        key: "personagem-luca",
        keyCinza: "personagem-luca-inativo",
        label: "LUCA",
      },
      {
        key: "personagem-ana",
        keyCinza: "personagem-ana-inativo",
        label: "ANA",
      },
    ];

    const centerY = this.scale.height * 0.85;
    const spaceX = this.scale.width / (characters.length + 1);
    const extraPadding = 75;

    characters.forEach((p, i) => {
      const posX = spaceX * (i + 1) + (i - 1.5) * extraPadding;
      const alreadyFilled = filled.includes(p.label);

      const personagem = this.add
        .image(posX, centerY, alreadyFilled ? p.keyCinza : p.key)
        .setOrigin(0.5, 1)
        .setScale(1.05);

      const bt = new Button(this, {
        text: "ESCOLHER",
        showIcon: false,
        colors: alreadyFilled ? colorsDisabled : colors,
      });

      bt.setPosition(posX - bt.width / 2, personagem.y + 10);
      this.add.existing(bt);

      if (!alreadyFilled) {
        bt.on("buttonClick", () => {
          const characterFormatted =
            p.label.charAt(0) + p.label.slice(1).toLowerCase();
          this.scene.start("Game2", { personagem: characterFormatted });
        });
      } else {
        bt.setDisabled(true);
      }
    });

    const dialog = new NarradorSup(
      this,
      this.scale.width / 2,
      100,
      "CLIQUE PARA SELECIONAR UM AMIGO E VER SUA COLEÇÃO",
      "NA002"
    );
    this.add.existing(dialog);

    super.create();
  }
}

export default Game1;
