import { TextFrameHUD } from "../components/TextFrameHUD.js";
import SoundManager from "../managers/SoundManager.js";
import { Button } from "../components/Button.js";

export class NarradorWImg {
  constructor(
    scene,
    sequencia = [],
    narracaoKey = null,
    colors = null,
    onFinish = null,
    personagens = { v1: "personagem_V1", v2: "personagem_V2" },
    permitirPular = true,
    textFrameKey = "textframe"
  ) {
    this.scene = scene;
    this.sequencia = sequencia;
    this.narracaoKey = narracaoKey;
    this.colors = colors;
    this.onFinish = onFinish;
    this.personagens = personagens;
    this.permitirPular = permitirPular;
    this.textFrameKey = textFrameKey;

    this.imgAtuais = [];
    this.timers = [];

    this.hud = new TextFrameHUD(scene, 0, 0, this.textFrameKey, -25);
    const frameH = this.hud.frame.height;
    this.hud.y = scene.scale.height - frameH;
    this.hud.x = (scene.scale.width - this.hud.frame.width) / 2 - 50;

    if (this.permitirPular) {
      this.btPular = new Button(scene, {
        text: "PULAR",
        showIcon: false,
        colors: this.colors || {
          background: 0xffffff,
          border: 0x000000,
          text: 0x000000,
        },
      });
      scene.add.existing(this.btPular);
      const pad = 100;
      const bounds = this.btPular.getBounds();
      this.btPular.x = scene.scale.width - bounds.width - pad;
      this.btPular.y = 40;
      this.btPular.setScrollFactor(0);
      this.btPular.setDepth(9999);
      this.btPular.on("buttonClick", () => this.pular());
    }

    SoundManager.init(scene);
    this.executarSequencia();
  }

  executarSequencia() {
    this.currentSound = SoundManager.play(this.narracaoKey, 1.0, false, () => {
      this.finalizar();
    });

    this.sequencia.forEach((passo, index) => {
      const timer = this.scene.time.addEvent({
        delay: passo.delay,
        callback: () => this.executarPasso(index),
      });
      this.timers.push(timer);
    });
  }

  executarPasso(index) {
    const passo = this.sequencia[index];
    this.hud.setText(passo.texto);

    const tex = index % 2 === 1 ? this.personagens.v1 : this.personagens.v2;
    this.hud.tadeuName.setTexture(tex);

    if (passo.imagem) {
      const x = passo.pos?.x ?? this.scene.scale.width / 2;
      const y = passo.pos?.y ?? this.scene.scale.height / 2;
      const img = this.scene.add
        .image(x, y, passo.imagem)
        .setOrigin(0.5)
        .setAlpha(0);
      img.setDepth(50);

      this.scene.tweens.add({
        targets: img,
        alpha: 1,
        duration: 600,
        ease: "Power2",
      });

      this.imgAtuais.push(img);
    }
  }

  pular() {
    this.timers.forEach((t) => t.remove());
    this.timers = [];

    if (this.currentSound) {
      SoundManager.stop(this.currentSound);
      this.currentSound = null;
    }

    this.finalizar();
  }

  finalizar() {
    this.hud.destroy();
    this.imgAtuais.forEach((img) => img.destroy());
    if (this.btPular) this.btPular.destroy();
    if (this.onFinish) this.onFinish();
  }

  destroy() {
    this.pular();
  }
}
