import { BaseCena } from "../../js/library/base/BaseCena.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;
  }

  create() {
    const background = this.add.image(0, 0, "bgGame1").setOrigin(0, 0);

    const comprovantesKeys = [
      "comprovante_pagamento",
      "comprovante_pix_enviado",
      "comprovante_pix_recebido",
      "comprovante_salario",
      "comprovante_transporte",
    ];

    const escalaBase = 0.35;
    const padding = 20;
    const hoverScale = 1.05;
    const offsetX = -125;
    const topY = 805;

    const OUTLINE_COLOR = 0x5adcff;
    const OUTLINE_ALPHA = 0.5;
    const OUTLINE_PX = 7;

    this.comprovantes = [];

    comprovantesKeys.forEach((key) => {
      const container = this.add.container(0, 0);
      container.setScale(1);

      const sprite = this.add.image(0, 0, key).setOrigin(0.5);
      sprite.setScale(escalaBase);

      const w = sprite.displayWidth;
      const h = sprite.displayHeight;

      const offsets = [
        [-OUTLINE_PX, 0],
        [OUTLINE_PX, 0],
        [0, -OUTLINE_PX],
        [0, OUTLINE_PX],
        [-OUTLINE_PX, -OUTLINE_PX],
        [OUTLINE_PX, -OUTLINE_PX],
        [-OUTLINE_PX, OUTLINE_PX],
        [OUTLINE_PX, OUTLINE_PX],
      ];

      const outlineParts = offsets.map(([ox, oy]) => {
        const s = this.add.image(ox, oy, key).setOrigin(0.5);
        s.setScale(escalaBase);
        s.setTint(OUTLINE_COLOR);
        s.setAlpha(OUTLINE_ALPHA);
        s.setVisible(false);
        return s;
      });

      container.add([...outlineParts, sprite]);

      this.comprovantes.push({ container, sprite, outlineParts, w, h });
    });

    const totalWidth =
      this.comprovantes.reduce((acc, c) => acc + c.w, 0) +
      padding * (this.comprovantes.length - 1);

    const startX =
      background.x + (background.displayWidth - totalWidth) / 2 + offsetX;

    const baseH = this.comprovantes[0].h;
    const centerY = topY + baseH / 2;

    let cursorX = startX;
    this.comprovantes.forEach((c) => {
      c.container.x = cursorX + c.w / 2;
      c.container.y = centerY;
      cursorX += c.w + padding;

      c.sprite.setInteractive({ useHandCursor: true });

      c.sprite.on("pointerover", () => {
        c.outlineParts.forEach((s) => s.setVisible(true));
        this.tweens.add({
          targets: c.container,
          scale: hoverScale,
          duration: 140,
          ease: "Quad.easeOut",
        });
      });

      c.sprite.on("pointerout", () => {
        c.outlineParts.forEach((s) => s.setVisible(false));
        this.tweens.add({
          targets: c.container,
          scale: 1,
          duration: 140,
          ease: "Quad.easeOut",
        });
      });

      c.sprite.on("pointerdown", () => {
        this.scene.start("Game2");
      });
    });

    super.create();
  }
}

export default Game1;
