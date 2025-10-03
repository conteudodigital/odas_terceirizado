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

    //---------------------------------------------------------------------

    this.load.image("bgCapa", "././resources/images/hud/bgCapa.png");
    this.load.image("titulo", "././resources/images/hud/titulo.png");

    this.load.image(
      "personagem_LucaV1",
      "././resources/images/hud/personagem_LucaV1.png"
    );
    this.load.image(
      "personagem_LucaV2",
      "././resources/images/hud/personagem_LucaV2.png"
    );
    this.load.image(
      "textframe-luca",
      "././resources/images/hud/textframe-luca.png"
    );

    this.load.image("bgGame", "././resources/images/hud/bgGame.png");

    this.load.image("Botao-Next", "././resources/images/hud/Botao-Next.png");
    this.load.image(
      "Botao-Previous",
      "././resources/images/hud/Botao-Previous.png"
    );

    this.load.image("bgGame1", "././resources/images/hud/bgGame1.png");

    this.load.image(
      "comprovante_pagamento",
      "././resources/images/hud/comprovante_pagamento.png"
    );
    this.load.image(
      "comprovante_pix_enviado",
      "././resources/images/hud/comprovante_pix_enviado.png"
    );
    this.load.image(
      "comprovante_pix_recebido",
      "././resources/images/hud/comprovante_pix_recebido.png"
    );
    this.load.image(
      "comprovante_salario",
      "././resources/images/hud/comprovante_salario.png"
    );
    this.load.image(
      "comprovante_transporte",
      "././resources/images/hud/comprovante_transporte.png"
    );

    this.load.image(
      "background_atv1",
      "././resources/images/hud/background_atv1.png"
    );

    this.load.image(
      "Modal_FeedbackPositivo_Atv1",
      "././resources/images/hud/Modal_FeedbackPositivo_Atv1.png"
    );

    this.load.image(
      "Modal_FeedbackNegativo_Atv1",
      "././resources/images/hud/Modal_FeedbackNegativo_Atv1.png"
    );

    this.load.image(
      "calculadora_entradas",
      "././resources/images/hud/calculadora_entradas.png"
    );

    this.load.image(
      "Modal_FeedbackNegativo_Atv2",
      "././resources/images/hud/Modal_FeedbackNegativo_Atv2.png"
    );

    this.load.image(
      "calculadora_saidas",
      "././resources/images/hud/calculadora_saidas.png"
    );

    this.load.image(
      "calculadora_entradasesaidas",
      "././resources/images/hud/calculadora_entradasesaidas.png"
    );

    this.load.image(
      "Modal_FeedbackPositivo_Atv3",
      "././resources/images/hud/Modal_FeedbackPositivo_Atv3.png"
    );

    this.load.image(
      "Modal_FeedbackNegativo_Atv3",
      "././resources/images/hud/Modal_FeedbackNegativo_Atv3.png"
    );

    this.load.image(
      "calculadora_aulaparticular",
      "././resources/images/hud/calculadora_aulaparticular.png"
    );

    this.load.image(
      "calculadora_vendadebolos",
      "././resources/images/hud/calculadora_vendadebolos.png"
    );

    this.load.image(
      "calculadora_traducaodetexto",
      "././resources/images/hud/calculadora_traducaodetexto.png"
    );

    this.load.image(
      "calculadora_ganhos",
      "././resources/images/hud/calculadora_ganhos.png"
    );

    this.load.image("saldofinal", "././resources/images/hud/saldofinal.png");

    this.load.image(
      "modal_concluido",
      "././resources/images/hud/modal_concluido.png"
    );

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
