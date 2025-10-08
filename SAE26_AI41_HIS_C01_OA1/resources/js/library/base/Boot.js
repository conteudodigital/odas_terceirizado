export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    // Hud
    this.load.image("Capa", "./resources/images/hud/Capa.png");
    this.load.image("Bg", "./resources/images/hud/Bg.png");
    this.load.image("btMenu", "./resources/images/hud/btMenu.png");
    this.load.image("btFechar", "./resources/images/hud/btFechar.png");

    this.load.image("Botao-Next", "./resources/images/hud/Botao-Next.png");
    this.load.image(
      "Botao-Previous",
      "./resources/images/hud/Botao-Previous.png"
    );

    this.load.image(
      "dialogo_intro",
      "./resources/images/hud/dialogo_intro.png"
    );

    this.load.image(
      "dialogo_intro_1",
      "./resources/images/hud/dialogo_intro_1.png"
    );

    this.load.image("bgFase1", "./resources/images/hud/bgFase1.png");

    // Sprites dos personagens
    this.load.image("gabe", "./resources/images/hud/gabe.png");
    this.load.image("gabe_inativo", "./resources/images/hud/gabe-inativo.png");
    this.load.image("ana", "./resources/images/hud/ana.png");
    this.load.image("ana_inativo", "./resources/images/hud/ana-inativo.png");
    this.load.image("luca", "./resources/images/hud/luca.png");
    this.load.image("luca_inativo", "./resources/images/hud/luca-inativo.png");
    this.load.image("ju", "./resources/images/hud/ju.png");
    this.load.image("ju_inativo", "./resources/images/hud/ju-inativo.png");
    this.load.image(
      "bt_azul",
      "./resources/images/hud/Botao-Selecionar-Azul.png"
    );
    this.load.image(
      "bt_cinza",
      "./resources/images/hud/Botao-Selecionar-Cinza.png"
    );

    this.load.image(
      "Depoimento-Gabe",
      "./resources/images/hud/Depoimento-Gabe.png"
    );

    this.load.image(
      "Depoimento-Ana",
      "./resources/images/hud/Depoimento-Ana.png"
    );

    this.load.image(
      "Depoimento-Ju",
      "./resources/images/hud/Depoimento-Ju.png"
    );

    this.load.image(
      "Depoimento-Luca",
      "./resources/images/hud/Depoimento-Luca.png"
    );

    this.load.image("quiz-gabe", "./resources/images/hud/quiz-gabe.png");

    this.load.image("quiz-ana", "./resources/images/hud/quiz-ana.png");

    this.load.image("quiz-ju", "./resources/images/hud/quiz-ju.png");

    this.load.image("quiz-luca", "./resources/images/hud/quiz-luca.png");

    this.load.image(
      "temporaria-branca",
      "./resources/images/hud/temporaria-branca.png"
    );

    this.load.image(
      "temporaria-selecionada",
      "./resources/images/hud/temporaria-selecionada.png"
    );

    this.load.image(
      "internacional-branca",
      "./resources/images/hud/internacional-branca.png"
    );

    this.load.image(
      "internacional-selecionada",
      "./resources/images/hud/internacional-selecionada.png"
    );

    this.load.image(
      "nacional-branca",
      "./resources/images/hud/nacional-branca.png"
    );

    this.load.image(
      "nacional-selecionada",
      "./resources/images/hud/nacional-selecionada.png"
    );

    this.load.image(
      "definitiva-branca",
      "./resources/images/hud/definitiva-branca.png"
    );

    this.load.image(
      "definitiva-selecionada",
      "./resources/images/hud/definitiva-selecionada.png"
    );

    this.load.image(
      "modal_feedback_negativoatv1",
      "./resources/images/hud/modal_feedback_negativoatv1.png"
    );

    this.load.image(
      "feedback-acerto",
      "./resources/images/hud/feedback-acerto.png"
    );

    this.load.image(
      "dialogofase2_1",
      "./resources/images/hud/dialogofase2_1.png"
    );

    this.load.image(
      "dialogofase2_2",
      "./resources/images/hud/dialogofase2_2.png"
    );

    this.load.image(
      "dialogofase2_3",
      "./resources/images/hud/dialogofase2_3.png"
    );

    this.load.image(
      "dialogofase2_4",
      "./resources/images/hud/dialogofase2_4.png"
    );

    this.load.image(
      "quiz1Background",
      "./resources/images/hud/quiz1Background.png"
    );

    this.load.image(
      "quiz1_a_branca",
      "./resources/images/hud/quiz1_a_branca.png"
    );

    this.load.image(
      "quiz1_b_branca",
      "./resources/images/hud/quiz1_b_branca.png"
    );

    this.load.image(
      "quiz1_c_branca",
      "./resources/images/hud/quiz1_c_branca.png"
    );

    this.load.image(
      "quiz1_a_selecionada",
      "./resources/images/hud/quiz1_a_selecionada.png"
    );

    this.load.image(
      "quiz1_b_selecionada",
      "./resources/images/hud/quiz1_b_selecionada.png"
    );

    this.load.image(
      "quiz1_c_selecionada",
      "./resources/images/hud/quiz1_c_selecionada.png"
    );

    this.load.image(
      "modal_feedback_negativoatv2",
      "./resources/images/hud/modal_feedback_negativoatv2.png"
    );

    this.load.image(
      "quiz2Background",
      "./resources/images/hud/quiz2Background.png"
    );

    this.load.image(
      "quiz2_a_branca",
      "./resources/images/hud/quiz2_a_branca.png"
    );

    this.load.image(
      "quiz2_a_selecionada",
      "./resources/images/hud/quiz2_a_selecionada.png"
    );

    this.load.image(
      "quiz2_b_branca",
      "./resources/images/hud/quiz2_b_branca.png"
    );

    this.load.image(
      "quiz2_b_selecionada",
      "./resources/images/hud/quiz2_b_selecionada.png"
    );

    this.load.image(
      "quiz2_c_branca",
      "./resources/images/hud/quiz2_c_branca.png"
    );

    this.load.image(
      "quiz2_c_selecionada",
      "./resources/images/hud/quiz2_c_selecionada.png"
    );

    this.load.image(
      "dialogofase2_5",
      "./resources/images/hud/dialogofase2_5.png"
    );

    this.load.image(
      "dialogofase2_6",
      "./resources/images/hud/dialogofase2_6.png"
    );

    this.load.image(
      "dialogofase2_7",
      "./resources/images/hud/dialogofase2_7.png"
    );

    this.load.image(
      "dialogofase2_8",
      "./resources/images/hud/dialogofase2_8.png"
    );

    this.load.image(
      "modal_feedback_concluido",
      "./resources/images/hud/modal_feedback_concluido.png"
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
