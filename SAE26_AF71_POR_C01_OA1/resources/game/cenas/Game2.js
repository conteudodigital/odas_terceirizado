import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game2 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game2");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.DRAW_GIZMOS = false;

    this.BOARD_POS = { x: 1430, y: 665, scale: 1.0, rotation: 0 };

    this.FEEDBACK_POS = { x: 1425, y: 625, scale: 1.1 };

    this.LEON_POS = { x: 620, y: 750, scale: 1.0, rotation: 0 };

    this.MODAL_POS = {
      x: 960,
      y: 540,
      scale: 1.0,
      buttonOffsetY: 200,
    };

    this.OVERLAY_ALPHA = 0.75;
    this.OVERLAY_Z = 9900;
    this.MODAL_Z = 10000;
    this.BUTTON_Z = 10001;

    this.currentStep = 0;
    this.letters = [];
    this.dropZone = null;
    this.dropGizmo = null;
    this.board = null;
    this.placedText = null;

    this.fbOk = null;
    this.fbErr = null;

    this.leon = null;

    this.sfx = { acerto: null, erro: null };

    this.stepLocked = false;
    this._dropHandlerRegistered = false;

    this.totalCorrect = 0;
    this.totalAnswered = 0;

    this._modal = null;
    this._modalBtn = null;
    this._overlay = null;
  }

  get QUIZ() {
    return [
      {
        id: "atv1_quest1",
        boardKey: "atv1_quest1",
        correct: "ss",
        zone: { x: 1380, y: 457, w: 75, h: 75 },
      },
      {
        id: "atv1_quest2",
        boardKey: "atv1_quest2",
        correct: "cedilha",
        zone: { x: 1492, y: 468, w: 75, h: 75 },
      },
      {
        id: "atv1_quest3",
        boardKey: "atv1_quest3",
        correct: "cedilha",
        zone: { x: 1284, y: 765, w: 75, h: 75 },
      },
    ];
  }

  create() {
    this.add.image(0, 0, "atv1Bg").setOrigin(0, 0);

    this.marca = ColorManager.getCurrentMarca(this);
    this.colors = ColorManager.getColors(this.marca, ColorManager.BLUE);

    this.board = this.add
      .image(this.BOARD_POS.x, this.BOARD_POS.y, this.QUIZ[0].boardKey)
      .setOrigin(0.5)
      .setScale(this.BOARD_POS.scale)
      .setRotation(this.BOARD_POS.rotation);

    const firstLeonKey = this.getLeonKeyForStep(0);
    this.leon = this.add
      .image(this.LEON_POS.x, this.LEON_POS.y, firstLeonKey)
      .setOrigin(0.5)
      .setScale(this.LEON_POS.scale)
      .setRotation(this.LEON_POS.rotation)
      .setDepth(500);

    this.fbOk = this.add
      .image(this.FEEDBACK_POS.x, this.FEEDBACK_POS.y, "feedback_acerto")
      .setOrigin(0.5)
      .setScale(this.FEEDBACK_POS.scale)
      .setDepth(1000)
      .setVisible(false)
      .setAlpha(0);

    this.fbErr = this.add
      .image(this.FEEDBACK_POS.x, this.FEEDBACK_POS.y, "feedback_erro")
      .setOrigin(0.5)
      .setScale(this.FEEDBACK_POS.scale)
      .setDepth(1000)
      .setVisible(false)
      .setAlpha(0);

    this.sfx.acerto = this.sound.add("acerto", { volume: 1 });
    this.sfx.erro = this.sound.add("erro", { volume: 1 });

    this.createLetterChips();
    this.buildDropZoneForStep(0);

    if (!this._dropHandlerRegistered) {
      this.input.on("drop", this.handleDrop, this);
      this._dropHandlerRegistered = true;
    }

    super.create();
  }

  getLeonKeyForStep(stepIndex) {
    return stepIndex % 2 === 0 ? "leon_atv1" : "leon_atv2";
  }

  updateLeonForStep(stepIndex) {
    const key = this.getLeonKeyForStep(stepIndex);
    if (!this.leon) return;
    this.leon
      .setTexture(key)
      .setPosition(this.LEON_POS.x, this.LEON_POS.y)
      .setScale(this.LEON_POS.scale)
      .setRotation(this.LEON_POS.rotation);
  }

  createLetterChips() {
    const home = [
      { key: "ss", texture: "ss_drag", x: 110, y: 450 },
      { key: "cedilha", texture: "cedilha_drag", x: 110, y: 600 },
      { key: "s", texture: "s_drag", x: 110, y: 750 },
    ];

    this.letters = home.map((cfg) => {
      const sp = this.add.image(cfg.x, cfg.y, cfg.texture).setOrigin(0.5);
      sp.setInteractive({ draggable: true, useHandCursor: true });
      sp.setData("key", cfg.key);
      sp.setData("homeX", cfg.x);
      sp.setData("homeY", cfg.y);

      sp.on("dragstart", () => {
        if (this.stepLocked) return;
        this.children.bringToTop(sp);
        this.tweenPulse(sp, 1.0, 1.12, 140);
      });

      sp.on("drag", (_pointer, dragX, dragY) => {
        if (this.stepLocked) return;
        sp.x = dragX;
        sp.y = dragY;
      });

      sp.on("dragend", (_pointer, wasDropped) => {
        if (this.stepLocked) return;
        if (!wasDropped) this.resetToHome(sp);
      });

      return sp;
    });
  }

  disableAllLetters() {
    this.letters.forEach((l) => l.disableInteractive());
  }
  enableAllLetters() {
    this.letters.forEach((l) => l.setInteractive({ draggable: true }));
  }

  resetToHome(sp) {
    sp.setVisible(true);
    this.tweens.add({
      targets: sp,
      x: sp.getData("homeX"),
      y: sp.getData("homeY"),
      alpha: 1,
      scale: 1,
      duration: 240,
      ease: "Quad.easeOut",
      onComplete: () => this.tweenPulse(sp, 1.06, 1.0, 120),
    });
  }

  snapScaleAndFill(sp, zone) {
    const toX = zone.x;
    const toY = zone.y;

    const fitW =
      zone.input?.hitArea?.width ??
      zone.width ??
      this.QUIZ[this.currentStep].zone.w;
    const fitH =
      zone.input?.hitArea?.height ??
      zone.height ??
      this.QUIZ[this.currentStep].zone.h;

    const baseW = sp.width;
    const baseH = sp.height;
    const scaleFit = Math.min(fitW / baseW, fitH / baseH) * 0.9;

    this.tweens.add({
      targets: sp,
      x: toX,
      y: toY,
      scale: scaleFit * 1.12,
      duration: 260,
      ease: "Back.easeOut",
      onComplete: () => {
        this.tweens.add({
          targets: sp,
          scale: scaleFit,
          duration: 140,
          ease: "Sine.easeOut",
        });

        if (this.placedText) this.placedText.destroy();

        const letterStr = this.getLetterDisplay(
          this.QUIZ[this.currentStep].correct
        );
        this.placedText = this.add
          .text(toX, toY, letterStr, {
            fontFamily: "Nunito",
            fontSize: "35px",
            fontStyle: "900",
            color: "#FFFFFF",
            stroke: "#1B1B1B",
            strokeThickness: 6,
            align: "center",
          })
          .setOrigin(0.5)
          .setDepth(sp.depth + 1);

        this.tweens.add({
          targets: sp,
          alpha: 0,
          duration: 120,
          onComplete: () => sp.setVisible(false),
        });
      },
    });
  }

  showFeedback(ok = true) {
    const sprite = ok ? this.fbOk : this.fbErr;
    if (!sprite) return;

    sprite.setPosition(this.FEEDBACK_POS.x, this.FEEDBACK_POS.y);
    sprite.setScale(this.FEEDBACK_POS.scale);

    sprite
      .setVisible(true)
      .setAlpha(0)
      .setScale(this.FEEDBACK_POS.scale * 0.8);
    this.tweens.add({
      targets: sprite,
      alpha: 1,
      scale: this.FEEDBACK_POS.scale,
      duration: 180,
      ease: "Back.easeOut",
      onComplete: () => {
        this.time.delayedCall(500, () => {
          this.tweens.add({
            targets: sprite,
            alpha: 0,
            duration: 180,
            ease: "Sine.easeInOut",
            onComplete: () => sprite.setVisible(false),
          });
        });
      },
    });

    if (ok) this.sfx.acerto?.play();
    else this.sfx.erro?.play();
  }

  handleDrop(_pointer, gameObject, dropZone) {
    if (this.stepLocked) return;

    const sp = this.letters.find((l) => l === gameObject);
    if (!sp) return;

    this.stepLocked = true;
    this.disableAllLetters();

    const stepCfg = this.QUIZ[this.currentStep];
    const isCorrect = sp.getData("key") === stepCfg.correct;

    this.totalAnswered += 1;
    if (isCorrect) this.totalCorrect += 1;

    if (isCorrect) {
      this.snapScaleAndFill(sp, dropZone);
      this.feedbackZone(true);
      this.showFeedback(true);
    } else {
      this.feedbackZone(false);
      this.showFeedback(false);

      this.resetToHome(sp);
    }

    this.time.delayedCall(650, () => this.advanceOrEnd());
  }

  advanceOrEnd() {
    if (this.totalAnswered >= this.QUIZ.length) {
      const allRight = this.totalCorrect === this.QUIZ.length;
      this.showEndModal(allRight);
      return;
    }

    this.nextStep();
  }

  showEndModal(isPositive) {
    this.stepLocked = true;
    this.disableAllLetters();

    this._overlay = this.add
      .rectangle(960, 540, 1920, 1080, 0x000000, 0)
      .setDepth(this.OVERLAY_Z)
      .setScrollFactor(0)
      .setInteractive();
    this.tweens.add({
      targets: this._overlay,
      fillAlpha: this.OVERLAY_ALPHA,
      duration: 200,
      ease: "Sine.easeOut",
    });

    const key = isPositive ? "modal_positivo_atv1" : "modal_negativo_atv1";
    this._modal = this.add
      .image(this.MODAL_POS.x, this.MODAL_POS.y, key)
      .setOrigin(0.5)
      .setScale(this.MODAL_POS.scale)
      .setDepth(this.MODAL_Z);

    const btnText = isPositive ? "PRÓXIMO" : "TENTAR DE NOVO";
    const btn = new Button(this, {
      text: btnText,
      showIcon: true,
      colors: this.colors,
    });
    btn.x =
      this._modal.x -
      btn.width / 2 +
      (this._modal.width * this._modal.scale) / 2 -
      (this._modal.width * this._modal.scale) / 2;
    btn.y = this._modal.y + this.MODAL_POS.buttonOffsetY;
    btn.setDepth(this.BUTTON_Z);

    const closeModal = () => {
      if (this._overlay) {
        this._overlay.destroy();
        this._overlay = null;
      }
      if (this._modal) {
        this._modal.destroy();
        this._modal = null;
      }
      if (this._modalBtn) {
        this._modalBtn.destroy();
        this._modalBtn = null;
      }
    };

    btn.on("buttonClick", () => {
      const positive = isPositive;
      closeModal();
      if (positive) {
        this.scene.start("Game3");
      } else {
        this.resetActivity();
      }
    });

    this._modalBtn = btn;
  }

  resetActivity() {
    if (this._overlay) {
      this._overlay.destroy();
      this._overlay = null;
    }
    if (this._modal) {
      this._modal.destroy();
      this._modal = null;
    }
    if (this._modalBtn) {
      this._modalBtn.destroy();
      this._modalBtn = null;
    }

    this.totalAnswered = 0;
    this.totalCorrect = 0;
    this.currentStep = 0;

    if (this.placedText) {
      this.placedText.destroy();
      this.placedText = null;
    }

    this.letters.forEach((sp) => {
      sp.setAlpha(1);
      sp.setVisible(true);
      sp.setScale(1);
      sp.setPosition(sp.getData("homeX"), sp.getData("homeY"));
    });

    this.stepLocked = false;
    this.enableAllLetters();

    this.buildDropZoneForStep(this.currentStep);
  }

  getLetterDisplay(key) {
    switch (key) {
      case "ss":
        return "SS";
      case "cedilha":
        return "Ç";
      default:
        return "S";
    }
  }

  tweenPulse(target, from, to, duration) {
    target.setScale(from);
    this.tweens.add({
      targets: target,
      scale: to,
      duration,
      yoyo: true,
      ease: "Sine.easeInOut",
    });
  }

  buildDropZoneForStep(stepIndex) {
    if (this.dropZone) {
      this.dropZone.destroy();
      this.dropZone = null;
    }
    if (this.dropGizmo) {
      this.dropGizmo.destroy();
      this.dropGizmo = null;
    }
    if (this.placedText) {
      this.placedText.destroy();
      this.placedText = null;
    }

    const cfg = this.QUIZ[stepIndex];

    if (this.board) {
      this.board
        .setTexture(cfg.boardKey)
        .setPosition(this.BOARD_POS.x, this.BOARD_POS.y)
        .setScale(this.BOARD_POS.scale)
        .setRotation(this.BOARD_POS.rotation);
    }

    this.updateLeonForStep(stepIndex);

    const Z = cfg.zone;
    this.dropZone = this.add
      .zone(Z.x, Z.y, Z.w, Z.h)
      .setRectangleDropZone(Z.w, Z.h)
      .setInteractive({ cursor: "copy" });
    this.dropZone.setData("id", cfg.id);

    if (this.DRAW_GIZMOS) {
      this.dropGizmo = this.add.graphics();
      this.drawDropGizmo(Z, 0x00ff00);
    }

    this.stepLocked = false;
    this.enableAllLetters();
    this.input.setTopOnly(false);
  }

  drawDropGizmo(zoneRect, color) {
    if (!this.dropGizmo) return;
    this.dropGizmo.clear();
    this.dropGizmo.lineStyle(3, color, 0.9);
    this.dropGizmo.strokeRect(
      zoneRect.x - zoneRect.w / 2,
      zoneRect.y - zoneRect.h / 2,
      zoneRect.w,
      zoneRect.h
    );
    this.dropGizmo.lineBetween(
      zoneRect.x - 12,
      zoneRect.y - 12,
      zoneRect.x + 12,
      zoneRect.y + 12
    );
    this.dropGizmo.lineBetween(
      zoneRect.x - 12,
      zoneRect.y + 12,
      zoneRect.x + 12,
      zoneRect.y - 12
    );

    const tag = this.add
      .text(
        zoneRect.x,
        zoneRect.y - zoneRect.h / 2 - 18,
        this.QUIZ[this.currentStep].id,
        {
          fontFamily: "Inter, Nunito, Arial",
          fontSize: "16px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5);

    this.time.delayedCall(40, () => {
      if (this.dropGizmo) this.dropGizmo.once("destroy", () => tag.destroy());
    });
  }

  feedbackZone(ok) {
    if (!this.dropGizmo || !this.DRAW_GIZMOS) return;
    const Z = this.QUIZ[this.currentStep].zone;
    const flashColor = ok ? 0x2ecc71 : 0xe74c3c;
    this.drawDropGizmo(Z, flashColor);
    this.time.delayedCall(220, () => this.drawDropGizmo(Z, 0x00ff00));
  }

  nextStep() {
    this.letters.forEach((sp) => {
      sp.setAlpha(1);
      sp.setVisible(true);
      sp.setScale(1);
      this.tweens.add({
        targets: sp,
        x: sp.getData("homeX"),
        y: sp.getData("homeY"),
        duration: 220,
        ease: "Quad.easeOut",
      });
    });

    this.currentStep++;

    this.buildDropZoneForStep(this.currentStep);
  }
}

export default Game2;
