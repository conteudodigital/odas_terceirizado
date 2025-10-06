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

    this.load.image("popUpIntro1", "./resources/images/hud/popUpIntro1.png");
    this.load.image("popUpIntro2", "./resources/images/hud/popUpIntro2.png");
    this.load.image(
      "button_fechar",
      "./resources/images/hud/button-fechar.png"
    );
    this.load.image("bgIntro", "./resources/images/hud/bgIntro.png");

    this.load.image(
      "textframe-leon",
      "./resources/images/hud/textframe-leon.png"
    );

    this.load.image("leonv1", "./resources/images/hud/leonv1.png");

    this.load.image("leonv2", "./resources/images/hud/leonv2.png");

    this.load.image("Botao-Next", "./resources/images/hud/Botao-Next.png");

    this.load.image(
      "Botao-Previous",
      "./resources/images/hud/Botao-Previous.png"
    );

    this.load.image("popUpIntro3", "./resources/images/hud/popUpIntro3.png");

    this.load.image("bgIntro2", "./resources/images/hud/bgIntro2.png");

    this.load.image("atv1Bg", "./resources/images/hud/atv1Bg.png");

    this.load.image("s_drag", "./resources/images/hud/s_drag.png");

    this.load.image("cedilha_drag", "./resources/images/hud/cedilha_drag.png");

    this.load.image("ss_drag", "./resources/images/hud/ss_drag.png");

    this.load.image("leon_atv1", "./resources/images/hud/leon_atv1.png");
    this.load.image("leon_atv2", "./resources/images/hud/leon_atv2.png");

    this.load.image("atv1_quest1", "./resources/images/hud/atv1_quest1.png");
    this.load.image("atv1_quest2", "./resources/images/hud/atv1_quest2.png");
    this.load.image("atv1_quest3", "./resources/images/hud/atv1_quest3.png");

    this.load.image(
      "feedback_acerto",
      "./resources/images/hud/feedback_acerto.png"
    );
    this.load.image(
      "feedback_erro",
      "./resources/images/hud/feedback_erro.png"
    );

    this.load.image(
      "modal_positivo_atv1",
      "./resources/images/hud/modal_positivo_atv1.png"
    );

    this.load.image(
      "modal_negativo_atv1",
      "./resources/images/hud/modal_negativo_atv1.png"
    );

    this.load.image("bgIntro3", "./resources/images/hud/bgIntro3.png");

    this.load.image(
      "popUpIntro3_1",
      "./resources/images/hud/popUpIntro3_1.png"
    );

    this.load.image(
      "popUpIntro3_2",
      "./resources/images/hud/popUpIntro3_2.png"
    );

    this.load.image(
      "popUpIntro3_3",
      "./resources/images/hud/popUpIntro3_3.png"
    );

    this.load.image(
      "popUpIntro3_4",
      "./resources/images/hud/popUpIntro3_4.png"
    );

    this.load.image("bgIntro4", "./resources/images/hud/bgIntro4.png");

    this.load.image(
      "popUpIntro4_1",
      "./resources/images/hud/popUpIntro4_1.png"
    );

    this.load.image(
      "popUpIntro4_2",
      "./resources/images/hud/popUpIntro4_2.png"
    );

    this.load.image(
      "popUpIntro4_3",
      "./resources/images/hud/popUpIntro4_3.png"
    );

    this.load.image("c_drag", "./resources/images/hud/c_drag.png");

    this.load.image("atv2_bg", "./resources/images/hud/atv2_bg.png");

    this.load.image("atv2_quest1", "./resources/images/hud/atv2_quest1.png");

    this.load.image("atv2_quest2", "./resources/images/hud/atv2_quest2.png");

    this.load.image("atv2_quest3", "./resources/images/hud/atv2_quest3.png");

    this.load.image(
      "modal_positivo_atv2",
      "./resources/images/hud/modal_positivo_atv2.png"
    );

    this.load.image("atv3_bg", "./resources/images/hud/atv3_bg.png");

    this.load.image("atv3_quest1", "./resources/images/hud/atv3_quest1.png");

    this.load.image("atv3_quest2", "./resources/images/hud/atv3_quest2.png");

    this.load.image(
      "modal_positivo_atv3",
      "./resources/images/hud/modal_positivo_atv3.png"
    );

    this.load.image(
      "modal_negativo_atv3",
      "./resources/images/hud/modal_negativo_atv3.png"
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
