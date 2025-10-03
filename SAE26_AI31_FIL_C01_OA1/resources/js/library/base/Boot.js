export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    // Hud
    this.load.image("Bg", "./resources/images/hud/Bg.png");
    this.load.image("btMenu", "./resources/images/hud/btMenu.png");
    this.load.image("btFechar", "./resources/images/hud/btFechar.png");

    this.load.image(
      "BackgroundCapa",
      "./resources/images/hud/BackgroundCapa.png"
    );

    this.load.image("titulo", "./resources/images/hud/titulo.png");
    this.load.image("bgTitulo", "./resources/images/hud/bgTitulo.png");
    this.load.image(
      "narracao_icon",
      "./resources/images/hud/narracao_icon.png"
    );

    this.load.image("bgGame", "./resources/images/hud/bgGame.png");

    this.load.image(
      "textframe-Ana",
      "./resources/images/hud/textframe-Ana.png"
    );

    this.load.image(
      "Botao-Previous",
      "./resources/images/hud/Botao-Previous.png"
    );
    this.load.image("Botao-Next", "./resources/images/hud/Botao-Next.png");

    this.load.image(
      "personagem-ana-v1",
      "./resources/images/hud/personagem-ana-v1.png"
    );
    this.load.image(
      "personagem-ana-v2",
      "./resources/images/hud/personagem-ana-v2.png"
    );

    this.load.image(
      "backgroundBlur",
      "./resources/images/hud/backgroundBlur.png"
    );

    this.load.image("popUpAtv1", "./resources/images/hud/popUpAtv1.png");

    this.load.image("modal_atv1", "./resources/images/hud/modal_atv1.png");

    this.load.image("modal_atv2", "./resources/images/hud/modal_atv2.png");

    this.load.image(
      "pop_up_branco1",
      "./resources/images/hud/pop_up_branco1.png"
    );

    this.load.image(
      "pop_up_branco2",
      "./resources/images/hud/pop_up_branco2.png"
    );

    this.load.image(
      "pop_up_branco3",
      "./resources/images/hud/pop_up_branco3.png"
    );

    this.load.image("quadro_vazio", "./resources/images/hud/quadro_vazio.png");

    this.load.image("quadro_img_1", "./resources/images/hud/quadro_img_1.png");
    this.load.image("quadro_img_2", "./resources/images/hud/quadro_img_2.png");
    this.load.image("quadro_img_3", "./resources/images/hud/quadro_img_3.png");

    this.load.image(
      "pop_up_amarelo1",
      "./resources/images/hud/pop_up_amarelo1.png"
    );
    this.load.image(
      "pop_up_amarelo2",
      "./resources/images/hud/pop_up_amarelo2.png"
    );
    this.load.image(
      "pop_up_amarelo3",
      "./resources/images/hud/pop_up_amarelo3.png"
    );

    this.load.image(
      "amarelo_mictorio",
      "./resources/images/hud/amarelo_mictorio.png"
    );
    this.load.image(
      "amarelo_bansky",
      "./resources/images/hud/amarelo_bansky.png"
    );
    this.load.image("amarelo_doge", "./resources/images/hud/amarelo_doge.png");

    this.load.image("atv1text", "./resources/images/hud/atv1text.png");

    this.load.image(
      "Button-Copyright",
      "./resources/images/hud/Button-Copyright.png"
    );
    this.load.image(
      "credits_mictorio",
      "./resources/images/hud/credits_mictorio.png"
    );
    this.load.image("credits_doge", "./resources/images/hud/credits_doge.png");
    this.load.image(
      "credits_bansky",
      "./resources/images/hud/credits_bansky.png"
    );

    this.load.image(
      "closeCreditsModal",
      "./resources/images/hud/closeCreditsModal.png"
    );

    this.load.image(
      "modal_atv_feedback_atv2",
      "./resources/images/hud/modal_atv_feedback_atv2.png"
    );

    this.load.image(
      "modal_atv_feedback_atv3",
      "./resources/images/hud/modal_atv_feedback_atv3.png"
    );

    this.load.image(
      "modal_atv_feedback_atv4",
      "./resources/images/hud/modal_atv_feedback_atv4.png"
    );

    this.load.image("atv2text", "./resources/images/hud/atv2text.png");

    this.load.image("mochila_atv2", "./resources/images/hud/mochila_atv2.png");

    this.load.image("banana_atv2", "./resources/images/hud/banana_atv2.png");

    this.load.image("xicara_atv2", "./resources/images/hud/xicara_atv2.png");

    this.load.image(
      "controle_atv2",
      "./resources/images/hud/controle_atv2.png"
    );

    this.load.image(
      "Botao_Registrar_Obra",
      "./resources/images/hud/Botao_Registrar_Obra.png"
    );

    this.load.image(
      "Botao_Zoom_Out",
      "./resources/images/hud/Botao_Zoom_Out.png"
    );

    this.load.image(
      "Botao_Zoom_In",
      "./resources/images/hud/Botao_Zoom_In.png"
    );

    this.load.image("Botao_Rotate", "./resources/images/hud/Botao_Rotate.png");

    this.load.image("quadroDeArte", "./resources/images/hud/quadroDeArte.png");

    this.load.image(
      "popUpFundoAtv2",
      "./resources/images/hud/popUpFundoAtv2.png"
    );

    this.load.image(
      "Modal_Feedback",
      "./resources/images/hud/Modal_Feedback.png"
    );

    this.load.image(
      "Botao_Download",
      "./resources/images/hud/Botao_Download.png"
    );

    this.load.image(
      "Botao_Finalizar",
      "./resources/images/hud/Botao_Finalizar.png"
    );

    //----------------------------------

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
