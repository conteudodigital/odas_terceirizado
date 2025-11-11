import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game4 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game4");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.DRAW_GIZMOS = false;

    this.BOARD_POS = { x: 775, y: 625, scale: 1.0, rotation: 0 };
    this.FEEDBACK_POS = { x: 750, y: 650, scale: 1.1 };
    this.LEON_POS = { x: 1475, y: 806, scale: 1.0, rotation: 0 };

    this.MODAL_POS = { x: 960, y: 540, scale: 1.0, buttonOffsetY: 200 };
    this.OVERLAY_ALPHA = 0.75;
    this.OVERLAY_Z = 9900;
    this.MODAL_Z = 10000;
    this.BUTTON_Z = 10001;

    this.currentStep = 0;
    this.letters = [];
    this.dropZones = [];
    this.dropGizmos = [];
    this.zoneAnswers = [];
    this.board = null;
    this._placedTexts = [];

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
        id: "atv2_quest1",
        boardKey: "atv2_quest1",
        zones: [{ x: 935, y: 580, w: 75, h: 75, expect: "c" }],
      },
      {
        id: "atv2_quest2",
        boardKey: "atv2_quest2",
        zones: [
          { x: 561, y: 565, w: 75, h: 75, expect: "c" },
          { x: 576, y: 680, w: 75, h: 75, expect: "s" },
        ],
      },
      {
        id: "atv2_quest3",
        boardKey: "atv2_quest3",
        zones: [
          { x: 871, y: 467, w: 75, h: 75, expect: "c" },
          { x: 603, y: 583, w: 75, h: 75, expect: "ss" },
        ],
      },
    ];
  }

  create() {
    this.add.image(0, 0, "atv2_bg").setOrigin(0, 0);

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
      .setDepth(1500)
      .setVisible(false)
      .setAlpha(0);

    this.fbErr = this.add
      .image(this.FEEDBACK_POS.x, this.FEEDBACK_POS.y, "feedback_erro")
      .setOrigin(0.5)
      .setScale(this.FEEDBACK_POS.scale)
      .setDepth(1500)
      .setVisible(false)
      .setAlpha(0);

    this.sfx.acerto = this.sound.add("acerto", { volume: 1 });
    this.sfx.erro = this.sound.add("erro", { volume: 1 });

    this.createLetterChips();

    this.buildDropZonesForStep(0);

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
    this.leon
      ?.setTexture(key)
      .setPosition(this.LEON_POS.x, this.LEON_POS.y)
      .setScale(this.LEON_POS.scale)
      .setRotation(this.LEON_POS.rotation);
  }

  createLetterChips() {
    const home = [
      { key: "ss", texture: "ss_drag", x: 110, y: 395 },
      { key: "cedilha", texture: "cedilha_drag", x: 110, y: 535 },
      { key: "c", texture: "c_drag", x: 110, y: 675 },
      { key: "s", texture: "s_drag", x: 110, y: 815 },
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
      zone.input?.hitArea?.width ?? zone.width ?? zone.getData("w") ?? 75;
    const fitH =
      zone.input?.hitArea?.height ?? zone.height ?? zone.getData("h") ?? 75;

    const scaleFit = Math.min(fitW / sp.width, fitH / sp.height) * 0.9;

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

        const letterStr = this.getLetterDisplay(sp.getData("key"));
        const txt = this.add
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

        this._placedTexts.push(txt);

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

    sprite
      .setPosition(this.FEEDBACK_POS.x, this.FEEDBACK_POS.y)
      .setScale(this.FEEDBACK_POS.scale)
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

    (ok ? this.sfx.acerto : this.sfx.erro)?.play();
  }

  handleDrop(_pointer, gameObject, dropZone) {
    const zonesCount = this.dropZones.length;

    const sp = this.letters.find((l) => l === gameObject);
    if (!sp) return;

    const idx = dropZone.getData("slotIndex") ?? 0;
    if (this.zoneAnswers[idx]?.correct) return;

    const expected = dropZone.getData("expect");
    const droppedKey = sp.getData("key");
    const isCorrect = droppedKey === expected;

    if (zonesCount === 1) {
      if (this.stepLocked) return;
      this.stepLocked = true;

      if (isCorrect) {
        this.zoneAnswers[idx] = { correct: true };
        sp.disableInteractive();
        this.snapScaleAndFill(sp, dropZone);
        this.feedbackZone(true, dropZone);
        this.showFeedback(true);
        this.totalAnswered += 1;
        this.totalCorrect += 1;
        this.disableAllLetters();
        this.time.delayedCall(650, () => this.advanceOrEnd());
      } else {
        this.feedbackZone(false, dropZone);
        this.showFeedback(false);
        this.resetToHome(sp);
        this.time.delayedCall(650, () => {
          this.stepLocked = false;
          this.enableAllLetters();
        });
      }
      return;
    }

    if (isCorrect) {
      this.zoneAnswers[idx] = { correct: true };
      sp.disableInteractive();
      this.snapScaleAndFill(sp, dropZone);
      this.feedbackZone(true, dropZone);
      this.showFeedback(true);

      const allCorrect = this.zoneAnswers.every((z) => z && z.correct);
      if (allCorrect) {
        this.totalAnswered += 1;
        this.totalCorrect += 1;
        this.disableAllLetters();
        this.time.delayedCall(650, () => this.advanceOrEnd());
      }
    } else {
      this.feedbackZone(false, dropZone);
      this.showFeedback(false);
      this.resetToHome(sp);
    }
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

    const key = isPositive ? "modal_positivo_atv2" : "modal_negativo_atv1";
    this._modal = this.add
      .image(this.MODAL_POS.x, this.MODAL_POS.y, key)
      .setOrigin(0.5)
      .setScale(this.MODAL_POS.scale)
      .setDepth(this.MODAL_Z);

    const btnText = isPositive ? "PRÓXIMA FASE" : "TENTAR DE NOVO";
    const btn = new Button(this, {
      text: btnText,
      showIcon: true,
      colors: this.colors,
    });
    btn.x = this._modal.x - 250;
    btn.y = this._modal.y + this.MODAL_POS.buttonOffsetY;
    btn.setDepth(this.BUTTON_Z);

    const closeModal = () => {
      this._overlay?.destroy();
      this._overlay = null;
      this._modal?.destroy();
      this._modal = null;
      this._modalBtn?.destroy();
      this._modalBtn = null;
    };

    btn.on("buttonClick", () => {
      const positive = isPositive;
      closeModal();
      if (positive) this.scene.start("Game5");
      else this.resetActivity();
    });

    this._modalBtn = btn;
  }

  resetActivity() {
    this._overlay?.destroy();
    this._overlay = null;
    this._modal?.destroy();
    this._modal = null;
    this._modalBtn?.destroy();
    this._modalBtn = null;

    this.totalAnswered = 0;
    this.totalCorrect = 0;
    this.currentStep = 0;

    this._placedTexts.forEach((t) => t.destroy());
    this._placedTexts = [];

    this.letters.forEach((sp) => {
      sp.setAlpha(1);
      sp.setVisible(true);
      sp.setScale(1);
      sp.setPosition(sp.getData("homeX"), sp.getData("homeY"));
      sp.setInteractive({ draggable: true, useHandCursor: true });
    });

    this.buildDropZonesForStep(this.currentStep);
  }

  getLetterDisplay(key) {
    switch (key) {
      case "ss":
        return "SS";
      case "cedilha":
        return "Ç";
      case "c":
        return "C";
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

  buildDropZonesForStep(stepIndex) {
    this.dropZones.forEach((z) => z.destroy());
    this.dropZones = [];
    this.dropGizmos.forEach((g) => g.destroy());
    this.dropGizmos = [];
    this._placedTexts.forEach((t) => t.destroy());
    this._placedTexts = [];

    const cfg = this.QUIZ[stepIndex];

    this.board
      .setTexture(cfg.boardKey)
      .setPosition(this.BOARD_POS.x, this.BOARD_POS.y)
      .setScale(this.BOARD_POS.scale)
      .setRotation(this.BOARD_POS.rotation);
    this.updateLeonForStep(stepIndex);

    this.zoneAnswers = cfg.zones.map(() => ({ correct: false }));
    this.stepLocked = false;

    cfg.zones.forEach((Z, idx) => {
      const zone = this.add
        .zone(Z.x, Z.y, Z.w, Z.h)
        .setRectangleDropZone(Z.w, Z.h)
        .setInteractive({ cursor: "copy" });
      zone.setData("id", cfg.id);
      zone.setData("slotIndex", idx);
      zone.setData("w", Z.w);
      zone.setData("h", Z.h);
      zone.setData("expect", Z.expect);

      this.dropZones.push(zone);

      if (this.DRAW_GIZMOS) {
        const g = this.add.graphics();
        this.drawDropGizmo(g, cfg.id, Z, 0x00ff00, idx);
        this.dropGizmos.push(g);
      }
    });

    this.enableAllLetters();
    this.input.setTopOnly(false);
  }

  drawDropGizmo(gfx, id, zoneRect, color, idx) {
    gfx.clear();
    gfx.lineStyle(3, color, 0.9);
    gfx.strokeRect(
      zoneRect.x - zoneRect.w / 2,
      zoneRect.y - zoneRect.h / 2,
      zoneRect.w,
      zoneRect.h
    );
    gfx.lineBetween(
      zoneRect.x - 12,
      zoneRect.y - 12,
      zoneRect.x + 12,
      zoneRect.y + 12
    );
    gfx.lineBetween(
      zoneRect.x - 12,
      zoneRect.y + 12,
      zoneRect.x + 12,
      zoneRect.y - 12
    );

    const multi = this.QUIZ[this.currentStep].zones.length > 1;
    const label = `${id}${multi ? ` (Z${idx + 1})` : ""}`;

    const tag = this.add
      .text(zoneRect.x, zoneRect.y - zoneRect.h / 2 - 18, label, {
        fontFamily: "Inter, Nunito, Arial",
        fontSize: "16px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.time.delayedCall(40, () => {
      if (gfx) gfx.once("destroy", () => tag.destroy());
    });
  }

  feedbackZone(ok, dropZoneUsed) {
    if (!this.DRAW_GIZMOS || !dropZoneUsed) return;

    const idx = dropZoneUsed.getData("slotIndex") ?? 0;
    const zones = this.QUIZ[this.currentStep].zones;
    const Z = zones[idx] ?? zones[0];

    const g = this.dropGizmos[idx];
    if (!g) return;

    const flashColor = ok ? 0x2ecc71 : 0xe74c3c;
    this.drawDropGizmo(g, this.QUIZ[this.currentStep].id, Z, flashColor, idx);
    this.time.delayedCall(220, () =>
      this.drawDropGizmo(g, this.QUIZ[this.currentStep].id, Z, 0x00ff00, idx)
    );
  }

  nextStep() {
    this.letters.forEach((sp) => {
      sp.setAlpha(1);
      sp.setVisible(true);
      sp.setScale(1);
      sp.setInteractive({ draggable: true, useHandCursor: true });
      this.tweens.add({
        targets: sp,
        x: sp.getData("homeX"),
        y: sp.getData("homeY"),
        duration: 220,
        ease: "Quad.easeOut",
      });
    });

    this.currentStep++;
    this.buildDropZonesForStep(this.currentStep);
  }
}

export default Game4;
