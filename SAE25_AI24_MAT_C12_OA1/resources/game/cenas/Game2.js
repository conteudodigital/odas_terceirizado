import { Narrador } from "../../js/library/components/Narrador.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { NarradorSup } from "../../js/library/components/NarradorSup.js";
import { Button } from "../../js/library/components/Button.js";
import { PopUpTryAgain } from "../../js/library/components/PopUpTryAgain.js";

export class Game2 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game2");
    this.controladorDeCenas = controladorDeCenas;

    // Gabarito: quantidades corretas por personagem
    this.correctAnswers = {
      GABE: { verde: 2, amarela: 5 },
      BIA: { verde: 4, amarela: 3 },
      LUCA: { verde: 5, amarela: 5 },
      ANA: { verde: 5, amarela: 4 },
    };
  }

  create(data) {
    const character = data.personagem; // "Gabe" | "Bia" | "Luca" | "Ana"
    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    // Estado de confirmados (persistido entre cenas)
    this.confirmados = this.registry.get("colecaoConfirmados") || {
      GABE: false,
      BIA: false,
      LUCA: false,
      ANA: false,
    };

    const characterConfig = {
      Gabe: {
        personagem: "personagem-gabe-tf",
        legendas: [
          "Fico feliz que Você queira ver minha coleção! Eu tenho 7 folhas, dá uma olhadinha!",
        ],
        narracoes: ["CH_GA001"],
        textFrame: "textframe-Gabe",
        colecao: "colecao-gabe",
        textoSup: "PREENCHA A TABELA COM AS INFORMAÇÕES DA COLEÇÃO DOGABE!",
        narSup: "NA003",
        destaque: "GABE",
      },
      Bia: {
        personagem: "personagem-bia-tf",
        legendas: [
          "Você gostaria de ver a coleção? Claro, posso te mostrar sim, Tenho 7 folhas!",
        ],
        narracoes: ["CH_BI001"],
        textFrame: "textframe-Bia",
        colecao: "colecao-bia",
        textoSup: "PREENCHA A TABELA COM AS INFORMAÇÕES DA COLEÇÃO DABIA!",
        narSup: "NA004",
        destaque: "BIA",
      },
      Luca: {
        personagem: "personagem-luca-tf",
        legendas: [
          "A minha é a maior coleção de folhas. Tem 10 folhas, vamos lá ver?",
        ],
        narracoes: ["CH_LU001"],
        textFrame: "textframe-Luca",
        colecao: "colecao-luca",
        textoSup: "PREENCHA A TABELA COM AS INFORMAÇÕES DA COLEÇÃO DOLUCA!",
        narSup: "NA005",
        destaque: "LUCA",
      },
      Ana: {
        personagem: "personagem-ana-tf",
        legendas: [
          "Vai ser um prazer ajudar na sua pesquisa! Venha ver minha coleção de 9 folhas!",
        ],
        narracoes: ["CH_AN001"],
        textFrame: "textframe-Ana",
        colecao: "colecao-ana",
        textoSup: "PREENCHA A TABELA COM AS INFORMAÇÕES DA COLEÇÃO DAANA!",
        narSup: "NA006",
        destaque: "ANA",
      },
    };

    const config = characterConfig[character];
    if (!config) {
      console.warn("Personagem inválido:", character);
      this.scene.start("Game1");
      return;
    }

    const bg = this.add.image(0, 0, "bg-dialogo").setOrigin(0);

    this.dialog = new Narrador(
      this,
      config.legendas,
      config.narracoes,
      colors,
      () => {
        bg.destroy();
        this.add.image(0, 0, config.colecao).setOrigin(0);

        const narradorSup = new NarradorSup(
          this,
          this.scale.width / 2 - 125,
          100,
          config.textoSup,
          config.narSup,
          config.destaque,
          "#FFD700"
        );
        this.add.existing(narradorSup);

        this.exibirTabela(config.destaque);
      },
      { v1: config.personagem, v2: config.personagem },
      false,
      config.textFrame
    );

    super.create();
  }

  exibirTabela(ativo) {
    const bgTable = this.add.image(0, 0, "tabela-fundo").setOrigin(1, 1);
    bgTable.setPosition(this.scale.width - 40, this.scale.height - 40);

    const tableTopLeftX = bgTable.x - bgTable.width;
    const tableTopLeftY = bgTable.y - bgTable.height;

    const lineHeight = 140;
    const offsetFirstHeight = 350;
    const offsetGreenColumn = 350;
    const offsetYellowColumn = 650;

    const characters = ["GABE", "BIA", "LUCA", "ANA"];
    const leafs = ["verde", "amarela"];
    const adjustPerLine = [14, 2, -8, -18];

    // Valores atuais (persistidos)
    const leaftData = this.registry.get("colecaoFolhas") || {
      GABE: { verde: 0, amarela: 0 },
      BIA: { verde: 0, amarela: 0 },
      LUCA: { verde: 0, amarela: 0 },
      ANA: { verde: 0, amarela: 0 },
    };

    const confirmados = this.confirmados || {
      GABE: false,
      BIA: false,
      LUCA: false,
      ANA: false,
    };

    const textField = {};

    characters.forEach((name, i) => {
      leafs.forEach((color) => {
        const offsetX =
          color === "verde" ? offsetGreenColumn : offsetYellowColumn;
        const yBase = tableTopLeftY + offsetFirstHeight + i * lineHeight;
        const y = yBase + adjustPerLine[i];
        const baseX = tableTopLeftX + offsetX;

        const isConfirmed = !!confirmados[name];
        const isActive = name === ativo && !isConfirmed;
        const blocked =
          isConfirmed || (!isActive && leaftData[name][color] > 0);

        const bgKey = blocked
          ? "numero-tabela-inativo"
          : isActive
          ? "numero-tabela"
          : "numero-tabela-inativo";
        const moreKey = blocked
          ? "botao-mais-inativo"
          : isActive
          ? "botao-mais"
          : "botao-mais-inativo";
        const lessKey = blocked
          ? "botao-menos-inativo"
          : isActive
          ? "botao-menos"
          : "botao-menos-inativo";

        const spacing = 75;
        const lessX = baseX - spacing * 1.5;
        const moreX = baseX - spacing * 0.4;
        const fieldX = baseX + spacing;

        this.add.image(fieldX, y, bgKey).setOrigin(0.5);

        const texto = this.add
          .text(fieldX, y, leaftData[name][color].toString(), {
            fontFamily: "Nunito",
            fontSize: 32,
            fontStyle: "bold",
            color: "#000000",
            align: "center",
          })
          .setOrigin(0.5);

        const btLess = this.add
          .image(lessX, y, lessKey)
          .setOrigin(0.5)
          .setInteractive({ cursor: "pointer" });
        const btMore = this.add
          .image(moreX, y, moreKey)
          .setOrigin(0.5)
          .setInteractive({ cursor: "pointer" });

        if (!isActive || blocked) {
          btMore.disableInteractive();
          btLess.disableInteractive();
        }

        btMore.on("pointerdown", () => {
          if (!isActive) return;
          leaftData[name][color]++;
          texto.setText(leaftData[name][color]);
        });

        btLess.on("pointerdown", () => {
          if (!isActive || leaftData[name][color] <= 0) return;
          leaftData[name][color]--;
          texto.setText(leaftData[name][color]);
        });

        textField[`${name}-${color}`] = texto;
      });
    });

    const btConfirm = new Button(this, {
      text: "CONFIRMAR",
      showIcon: false,
      colors: ColorManager.getColors("default", ColorManager.BLUE),
    });
    btConfirm.setPosition(this.scale.width - btConfirm.width - 40, 40);

    // === Fluxo: validar só o personagem ativo; se errar, fica na mesma tela ===
    btConfirm.on("buttonClick", () => {
      // Persiste progresso atual
      this.registry.set("colecaoFolhas", leaftData);

      const nomeAtual = ativo; // "GABE" | "BIA" | "LUCA" | "ANA"

      // Se já estiver confirmado, vai escolher outro
      if (confirmados[nomeAtual]) {
        this.scene.start("Game1");
        return;
      }

      const esperado = this.correctAnswers[nomeAtual];
      const atual = leaftData[nomeAtual];

      const okAtual =
        atual.verde === esperado.verde && atual.amarela === esperado.amarela;

      if (!okAtual) {
        // Errou: exibe popup e, ao voltar, apenas fecha o modal e continua na mesma cena
        const popup = new PopUpTryAgain(
          this,
          "OPA! VAMOS TENTAR DE NOVO?",
          "A QUANTIDADE NÃO ESTÁ CORRETA. CONTE NOVAMENTE QUANTAS FOLHAS DE CADA COR ESSE AMIGO TEM NA COLEÇÃO E PREENCHA A TABELA.",
          "NA007",
          () => {
            // Fecha somente o modal; não reseta e não troca de cena
            popup.destroy(true);
          }
        );
        return;
      }

      // Acertou este personagem -> marca confirmado e decide próximo passo
      confirmados[nomeAtual] = true;
      this.confirmados = confirmados;
      this.registry.set("colecaoConfirmados", confirmados);

      const todosConfirmados = Object.values(confirmados).every(Boolean);
      if (todosConfirmados) {
        this.scene.start("Game3");
      } else {
        this.scene.start("Game1");
      }
    });

    this.add.existing(btConfirm);
  }
}

export default Game2;
