export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    // Hud
    this.load.image("Bg", "./resources/images/hud/Bg.png");
    this.load.image("btMenu", "./resources/images/hud/btMenu.png");
    this.load.image("btFechar", "./resources/images/hud/btFechar.png");

    this.load.image("bg-capa", "./resources/images/hud/bg-capa.png");
    this.load.image("titulo", "./resources/images/hud/titulo.png");
    this.load.image("bg-dialogo", "./resources/images/hud/bg-dialogo.png");
    this.load.image("textframe-Ju", "./resources/images/hud/textframe-Ju.png");
    this.load.image(
      "textframe-Bia",
      "./resources/images/hud/textframe-Bia.png"
    );
    this.load.image(
      "textframe-Gabe",
      "./resources/images/hud/textframe-Gabe.png"
    );
    this.load.image(
      "textframe-Ana",
      "./resources/images/hud/textframe-Ana.png"
    );
    this.load.image(
      "textframe-Luca",
      "./resources/images/hud/textframe-Luca.png"
    );
    this.load.image("narracao_icon", "./resources/images/hud/Button-icon.png");
    this.load.image(
      "bg-jogo-fase1",
      "./resources/images/hud/bg-jogo-fase1.png"
    );
    this.load.image(
      "enunciado-com-narracao",
      "./resources/images/hud/enunciado-com-narracao.png"
    );

    this.load.image("tabela-fundo", "./resources/images/hud/tabela-fundo.png");

    this.load.image("botao-menos", "./resources/images/hud/botao-menos.png");
    this.load.image(
      "botao-menos-inativo",
      "./resources/images/hud/botao-menos-inativo.png"
    );

    this.load.image("botao-mais", "./resources/images/hud/botao-mais.png");
    this.load.image(
      "botao-mais-inativo",
      "./resources/images/hud/botao-mais-inativo.png"
    );

    this.load.image(
      "numero-tabela",
      "./resources/images/hud/numero-tabela.png"
    );
    this.load.image(
      "numero-tabela-inativo",
      "./resources/images/hud/numero-tabela-inativo.png"
    );

    this.load.image(
      "modal-feedback-negativo",
      "./resources/images/hud/modal-feedback-negativo.png"
    );

    this.load.image(
      "grafico-exemplo",
      "./resources/images/hud/grafico-exemplo.png"
    );
    this.load.image(
      "grafico-exemplo2",
      "./resources/images/hud/grafico-exemplo2.png"
    );
    this.load.image(
      "grafico-exemplo3",
      "./resources/images/hud/grafico-exemplo3.png"
    );
    this.load.image("tabela-fase2", "./resources/images/hud/tabela-fase2.png");

    this.load.image("botao-editar", "./resources/images/hud/botao-editar.png");
    this.load.image(
      "jogo-fase2-bg",
      "./resources/images/hud/jogo-fase2-bg.png"
    );

    this.load.image("bloco-verde", "./resources/images/hud/bloco-verde.png");
    this.load.image(
      "bloco-amarelo",
      "./resources/images/hud/bloco-amarelo.png"
    );
    this.load.image("bloco-padrao", "./resources/images/hud/bloco-padrao.png");

    this.load.image(
      "botao-sair-highlight",
      "./resources/images/hud/botao-sair-highlight.png"
    );
    this.load.image(
      "background-colunas",
      "./resources/images/hud/background-colunas.png"
    );

    this.load.image("final-game", "./resources/images/hud/final-game.png");

    //Personagens
    this.load.image(
      "personagem-ju-v1",
      "./resources/images/hud/personagem-ju-v1.png"
    );
    this.load.image(
      "personagem-ju-v2",
      "./resources/images/hud/personagem-ju-v2.png"
    );
    //Ana
    this.load.image(
      "personagem-ana",
      "./resources/images/hud/personagem-ana.png"
    );
    this.load.image(
      "personagem-ana-inativo",
      "./resources/images/hud/personagem-ana-inativo.png"
    );
    this.load.image(
      "personagem-ana-tf",
      "./resources/images/hud/personagem-ana-tf.png"
    );
    this.load.image("colecao-ana", "./resources/images/hud/colecao-ana.png");
    //Bia
    this.load.image(
      "personagem-bia",
      "./resources/images/hud/personagem-bia.png"
    );
    this.load.image(
      "personagem-bia-inativo",
      "./resources/images/hud/personagem-bia-inativo.png"
    );
    this.load.image(
      "personagem-bia-tf",
      "./resources/images/hud/personagem-bia-tf.png"
    );
    this.load.image("colecao-bia", "./resources/images/hud/colecao-bia.png");
    //Gabe
    this.load.image(
      "personagem-gabe",
      "./resources/images/hud/personagem-gabe.png"
    );
    this.load.image(
      "personagem-gabe-inativo",
      "./resources/images/hud/personagem-gabe-inativo.png"
    );
    this.load.image(
      "personagem-gabe-tf",
      "./resources/images/hud/personagem-gabe-tf.png"
    );
    this.load.image("colecao-gabe", "./resources/images/hud/colecao-gabe.png");
    //Luca
    this.load.image(
      "personagem-luca",
      "./resources/images/hud/personagem-luca.png"
    );
    this.load.image(
      "personagem-luca-inativo",
      "./resources/images/hud/personagem-luca-inativo.png"
    );
    this.load.image(
      "personagem-luca-tf",
      "./resources/images/hud/personagem-luca-tf.png"
    );
    this.load.image("colecao-luca", "./resources/images/hud/colecao-luca.png");

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
