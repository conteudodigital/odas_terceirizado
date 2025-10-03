export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    // Hud
    this.load.image("Bg", "./resources/images/hud/Bg.png");
    this.load.image("btMenu", "./resources/images/hud/btMenu.png");
    this.load.image("btFechar", "./resources/images/hud/btFechar.png");

    this.load.image("btSoundOn", "./resources/images/hud/btSonsNormal.png"); // Botão de som ligado
    this.load.image("btSoundOff", "./resources/images/hud/btSonsMutado.png"); //
    this.load.image("btEnunciado", "./resources/images/hud/btEnunciado.png");
    this.load.image(
      "btMusicasOn",
      "./resources/images/hud/btMusicasNormal.png"
    );
    this.load.image(
      "btMusicasOff",
      "./resources/images/hud/btMusicasMutado.png"
    );
    this.load.image("btTelaCheia", "./resources/images/hud/btTelaCheia.png");
    this.load.image("btOrientacao", "./resources/images/hud/btOrientacao.png");
    this.load.svg(
      "btOrientacao_sae",
      "./resources/images/hud/btOrientacao_sae.svg"
    );
    this.load.svg(
      "btOrientacao_cqt",
      "./resources/images/hud/btOrientacao_cqt.svg"
    );
    this.load.svg(
      "btOrientacao_spe",
      "./resources/images/hud/btOrientacao_spe.svg"
    );

    this.load.image("modalEnunciado", "./resources/images/hud/modal1.png");
    this.load.image(
      "modalFeedbackPositivo",
      "./resources/images/hud/modal3.png"
    );
    this.load.image(
      "modalFeedbackNegativo",
      "./resources/images/hud/modal2.png"
    );
    this.load.image("btVamosLa", "./resources/images/hud/btVamosLa.png");
    this.load.image("btVoltar", "./resources/images/hud/btVoltar.png");
    this.load.image("btNarracao", "././resources/images/hud/btNarracao.png");
    this.load.image("btConfirmar", "././resources/images/hud/btConfirmar.png");
    this.load.image(
      "btJogarNovamente",
      "././resources/images/hud/btJogarNovamente.png"
    );
    this.load.image("digiPositivo", "././resources/images/hud/digi1.png");
    this.load.image("digiNegativo", "././resources/images/hud/digi2.png");
    this.load.image("boxCreditos", "././resources/images/hud/boxCreditos.png");
    this.load.image("btCreditos", "././resources/images/hud/btCreditos.png");

    this.load.image("capa", "././resources/images/hud/capa.png");
    this.load.image("tutorialBg", "././resources/images/hud/tutorialBg.png");

    this.load.image("gameFullBg", "././resources/images/hud/gameFullBg.png");

    this.load.image("inseto", "././resources/images/hud/inseto.png");
    this.load.image("peixe", "././resources/images/hud/peixe.png");
    this.load.image("lagarto", "././resources/images/hud/lagarto.png");
    this.load.image("cachorro", "././resources/images/hud/cachorro.png");
    this.load.image("cobra", "././resources/images/hud/cobra.png");
    this.load.image("caracol", "././resources/images/hud/caracol.png");
    this.load.image("pato", "././resources/images/hud/pato.png");
    this.load.image("golfinho", "././resources/images/hud/golfinho.png");
    this.load.image("passaro", "././resources/images/hud/passaro.png");
    this.load.image("sapo", "././resources/images/hud/sapo.png");

    this.load.image(
      "modal_feedback_positivo_atv1",
      "././resources/images/hud/modal_feedback_positivo_atv1.png"
    );
    this.load.image(
      "modal_feedback_negativo_atv1",
      "././resources/images/hud/modal_feedback_negativo_atv1.png"
    );

    this.load.image("tutorial2Bg", "././resources/images/hud/tutorial2Bg.png");

    this.load.image("game2FullBg", "././resources/images/hud/game2FullBg.png");

    this.load.image("terra", "././resources/images/hud/terra.png");

    this.load.image("agua", "././resources/images/hud/agua.png");

    this.load.image("ambos", "././resources/images/hud/ambos.png");

    this.load.image("cobra_img", "././resources/images/hud/cobra_img.png");

    this.load.image(
      "cobra_sombra",
      "././resources/images/hud/cobra_sombra.png"
    );

    this.load.image("pato_img", "././resources/images/hud/pato_img.png");

    this.load.image("pato_sombra", "././resources/images/hud/pato_sombra.png");

    this.load.image(
      "golfinho_img",
      "././resources/images/hud/golfinho_img.png"
    );

    this.load.image(
      "golfinho_sombra",
      "././resources/images/hud/golfinho_sombra.png"
    );

    this.load.image("sapo_img", "././resources/images/hud/sapo_img.png");

    this.load.image("sapo_sombra", "././resources/images/hud/sapo_sombra.png");

    this.load.image("biav1", "././resources/images/hud/biav1.png");

    this.load.image("biav2", "././resources/images/hud/biav2.png");

    this.load.image(
      "cobra_letreiro",
      "././resources/images/hud/cobra_letreiro.png"
    );
    this.load.image(
      "golfinho_letreiro",
      "././resources/images/hud/golfinho_letreiro.png"
    );
    this.load.image(
      "pato_letreiro",
      "././resources/images/hud/pato_letreiro.png"
    );
    this.load.image(
      "sapo_letreiro",
      "././resources/images/hud/sapo_letreiro.png"
    );

    this.load.image(
      "modal_feedback_concluido",
      "././resources/images/hud/modal_feedback_concluido.png"
    );

    //------------------------------------------------------------------

    this.load.plugin(
      "rextagtextplugin",
      "resources/js/library/plugins/rextagtextplugin.min.js",
      true
    );

    this.load.svg("btFechar_sae", "./resources/images/hud/btFechar_sae.svg");
    this.load.svg("btFechar_cqt", "./resources/images/hud/btFechar_cqt.svg");
    this.load.svg("btFechar_spe", "./resources/images/hud/btFechar_spe.svg");

    this.load.svg("iconPlayButton", "./resources/images/hud/iconPlay.svg");
    this.load.svg("iconReload", "./resources/images/hud/iconReload.svg");
    this.load.svg("elipse", "./resources/images/hud/elipse.svg");

    this.load.json("gameData", "./resources/game/data/oda.json");

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

    // Monitora o carregamento
    /*this.load.on('complete', () => {
            this.scene.start('Preload');
        });*/
  }

  create() {
    const gameData = this.cache.json.get("gameData");
    this.game.registry.set("gameData", gameData);

    this.scene.start("Preload"); // Fazendo o preload dos assets.

    // Removemos o start daqui, pois agora está no evento complete
  }
}
