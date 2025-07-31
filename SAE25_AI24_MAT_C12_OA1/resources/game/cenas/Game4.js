import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { NarradorSup } from "../../js/library/components/NarradorSup.js";
import { Button } from "../../js/library/components/Button.js";
import { PopUpTryAgain } from "../../js/library/components/PopUpTryAgain.js";

export class Game4 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game4");
    this.controladorDeCenas = controladorDeCenas;
    this.fundoColunasVisiveis = {}; // controle de visibilidade
    this.columnState = {}; // controle de quantidade
  }

  create() {
    this.add.image(0, 0, "jogo-fase2-bg").setOrigin(0);

    this.leafTable = this.add.image(0, 0, "tabela-fase2").setOrigin(1, 1);
    this.leafTable.setPosition(this.scale.width - 40, this.scale.height - 40);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const dialog = new NarradorSup(
      this,
      this.scale.width / 2 - 120,
      100,
      "  EDITE O GRÁFICO COM BASE NA TABELA, DEPOIS CLIQUE EM CONCLUIR",
      "NA008"
    );
    this.add.existing(dialog);

    const btConfirm = new Button(this, {
      text: "CONCLUIR",
      showIcon: false,
      colors: ColorManager.getColors("default", ColorManager.BLUE),
    });

    btConfirm.setPosition(this.scale.width - btConfirm.width - 40, 40);

    btConfirm.on("buttonClick", () => {
      const expected = {
        GABE: { verde: 2, amarela: 5 },
        BIA: { verde: 4, amarela: 3 },
        LUCA: { verde: 5, amarela: 5 },
        ANA: { verde: 5, amarela: 4 },
      };

      const correct = Object.entries(expected).every(
        ([name, expectedValues]) => {
          const current = this.columnState[name];
          return (
            current &&
            current.verde === expectedValues.verde &&
            current.amarela === expectedValues.amarela
          );
        }
      );

      if (correct) {
        this.scene.start("Game5");
      } else {
        new PopUpTryAgain(
          this,
          "OPA! VAMOS TENTAR DE NOVO?",
          "A QUANTIDADE NÃO ESTÁ CORRETA. CONFIRA OS DADOS DA TABELA E EDITE O GRÁFICO. DEPOIS, CLIQUE EM CONCLUIR.",
          "NA009",
          () => {
            this.scene.start("Game4");
          }
        );
      }
    });

    this.editButtons = {};
    this.leafColumns = {};

    const configButtons = {
      GABE: {
        x: 180,
        y: 940,
        verdeX: 237,
        verdeY: 856,
        amarelaX: 318,
        amarelaY: 856,
        fundoX: 278,
        fundoY: 620,
        fecharX: 400,
        fecharY: 242,
      },
      BIA: {
        x: 457,
        y: 940,
        verdeX: 500,
        verdeY: 856,
        amarelaX: 579,
        amarelaY: 856,
        fundoX: 540,
        fundoY: 620,
        fecharX: 665,
        fecharY: 242,
      },
      LUCA: {
        x: 710,
        y: 940,
        verdeX: 760,
        verdeY: 856,
        amarelaX: 840,
        amarelaY: 856,
        fundoX: 800,
        fundoY: 620,
        fecharX: 925,
        fecharY: 242,
      },
      ANA: {
        x: 980,
        y: 940,
        verdeX: 1020,
        verdeY: 856,
        amarelaX: 1100,
        amarelaY: 856,
        fundoX: 1060,
        fundoY: 620,
        fecharX: 1185,
        fecharY: 242,
      },
    };

    Object.entries(configButtons).forEach(([name, pos]) => {
      const button = this.add
        .image(pos.x, pos.y, "botao-editar")
        .setInteractive({ cursor: "pointer" });
      button.setData("personagem", name);
      button.on("pointerdown", () => {
        this.abrirOverlay(name);
      });
      this.editButtons[name] = button;

      const closeButton = this.add
        .image(pos.fecharX, pos.fecharY, "botao-sair-highlight")
        .setOrigin(0.5)
        .setVisible(false)
        .setInteractive({ cursor: "pointer" });

      closeButton.on("pointerdown", () => {
        this.fecharOverlay();
      });

      const bg = this.add
        .image(pos.fundoX, pos.fundoY, "background-colunas")
        .setOrigin(0.5)
        .setScale(1)
        .setVisible(false);

      const verde = this.criarColunaBlocos(pos.verdeX, pos.verdeY, 0, "verde");
      const amarela = this.criarColunaBlocos(
        pos.amarelaX,
        pos.amarelaY,
        0,
        "amarela"
      );

      const botoes = {
        maisVerde: this.add
          .image(pos.verdeX, pos.verdeY - 580, "botao-mais")
          .setInteractive({ cursor: "pointer" })
          .setVisible(false),
        menosVerde: this.add
          .image(pos.verdeX, pos.verdeY + 80, "botao-menos")
          .setInteractive({ cursor: "pointer" })
          .setVisible(false),
        maisAmarela: this.add
          .image(pos.amarelaX, pos.amarelaY - 580, "botao-mais")
          .setInteractive({ cursor: "pointer" })
          .setVisible(false),
        menosAmarela: this.add
          .image(pos.amarelaX, pos.amarelaY + 80, "botao-menos")
          .setInteractive({ cursor: "pointer" })
          .setVisible(false),
      };

      this.columnState[name] = { verde: 0, amarela: 0 };

      botoes.maisVerde.on("pointerdown", () =>
        this.atualizarColuna(name, "verde", 1)
      );
      botoes.menosVerde.on("pointerdown", () =>
        this.atualizarColuna(name, "verde", -1)
      );
      botoes.maisAmarela.on("pointerdown", () =>
        this.atualizarColuna(name, "amarela", 1)
      );
      botoes.menosAmarela.on("pointerdown", () =>
        this.atualizarColuna(name, "amarela", -1)
      );

      this.leafColumns[name] = {
        fundo: bg,
        verde,
        amarela,
        botaoFechar: closeButton,
        ...botoes,
      };
    });

    super.create();
  }

  abrirOverlay(personagem) {
    if (this.overlay) this.overlay.destroy();

    this.overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.75)
      .setOrigin(0)
      .setInteractive();

    this.children.bringToTop(this.leafTable);

    Object.entries(this.leafColumns).forEach(([nome, colunas]) => {
      const visivel = nome === personagem;
      colunas.fundo.setVisible(visivel);
      colunas.maisVerde.setVisible(visivel);
      colunas.menosVerde.setVisible(visivel);
      colunas.maisAmarela.setVisible(visivel);
      colunas.menosAmarela.setVisible(visivel);
      colunas.botaoFechar.setVisible(visivel);

      if (visivel) {
        this.children.bringToTop(colunas.botaoFechar);
        this.children.bringToTop(colunas.fundo);
        this.children.bringToTop(colunas.verde);
        this.children.bringToTop(colunas.amarela);
        this.children.bringToTop(colunas.maisVerde);
        this.children.bringToTop(colunas.menosVerde);
        this.children.bringToTop(colunas.maisAmarela);
        this.children.bringToTop(colunas.menosAmarela);
      }
    });

    this.overlay.on("pointerdown", (pointer) => {
      const bounds = this.leafTable.getBounds();
      if (!Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
        this.fecharOverlay();
      }
    });
  }

  fecharOverlay() {
    if (this.overlay) this.overlay.destroy();

    Object.values(this.leafColumns).forEach((colunas) => {
      colunas.fundo.setVisible(false);
      colunas.maisVerde.setVisible(false);
      colunas.menosVerde.setVisible(false);
      colunas.maisAmarela.setVisible(false);
      colunas.menosAmarela.setVisible(false);
      colunas.botaoFechar.setVisible(false);
    });
  }

  criarColunaBlocos(x, y, quantidade, cor) {
    const grupo = this.add.container(x, y);

    for (let i = 0; i < 10; i++) {
      const spriteKey =
        i < quantidade
          ? cor === "verde"
            ? "bloco-verde"
            : "bloco-amarelo"
          : "bloco-padrao";
      const bloco = this.add.image(0, -i * 55, spriteKey).setOrigin(0.5);
      grupo.add(bloco);
    }

    return grupo;
  }

  atualizarColuna(nome, cor, delta) {
    const estado = this.columnState[nome];
    if (!estado) return;

    estado[cor] = Phaser.Math.Clamp(estado[cor] + delta, 0, 10);

    const container = this.leafColumns[nome][cor];
    container.removeAll(true);

    for (let i = 0; i < 10; i++) {
      let spriteKey = "bloco-padrao";
      if (i < estado[cor])
        spriteKey = cor === "verde" ? "bloco-verde" : "bloco-amarelo";
      const bloco = this.add.image(0, -i * 55, spriteKey).setOrigin(0.5);
      container.add(bloco);
    }
  }
}

export default Game4;
