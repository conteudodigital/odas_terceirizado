export class Boot extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  preload() {
    // Hud
    this.load.image("Bg", "./resources/images/hud/Bg.png");
    this.load.image("btMenu", "./resources/images/hud/btMenu.png");
    this.load.image("btFechar", "./resources/images/hud/btFechar.png");

    this.load.image("bgCapa", "./resources/images/hud/bgCapa.png");

    this.load.image(
      "escolhaHeroiBg",
      "./resources/images/hud/escolhaHeroiBg.png"
    );

    this.load.image(
      "escolhaDesafioBg",
      "./resources/images/hud/escolhaDesafioBg.png"
    );

    this.load.image(
      "escolhaLocalBg",
      "./resources/images/hud/escolhaLocalBg.png"
    );

    this.load.image("bgGame", "./resources/images/hud/bgGame.png");

    this.load.image(
      "Botao-Previous",
      "./resources/images/hud/Botao-Previous.png"
    );
    this.load.image("Botao-Next", "./resources/images/hud/Botao-Next.png");

    this.load.image(
      "concluirCinza",
      "./resources/images/hud/concluirCinza.png"
    );
    this.load.image(
      "concluirAmarelo",
      "./resources/images/hud/concluirAmarelo.png"
    );

    this.load.image("Adesivos", "./resources/images/hud/Adesivos.png");

    this.load.image("blankMoldura", "./resources/images/hud/blankMoldura.png");

    //Introdução

    this.load.image(
      "livroIntroducao",
      "./resources/images/hud/livroIntroducao.png"
    );

    this.load.image(
      "luna-floresta-introducao",
      "./resources/images/hud/luna-floresta-introducao.png"
    );
    this.load.image(
      "teo-floresta-introducao",
      "./resources/images/hud/teo-floresta-introducao.png"
    );
    this.load.image(
      "rico-floresta-introducao",
      "./resources/images/hud/rico-floresta-introducao.png"
    );

    this.load.image(
      "luna-cidade-introducao",
      "./resources/images/hud/luna-cidade-introducao.png"
    );
    this.load.image(
      "teo-cidade-introducao",
      "./resources/images/hud/teo-cidade-introducao.png"
    );
    this.load.image(
      "rico-cidade-introducao",
      "./resources/images/hud/rico-cidade-introducao.png"
    );

    this.load.image(
      "luna-planeta-introducao",
      "./resources/images/hud/luna-planeta-introducao.png"
    );
    this.load.image(
      "teo-planeta-introducao",
      "./resources/images/hud/teo-planeta-introducao.png"
    );
    this.load.image(
      "rico-planeta-introducao",
      "./resources/images/hud/rico-planeta-introducao.png"
    );

    //Conflito

    this.load.image(
      "livroConflito",
      "./resources/images/hud/livroConflito.png"
    );

    //luna resgate

    this.load.image(
      "luna-resgate-floresta",
      "./resources/images/hud/luna-resgate-floresta.png"
    );

    this.load.image(
      "luna-resgate-cidade",
      "./resources/images/hud/luna-resgate-cidade.png"
    );

    this.load.image(
      "luna-resgate-planeta",
      "./resources/images/hud/luna-resgate-planeta.png"
    );

    //Rico resgate

    this.load.image(
      "rico-resgate-floresta",
      "./resources/images/hud/rico-resgate-floresta.png"
    );

    this.load.image(
      "rico-resgate-cidade",
      "./resources/images/hud/rico-resgate-cidade.png"
    );

    this.load.image(
      "rico-resgate-planeta",
      "./resources/images/hud/rico-resgate-planeta.png"
    );

    //Teo resgate

    this.load.image(
      "teo-resgate-floresta",
      "./resources/images/hud/teo-resgate-floresta.png"
    );

    this.load.image(
      "teo-resgate-cidade",
      "./resources/images/hud/teo-resgate-cidade.png"
    );

    this.load.image(
      "teo-resgate-planeta",
      "./resources/images/hud/teo-resgate-planeta.png"
    );

    //Luna proteger

    this.load.image(
      "luna-proteger-floresta",
      "./resources/images/hud/luna-proteger-floresta.png"
    );

    this.load.image(
      "luna-proteger-cidade",
      "./resources/images/hud/luna-proteger-cidade.png"
    );

    this.load.image(
      "luna-proteger-planeta",
      "./resources/images/hud/luna-proteger-planeta.png"
    );

    //Rico proteger

    this.load.image(
      "rico-proteger-floresta",
      "./resources/images/hud/rico-proteger-floresta.png"
    );

    this.load.image(
      "rico-proteger-cidade",
      "./resources/images/hud/rico-proteger-cidade.png"
    );

    this.load.image(
      "rico-proteger-planeta",
      "./resources/images/hud/rico-proteger-planeta.png"
    );

    //Teo proteger

    this.load.image(
      "teo-proteger-floresta",
      "./resources/images/hud/teo-proteger-floresta.png"
    );

    this.load.image(
      "teo-proteger-cidade",
      "./resources/images/hud/teo-proteger-cidade.png"
    );

    this.load.image(
      "teo-proteger-planeta",
      "./resources/images/hud/teo-proteger-planeta.png"
    );

    //Luna misterio

    this.load.image(
      "luna-misterio-floresta",
      "./resources/images/hud/luna-misterio-floresta.png"
    );

    this.load.image(
      "luna-misterio-cidade",
      "./resources/images/hud/luna-misterio-cidade.png"
    );

    this.load.image(
      "luna-misterio-planeta",
      "./resources/images/hud/luna-misterio-planeta.png"
    );

    //Rico misterio

    this.load.image(
      "rico-misterio-floresta",
      "./resources/images/hud/rico-misterio-floresta.png"
    );

    this.load.image(
      "rico-misterio-cidade",
      "./resources/images/hud/rico-misterio-cidade.png"
    );

    this.load.image(
      "rico-misterio-planeta",
      "./resources/images/hud/rico-misterio-planeta.png"
    );

    //Teo misterio

    this.load.image(
      "teo-misterio-floresta",
      "./resources/images/hud/teo-misterio-floresta.png"
    );

    this.load.image(
      "teo-misterio-cidade",
      "./resources/images/hud/teo-misterio-cidade.png"
    );

    this.load.image(
      "teo-misterio-planeta",
      "./resources/images/hud/teo-misterio-planeta.png"
    );

    // Climax

    this.load.image("livroClimax", "./resources/images/hud/livroClimax.png");

    //Personagens climax

    this.load.image(
      "luna-climax-floresta",
      "./resources/images/hud/luna-climax-floresta.png"
    );

    this.load.image(
      "rico-climax-floresta",
      "./resources/images/hud/rico-climax-floresta.png"
    );

    this.load.image(
      "teo-climax-floresta",
      "./resources/images/hud/teo-climax-floresta.png"
    );

    this.load.image(
      "luna-climax-cidade",
      "./resources/images/hud/luna-climax-cidade.png"
    );

    this.load.image(
      "rico-climax-cidade",
      "./resources/images/hud/rico-climax-cidade.png"
    );

    this.load.image(
      "teo-climax-cidade",
      "./resources/images/hud/teo-climax-cidade.png"
    );

    this.load.image(
      "luna-climax-planeta",
      "./resources/images/hud/luna-climax-planeta.png"
    );

    this.load.image(
      "rico-climax-planeta",
      "./resources/images/hud/rico-climax-planeta.png"
    );

    this.load.image(
      "teo-climax-planeta",
      "./resources/images/hud/teo-climax-planeta.png"
    );

    // Desfecho

    this.load.image(
      "livroDesfecho",
      "./resources/images/hud/livroDesfecho.png"
    );

    this.load.image(
      "luna-desfecho-resgate-floresta",
      "./resources/images/hud/luna-desfecho-resgate-floresta.png"
    );

    this.load.image(
      "luna-desfecho-resgate-cidade",
      "./resources/images/hud/luna-desfecho-resgate-cidade.png"
    );

    this.load.image(
      "luna-desfecho-resgate-planeta",
      "./resources/images/hud/luna-desfecho-resgate-planeta.png"
    );

    this.load.image(
      "rico-desfecho-resgate-floresta",
      "./resources/images/hud/rico-desfecho-resgate-floresta.png"
    );

    this.load.image(
      "rico-desfecho-resgate-cidade",
      "./resources/images/hud/rico-desfecho-resgate-cidade.png"
    );

    this.load.image(
      "rico-desfecho-resgate-planeta",
      "./resources/images/hud/rico-desfecho-resgate-planeta.png"
    );

    this.load.image(
      "teo-desfecho-resgate-floresta",
      "./resources/images/hud/teo-desfecho-resgate-floresta.png"
    );

    this.load.image(
      "teo-desfecho-resgate-cidade",
      "./resources/images/hud/teo-desfecho-resgate-cidade.png"
    );

    this.load.image(
      "teo-desfecho-resgate-planeta",
      "./resources/images/hud/teo-desfecho-resgate-planeta.png"
    );

    ///////////////

    this.load.image(
      "luna-desfecho-proteger-floresta",
      "./resources/images/hud/luna-desfecho-proteger-floresta.png"
    );

    this.load.image(
      "luna-desfecho-proteger-cidade",
      "./resources/images/hud/luna-desfecho-proteger-cidade.png"
    );

    this.load.image(
      "luna-desfecho-proteger-planeta",
      "./resources/images/hud/luna-desfecho-proteger-planeta.png"
    );

    this.load.image(
      "rico-desfecho-proteger-floresta",
      "./resources/images/hud/rico-desfecho-proteger-floresta.png"
    );

    this.load.image(
      "rico-desfecho-proteger-cidade",
      "./resources/images/hud/rico-desfecho-proteger-cidade.png"
    );

    this.load.image(
      "rico-desfecho-proteger-planeta",
      "./resources/images/hud/rico-desfecho-proteger-planeta.png"
    );

    this.load.image(
      "teo-desfecho-proteger-floresta",
      "./resources/images/hud/teo-desfecho-proteger-floresta.png"
    );

    this.load.image(
      "teo-desfecho-proteger-cidade",
      "./resources/images/hud/teo-desfecho-proteger-cidade.png"
    );

    this.load.image(
      "teo-desfecho-proteger-planeta",
      "./resources/images/hud/teo-desfecho-proteger-planeta.png"
    );

    ////////////////

    this.load.image(
      "luna-desfecho-misterio-floresta",
      "./resources/images/hud/luna-desfecho-proteger-floresta.png"
    );

    this.load.image(
      "luna-desfecho-misterio-cidade",
      "./resources/images/hud/luna-desfecho-proteger-cidade.png"
    );

    this.load.image(
      "luna-desfecho-misterio-planeta",
      "./resources/images/hud/luna-desfecho-proteger-planeta.png"
    );

    this.load.image(
      "rico-desfecho-misterio-floresta",
      "./resources/images/hud/rico-desfecho-proteger-floresta.png"
    );

    this.load.image(
      "rico-desfecho-misterio-cidade",
      "./resources/images/hud/rico-desfecho-proteger-cidade.png"
    );

    this.load.image(
      "rico-desfecho-misterio-planeta",
      "./resources/images/hud/rico-desfecho-proteger-planeta.png"
    );

    this.load.image(
      "teo-desfecho-misterio-floresta",
      "./resources/images/hud/teo-desfecho-proteger-floresta.png"
    );

    this.load.image(
      "teo-desfecho-misterio-cidade",
      "./resources/images/hud/teo-desfecho-proteger-cidade.png"
    );

    this.load.image(
      "teo-desfecho-misterio-planeta",
      "./resources/images/hud/teo-desfecho-proteger-planeta.png"
    );

    this.load.image(
      "modalConcluido",
      "./resources/images/hud/modalConcluido.png"
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
