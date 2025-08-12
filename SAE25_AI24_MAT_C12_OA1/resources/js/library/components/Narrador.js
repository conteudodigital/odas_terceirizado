import { TextFrameHUD } from "../components/TextFrameHUD.js";
import SoundManager from "../managers/SoundManager.js";
import { Button } from "../components/Button.js";

export class Narrador {
  /**
   * @param {Phaser.Scene} scene - A cena onde o narrador será usado
   * @param {string[]} legendas - Array de legendas
   * @param {string[]} narracoes - Array de keys dos áudios correspondentes
   * @param {Object} colors - Estilo de cores para o botão de pular
   * @param {Function} onFinish - Callback ao finalizar todas as falas
   * @param {Object} personagens - { v1: string, v2: string } keys dos personagens
   * @param {boolean} permitirPular - se o botão de pular deve aparecer ou não
   * @param {string} textFrameKey - key da imagem do balão de fala (frame)
   */
  constructor(
    scene,
    legendas = [],
    narracoes = [],
    colors = null,
    onFinish = null,
    personagens = { v1: "personagem_V1", v2: "personagem_V2" },
    permitirPular = true,
    textFrameKey = "textframe"
  ) {
    this.scene = scene;
    this.legendas = legendas;
    this.narracoes = narracoes;
    this.colors = colors;
    this.currentIndex = 0;
    this.currentSound = null;
    this.onFinish = onFinish;
    this.personagens = personagens;
    this.permitirPular = permitirPular;
    this.textFrameKey = textFrameKey;

    SoundManager.init(scene);

    // HUD
    this.hud = new TextFrameHUD(scene, 0, 0, this.textFrameKey, -25);
    const frameH = this.hud.frame.height;
    this.hud.y = scene.scale.height - frameH;
    this.hud.x = (scene.scale.width - this.hud.frame.width) / 2 - 50;

    // Botão "Pular"
    if (this.permitirPular) {
      this.btPular = new Button(this.scene, {
        text: "PULAR",
        showIcon: false,
        colors: this.colors || {
          background: 0xffffff,
          border: 0x000000,
          text: 0x000000,
        },
      });

      this.scene.add.existing(this.btPular);

      const pad = 100;
      const bounds = this.btPular.getBounds();
      this.btPular.x = this.scene.scale.width - bounds.width - pad;
      this.btPular.y = 40;

      this.btPular.setScrollFactor(0);
      this.btPular.setDepth(9999);
      this.btPular.on("buttonClick", this.pular.bind(this));
    }

    this.playAtual();
  }

  playAtual() {
    console.log("[Narrador] Reproduzindo índice:", this.currentIndex);

    if (this.currentIndex >= this.legendas.length) {
      if (this.onFinish) {
        console.log("[Narrador] Fim das legendas. Chamando onFinish()");
        this.onFinish();
      }
      return;
    }

    this.hud.setText(this.legendas[this.currentIndex]);

    const tex =
      this.currentIndex % 2 === 1 ? this.personagens.v1 : this.personagens.v2;
    this.hud.tadeuName.setTexture(tex);

    if (this.currentSound) {
      this.currentSound.off("complete", this._onCompleteCallback);
      SoundManager.stop(this.currentSound);
      this.currentSound = null;
    }

    const key = this.narracoes[this.currentIndex];
    this._onCompleteCallback = () => this.onSoundComplete();
    this.currentSound = SoundManager.play(
      key,
      1.0,
      false,
      this._onCompleteCallback
    );
  }

  onSoundComplete() {
    this.currentIndex++;
    this.playAtual();
  }

  pular() {
    console.log("[Narrador] CLICADO: índice atual =", this.currentIndex);

    if (this.currentSound) {
      console.log("[Narrador] Parando som:", this.currentSound.key);
      this.currentSound.off("complete", this._onCompleteCallback);
      SoundManager.stop(this.currentSound);
      this.currentSound = null;
    }

    this.currentIndex++;
    this.playAtual();
  }

  destroy() {
    if (this.currentSound) {
      SoundManager.stop(this.currentSound);
    }
    this.hud.destroy();
    if (this.btPular) this.btPular.destroy();
  }
}
