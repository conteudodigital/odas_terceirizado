import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.inputArea = {
      x: 1001,
      y: 406,
      width: 605,
      height: 395,
    };

    this.textStyle = {
      fontFamily: "Nunito",
      fontSize: "24px",
      color: "#000000",
      align: "left",
    };

    this.capituloAtual = 1;
    this.textosCapitulo = {
      1: "",
      2: "",
      3: "",
      4: "",
    };

    this.modalAberto = false;
  }

  create() {
    this.heroiIndex = this.registry.get("heroiEscolhido");
    this.desafioIndex = this.registry.get("desafioEscolhido");
    this.localIndex = this.registry.get("localEscolhido");

    this.heroiNome = this.getNomeHeroi(this.heroiIndex);
    this.desafioNome = this.getNomeDesafio(this.desafioIndex);
    this.localNome = this.getNomeLocal(this.localIndex);

    this.spriteIntroducaoKey = `${this.heroiNome}-${this.localNome}-introducao`;
    this.spriteConflitoKey = `${this.heroiNome}-${this.desafioNome}-${this.localNome}`;
    this.spriteClimaxKey = `${this.heroiNome}-climax-${this.localNome}`;
    this.spriteDesfechoKey = `${this.heroiNome}-desfecho-${this.desafioNome}-${this.localNome}`;

    console.log("[DEBUG SPRITES]", {
      introducao: this.spriteIntroducaoKey,
      conflito: this.spriteConflitoKey,
      climax: this.spriteClimaxKey,
      desfecho: this.spriteDesfechoKey,
    });

    this.background = this.add
      .image(0, 0, "bgGame")
      .setOrigin(0, 0)
      .setDepth(0);

    this.botaoConcluirCinza = this.add
      .image(1722, 95, "concluirCinza")
      .setDepth(1)
      .setInteractive({ useHandCursor: true });

    this.botaoConcluirAmarelo = this.add
      .image(1722, 95, "concluirAmarelo")
      .setDepth(2)
      .setVisible(false)
      .disableInteractive();

    this.livroIntroducao = this.add
      .image(960, 613, "livroIntroducao")
      .setDepth(3)
      .setVisible(true);

    this.livroConflito = this.add
      .image(960, 613, "livroConflito")
      .setDepth(3)
      .setVisible(false);

    this.livroClimax = this.add
      .image(960, 613, "livroClimax")
      .setDepth(3)
      .setVisible(false);

    this.livroDesfecho = this.add
      .image(960, 613, "livroDesfecho")
      .setDepth(3)
      .setVisible(false);

    this.botaoNext = this.add
      .image(1560, 893, "Botao-Next")
      .setDepth(4)
      .setInteractive({ useHandCursor: true });

    this.botaoPrevious = this.add
      .image(1050, 893, "Botao-Previous")
      .setDepth(4)
      .setInteractive({ useHandCursor: true });

    this.botaoPrevious.setVisible(false);

    this.blankMoldura = this.add.image(619, 593, "blankMoldura").setDepth(5);

    this.spriteIntroducao = this.add
      .image(this.blankMoldura.x, this.blankMoldura.y, this.spriteIntroducaoKey)
      .setDepth(5.1)
      .setVisible(true);

    this.spriteConflito = this.add
      .image(this.blankMoldura.x, this.blankMoldura.y, this.spriteConflitoKey)
      .setDepth(5.1)
      .setVisible(false);

    this.spriteClimax = this.add
      .image(this.blankMoldura.x, this.blankMoldura.y, this.spriteClimaxKey)
      .setDepth(5.1)
      .setVisible(false);

    this.spriteDesfecho = this.add
      .image(this.blankMoldura.x, this.blankMoldura.y, this.spriteDesfechoKey)
      .setDepth(5.1)
      .setVisible(false);

    this.Adesivos = this.add.image(615, 585, "Adesivos").setDepth(6);

    const { x, y, width, height } = this.inputArea;

    this.textInput = this.add
      .dom(x + width / 2, y + height / 2, "textarea", {
        width: `${width}px`,
        height: `${height}px`,
        fontFamily: "Nunito, sans-serif",
        fontSize: "24px",
        color: "#000000",
        padding: "20px",
        lineHeight: "1.5",
        overflowY: "auto",
        boxSizing: "border-box",
        resize: "none",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
      })
      .setDepth(10);

    this.textInput.node.placeholder = "Digite aqui sua história...";
    this.textInput.node.maxLength = 500;
    this.textInput.node.value = this.textosCapitulo[this.capituloAtual] || "";
    this.textInput.node.focus();

    this.textInput.node.addEventListener("input", () => {
      this.textosCapitulo[this.capituloAtual] = this.textInput.node.value;
      this.atualizarEstadoConcluir();
    });

    this.botaoNext.on("pointerdown", () => {
      this.sound.play("click");
      this.irParaProximoCapitulo();
    });

    this.botaoPrevious.on("pointerdown", () => {
      this.sound.play("click");
      this.irParaCapituloAnterior();
    });

    this.botaoConcluirCinza.on("pointerdown", () => {
      console.log("Concluir ainda bloqueado (usar botão cinza).");
    });

    this.botaoConcluirAmarelo.on("pointerdown", () => {
      const tudoPreenchido = this.verificarTudoPreenchido();
      if (tudoPreenchido && !this.modalAberto) {
        this.mostrarModalConcluido();
      }
    });
  }

  irParaProximoCapitulo() {
    if (this.capituloAtual === 1) {
      this.textosCapitulo[1] = this.textInput.node.value || "";
      this.capituloAtual = 2;
    } else if (this.capituloAtual === 2) {
      this.textosCapitulo[2] = this.textInput.node.value || "";
      this.capituloAtual = 3;
    } else if (this.capituloAtual === 3) {
      this.textosCapitulo[3] = this.textInput.node.value || "";
      this.capituloAtual = 4;
    }
    this.atualizarCapituloVisual();
    this.atualizarEstadoConcluir();
  }

  irParaCapituloAnterior() {
    if (this.capituloAtual === 4) {
      this.textosCapitulo[4] = this.textInput.node.value || "";
      this.capituloAtual = 3;
    } else if (this.capituloAtual === 3) {
      this.textosCapitulo[3] = this.textInput.node.value || "";
      this.capituloAtual = 2;
    } else if (this.capituloAtual === 2) {
      this.textosCapitulo[2] = this.textInput.node.value || "";
      this.capituloAtual = 1;
    }
    this.atualizarCapituloVisual();
    this.atualizarEstadoConcluir();
  }

  atualizarCapituloVisual() {
    const mostrandoIntroducao = this.capituloAtual === 1;
    const mostrandoConflito = this.capituloAtual === 2;
    const mostrandoClimax = this.capituloAtual === 3;
    const mostrandoDesfecho = this.capituloAtual === 4;

    this.livroIntroducao.setVisible(mostrandoIntroducao);
    this.livroConflito.setVisible(mostrandoConflito);
    this.livroClimax.setVisible(mostrandoClimax);
    this.livroDesfecho.setVisible(mostrandoDesfecho);

    this.spriteIntroducao.setVisible(mostrandoIntroducao);
    this.spriteConflito.setVisible(mostrandoConflito);
    this.spriteClimax.setVisible(mostrandoClimax);
    this.spriteDesfecho.setVisible(mostrandoDesfecho);

    this.botaoPrevious.setVisible(!mostrandoIntroducao);

    this.textInput.node.value = this.textosCapitulo[this.capituloAtual] || "";

    if (mostrandoIntroducao) {
      this.textInput.node.placeholder =
        "Apresente seu herói e o lugar onde ele vive...";
    } else if (mostrandoConflito) {
      this.textInput.node.placeholder = "Qual é o problema/desafio que surge?";
    } else if (mostrandoClimax) {
      this.textInput.node.placeholder =
        "Como o herói enfrenta o momento mais difícil?";
    } else if (mostrandoDesfecho) {
      this.textInput.node.placeholder =
        "Como tudo termina? Qual é o final da história?";
    }
  }

  atualizarEstadoConcluir() {
    const tudoPreenchido = this.verificarTudoPreenchido();

    if (tudoPreenchido) {
      this.botaoConcluirAmarelo
        .setVisible(true)
        .setInteractive({ useHandCursor: true });
      this.botaoConcluirCinza.setVisible(false).disableInteractive();
    } else {
      this.botaoConcluirAmarelo.setVisible(false).disableInteractive();
      this.botaoConcluirCinza
        .setVisible(true)
        .setInteractive({ useHandCursor: true });
    }
  }

  verificarTudoPreenchido() {
    const t1 = (this.textosCapitulo[1] || "").trim();
    const t2 = (this.textosCapitulo[2] || "").trim();
    const t3 = (this.textosCapitulo[3] || "").trim();
    const t4 = (this.textosCapitulo[4] || "").trim();
    return t1 && t2 && t3 && t4;
  }

  mostrarModalConcluido() {
    this.modalAberto = true;

    if (this.textInput && this.textInput.node) {
      this.textInput.node.blur();
      this.textInput.node.readOnly = true;
      this.textInput.node.disabled = true;
      this.textInput.node.placeholder = "";
      this.textInput.node.value = "";
      this.textInput.node.style.pointerEvents = "none";
      this.textInput.node.style.display = "none";
    }

    this.sound.play("acerto");

    const overlayDepth = 999;
    const modalDepth = 1000;
    const buttonDepth = 1001;

    this.overlayFinal = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, 0.75)
      .setOrigin(0, 0)
      .setDepth(overlayDepth);

    this.modalConcluidoSprite = this.add
      .image(960, 540, "modalConcluido")
      .setDepth(modalDepth);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    this.btIniciarHistoriaFinal = new Button(this, {
      text: "INÍCIO",
      showIcon: false,
      colors: colors,
    });

    this.btIniciarHistoriaFinal.x =
      this.modalConcluidoSprite.x - this.btIniciarHistoriaFinal.width / 2;
    this.btIniciarHistoriaFinal.y = this.modalConcluidoSprite.y + 200;

    this.btIniciarHistoriaFinal.setDepth(buttonDepth);

    this.btIniciarHistoriaFinal.on("buttonClick", () => {
      this.scene.start("Capa");
    });
  }

  getNomeHeroi(index) {
    switch (index) {
      case 0:
        return "rico";
      case 1:
        return "luna";
      case 2:
        return "teo";
      default:
        return "heroi";
    }
  }

  getNomeDesafio(index) {
    switch (index) {
      case 0:
        return "resgate";
      case 1:
        return "proteger";
      case 2:
        return "misterio";
      default:
        return "desafio";
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
        return "lugar";
    }
  }
}

export default Game1;
