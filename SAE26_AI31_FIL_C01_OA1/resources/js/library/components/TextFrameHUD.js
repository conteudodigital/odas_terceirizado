import { Button } from "../components/Button.js";
import { ColorManager } from "../managers/ColorManager.js";

export class TextFrameHUD extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} frameKey - ex: "textframe-Ana" / "Ana_PopUp"
   * @param {number} extraHeight
   * @param {Object} opts - { prevConfig, nextConfig, avancarConfig, pularConfig }
   */
  constructor(
    scene,
    x = 0,
    y = 0,
    frameKey = "textframe-Ana",
    extraHeight = 0,
    opts = {}
  ) {
    super(scene, x, y);
    this.scene = scene;

    // --- FRAME ---
    this.frame = scene.add.image(0, 0, frameKey).setOrigin(0, 0);
    const frameWidth = this.frame.width;
    const frameHeight = this.frame.height;

    if (extraHeight !== 0) {
      this.frame.setDisplaySize(frameWidth, frameHeight + extraHeight);
    }

    // --- TEXTO ---
    this.centerText = scene.add
      .text(0, 0, "", {
        fontFamily: "Nunito-ExtraBold",
        fontSize: "32px",
        fontWeight: "700",
        lineHeight: 1.2,
        lineSpacing: 2,
        color: "#000000",
        align: "left",
        wordWrap: { width: frameWidth - 420 },
      })
      .setOrigin(0, 0);

    const padX = 75;
    const padY = Math.round(frameHeight * 0.3);
    this.centerText.x = padX;
    this.centerText.y = padY;

    // --- PERSONAGEM (direita, visível) ---
    this.personagemName = scene.add.image(0, 0, "personagem-ana-v1");
    this.personagemName.setOrigin(1, 1);
    this.personagemName.x = this.frame.width + 225;
    this.personagemName.y = this.frame.height + 25;
    this.personagemName.setDepth(2);

    // === BOTÕES ===
    const prevKey = opts?.prevConfig?.key || "Botao-Previous";
    const nextKey = opts?.nextConfig?.key || "Botao-Next";

    this.btBack = scene.add
      .image(0, 0, prevKey)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.btNext = scene.add
      .image(0, 0, nextKey)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // --- Botão AVANÇAR (azul) ---
    let avancarColors = opts?.avancarConfig?.colors;
    if (!avancarColors) {
      try {
        const marcaAtual = ColorManager.getCurrentMarca(scene);
        avancarColors = ColorManager.getColors(marcaAtual, ColorManager.BLUE);
      } catch (e) {
        avancarColors = {
          background: 0x4cc9f0,
          border: 0x000000,
          text: 0x000000,
        };
      }
    }

    this.btAvancar = new Button(scene, {
      text: opts?.avancarConfig?.text || "AVANÇAR",
      showIcon: false,
      colors: avancarColors,
    });
    this.btAvancar.setVisible(false);

    // Posicionamento dos botões dentro do frame
    const btnMarginBottom = 50;
    const btnOffsetY =
      frameHeight - this.btNext.displayHeight / 2 - btnMarginBottom;

    this.btBack.x = padX + this.btBack.displayWidth / 2 - 10;
    this.btBack.y = btnOffsetY;

    this.btNext.x = frameWidth - padX - this.btNext.displayWidth / 2 - 300;
    this.btNext.y = btnOffsetY;

    this.btAvancar.x = frameWidth / 2;
    this.btAvancar.y = btnOffsetY - 50;

    // Container
    this.add([
      this.frame,
      this.personagemName,
      this.centerText,
      this.btBack,
      this.btNext,
      this.btAvancar,
    ]);
    scene.add.existing(this);
  }

  setExtraHeight(extraHeight) {
    const frameWidth = this.frame.width;
    const frameHeight = this.frame.height;
    this.frame.setDisplaySize(frameWidth, frameHeight + extraHeight);
    return this;
  }

  // Handlers
  onBack(cb) {
    this.btBack.on("pointerup", cb);
  }
  onNext(cb) {
    this.btNext.on("pointerup", cb);
  }
  onAvancar(cb) {
    this.btAvancar.on("buttonClick", cb);
  }
  onPular(cb) {
    if (this.btPular) this.btPular.on("buttonClick", cb);
  }

  // Estado visual
  setText(content) {
    this.centerText.setText((content ?? "").toUpperCase());
    return this;
  }

  showNav(show = true) {
    this.btBack.setVisible(show);
    this.btNext.setVisible(show);
  }

  setBackEnabled(enabled) {
    this.btBack.setAlpha(enabled ? 1 : 0.5);
    if (this.btBack.input) this.btBack.input.enabled = enabled;
  }

  showAvancar(show = true) {
    this.btAvancar.setVisible(show);
  }

  // Helpers para personagem
  setPersonagemTexture(key) {
    this.personagemName.setTexture(key);
    return this;
  }
  showPersonagem(v = true) {
    this.personagemName.setVisible(v);
    return this;
  }
}
