import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;

    this._bgKeys = ["dialogo1_3", "dialogo1_4", "dialogo1_5"];
    this._bgIndex = 0;

    this.bgEscolha = null;
    this.bgDialogo = null;
    this.btPrev = null;
    this.btNext = null;
    this.btComecar = null;
    this.btEscolherList = [];

    this._inDialogo = false;
    this.loaded = false;

    this.LAYOUT = {
      navY: 950,
      prevX: 315,
      nextX: 1150,
    };
  }

  create() {
    this.bgEscolha = this.add.image(0, 0, "game1_bg").setOrigin(0, 0);

    this.bgDialogo = this.add
      .image(0, 0, this._bgKeys[0])
      .setOrigin(0, 0)
      .setVisible(false);

    this.btPrev = this.add
      .image(this.LAYOUT.prevX, this.LAYOUT.navY, "Botao-Previous")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.btNext = this.add
      .image(this.LAYOUT.nextX, this.LAYOUT.navY, "Botao-Next")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.btPrev.on("pointerdown", () => {
      if (!this._inDialogo) return;
      if (this._bgIndex > 0) {
        this._bgIndex--;
        this._applyBg();
      }
    });

    this.btNext.on("pointerdown", () => {
      if (!this._inDialogo) return;
      if (this._bgIndex < this._bgKeys.length - 1) {
        this._bgIndex++;
        this._applyBg();
      }
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colorsBlue = ColorManager.getColors(marca, ColorManager.BLUE);

    this.btComecar = new Button(this, {
      text: "COMEÇAR",
      showIcon: false,
      colors: colorsBlue,
    });
    this.add.existing(this.btComecar);
    this.btComecar.setVisible(false);
    this.btComecar.x = 1025 - this.btComecar.width / 2;
    this.btComecar.y = 900;

    this.btComecar.on("buttonClick", () => {
      const bolinha = this.registry.get("bolinhaSelecionada");
      console.log("Iniciando Game2 com bolinha:", bolinha);

      this.scene.start("Game2", { bolinhaSelecionada: bolinha });
    });

    const BUTTON_Y = 800;
    const BUTTON_SPACING = 555;
    const BUTTON_START_X = 960 - BUTTON_SPACING;

    const modelos = [
      { key: "modelo_1" },
      { key: "modelo_2" },
      { key: "modelo_3" },
    ];

    modelos.forEach((modelo, i) => {
      const x = BUTTON_START_X + i * BUTTON_SPACING;

      const btEscolher = new Button(this, {
        text: "ESCOLHER",
        showIcon: false,
        colors: colorsBlue,
      });

      btEscolher.x = x - btEscolher.width / 2;
      btEscolher.y = BUTTON_Y;

      btEscolher.on("buttonClick", () => {
        this.registry.set("bolinhaSelecionada", modelo.key);
        console.log("Bolinha escolhida:", modelo.key);

        this._goToDialogos();
      });

      this.btEscolherList.push(btEscolher);
    });

    super.create();
  }

  _goToDialogos() {
    this.btEscolherList.forEach((b) => b.setVisible(false));
    this.bgEscolha.setVisible(false);

    this._inDialogo = true;
    this._bgIndex = 0;
    this.bgDialogo.setVisible(true);
    this.btPrev.setVisible(true);
    this.btNext.setVisible(true);

    this._applyBg();
  }

  _applyBg() {
    if (!this._inDialogo) return;

    this.bgDialogo.setTexture(this._bgKeys[this._bgIndex]);

    const isFirst = this._bgIndex === 0;
    const isLast = this._bgIndex === this._bgKeys.length - 1;

    this.btPrev.setVisible(!isFirst);
    this.btNext.setVisible(!isLast);
    this.btComecar.setVisible(isLast);
  }
}

export default Game1;
