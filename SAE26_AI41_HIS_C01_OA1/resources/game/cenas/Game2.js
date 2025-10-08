import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game2 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game2");
    this.controladorDeCenas = controladorDeCenas;

    /** @type {"dialog"|"quiz"} */
    this.MODE = "dialog";

    this.SFX = {
      click: "click",
      correct: "acerto",
      wrong: "erro",
      volume: 0.6,
    };

    this.DIALOG_SEQUENCE = [
      "dialogofase2_1",
      "dialogofase2_2",
      "dialogofase2_3",
      "dialogofase2_4",
      "dialogofase2_5",
      "dialogofase2_6",
      "dialogofase2_7",
      "dialogofase2_8",
    ];
    this.SET_RANGES = [
      { start: 0, end: 3 },
      { start: 4, end: 7 },
    ];
    this.setIndex = 0;
    this._index = this.SET_RANGES[this.setIndex].start;

    this.DIALOG_LAYOUT = {
      navY: 950,
      prevX: 315,
      nextX: 1150,
      skipMargin: 175,
      skipY: 45,
    };

    this.QUIZZES = [
      {
        backgroundKey: "quiz1Background",
        optionsPos: [
          { x: 1365, y: 360 },
          { x: 1365, y: 560 },
          { x: 1365, y: 764 },
        ],
        confirmPos: { x: 1182, y: 900 },
        sprites: {
          A: { normal: "quiz1_a_branca", selected: "quiz1_a_selecionada" },
          B: { normal: "quiz1_b_branca", selected: "quiz1_b_selecionada" },
          C: { normal: "quiz1_c_branca", selected: "quiz1_c_selecionada" },
        },
        correct: "A",
        successPos: { x: 1350, y: 525 },
      },
      {
        backgroundKey: "quiz2Background",
        optionsPos: [
          { x: 1365, y: 360 },
          { x: 1365, y: 560 },
          { x: 1365, y: 764 },
        ],
        confirmPos: { x: 1182, y: 900 },
        sprites: {
          A: { normal: "quiz2_a_branca", selected: "quiz2_a_selecionada" },
          B: { normal: "quiz2_b_branca", selected: "quiz2_b_selecionada" },
          C: { normal: "quiz2_c_branca", selected: "quiz2_c_selecionada" },
        },
        correct: "A",
        successPos: { x: 1350, y: 525 },
      },
    ];

    this.QUIZ_DEPTH = { BG: 100, OPTION: 110, CONFIRM: 120 };

    this.QUIZ_FEEDBACK = {
      successKey: "feedback-acerto",
      negativeKey: "modal_feedback_negativoatv2",
      negativeBtnPos: { x: 825, y: 750 },
      overlayColor: 0x000000,
      overlayAlpha: 0.6,

      DEPTH: { OVERLAY: 12000, MODAL: 12001, BTN: 12002 },
      autoAdvanceMs: 900,
    };

    this.END_MODAL = {
      key: "modal_feedback_concluido",
      overlayAlpha: 0.7,
      btnText: "INÍCIO",
      btnPos: { x: 825, y: 750 },
    };

    this.background = null;
    this.btPrev = null;
    this.btNext = null;
    this.btPular = null;

    this.quizBG = null;
    /** @type {Record<"A"|"B"|"C", Phaser.GameObjects.Image>} */
    this.options = { A: null, B: null, C: null };
    this.selectedOption = null;
    /** @type {Button|null} */ this.btConfirmar = null;

    this._modalOpen = false;
    this.fbOverlay = null;
    this.fbSuccess = null;
    this.fbNegative = null;
    this.btVoltar = null;

    this.endOverlay = null;
    this.endModal = null;
    this.btInicio = null;

    this.loaded = false;
  }

  ensureGlobalHUDOnTop() {
    if (this.btMenu) {
      this.btMenu.setDepth(9999);
      this.children.bringToTop(this.btMenu);
    }
    if (this.hudContainer) {
      this.hudContainer.setDepth(9999);
      this.children.bringToTop(this.hudContainer);
    }
    if (this.creditos) this.children.bringToTop(this.creditos);
    if (this.enunciado) this.children.bringToTop(this.enunciado);
    if (this.orientacao) this.children.bringToTop(this.orientacao);
  }

  create() {
    this.background = this.add
      .image(0, 0, this.DIALOG_SEQUENCE[this._index])
      .setOrigin(0, 0);

    this.btPrev = this.add
      .image(
        this.DIALOG_LAYOUT.prevX,
        this.DIALOG_LAYOUT.navY,
        "Botao-Previous"
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.btNext = this.add
      .image(this.DIALOG_LAYOUT.nextX, this.DIALOG_LAYOUT.navY, "Botao-Next")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    [this.btPrev, this.btNext].forEach((btn) => {
      btn.on("pointerover", () => btn.setScale(1.04));
      btn.on("pointerout", () => btn.setScale(1));
    });

    this.btPrev.on("pointerdown", () => {
      this._playSfx(this.SFX.click);
      this._goPrev();
    });
    this.btNext.on("pointerdown", () => {
      this._playSfx(this.SFX.click);
      this._goNext();
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    this.btPular = new Button(this, {
      text: "PULAR",
      showIcon: false,
      colors: colors,
    });
    this.add.existing(this.btPular);

    this.btPular.x =
      this.background.x +
      this.background.width -
      this.btPular.width / 2 -
      this.DIALOG_LAYOUT.skipMargin;
    this.btPular.y = this.DIALOG_LAYOUT.skipY;

    this.btPular.on("buttonClick", () => {
      const range = this.SET_RANGES[this.setIndex];
      this._index = range.end;
      this._applyDialog();
    });

    this._applyDialog();

    this.input.setTopOnly(true);

    super.create();
    this.ensureGlobalHUDOnTop();
  }

  _applyDialog() {
    if (!this.background) return;
    this.background.setTexture(this.DIALOG_SEQUENCE[this._index]);
    this._updateNavState();
    this.background.setVisible(true);
    this.MODE = "dialog";
    this.ensureGlobalHUDOnTop();
  }

  _updateNavState() {
    const range = this.SET_RANGES[this.setIndex];
    this.btPrev?.setVisible(this._index > range.start);
  }

  _goPrev() {
    if (this.MODE !== "dialog") return;
    const range = this.SET_RANGES[this.setIndex];
    if (this._index > range.start) {
      this._index--;
      this._applyDialog();
    }
  }

  _goNext() {
    if (this.MODE !== "dialog") return;
    const range = this.SET_RANGES[this.setIndex];

    if (this._index < range.end) {
      this._index++;
      this._applyDialog();
    } else {
      this._goToQuiz();
    }
  }

  _goToQuiz() {
    this.MODE = "quiz";

    this.btPrev?.setVisible(false);
    this.btNext?.setVisible(false);
    this.btPular?.setVisible(false);

    this.currentQuiz = this.QUIZZES[this.setIndex];

    if (this.quizBG) this.quizBG.destroy();
    this.quizBG = this.add
      .image(0, 0, this.currentQuiz.backgroundKey)
      .setOrigin(0, 0)
      .setDepth(this.QUIZ_DEPTH.BG);

    this.background.setVisible(false);

    this._createOptions();

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    if (this.btConfirmar) this.btConfirmar.destroy();
    this.btConfirmar = new Button(this, {
      text: "CONFIRMAR",
      showIcon: false,
      colors,
    });
    this.add.existing(this.btConfirmar);
    this.btConfirmar.setDepth(this.QUIZ_DEPTH.CONFIRM);
    this.btConfirmar.x = this.currentQuiz.confirmPos.x;
    this.btConfirmar.y = this.currentQuiz.confirmPos.y;

    this._updateConfirmVisual();
    this.btConfirmar.on("buttonClick", () => this._confirmQuiz());

    this._prepareFeedbackLayer();

    this.ensureGlobalHUDOnTop();
  }

  _createOptions() {
    ["A", "B", "C"].forEach((k) => {
      if (this.options[k]) {
        this.options[k].destroy();
        this.options[k] = null;
      }
    });
    this.selectedOption = null;

    const labels = ["A", "B", "C"];
    labels.forEach((label, i) => {
      const pos = this.currentQuiz.optionsPos[i];
      const key = this.currentQuiz.sprites[label].normal;

      const img = this.add
        .image(pos.x, pos.y, key)
        .setOrigin(0.5)
        .setDepth(this.QUIZ_DEPTH.OPTION)
        .setInteractive({ useHandCursor: true });

      img.on("pointerover", () => img.setScale(1.01));
      img.on("pointerout", () => img.setScale(1));
      img.on("pointerdown", () => {
        this._playSfx(this.SFX.click);
        this._selectOption(label);
      });

      this.options[label] = img;
    });
  }

  _selectOption(label) {
    if (this._modalOpen) return;

    ["A", "B", "C"].forEach((L) => {
      const img = this.options[L];
      if (!img) return;
      const s = this.currentQuiz.sprites[L];
      img.setTexture(L === label ? s.selected : s.normal);
    });

    this.selectedOption = label;
    this._updateConfirmVisual();
  }

  _updateConfirmVisual() {
    if (!this.btConfirmar) return;
    const hasSelection = !!this.selectedOption;
    this.btConfirmar.setAlpha(hasSelection ? 1 : 0.6);
  }

  _confirmQuiz() {
    if (!this.selectedOption || this._modalOpen) return;

    const acerto = this.selectedOption === this.currentQuiz.correct;
    this._playSfx(acerto ? this.SFX.correct : this.SFX.wrong);

    if (acerto) this._showSuccess();
    else this._showNegative();
  }

  _prepareFeedbackLayer() {
    if (!this.fbOverlay) {
      this.fbOverlay = this.add
        .rectangle(
          0,
          0,
          this.scale.width,
          this.scale.height,
          this.QUIZ_FEEDBACK.overlayColor,
          this.QUIZ_FEEDBACK.overlayAlpha
        )
        .setOrigin(0, 0)
        .setDepth(this.QUIZ_FEEDBACK.DEPTH.OVERLAY)
        .setScrollFactor(0)
        .setVisible(false)
        .setInteractive();
    }

    if (this.fbSuccess) {
      this.fbSuccess.destroy();
      this.fbSuccess = null;
    }
    if (this.fbNegative) {
      this.fbNegative.destroy();
      this.fbNegative = null;
    }
    if (this.btVoltar) {
      this.btVoltar.destroy();
      this.btVoltar = null;
    }
  }

  _showSuccess() {
    if (!this.fbSuccess) {
      const pos = this.currentQuiz.successPos;
      this.fbSuccess = this.add
        .image(pos.x, pos.y, this.QUIZ_FEEDBACK.successKey)
        .setOrigin(0.5)
        .setDepth(this.QUIZ_FEEDBACK.DEPTH.MODAL);
    } else {
      this.fbSuccess.setVisible(true);
    }

    this.time.delayedCall(this.QUIZ_FEEDBACK.autoAdvanceMs, () => {
      this._onSuccessContinue();
    });
  }

  _onSuccessContinue() {
    this.fbSuccess?.setVisible(false);

    if (this.setIndex === 0) {
      this._startDialogSet(1);
    } else {
      this._showEndModal();
    }
  }

  _showNegative() {
    this._modalOpen = true;

    this.fbOverlay?.setVisible(true);

    if (!this.fbNegative) {
      this.fbNegative = this.add
        .image(
          this.scale.width / 2,
          this.scale.height / 2,
          this.QUIZ_FEEDBACK.negativeKey
        )
        .setOrigin(0.5)
        .setDepth(this.QUIZ_FEEDBACK.DEPTH.MODAL);
    } else {
      this.fbNegative.setVisible(true);
    }

    if (!this.btVoltar) {
      const marca = ColorManager.getCurrentMarca(this);
      const colors = ColorManager.getColors(marca, ColorManager.BLUE);

      this.btVoltar = new Button(this, {
        text: "VOLTAR",
        showIcon: false,
        colors,
      });
      this.add.existing(this.btVoltar);
      this.btVoltar.setDepth(this.QUIZ_FEEDBACK.DEPTH.BTN);
    }
    this.btVoltar.x = this.QUIZ_FEEDBACK.negativeBtnPos.x;
    this.btVoltar.y = this.QUIZ_FEEDBACK.negativeBtnPos.y;
    this.btVoltar.setVisible(true);

    this.btVoltar.removeAllListeners("buttonClick");
    this.btVoltar.on("buttonClick", () => this._resetAfterError());
  }

  _resetAfterError() {
    this._modalOpen = false;
    this.fbOverlay?.setVisible(false);
    this.fbNegative?.setVisible(false);
    this.btVoltar?.setVisible(false);

    this.selectedOption = null;
    ["A", "B", "C"].forEach((L) => {
      const img = this.options[L];
      if (!img) return;
      img.setTexture(this.currentQuiz.sprites[L].normal);
    });
    this._updateConfirmVisual();
  }

  _startDialogSet(newSetIndex) {
    this._destroyQuizUI();

    this.setIndex = newSetIndex;
    const range = this.SET_RANGES[this.setIndex];
    this._index = range.start;

    this.btPrev?.setVisible(false);
    this.btNext?.setVisible(true);
    this.btPular?.setVisible(true);

    this._applyDialog();
    this.ensureGlobalHUDOnTop();
  }

  _destroyQuizUI() {
    this.quizBG?.destroy();
    this.quizBG = null;
    ["A", "B", "C"].forEach((k) => {
      this.options[k]?.destroy();
      this.options[k] = null;
    });
    this.btConfirmar?.destroy();
    this.btConfirmar = null;

    this.fbSuccess?.destroy();
    this.fbSuccess = null;
    this.fbNegative?.destroy();
    this.fbNegative = null;
    this.btVoltar?.destroy();
    this.btVoltar = null;
    this.fbOverlay?.setVisible(false);

    this.selectedOption = null;
    this._modalOpen = false;
  }

  _showEndModal() {
    if (!this.endOverlay) {
      this.endOverlay = this.add
        .rectangle(
          0,
          0,
          this.scale.width,
          this.scale.height,
          0x000000,
          this.END_MODAL.overlayAlpha
        )
        .setOrigin(0, 0)
        .setDepth(this.QUIZ_FEEDBACK.DEPTH.OVERLAY)
        .setScrollFactor(0)
        .setInteractive();
    } else {
      this.endOverlay.setVisible(true);
      this.endOverlay.setDepth(this.QUIZ_FEEDBACK.DEPTH.OVERLAY);
    }

    if (this.END_MODAL.key) {
      if (!this.endModal) {
        this.endModal = this.add
          .image(
            this.scale.width / 2,
            this.scale.height / 2,
            this.END_MODAL.key
          )
          .setOrigin(0.5)
          .setDepth(this.QUIZ_FEEDBACK.DEPTH.MODAL);
      } else {
        this.endModal.setVisible(true);
        this.endModal.setDepth(this.QUIZ_FEEDBACK.DEPTH.MODAL);
      }
    }

    if (!this.btInicio) {
      const marca = ColorManager.getCurrentMarca(this);
      const colors = ColorManager.getColors(marca, ColorManager.BLUE);

      this.btInicio = new Button(this, {
        text: this.END_MODAL.btnText,
        showIcon: false,
        colors,
      });
      this.add.existing(this.btInicio);
      this.btInicio.setDepth(this.QUIZ_FEEDBACK.DEPTH.BTN);
      this.btInicio.on("buttonClick", () => this._goToCapa());
    } else {
      this.btInicio.setDepth(this.QUIZ_FEEDBACK.DEPTH.BTN);
    }
    this.btInicio.x = this.END_MODAL.btnPos.x;
    this.btInicio.y = this.END_MODAL.btnPos.y;
    this.btInicio.setVisible(true);

    this.ensureGlobalHUDOnTop();
  }

  _goToCapa() {
    try {
      if (this.controladorDeCenas?.voltarParaCapa) {
        this.controladorDeCenas.voltarParaCapa();
        return;
      }
    } catch {}
    try {
      this.scene.start("Capa");
    } catch {}
  }

  _playSfx(key) {
    try {
      if (!key) return;
      this.sound?.play(key, { volume: this.SFX.volume });
    } catch (e) {}
  }
}

export default Game2;
