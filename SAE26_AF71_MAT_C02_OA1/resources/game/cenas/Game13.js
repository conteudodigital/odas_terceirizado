// src/scenes/Game13.js
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game13 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game13");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    // Profundidades de UI / Modal
    this.UI_DEPTH = 500;
    this.MODAL_DEPTH = 100000;
    this.OVERLAY_ALPHA = 0.85;

    // Refs do modal
    this.overlay = null;
    this.modalConcluido = null;
  }

  create() {
    const background = this.add.image(0, 0, "saldofinal").setOrigin(0, 0);

    // Marca e cores
    const marca = ColorManager.getCurrentMarca(this);
    const colorsBlue = ColorManager.getColors(marca, ColorManager.BLUE);

    // =========================
    // Botão FINALIZAR (principal)
    // =========================
    const btFinalizar = new Button(this, {
      text: "FINALIZAR",
      showIcon: false,
      colors: colorsBlue,
    });
    this.add.existing(btFinalizar);
    btFinalizar.setDepth(this.UI_DEPTH);

    btFinalizar.x =
      background.x + (background.width - btFinalizar.width) / 2 + 465;
    btFinalizar.y = 700;

    // Cria o modal concluído (invisível inicialmente)
    this.createConcluidoModal(background, colorsBlue);

    btFinalizar.on("buttonClick", () => {
      // Abre modal
      this.showConcluidoModal();
    });

    super.create(); // manter a chamada ao super
  }

  // =========================
  // Criação do Modal Concluído
  // =========================
  createConcluidoModal(bg, btnColors) {
    const w = Math.max(bg.displayWidth, this.cameras.main.width);
    const h = Math.max(bg.displayHeight, this.cameras.main.height);

    // Overlay preto translúcido para bloquear o fundo
    this.overlay = this.add
      .rectangle(0, 0, w, h, 0x000000, this.OVERLAY_ALPHA)
      .setOrigin(0, 0)
      .setDepth(this.MODAL_DEPTH)
      .setScrollFactor(0)
      .setVisible(false)
      .setInteractive({ useHandCursor: false });

    // Container do modal
    this.modalConcluido = this.add
      .container(0, 0)
      .setDepth(this.MODAL_DEPTH + 1)
      .setScrollFactor(0)
      .setVisible(false);

    // Imagem do modal (fundo preto da arte)
    const cx = bg.x + bg.displayWidth / 2;
    const cy = bg.y + bg.displayHeight / 2;

    // A arte do modal — chave: "modal_concluido"
    const imgModal = this.add.image(cx, cy, "modal_concluido").setOrigin(0.5);
    this.modalConcluido.add(imgModal);

    // Botão INÍCIO (para voltar à cena inicial)
    const btInicio = new Button(this, {
      text: "INÍCIO",
      showIcon: false,
      colors: btnColors,
    });
    this.add.existing(btInicio);
    this.modalConcluido.add(btInicio);

    // Posicionamento do botão dentro do modal
    // Ajuste fino relativo à arte do modal (centralizado e um pouco abaixo do centro)
    btInicio.x = imgModal.x - 110; // centralizado no eixo X do modal
    btInicio.y = imgModal.y + imgModal.displayHeight * 0.2; // 28% abaixo do centro (ajuste se necessário)

    // Ação do botão INÍCIO
    btInicio.on("buttonClick", () => {
      // Volta para a cena inicial do jogo (ajuste o nome se sua cena inicial for outra)
      this.scene.start("Capa");
    });
  }

  // =========================
  // Mostrar / Ocultar Modal
  // =========================
  showConcluidoModal() {
    this.overlay?.setVisible(true);
    this.modalConcluido?.setVisible(true);
    // Garante que apenas o modal receba cliques
    this.input.setTopOnly(true);
  }

  hideConcluidoModal() {
    this.modalConcluido?.setVisible(false);
    this.overlay?.setVisible(false);
    this.input.setTopOnly(false);
  }
}

export default Game13;
