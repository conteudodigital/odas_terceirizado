import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;

    this.DEPTH = {
      BG: -9999,
      UI: -50,
      OVERLAY: 12000,
      MODAL: 12001,
      MODAL_BTN: 12002,
    };

    this.characters = [];

    this.completedCount = 0;

    this.background = null;
    this.depoimentoBg = null;
    this.nextButton = null;

    /** @type {null | {charIndex:number, containers:Phaser.GameObjects.GameObject[], selects:Record<string,string>, correct:Record<string,string>}} */
    this.quizState = null;

    this.QUIZ_PREV_KEY = "Botao-Previous";
    this.DEFAULT_DEPO_NEXT_POS = { x: 1125, y: 955 };

    /** @type {QuizConfig} */
    this.DEFAULT_QUIZ = {
      bgKey: "quiz-ana",
      prevPos: { x: 300, y: 880 },
      confirmPos: { x: 1080, y: 880 },
      pairs: [
        {
          pairId: "duracao",
          left: {
            id: "definitiva",
            normalKey: "definitiva-branca",
            selectedKey: "definitiva-selecionada",
            x: 720,
            y: 300,
          },
          right: {
            id: "temporaria",
            normalKey: "temporaria-branca",
            selectedKey: "temporaria-selecionada",
            x: 1240,
            y: 300,
          },
          correct: "temporaria",
        },
        {
          pairId: "alcance",
          left: {
            id: "nacional",
            normalKey: "nacional-branca",
            selectedKey: "nacional-selecionada",
            x: 720,
            y: 520,
          },
          right: {
            id: "internacional",
            normalKey: "internacional-branca",
            selectedKey: "internacional-selecionada",
            x: 1240,
            y: 520,
          },
          correct: "nacional",
        },
      ],
      feedback: {
        positiveKey: "feedback-acerto",
        positivePos: { x: 1350, y: 525 },
        negativeKey: "modal_feedback_negativoatv1",
        negativeModalPos: { x: 960, y: 540 },
        negativeBackPos: { x: 825, y: 750 },
      },
    };
  }

  playS(key, opts = {}) {
    try {
      this.sound.play(key, opts);
    } catch (e) {}
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
    super.create();

    this.background = this.add
      .image(0, 0, "bgFase1")
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.BG);

    this.characters = [
      {
        key: "gabe",
        active: "gabe",
        inactive: "gabe_inativo",
        depoimento: "Depoimento-Gabe",
        quizBg: "quiz-gabe",
        x: 300,
        y: 595,
        buttonX: 300,
        buttonY: 925,
        depNextPos: { x: 1125, y: 955 },
        done: false,
        sprite: null,
        button: null,
        quiz: {
          bgKey: "quiz-gabe",
          prevPos: { x: 433, y: 920 },
          confirmPos: { x: 1170, y: 901 },
          pairs: [
            {
              pairId: "duracao",
              left: {
                id: "definitiva",
                normalKey: "definitiva-branca",
                selectedKey: "definitiva-selecionada",
                x: 1083,
                y: 365,
              },
              right: {
                id: "temporaria",
                normalKey: "temporaria-branca",
                selectedKey: "temporaria-selecionada",
                x: 1627,
                y: 365,
              },
              correct: "definitiva",
            },
            {
              pairId: "alcance",
              left: {
                id: "nacional",
                normalKey: "nacional-branca",
                selectedKey: "nacional-selecionada",
                x: 1083,
                y: 670,
              },
              right: {
                id: "internacional",
                normalKey: "internacional-branca",
                selectedKey: "internacional-selecionada",
                x: 1627,
                y: 670,
              },
              correct: "nacional",
            },
          ],
        },
      },
      {
        key: "ana",
        active: "ana",
        inactive: "ana_inativo",
        depoimento: "Depoimento-Ana",
        quizBg: "quiz-ana",
        x: 720,
        y: 595,
        buttonX: 730,
        buttonY: 925,
        depNextPos: { x: 1125, y: 955 },
        done: false,
        sprite: null,
        button: null,
        quiz: {
          bgKey: "quiz-ana",
          prevPos: { x: 433, y: 920 },
          confirmPos: { x: 1170, y: 901 },
          pairs: [
            {
              pairId: "duracao",
              left: {
                id: "definitiva",
                normalKey: "definitiva-branca",
                selectedKey: "definitiva-selecionada",
                x: 1083,
                y: 365,
              },
              right: {
                id: "temporaria",
                normalKey: "temporaria-branca",
                selectedKey: "temporaria-selecionada",
                x: 1627,
                y: 365,
              },
              correct: "temporaria",
            },
            {
              pairId: "alcance",
              left: {
                id: "nacional",
                normalKey: "nacional-branca",
                selectedKey: "nacional-selecionada",
                x: 1083,
                y: 670,
              },
              right: {
                id: "internacional",
                normalKey: "internacional-branca",
                selectedKey: "internacional-selecionada",
                x: 1627,
                y: 670,
              },
              correct: "internacional",
            },
          ],
        },
      },
      {
        key: "luca",
        active: "luca",
        inactive: "luca_inativo",
        depoimento: "Depoimento-Luca",
        quizBg: "quiz-luca",
        x: 1156,
        y: 595,
        buttonX: 1165,
        buttonY: 925,
        depNextPos: { x: 1125, y: 955 },
        done: false,
        sprite: null,
        button: null,
        quiz: {
          bgKey: "quiz-luca",
          prevPos: { x: 433, y: 920 },
          confirmPos: { x: 1170, y: 901 },
          pairs: [
            {
              pairId: "duracao",
              left: {
                id: "definitiva",
                normalKey: "definitiva-branca",
                selectedKey: "definitiva-selecionada",
                x: 1083,
                y: 365,
              },
              right: {
                id: "temporaria",
                normalKey: "temporaria-branca",
                selectedKey: "temporaria-selecionada",
                x: 1627,
                y: 365,
              },
              correct: "definitiva",
            },
            {
              pairId: "alcance",
              left: {
                id: "nacional",
                normalKey: "nacional-branca",
                selectedKey: "nacional-selecionada",
                x: 1083,
                y: 670,
              },
              right: {
                id: "internacional",
                normalKey: "internacional-branca",
                selectedKey: "internacional-selecionada",
                x: 1627,
                y: 670,
              },
              correct: "internacional",
            },
          ],
        },
      },
      {
        key: "ju",
        active: "ju",
        inactive: "ju_inativo",
        depoimento: "Depoimento-Ju",
        quizBg: "quiz-ju",
        x: 1600,
        y: 595,
        buttonX: 1600,
        buttonY: 925,
        depNextPos: { x: 1125, y: 955 },
        done: false,
        sprite: null,
        button: null,
        quiz: {
          bgKey: "quiz-ju",
          prevPos: { x: 433, y: 920 },
          confirmPos: { x: 1170, y: 901 },
          pairs: [
            {
              pairId: "duracao",
              left: {
                id: "definitiva",
                normalKey: "definitiva-branca",
                selectedKey: "definitiva-selecionada",
                x: 1083,
                y: 365,
              },
              right: {
                id: "temporaria",
                normalKey: "temporaria-branca",
                selectedKey: "temporaria-selecionada",
                x: 1627,
                y: 365,
              },
              correct: "temporaria",
            },
            {
              pairId: "alcance",
              left: {
                id: "nacional",
                normalKey: "nacional-branca",
                selectedKey: "nacional-selecionada",
                x: 1083,
                y: 670,
              },
              right: {
                id: "internacional",
                normalKey: "internacional-branca",
                selectedKey: "internacional-selecionada",
                x: 1627,
                y: 670,
              },
              correct: "nacional",
            },
          ],
        },
      },
    ];

    this.characters.forEach((char, index) => {
      char.sprite = this.add
        .image(char.x, char.y, char.active)
        .setOrigin(0.5)
        .setDepth(this.DEPTH.UI);

      char.button = this.add
        .image(char.buttonX, char.buttonY, "bt_azul")
        .setOrigin(0.5)
        .setDepth(this.DEPTH.UI)
        .setInteractive({ useHandCursor: true });

      char.button.on("pointerdown", () => {
        if (char.done) return;
        this.playS("click");
        this.showDepoimento(index);
      });
    });

    this.ensureGlobalHUDOnTop();
  }

  showDepoimento(charIndex) {
    const char = this.characters[charIndex];

    this.characters.forEach((c) => {
      c.sprite.setVisible(false);
      c.button.setVisible(false);
    });
    this.background.setVisible(false);

    this.depoimentoBg = this.add
      .image(0, 0, char.depoimento)
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.BG);

    this.ensureGlobalHUDOnTop();

    const pos = char.depNextPos || this.DEFAULT_DEPO_NEXT_POS;
    this.nextButton = this.add
      .image(pos.x, pos.y, "Botao-Next")
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI)
      .setInteractive({ useHandCursor: true });

    this.nextButton.once("pointerdown", () => {
      this.playS("click");
      this.nextButton.disableInteractive();
      this.showQuiz(charIndex);
    });
  }

  showQuiz(charIndex) {
    if (this.depoimentoBg) this.depoimentoBg.destroy();
    if (this.nextButton) this.nextButton.destroy();

    const char = this.characters[charIndex];
    const qcfg = { ...this.DEFAULT_QUIZ, ...(char.quiz || {}) };

    const quizBg = this.add
      .image(0, 0, qcfg.bgKey)
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.BG);

    this.ensureGlobalHUDOnTop();

    const containers = [];
    const selected = {};
    const correct = {};
    qcfg.pairs.forEach((p) => (correct[p.pairId] = p.correct));

    qcfg.pairs.forEach((pair) => {
      const btnLeft = this.add
        .image(pair.left.x, pair.left.y, pair.left.normalKey)
        .setOrigin(0.5)
        .setDepth(this.DEPTH.UI)
        .setInteractive({ useHandCursor: true });

      const btnRight = this.add
        .image(pair.right.x, pair.right.y, pair.right.normalKey)
        .setOrigin(0.5)
        .setDepth(this.DEPTH.UI)
        .setInteractive({ useHandCursor: true });

      const refresh = () => {
        const s = selected[pair.pairId];
        btnLeft.setTexture(
          s === pair.left.id ? pair.left.selectedKey : pair.left.normalKey
        );
        btnRight.setTexture(
          s === pair.right.id ? pair.right.selectedKey : pair.right.normalKey
        );
      };

      btnLeft.on("pointerdown", () => {
        this.playS("click");
        selected[pair.pairId] = pair.left.id;
        refresh();
      });
      btnRight.on("pointerdown", () => {
        this.playS("click");
        selected[pair.pairId] = pair.right.id;
        refresh();
      });

      refresh();
      containers.push(btnLeft, btnRight);
    });

    const prevBtn = this.add
      .image(qcfg.prevPos.x, qcfg.prevPos.y, this.QUIZ_PREV_KEY)
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI)
      .setInteractive({ useHandCursor: true });
    containers.push(prevBtn);

    prevBtn.on("pointerdown", () => {
      this.playS("click");
      containers.forEach((c) => c.destroy());
      quizBg.destroy();
      this.returnToSelectionViewOnly();
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);
    const btConfirmar = new Button(this, {
      text: "CONFIRMAR",
      showIcon: false,
      colors,
    });
    this.add.existing(btConfirmar);
    btConfirmar.x = qcfg.confirmPos.x;
    btConfirmar.y = qcfg.confirmPos.y;
    containers.push(btConfirmar);

    btConfirmar.on("buttonClick", () => {
      const allAnswered = qcfg.pairs.every((p) => !!selected[p.pairId]);
      const allCorrect = qcfg.pairs.every(
        (p) => selected[p.pairId] === correct[p.pairId]
      );

      if (!allAnswered || !allCorrect) {
        this.showNegativeModal(qcfg, containers);
        return;
      }

      containers.forEach((o) => {
        if (o.disableInteractive) o.disableInteractive();
      });

      this.playPositiveFeedback(qcfg, () => {
        containers.forEach((c) => c.destroy());
        quizBg.destroy();
        this.markCharacterDone(charIndex);
      });
    });

    this.quizState = { charIndex, containers, selects: selected, correct };
  }

  showNegativeModal(qcfg, quizObjects) {
    quizObjects.forEach((o) => {
      if (o.disableInteractive) o.disableInteractive();
    });
    this.playS("erro");

    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.OVERLAY)
      .setInteractive();

    const modalPos = (qcfg.feedback && qcfg.feedback.negativeModalPos) || {
      x: 960,
      y: 540,
    };
    const modal = this.add
      .image(
        modalPos.x,
        modalPos.y,
        (qcfg.feedback && qcfg.feedback.negativeKey) ||
          "modal_feedback_negativoatv1"
      )
      .setDepth(this.DEPTH.MODAL)
      .setOrigin(0.5);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);
    const btVoltar = new Button(this, {
      text: "VOLTAR",
      showIcon: false,
      colors,
    });
    this.add.existing(btVoltar);
    const backPos = (qcfg.feedback && qcfg.feedback.negativeBackPos) || {
      x: 960,
      y: 830,
    };
    btVoltar.x = backPos.x;
    btVoltar.y = backPos.y;
    btVoltar.setDepth(this.DEPTH.MODAL_BTN);

    btVoltar.on("buttonClick", () => {
      overlay.destroy();
      modal.destroy();
      btVoltar.destroy();
      quizObjects.forEach((o) => {
        if (o.setInteractive) o.setInteractive({ useHandCursor: true });
      });

      this.ensureGlobalHUDOnTop();
    });
  }

  playPositiveFeedback(qcfg, done) {
    const pos = (qcfg.feedback && qcfg.feedback.positivePos) || {
      x: 960,
      y: 540,
    };
    const key =
      (qcfg.feedback && qcfg.feedback.positiveKey) || "feedback-acerto";

    this.playS("acerto");

    const fb = this.add
      .image(pos.x, pos.y, key)
      .setOrigin(0.5)
      .setDepth(this.DEPTH.MODAL)
      .setScale(0.9)
      .setAlpha(0);

    this.tweens.add({
      targets: fb,
      alpha: 1,
      scale: 1,
      ease: "Quad.Out",
      duration: 600,
    });

    this.time.delayedCall(3000, () => {
      fb.destroy();
      done && done();
    });
  }

  returnToSelectionViewOnly() {
    this.background.setVisible(true);
    this.characters.forEach((c) => {
      c.sprite.setVisible(true);
      c.button.setVisible(true);
    });
    this.ensureGlobalHUDOnTop();
  }

  markCharacterDone(charIndex) {
    const char = this.characters[charIndex];
    char.done = true;
    this.completedCount++;

    const allDone = this.completedCount === this.characters.length;

    if (allDone) {
      this.time.delayedCall(300, () => {
        this.goToGame2();
      });
      return;
    }

    this.background.setVisible(true);
    this.characters.forEach((c) => {
      c.sprite.setVisible(true);
      c.button.setVisible(true);
    });

    char.sprite.setTexture(char.inactive);
    char.button.setTexture("bt_cinza");

    this.ensureGlobalHUDOnTop();
  }

  goToGame2() {
    this.scene.start("Game2");
  }
}

export default Game1;

/**
 * @typedef {{
 *   bgKey: string,
 *   prevPos: {x:number,y:number},
 *   confirmPos: {x:number,y:number},
 *   pairs: {
 *     pairId: string,
 *     correct: string,
 *     left: { id:string, normalKey:string, selectedKey:string, x:number, y:number },
 *     right:{ id:string, normalKey:string, selectedKey:string, x:number, y:number }
 *   }[],
 *   feedback?: {
 *     positiveKey?: string,
 *     positivePos?: {x:number,y:number},
 *     negativeKey?: string,
 *     negativeModalPos?: {x:number,y:number},
 *     negativeBackPos?: {x:number,y:number}
 *   }
 * }} QuizConfig
 */
