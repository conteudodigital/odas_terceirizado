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

    this.load.image("bgCapa", "././resources/images/hud/bgCapa.png");
    this.load.image(
      "Botao-Previous",
      "././resources/images/hud/Botao-Previous.png"
    );
    this.load.image("Botao-Next", "././resources/images/hud/Botao-Next.png");
    this.load.image("bgDialogo1", "././resources/images/hud/bgDialogo1.png");
    this.load.image("bgDialogo2", "././resources/images/hud/bgDialogo2.png");
    this.load.image("bgMenu", "././resources/images/hud/bgMenu.png");

    this.load.image(
      "feedback-acerto",
      "././resources/images/hud/feedback-acerto.png"
    );
    this.load.image(
      "girassol_Menu",
      "././resources/images/hud/girassol_Menu.png"
    );
    this.load.image(
      "copo_Menu",
      "././resources/images/hud/copoPlastico_Menu.png"
    );
    this.load.image("suco_Menu", "././resources/images/hud/suco_Menu.png");
    this.load.image("pato_Menu", "././resources/images/hud/pato_Menu.png");
    this.load.image(
      "abacaxiMelancia_Menu",
      "././resources/images/hud/abacaxiMelancia_Menu.png"
    );

    this.load.image("bgGameMain", "././resources/images/hud/bgGameMain.png");

    this.load.image(
      "girassolDrag",
      "././resources/images/hud/girassolDrag.png"
    );
    this.load.image(
      "girassolPlacaNome",
      "././resources/images/hud/girassolPlacaNome.png"
    );
    this.load.image(
      "caixaVaziaDireita",
      "././resources/images/hud/caixaVaziaDireita.png"
    );
    this.load.image(
      "caixaVaziaEsquerda",
      "././resources/images/hud/caixaVaziaEsquerda.png"
    );
    this.load.image(
      "Confirmar-Laranja",
      "././resources/images/hud/Confirmar-Laranja.png"
    );
    this.load.image(
      "Confirmar-Cinza",
      "././resources/images/hud/Confirmar-Cinza.png"
    );
    this.load.image("Botao-Mais", "././resources/images/hud/Botao-Mais.png");

    this.load.image(
      "modal-girassol",
      "././resources/images/hud/modal-girassol.png"
    );

    this.load.image(
      "button-fechar-modal",
      "././resources/images/hud/button-fechar-modal.png"
    );

    this.load.image(
      "girassol-esquerda",
      "././resources/images/hud/girassol-esquerda.png"
    );
    this.load.image(
      "girassol-direita",
      "././resources/images/hud/girassol-direita.png"
    );

    this.load.image(
      "modal-feedback-negativo",
      "././resources/images/hud/modal-feedback-negativo.png"
    );

    this.load.image("modal-copo", "././resources/images/hud/modal-copo.png");

    this.load.image(
      "copoPlacaNome",
      "././resources/images/hud/copoPlacaNome.png"
    );

    this.load.image(
      "copo-esquerda",
      "././resources/images/hud/copo-esquerda.png"
    );
    this.load.image(
      "copo-direita",
      "././resources/images/hud/copo-direita.png"
    );

    this.load.image("copoDrag", "././resources/images/hud/copoDrag.png");

    this.load.image("modal-suco", "././resources/images/hud/modal-suco.png");

    this.load.image(
      "sucoPlacaNome",
      "././resources/images/hud/sucoPlacaNome.png"
    );

    this.load.image(
      "suco-esquerda",
      "././resources/images/hud/suco-esquerda.png"
    );
    this.load.image(
      "suco-direita",
      "././resources/images/hud/suco-direita.png"
    );

    this.load.image("sucoDrag", "././resources/images/hud/sucoDrag.png");

    this.load.image("modal-pato", "././resources/images/hud/modal-pato.png");

    this.load.image(
      "patoPlacaNome",
      "././resources/images/hud/patoPlacaNome.png"
    );

    this.load.image(
      "pato-esquerda",
      "././resources/images/hud/pato-esquerda.png"
    );
    this.load.image(
      "pato-direita",
      "././resources/images/hud/pato-direita.png"
    );

    this.load.image("patoDrag", "././resources/images/hud/patoDrag.png");

    this.load.image(
      "modal-abacaxiMelancia",
      "././resources/images/hud/modal-abacaxiMelancia.png"
    );

    this.load.image(
      "abacaxiMelanciaPlacaNome",
      "././resources/images/hud/abacaxiMelanciaPlacaNome.png"
    );

    this.load.image(
      "abacaxiMelancia-esquerda",
      "././resources/images/hud/abacaxiMelancia-esquerda.png"
    );
    this.load.image(
      "abacaxiMelancia-direita",
      "././resources/images/hud/abacaxiMelancia-direita.png"
    );

    this.load.image(
      "abacaxiMelanciaDrag",
      "././resources/images/hud/abacaxiMelanciaDrag.png"
    );

    this.load.image(
      "modal-conclusao",
      "././resources/images/hud/modal-conclusao.png"
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
