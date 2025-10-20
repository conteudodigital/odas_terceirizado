export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    // Hud
    this.load.image("Bg", "./resources/images/hud/Bg.png");
    this.load.image("btMenu", "./resources/images/hud/btMenu.png");
    this.load.image("btFechar", "./resources/images/hud/btFechar.png");

    this.load.image("Capa", "./resources/images/hud/Capa.png");
    this.load.image("dialogo1_1", "./resources/images/hud/dialogo1_1.png");
    this.load.image("dialogo1_2", "./resources/images/hud/dialogo1_2.png");

    this.load.image("Botao-Next", "./resources/images/hud/Botao-Next.png");
    this.load.image(
      "Botao-Previous",
      "./resources/images/hud/Botao-Previous.png"
    );

    this.load.image(
      "bolinha_azul",
      "./resources/images/hud/bolinha_forca_azul.png"
    );

    this.load.image(
      "bolinha_laranja",
      "./resources/images/hud/bolinha_laranja.png"
    );

    this.load.image("bolinha_rosa", "./resources/images/hud/bolinha_rosa.png");

    this.load.image(
      "bolinha_verde",
      "./resources/images/hud/bolinha_verde.png"
    );

    this.load.image("game1_bg", "./resources/images/hud/game1_bg.png");
    +this.load.image("dialogo1_3", "./resources/images/hud/dialogo1_3.png");

    this.load.image("dialogo1_4", "./resources/images/hud/dialogo1_4.png");

    this.load.image("dialogo1_5", "./resources/images/hud/dialogo1_5.png");

    this.load.image("game2_bg", "./resources/images/hud/game2_bg.png");

    this.load.image(
      "feedback-acerto",
      "./resources/images/hud/feedback-acerto.png"
    );

    this.load.image("area_bolinha", "./resources/images/hud/area_bolinha.png");
    this.load.image(
      "estrela_bolinha",
      "./resources/images/hud/estrela_bolinha.png"
    );

    this.load.image(
      "triangulo_area_atv1",
      "./resources/images/hud/triangulo_area_atv1.png"
    );

    this.load.image("forca1_vazia", "./resources/images/hud/forca1_vazia.png");
    this.load.image("forca2_vazia", "./resources/images/hud/forca2_vazia.png");
    this.load.image("forca3_vazia", "./resources/images/hud/forca3_vazia.png");

    this.load.image("forca1_cheia", "./resources/images/hud/forca1_cheia.png");
    this.load.image("forca2_cheia", "./resources/images/hud/forca2_cheia.png");
    this.load.image("forca3_cheia", "./resources/images/hud/forca3_cheia.png");

    this.load.image("mira", "./resources/images/hud/mira.png");
    this.load.image("mira_cima", "./resources/images/hud/mira_cima.png");
    this.load.image("mira_baixo", "./resources/images/hud/mira_baixo.png");

    this.load.image("modelo_1", "./resources/images/hud/modelo_1.png");

    this.load.image("modelo_2", "./resources/images/hud/modelo_2.png");

    this.load.image("modelo_3", "./resources/images/hud/modelo_3.png");

    this.load.image("dialogo2_1", "./resources/images/hud/dialogo2_1.png");

    this.load.image("linha_atv2", "./resources/images/hud/linha_atv2.png");

    this.load.image("game3_bg", "./resources/images/hud/game3_bg.png");

    this.load.image("dialogo3_1", "./resources/images/hud/dialogo3_1.png");
    this.load.image("dialogo3_2", "./resources/images/hud/dialogo3_2.png");

    this.load.image("game4_bg", "./resources/images/hud/game4_bg.png");

    this.load.image(
      "buraco_modelo",
      "./resources/images/hud/buraco_modelo.png"
    );

    this.load.image(
      "modal_feedback_finalizacao",
      "./resources/images/hud/modal_feedback_finalizacao.png"
    );

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
