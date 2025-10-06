import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Narrador } from "../../js/library/components/Narrador.js";

export class Game extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    /** @type {Phaser.GameObjects.Image} */
    this.background = null;
    /** @type {Phaser.GameObjects.Image} */
    this.btClosePopUp = null;
    /** @type {Button} */
    this.btAvancar = null;

    /** @type {any|null} */ this.narrador = null;
    /** @type {Phaser.GameObjects.GameObject|null} */ this._narradorGO = null;

    this._introStep = 1;

    this._bgKeys = {
      1: "popUpIntro1",
      2: "popUpIntro2",
      3: "bgIntro",
    };
  }

  create() {
    this.background = this.add
      .image(0, 0, this._bgKeys[this._introStep])
      .setOrigin(0, 0)
      .setDepth(0);

    this.btClosePopUp = this.add
      .image(0, 0, "button_fechar")
      .setOrigin(0, 0)
      .setDepth(5);
    this.btClosePopUp.setInteractive({ useHandCursor: true });

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    this.btAvancar = new Button(this, {
      text: "AVANÇAR",
      showIcon: true,
      colors,
    });
    this.add.existing(this.btAvancar);
    this.btAvancar.setDepth(5);

    this.btAvancar.on("buttonClick", () => {
      if (this._introStep < 3) {
        this._introStep += 1;
        this._applyStep();
      }
    });

    this.btClosePopUp.on("pointerup", () => {
      this._introStep = 3;
      this._applyStep();
    });

    this.updateLayout();

    super.create();
  }

  _spawnNarrador() {
    if (this.narrador) return;

    const legendas = [
      "OLÁ! EU SOU LEON, \nGUARDIÃO DO REINO DA ORTOGRAFIA",
      "ALGO TERRÍVEL ACONTECEU: MUITAS PALAVRAS \nPERDERAM PARTES IMPORTANTES!",
      "O CAOS SE ESPALHOU PELO BOSQUE, PELA \nMONTANHA E ATÉ PELO CASTELO! SÓ VOCÊ PODE \nME AJUDAR A RESTAURAR A ORDEM.",
      "PARA ISSO, COMPLETE CORRETAMENTE AS \nPALAVRAS COM S, SS, C OU Ç, VAMOS JUNTOS \nRECUPERAR A ORDEM DO REINO DA ORTOGRAFIA?",
    ];
    const narracoes = [];

    this.narrador = new Narrador(
      this,
      legendas,
      narracoes,
      null,
      null,
      { v1: "leonv1", v2: "leonv2" },
      true,
      "textframe-leon",
      "Game1"
    );

    this._narradorGO = this._resolveNarradorGameObject(this.narrador);

    if (this._narradorGO) {
      if (typeof this._narradorGO.setAlpha === "function")
        this._narradorGO.setAlpha(0);
      if (typeof this._narradorGO.setVisible === "function")
        this._narradorGO.setVisible(false);
      if (typeof this._narradorGO.setDepth === "function")
        this._narradorGO.setDepth(20);
    }
  }

  _resolveNarradorGameObject(narrador) {
    if (!narrador) return null;

    if (
      typeof narrador.setAlpha === "function" &&
      typeof narrador.setVisible === "function"
    ) {
      return narrador;
    }

    const candidates = [
      "container",
      "root",
      "view",
      "node",
      "panel",
      "box",
      "group",
      "sprite",
      "frame",
    ];
    for (const key of candidates) {
      const v = narrador[key];
      if (
        v &&
        typeof v.setAlpha === "function" &&
        typeof v.setVisible === "function"
      ) {
        return v;
      }
    }

    if (Array.isArray(narrador.children)) {
      for (const child of narrador.children) {
        if (
          child &&
          typeof child.setAlpha === "function" &&
          typeof child.setVisible === "function"
        ) {
          return child;
        }
      }
    }

    return null;
  }

  _applyStep() {
    const key = this._bgKeys[this._introStep];
    this.background.setTexture(key);

    const isFinalBg = this._introStep === 3;

    if (isFinalBg) {
      if (this.btClosePopUp) {
        this.btClosePopUp.disableInteractive();
        this.btClosePopUp.setVisible(false);
      }
      if (this.btAvancar) {
        this.btAvancar.disableInteractive?.();
        this.btAvancar.setVisible(false);
      }

      this._spawnNarrador();

      this.time.delayedCall(3000, () => {
        if (this._narradorGO) {
          this._narradorGO.setVisible(true);
          this.children.bringToTop(this._narradorGO);
          this.tweens.add({
            targets: this._narradorGO,
            alpha: 1,
            duration: 800,
            ease: "Power2",
          });
        } else if (this.narrador && typeof this.narrador.show === "function") {
          this.narrador.show();
        }
      });
    } else {
      if (this._narradorGO) {
        if (typeof this._narradorGO.setVisible === "function")
          this._narradorGO.setVisible(false);
        if (typeof this._narradorGO.setAlpha === "function")
          this._narradorGO.setAlpha(0);
      }

      this.btClosePopUp
        .setVisible(true)
        .setInteractive({ useHandCursor: true });
      this.btAvancar.setVisible(true);
    }

    this.updateLayout();
  }

  updateLayout() {
    const bgW = this.background.displayWidth || this.background.width;
    const bgX = this.background.x;
    const bgY = this.background.y;

    if (this.btAvancar && this.btAvancar.visible) {
      const btnW = this.btAvancar.width || 0;
      this.btAvancar.x = bgX + (bgW - btnW) / 2;
      this.btAvancar.y = bgY + 650;
    }

    if (this.btClosePopUp && this.btClosePopUp.visible) {
      const OFFSET_CLOSE_X = 350;
      const OFFSET_CLOSE_Y = 225;
      const closeW =
        this.btClosePopUp.displayWidth || this.btClosePopUp.width || 0;

      this.btClosePopUp.x = bgX + (bgW - closeW) / 2 + OFFSET_CLOSE_X;
      this.btClosePopUp.y = bgY + OFFSET_CLOSE_Y;
    }
  }
}

export default Game;
