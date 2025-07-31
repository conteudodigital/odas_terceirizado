export class NarradorSup extends Phaser.GameObjects.Container {
  constructor(scene, x, y, texto, somKey) {
    super(scene, x, y);
    this.scene = scene;
    this.somKey = somKey;
    this.currentNarracao = null;

    const faixa = scene.add
      .image(0, 0, "enunciado-com-narracao")
      .setOrigin(0.5);

    const icone = scene.add
      .image(-faixa.width / 2 + 70, 0, "narracao_icon")
      .setDisplaySize(100, 100)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    icone.on("pointerdown", () => {
      if (!this.currentNarracao) {
        this.currentNarracao = scene.sound.add(this.somKey);
      }
      if (this.currentNarracao.isPlaying) {
        this.currentNarracao.stop();
      }
      this.currentNarracao.play();
    });

    scene.events.on("shutdown", () => {
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        this.currentNarracao.stop();
      }
    });
    this.on("destroy", () => {
      if (this.currentNarracao && this.currentNarracao.isPlaying) {
        this.currentNarracao.stop();
      }
    });

    const regex = /(.*?)(GABE|BIA|ANA|LUCA)(.*)/i;
    const match = texto.match(regex);

    const textoAntes = match ? match[1] : texto;
    const destaque = match ? match[2] : "";
    const textoDepois = match ? match[3] : "";

    const estiloPadrao = {
      fontFamily: "Nunito",
      fontSize: "32px",
      fontWeight: "800",
      fontStyle: "bold",
      color: "#FFFFFF",
      align: "center",
    };

    const texto1 = scene.add
      .text(0, 0, textoAntes, estiloPadrao)
      .setOrigin(0, 0.5);
    texto1.setStroke("#222222", 6);

    const textoDestaque = scene.add
      .text(0, 0, destaque, {
        ...estiloPadrao,
        color: "#FFCC00",
      })
      .setOrigin(0, 0.5);
    textoDestaque.setStroke("#222222", 6);

    const texto2 = scene.add
      .text(0, 0, textoDepois, estiloPadrao)
      .setOrigin(0, 0.5);
    texto2.setStroke("#222222", 6);

    const paddingEsquerdo = 80;

    const totalWidth =
      texto1.width + textoDestaque.width + texto2.width + paddingEsquerdo;
    const startX = -totalWidth / 2 + paddingEsquerdo;

    texto1.x = startX;
    textoDestaque.x = texto1.x + texto1.width + 5;
    texto2.x = textoDestaque.x + textoDestaque.width + 5;

    texto1.y = textoDestaque.y = texto2.y = 0;

    this.add([faixa, icone, texto1, textoDestaque, texto2]);
    scene.add.existing(this);
  }
}
