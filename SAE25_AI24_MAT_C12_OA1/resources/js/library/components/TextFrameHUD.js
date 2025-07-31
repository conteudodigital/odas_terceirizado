export class TextFrameHUD extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - Cena atual
   * @param {number} x - Posição X do HUD
   * @param {number} y - Posição Y do HUD
   * @param {string} frameKey - Key da imagem do frame (default: "textframe")
   * @param {number} extraHeight - altura extra a somar ao frame (sem mexer em texto/personagem)
   */
  constructor(scene, x = 0, y = 0, frameKey = "textframe", extraHeight = 0) {
    super(scene, x, y);

    this.scene = scene;

    this.frame = scene.add.image(0, 0, frameKey).setOrigin(0, 0);

    const frameWidth = this.frame.width;
    const frameHeight = this.frame.height;

    if (extraHeight !== 0) {
      this.frame.setDisplaySize(frameWidth, frameHeight + extraHeight);
    }

    this.centerText = scene.add
      .text(0, 0, "", {
        fontFamily: "Nunito-ExtraBold",
        fontSize: "35px",
        fontWeight: "700",
        lineHeight: 1.2,
        lineSpacing: 2,
        color: "#000000",
        align: "left",
        wordWrap: { width: frameWidth - 400 },
        textTransform: "uppercase",
      })
      .setOrigin(0, 0);

    this.centerText.x = 50;
    this.centerText.y = frameHeight * 0.3;

    this.tadeuName = scene.add.image(0, 0, "personagem_V1").setOrigin(0, 1);
    this.tadeuName.x = this.frame.x + 1000;
    this.tadeuName.y = 435;

    this.add([this.frame, this.tadeuName, this.centerText]);

    scene.add.existing(this);
  }

  setExtraHeight(extraHeight) {
    const frameWidth = this.frame.width;
    const frameHeight = this.frame.height;
    this.frame.setDisplaySize(frameWidth, frameHeight + extraHeight);
    return this;
  }

  onBack(callback) {
    this.btBack.setInteractive({ cursor: "pointer" });
    this.btBack.on("pointerdown", callback);
  }

  onNext(callback) {
    this.btNext.setInteractive({ cursor: "pointer" });
    this.btNext.on("pointerdown", callback);
  }

  setText(content) {
    this.centerText.setText(content.toUpperCase());
    return this;
  }
}
