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
    this.load.image("titulo", "./resources/images/hud/titulo.png");

    this.load.image("bgDialogo1", "./resources/images/hud/bgDialogo1.png");
    this.load.image("bgDialogo2", "./resources/images/hud/bgDialogo2.png");

    this.load.image(
      "Botao-Previous",
      "./resources/images/hud/Botao-Previous.png"
    );
    this.load.image("Botao-Next", "./resources/images/hud/Botao-Next.png");

    this.load.image("bgGame", "./resources/images/hud/bgGame.png");

    this.load.image("prato", "./resources/images/hud/prato.png");

    this.load.image("monday", "./resources/images/hud/monday.png");

    this.load.image(
      "steamedBroccoli",
      "./resources/images/hud/steamedBroccoli.png"
    );

    this.load.image("lettuceSalad", "./resources/images/hud/lettuceSalad.png");
    this.load.image("tomato", "./resources/images/hud/tomato.png");

    this.load.image(
      "roastedCarrot",
      "./resources/images/hud/roastedCarrot.png"
    );

    this.load.image(
      "steamedCauliflower",
      "./resources/images/hud/steamedCauliflower.png"
    );

    this.load.image("cucumber", "./resources/images/hud/cucumber.png");

    this.load.image("arugula", "./resources/images/hud/arugula.png");

    this.load.image("bellPepper", "./resources/images/hud/bellPepper.png");

    this.load.image(
      "vegetablesPlaca",
      "./resources/images/hud/vegetablesPlaca.png"
    );

    this.load.image(
      "proteinsPlaca",
      "./resources/images/hud/proteinsPlaca.png"
    );

    this.load.image(
      "vegetablesFundo",
      "./resources/images/hud/vegetablesFundo.png"
    );

    this.load.image(
      "proteinsFundo",
      "./resources/images/hud/proteinsFundo.png"
    );

    this.load.image(
      "correctFeedback",
      "./resources/images/hud/correctFeedback.png"
    );

    this.load.image(
      "blankFeedback",
      "./resources/images/hud/blankFeedback.png"
    );

    this.load.image(
      "buttonReadyOn",
      "./resources/images/hud/buttonReadyOn.png"
    );

    this.load.image(
      "buttonReadyOff",
      "./resources/images/hud/buttonReadyOff.png"
    );

    this.load.image("grilledBeef", "./resources/images/hud/grilledBeef.png");

    this.load.image(
      "roastedChicken",
      "./resources/images/hud/roastedChicken.png"
    );

    this.load.image("beans", "./resources/images/hud/beans.png");

    this.load.image("shrimp", "./resources/images/hud/shrimp.png");

    this.load.image("boiledEgg", "./resources/images/hud/boiledEgg.png");

    this.load.image("tofu", "./resources/images/hud/tofu.png");

    this.load.image("fishFillet", "./resources/images/hud/fishFillet.png");

    this.load.image("friedEgg", "./resources/images/hud/friedEgg.png");

    this.load.image("mondayBg", "./resources/images/hud/mondayBg.png");

    this.load.image(
      "carbohydratesFundo",
      "./resources/images/hud/carbohydratesFundo.png"
    );
    this.load.image(
      "carbohydratesPlaca",
      "./resources/images/hud/carbohydratesPlaca.png"
    );
    this.load.image("brownRice", "./resources/images/hud/brownRice.png");
    this.load.image("whiteRice", "./resources/images/hud/whiteRice.png");
    this.load.image(
      "mashedPotatoes",
      "./resources/images/hud/mashedPotatoes.png"
    );
    this.load.image("sliceOfBread", "./resources/images/hud/sliceOfBread.png");
    this.load.image(
      "cookedSweetPotato",
      "./resources/images/hud/cookedSweetPotato.png"
    );
    this.load.image("pasta", "./resources/images/hud/pasta.png");
    this.load.image("farofa", "./resources/images/hud/farofa.png");
    this.load.image("polenta", "./resources/images/hud/polenta.png");

    this.load.image(
      "Button-Zoom-In",
      "./resources/images/hud/Button-Zoom-In.png"
    );
    this.load.image(
      "Button-Zoom-Out",
      "./resources/images/hud/Button-Zoom-Out.png"
    );
    this.load.image(
      "Button-Rotate",
      "./resources/images/hud/Button-Rotate.png"
    );
    this.load.image(
      "Button-Forward",
      "./resources/images/hud/Button-Forward.png"
    );
    this.load.image(
      "Button-Backward",
      "./resources/images/hud/Button-Backward.png"
    );
    this.load.image(
      "Button-Delete",
      "./resources/images/hud/Button-Delete.png"
    );

    this.load.image("nextDay", "./resources/images/hud/nextDay.png");

    this.load.image(
      "Button-Nextday",
      "./resources/images/hud/Button-Nextday.png"
    );

    this.load.image("tuesdayBg", "./resources/images/hud/tuesdayBg.png");

    this.load.image("wednesdayBg", "./resources/images/hud/wednesdayBg.png");

    this.load.image("thursdayBg", "./resources/images/hud/thursdayBg.png");

    this.load.image("fridayBg", "./resources/images/hud/fridayBg.png");

    this.load.image("modalFinal", "./resources/images/hud/modalFinal.png");

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
