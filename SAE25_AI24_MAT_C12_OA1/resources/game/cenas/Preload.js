export class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "Preload" });
  }

  preload() {
    // Efeitos sonoros
    this.load.audio("click", "resources/game/sounds/click.mp3");
    this.load.audio("acerto", "resources/game/sounds/acerto.mp3");
    this.load.audio("erro", "resources/game/sounds/erro.mp3");

    this.load.audio(
      "feedback-positivo",
      "resources/game/sounds/feedback-positivo.mp3"
    );
    this.load.audio(
      "feedback-negativo",
      "resources/game/sounds/feedback-negativo.mp3"
    );

    //Narrações
    //Ju
    this.load.audio("CH_JU001", "resources/game/sounds/CH_JU001.mp3");
    this.load.audio("CH_JU002", "resources/game/sounds/CH_JU002.mp3");
    this.load.audio("CH_JU003", "resources/game/sounds/CH_JU003.mp3");
    this.load.audio("CH_JU004", "resources/game/sounds/CH_JU004.mp3");
    this.load.audio("CH_JU005", "resources/game/sounds/CH_JU005.mp3");
    this.load.audio("CH_JU006", "resources/game/sounds/CH_JU006.mp3");
    this.load.audio("CH_JU007", "resources/game/sounds/CH_JU007.mp3");
    this.load.audio("CH_JU008", "resources/game/sounds/CH_JU008.mp3");
    this.load.audio("CH_JU009", "resources/game/sounds/CH_JU009.mp3");

    this.load.audio("CH_GA001", "resources/game/sounds/CH_GA001.mp3");
    this.load.audio("CH_BI001", "resources/game/sounds/CH_BI001.mp3");
    this.load.audio("CH_LU001", "resources/game/sounds/CH_LU001.mp3");
    this.load.audio("CH_AN001", "resources/game/sounds/CH_AN001.mp3");

    this.load.audio("NA001", "resources/game/sounds/NA001.mp3");
    this.load.audio("NA002", "resources/game/sounds/NA002.mp3");
    this.load.audio("NA003", "resources/game/sounds/NA003.mp3");
    this.load.audio("NA004", "resources/game/sounds/NA004.mp3");
    this.load.audio("NA005", "resources/game/sounds/NA005.mp3");
    this.load.audio("NA006", "resources/game/sounds/NA006.mp3");
    this.load.audio("NA007", "resources/game/sounds/NA007.mp3");
    this.load.audio("NA008", "resources/game/sounds/NA008.mp3");
    this.load.audio("NA009", "resources/game/sounds/NA009.mp3");

    this.load.audio("music", "resources/game/sounds/music.mp3");

    // Adicione um texto de carregamento
    const loadingText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, "Carregando...", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    // Atualize a barra de carregamento (opcional)
    this.load.on("progress", (value) => {
      loadingText.setText(`Carregando... ${Math.round(value * 100)}%`);
    });
  }

  create() {
    const gameData = this.cache.json.get("gameData");
    this.game.registry.set("gameData", gameData);

    // Colocar as fontes aqui para garantir que foram carregadas. Verificar em index.html se está fazendo o load no css.
    Promise.all([
      document.fonts.load("36px Nunito-ExtraBold"),
      document.fonts.load("40px Nunito"),
    ]).then(() => {
      this.scene.start("Capa");
    });
  }
}
