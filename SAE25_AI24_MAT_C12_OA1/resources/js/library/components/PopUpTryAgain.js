import SoundManager from "../managers/SoundManager.js";
import { Button } from "./Button.js";
import { ColorManager } from "../managers/ColorManager.js";

export class PopUpTryAgain extends Phaser.GameObjects.Container {
  constructor(scene, titulo, subtitulo, somKey, onBack) {
    super(scene, scene.scale.width / 2, scene.scale.height / 2);
    this.scene = scene;
    this.somKey = somKey;
    SoundManager.init(scene);

    this.currentFeedback = null;
    this.currentNarracao = null;

    if (this.currentFeedback && this.currentFeedback.isPlaying) {
      SoundManager.stop(this.currentFeedback);
    }
    this.currentFeedback = SoundManager.play("feedback-negativo");

    const scaleFactor = 0.85;

    // === [ADICIONADO] Overlay escuro 75% ocupando a tela ===
    const bgOverlay = scene.add
      .rectangle(0, 0, scene.scale.width, scene.scale.height, 0x000000, 0.75)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive(); // bloqueia cliques na cena atrás

    const fundo = scene.add
      .image(0, 0, "modal-feedback-negativo")
      .setOrigin(0.5)
      .setScale(scaleFactor);

    const btNarra = scene.add
      .image(
        -fundo.displayWidth / 2 + 125,
        -fundo.displayHeight / 2 + 200,
        "narracao_icon"
      )
      .setDisplaySize(80, 80)
      .setOrigin(0.5)
      .setScale(1)
      .setInteractive({ useHandCursor: true });

    btNarra.on("pointerdown", () => {
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        SoundManager.stop(this.currentNarracao);
      }
      this.currentNarracao = SoundManager.play(this.somKey);
    });

    scene.events.on("shutdown", () => {
      if (this.currentFeedback && this.currentFeedback.isPlaying) {
        SoundManager.stop(this.currentFeedback);
      }
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        SoundManager.stop(this.currentNarracao);
      }
    });
    this.on("destroy", () => {
      if (this.currentFeedback && this.currentFeedback.isPlaying) {
        SoundManager.stop(this.currentFeedback);
      }
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        SoundManager.stop(this.currentNarracao);
      }
    });

    const tituloText = scene.add
      .text(0, -fundo.displayHeight / 2 + 250, titulo.toUpperCase(), {
        fontFamily: "Nunito",
        fontSize: "46px",
        fontWeight: "900",
        fontStyle: "Bold",
        color: "#ffffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setStroke("#222222", 10);

    const subtituloText = scene.add
      .text(0, 25, subtitulo, {
        fontFamily: "Nunito",
        fontSize: "30px",
        fontWeight: "700",
        color: "#222222",
        fontStyle: "Bold",
        align: "center",
        wordWrap: { width: 1100 * scaleFactor, useAdvancedWrap: true },
      })
      .setOrigin(0.5);

    const btVoltar = new Button(scene, {
      text: "VOLTAR",
      showIcon: false,
      colors: ColorManager.getColors(
        ColorManager.getCurrentMarca(scene),
        ColorManager.BLUE
      ),
    });

    btVoltar.setPosition(-btVoltar.width / 2, fundo.displayHeight / 2 - 250);

    btVoltar.on("buttonClick", () => {
      if (typeof onBack === "function") {
        onBack();
      }
    });

    // === [ALTERADO MINIMAMENTE] Inclui o overlay como primeiro elemento ===
    this.add([bgOverlay, fundo, btNarra, tituloText, subtituloText, btVoltar]);
    this.setSize(fundo.displayWidth, fundo.displayHeight);
    this.setDepth(999);
    scene.add.existing(this);
  }
}
