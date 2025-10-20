import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game3 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game3");
    this.controladorDeCenas = controladorDeCenas;

    this.loaded = false;
    this._currentIndex = 0;
    this._selectedEnv = null;
    this._envChips = {};
    this._envHomePositions = {};
    this._droppedChip = null;

    this.dropzones = {};
    this._dragCtx = new Map();
    this._onGlobalDrop = null;

    this.btConfirmar = null;
    this.btTente = null;
    this.btProximo = null;
    this._awaitingNext = false;
    this.letreiroSprite = null;

    this.modalOverlay = null;
    this.modalSprite = null;
    this.btInicio = null;

    this.feedbackSprite = null;
    this.feedbackErroSprite = null;
    this.sfxAcerto = null;
    this.sfxErro = null;
    this._fxTweenIn = null;
    this._fxTweenOut = null;
    this._fxErrIn = null;
    this._fxErrOut = null;

    this.DEPTH = {
      BG: -9999,
      SLOT: 5,
      CHIPS: 10,
      UI: 50,
      FEEDBACK: 900,
      MODAL_OVERLAY: 998,
      MODAL: 1000,
    };

    this.LAYOUT_PARAMS = {
      sombraCircle: { cx: 361, cy: 490, r: 245 },

      slotCircle: { cx: 716, cy: 375, r: 90, hitR: 160 },
      panelRect: { x: 1073, y: 275, w: 840, h: 275 },
      envCircles: {
        terra: { cx: 1215, cy: 385, r: 85 },
        agua: { cx: 1482.5, cy: 385, r: 85 },
        ambos: { cx: 1752.5, cy: 385, r: 85 },
      },

      dicaTitle: { x: 220, y: 885 },
      dicaText: { x: 220, y: 950, w: 1000 },

      bia: { x: 1675, y: 1080, scale: 1.0 },

      buttons: {
        confirm: { x: 175, y: 700 },
        tryAgain: { x: 100, y: 700 },
        next: { x: 195, y: 700 },
        inicio: { x: 825, y: 715 },
      },

      letreiro: {
        default: { x: 365, y: 230 },
      },

      modal: {
        overlayAlpha: 0.8,
        modalPos: { x: 960, y: 540 },
        modalScale: 1.0,
      },

      scales: { sombra: 1.0, chip: 1.0, bia: 1.0 },
      snapFactor: 1.0,
    };

    this.ANIMAIS = [
      {
        id: "golfinho",
        sombraKey: "golfinho_sombra",
        imgKey: "golfinho_img",
        letreiroKey: "golfinho_letreiro",
        dica: "Tem nadadeiras e vive no mar.",
        correta: "agua",
      },
      {
        id: "sapo",
        sombraKey: "sapo_sombra",
        imgKey: "sapo_img",
        letreiroKey: "sapo_letreiro",
        dica: "Pula bem alto, vive na terra e também nada muito bem.",
        correta: "ambos",
      },
      {
        id: "cobra",
        sombraKey: "cobra_sombra",
        imgKey: "cobra_img",
        letreiroKey: "cobra_letreiro",
        dica: "Não tem pernas, rasteja no chão e se esconde em tocas ou na vegetação.",
        correta: "terra",
      },
      {
        id: "pato",
        sombraKey: "pato_sombra",
        imgKey: "pato_img",
        letreiroKey: "pato_letreiro",
        dica: "Nada e também anda na terra. Tem penas e bico chato.",
        correta: "ambos",
      },
    ];
  }

  _resetRuntime() {
    this.dropzones = {};
    this._dragCtx = new Map();

    if (this._onGlobalDrop) this.input.off("drop", this._onGlobalDrop);

    this._onGlobalDrop = (pointer, gameObject, dropZone) => {
      if (dropZone && typeof dropZone.onDrop === "function") {
        dropZone.onDrop(pointer, gameObject);
      } else if (gameObject) {
        this._returnHome(gameObject, true);
      }
    };
    this.input.on("drop", this._onGlobalDrop);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this._onGlobalDrop) this.input.off("drop", this._onGlobalDrop);
      this.input.off("drag");
      this._hideAcertoFX(true);
      this._hideErroFX(true);
    });
  }

  create() {
    this.add.image(0, 0, "game2FullBg").setOrigin(0, 0).setDepth(this.DEPTH.BG);
    this.input.setTopOnly(false);
    this._resetRuntime();

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const { sombraCircle, dicaText, dicaTitle, bia } = this.LAYOUT_PARAMS;

    this._createSingleDropZone();

    this.sombraSprite = this.add
      .image(sombraCircle.cx, sombraCircle.cy, "__placeholder__")
      .setOrigin(0.5)
      .setScale(this.LAYOUT_PARAMS.scales.sombra)
      .setVisible(false)
      .setDepth(this.DEPTH.SLOT);

    this.letreiroSprite = this.add
      .image(0, 0, "__placeholder__")
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(this.DEPTH.UI);

    this.feedbackSprite = this.add
      .image(this.sombraSprite.x, this.sombraSprite.y, "feedback-acerto")
      .setOrigin(0.5)
      .setVisible(false)
      .setAlpha(0)
      .setDepth(this.DEPTH.FEEDBACK);

    this.feedbackErroSprite = this.add
      .image(this.sombraSprite.x, this.sombraSprite.y, "feedback-erro")
      .setOrigin(0.5)
      .setVisible(false)
      .setAlpha(0)
      .setDepth(this.DEPTH.FEEDBACK);

    try {
      this.sfxAcerto = this.sound.add("acerto", { volume: 1, loop: false });
    } catch (e) {
      this.sfxAcerto = null;
    }
    try {
      this.sfxErro = this.sound.add("erro", { volume: 1, loop: false });
    } catch (e) {
      this.sfxErro = null;
    }

    this.biaV1 = this.add
      .image(bia.x, bia.y, "biav1")
      .setOrigin(0.5, 1.0)
      .setScale(this.LAYOUT_PARAMS.scales.bia)
      .setVisible(true)
      .setDepth(this.DEPTH.UI);
    this.biaV2 = this.add
      .image(bia.x, bia.y, "biav2")
      .setOrigin(0.5, 1.0)
      .setScale(this.LAYOUT_PARAMS.scales.bia)
      .setVisible(false)
      .setDepth(this.DEPTH.UI);

    this.dicaTitle = this.add
      .text(dicaTitle.x, dicaTitle.y, "Dica", {
        fontFamily: "Nunito",
        fontSize: "38px",
        fontStyle: "Bold",
        color: "#7C3AED",
      })
      .setVisible(false)
      .setDepth(this.DEPTH.UI);

    this.dicaText = this.add
      .text(dicaText.x, dicaText.y, "", {
        fontFamily: "Nunito",
        fontSize: "30px",
        color: "#222222",
        fontStyle: "1000",
        wordWrap: { width: dicaText.w, useAdvancedWrap: true },
      })
      .setDepth(this.DEPTH.UI);

    this._createEnvChips();

    const { confirm, tryAgain, next } = this.LAYOUT_PARAMS.buttons;

    this.btConfirmar = new Button(this, {
      text: "CONFIRMAR",
      showIcon: false,
      colors,
    });
    this.add.existing(this.btConfirmar);
    this.btConfirmar.setPosition(confirm.x, confirm.y);
    this.btConfirmar.setDepth(this.DEPTH.UI);

    this.btTente = new Button(this, {
      text: "TENTE NOVAMENTE",
      showIcon: false,
      colors,
    });
    this.add.existing(this.btTente);
    this.btTente.setPosition(tryAgain.x, tryAgain.y);
    this.btTente.setDepth(this.DEPTH.UI);

    this.btProximo = new Button(this, {
      text: "PRÓXIMO",
      showIcon: false,
      colors,
    });
    this.add.existing(this.btProximo);
    this.btProximo.setPosition(next.x, next.y);
    this.btProximo.setDepth(this.DEPTH.UI);

    this._hideAllButtons();

    this.btConfirmar.on("buttonClick", () => this._onConfirm());
    this.btTente.on("buttonClick", () => this._onTryAgain());
    this.btProximo.on("buttonClick", () => this._nextAnimal());

    this._buildCompletionModal(colors);

    this.input.on("drag", (_p, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this._loadAnimal();

    super.create();
  }

  _hideAllButtons() {
    this.btConfirmar.setVisible(false);
    this.btTente.setVisible(false);
    this.btProximo.setVisible(false);
  }
  _showBtnConfirmar() {
    this._hideAllButtons();
    this.btConfirmar.setVisible(true);
    this.children.bringToTop(this.btConfirmar);
  }
  _showBtnTente() {
    this._hideAllButtons();
    this.btTente.setVisible(true);
    this.children.bringToTop(this.btTente);
  }
  _showBtnProximo() {
    this._hideAllButtons();
    this.btProximo.setVisible(true);
    this.children.bringToTop(this.btProximo);
  }

  _createSingleDropZone() {
    const { slotCircle } = this.LAYOUT_PARAMS;
    const zone = this.add
      .zone(
        slotCircle.cx,
        slotCircle.cy,
        slotCircle.hitR * 2,
        slotCircle.hitR * 2
      )
      .setCircleDropZone(slotCircle.hitR);
    zone.setName("SLOT");

    this.dropzones.SLOT = { zone, items: [], rect: { ...slotCircle } };
    zone.onDrop = (_pointer, gameObject) => this._trySnapIntoSlot(gameObject);
    zone.setDepth(this.DEPTH.SLOT);
    this.children.bringToTop(zone);
  }

  _createEnvChips() {
    const { envCircles } = this.LAYOUT_PARAMS;
    this._envChips.terra = this._makeChip(
      "terra",
      "terra",
      envCircles.terra.cx,
      envCircles.terra.cy
    );
    this._envChips.agua = this._makeChip(
      "agua",
      "agua",
      envCircles.agua.cx,
      envCircles.agua.cy
    );
    this._envChips.ambos = this._makeChip(
      "ambos",
      "ambos",
      envCircles.ambos.cx,
      envCircles.ambos.cy
    );

    Object.values(this._envChips).forEach((chip) => {
      this._envHomePositions[chip._kind] = { x: chip.x, y: chip.y };
      chip.setData("home", { x: chip.x, y: chip.y });
      chip.setData("inSlot", false);
    });
  }

  _makeChip(kind, textureKey, x, y) {
    const chip = this.add.image(x, y, textureKey).setOrigin(0.5);
    chip._kind = kind;
    chip.setScale(this.LAYOUT_PARAMS.scales.chip);
    chip.setInteractive({ draggable: true, useHandCursor: true });
    chip.setDepth(this.DEPTH.CHIPS);
    this.input.setDraggable(chip, true);

    chip.on("dragstart", () => this._onChipDragStart(chip));
    chip.on("dragend", () => this._onChipDragEnd(chip));
    chip.on("drop", (_pointer, dropZone) => {
      if (dropZone === this.dropzones.SLOT.zone) this._trySnapIntoSlot(chip);
    });

    return chip;
  }

  _onChipDragStart(chip) {
    chip.setDepth(this.DEPTH.UI + 1);
    this._rememberHome(chip);

    if (this._awaitingNext) this._awaitingNext = false;
    this._hideAllButtons();
    this._hideLetreiro();

    if (chip.getData("inSlot")) {
      chip.setData("inSlot", false);
      this._droppedChip = null;
      this._selectedEnv = null;
    }

    this._hideAcertoFX();
    this._hideErroFX();
  }

  _onChipDragEnd(chip) {
    if (!this._isInsideSlotVisual(chip)) {
      this._returnHome(chip, true);
      return;
    }
    this._trySnapIntoSlot(chip);
  }

  _isInsideSlotVisual(chip) {
    const { slotCircle, snapFactor } = this.LAYOUT_PARAMS;
    const dx = chip.x - slotCircle.cx;
    const dy = chip.y - slotCircle.cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist <= slotCircle.r * snapFactor;
  }

  _trySnapIntoSlot(chip) {
    if (!chip || !chip._kind) return;
    if (!this._isInsideSlotVisual(chip)) {
      this._returnHome(chip, true);
      return;
    }

    if (this._droppedChip && this._droppedChip !== chip)
      this._returnHome(this._droppedChip, false);

    const zone = this.dropzones.SLOT.zone;
    chip.setData("inSlot", true);
    this._droppedChip = chip;
    this._selectedEnv = chip._kind;

    this.tweens.add({
      targets: chip,
      x: zone.x,
      y: zone.y,
      duration: 160,
      ease: "Sine.easeOut",
      onComplete: () => {
        chip.setDepth(this.DEPTH.CHIPS);
        if (!this._awaitingNext) this._showBtnConfirmar();
      },
    });
  }

  _onConfirm() {
    if (!this._selectedEnv) return;

    const animal = this.ANIMAIS[this._currentIndex];
    const acertou = animal.correta === this._selectedEnv;

    this.biaV1.setVisible(false);
    this.biaV2.setVisible(true);

    if (acertou) {
      if (animal.imgKey) this.sombraSprite.setTexture(animal.imgKey);
      this.sombraSprite.setVisible(true);

      this._playAcertoFX();

      this._awaitingNext = true;
      this._showBtnProximo();
      this._hideLetreiro();
    } else {
      this._awaitingNext = false;
      this._showBtnTente();
      this._showFeedback("Quase lá! Pense bem nas pistas e tente de novo.");
      this._showLetreiroForCurrent();

      this._playErroFX();

      this._hideAcertoFX();
    }
  }

  _onTryAgain() {
    this._awaitingNext = false;

    if (this._droppedChip) this._returnHome(this._droppedChip, true);
    this._droppedChip = null;
    this._selectedEnv = null;

    this._hideLetreiro();
    const animal = this.ANIMAIS[this._currentIndex];
    this._showHint(animal.dica);

    this.biaV1.setVisible(true);
    this.biaV2.setVisible(false);

    this._hideAllButtons();
    this._hideAcertoFX();
    this._hideErroFX();
  }

  _nextAnimal() {
    this._hideAcertoFX(true);
    this._hideErroFX(true);

    this._currentIndex++;
    this._awaitingNext = false;

    if (this._currentIndex < this.ANIMAIS.length) {
      this._loadAnimal();
    } else {
      this._hideAllButtons();
      this._hideLetreiro();
      this._showCompletionModal();
    }
  }

  _showHint(texto) {
    if (this.dicaTitle) this.dicaTitle.setVisible(true);
    this.dicaText.setText(texto || "");
  }

  _showFeedback(texto) {
    if (this.dicaTitle) this.dicaTitle.setVisible(false);
    this.dicaText.setText(texto || "");
  }

  _resolveLetreiroPos(animalId) {
    const cfg = this.LAYOUT_PARAMS.letreiro || {};
    const defPos = cfg.default || { x: 360, y: 290 };
    const per = cfg.perAnimal || {};
    return per[animalId] ? per[animalId] : defPos;
  }

  _showLetreiroForCurrent() {
    const animal = this.ANIMAIS[this._currentIndex];
    if (!animal || !animal.letreiroKey || !this.letreiroSprite) return;

    const pos = this._resolveLetreiroPos(animal.id);
    this.letreiroSprite.setTexture(animal.letreiroKey);
    this.letreiroSprite.setPosition(pos.x, pos.y);
    this.letreiroSprite.setVisible(true);
    this.children.bringToTop(this.letreiroSprite);
  }

  _hideLetreiro() {
    if (this.letreiroSprite) this.letreiroSprite.setVisible(false);
  }

  _buildCompletionModal(colors) {
    const w = this.scale ? this.scale.width : 1920;
    const h = this.scale ? this.scale.height : 1080;
    const { overlayAlpha, modalPos, modalScale } = this.LAYOUT_PARAMS.modal;
    const { inicio } = this.LAYOUT_PARAMS.buttons;

    this.modalOverlay = this.add
      .rectangle(0, 0, w, h, 0x000000, overlayAlpha)
      .setOrigin(0, 0)
      .setVisible(false)
      .setInteractive()
      .setDepth(this.DEPTH.MODAL_OVERLAY);

    this.modalSprite = this.add
      .image(modalPos.x, modalPos.y, "modal_feedback_concluido")
      .setOrigin(0.5)
      .setScale(modalScale || 1)
      .setVisible(false)
      .setDepth(this.DEPTH.MODAL);

    this.btInicio = new Button(this, {
      text: "INICIO",
      showIcon: false,
      colors,
    });
    this.add.existing(this.btInicio);
    this.btInicio.setPosition(inicio.x, inicio.y);
    this.btInicio.setVisible(false);
    this.btInicio.setDepth(this.DEPTH.MODAL);
    this.btInicio.on("buttonClick", () => {
      this.scene.start("Capa");
    });
  }

  _showCompletionModal() {
    if (!this.modalOverlay || !this.modalSprite || !this.btInicio) return;

    this.modalOverlay.setVisible(true);
    this.modalSprite.setVisible(true);
    this.btInicio.setVisible(true);

    this.children.bringToTop(this.modalOverlay);
    this.children.bringToTop(this.modalSprite);
    this.children.bringToTop(this.btInicio);

    this.modalOverlay.alpha = 0;
    this.tweens.add({
      targets: this.modalOverlay,
      alpha: this.LAYOUT_PARAMS.modal.overlayAlpha,
      duration: 180,
      ease: "Sine.easeOut",
    });

    this.modalSprite.alpha = 0;
    this.tweens.add({
      targets: this.modalSprite,
      alpha: 1,
      duration: 220,
      ease: "Sine.easeOut",
    });

    this.btInicio.alpha = 0;
    this.tweens.add({
      targets: this.btInicio,
      alpha: 1,
      duration: 220,
      ease: "Sine.easeOut",
    });
  }

  _hideCompletionModal() {
    if (!this.modalOverlay || !this.modalSprite || !this.btInicio) return;
    this.modalOverlay.setVisible(false);
    this.modalSprite.setVisible(false);
    this.btInicio.setVisible(false);
  }

  _loadAnimal() {
    this._selectedEnv = null;
    if (this._droppedChip) this._returnHome(this._droppedChip, true);
    this._droppedChip = null;

    this._awaitingNext = false;
    this._hideAllButtons();
    this._hideLetreiro();
    this._hideCompletionModal();

    this._hideAcertoFX(true);
    this._hideErroFX(true);

    this.biaV1.setVisible(true);
    this.biaV2.setVisible(false);

    const animal = this.ANIMAIS[this._currentIndex];
    this.sombraSprite
      .setTexture(animal.sombraKey)
      .setVisible(true)
      .setAlpha(1)
      .setDepth(this.DEPTH.SLOT);

    const scaleRef = this.sombraSprite.scaleX || 1;
    this.feedbackSprite
      .setPosition(this.sombraSprite.x, this.sombraSprite.y)
      .setScale(scaleRef);
    this.feedbackErroSprite
      .setPosition(this.sombraSprite.x, this.sombraSprite.y)
      .setScale(scaleRef);

    this._showHint(animal.dica);
  }

  _rememberHome(spr) {
    if (!this._dragCtx.has(spr)) {
      const h = spr.getData("home") || { x: spr.x, y: spr.y };
      this._dragCtx.set(spr, { x: h.x, y: h.y });
    }
  }

  _returnHome(spr, hideConfirm = true) {
    const home = this._dragCtx.get(spr) ||
      spr.getData("home") || { x: spr.x, y: spr.y };
    this.tweens.add({
      targets: spr,
      x: home.x,
      y: home.y,
      duration: 160,
      ease: "Sine.easeOut",
      onComplete: () => {
        spr.setDepth(this.DEPTH.CHIPS);
        spr.setData("inSlot", false);
        if (hideConfirm) this._hideAllButtons();
      },
    });
  }

  _playAcertoFX() {
    this.feedbackSprite.setPosition(this.sombraSprite.x, this.sombraSprite.y);
    this.feedbackSprite.setScale(this.sombraSprite.scaleX || 1);

    this._killAcertoTweens();
    this.feedbackSprite.setAlpha(0).setVisible(true);
    this.children.bringToTop(this.feedbackSprite);

    if (this.sfxAcerto) {
      this.sfxAcerto.stop();
      this.sfxAcerto.play();
    }

    this._fxTweenIn = this.tweens.add({
      targets: this.feedbackSprite,
      alpha: 1,
      duration: 220,
      ease: "Sine.easeOut",
      onComplete: () => {
        this._fxTweenOut = this.tweens.add({
          targets: this.feedbackSprite,
          alpha: 0,
          duration: 260,
          delay: 260,
          ease: "Sine.easeIn",
          onComplete: () => this.feedbackSprite.setVisible(false),
        });
      },
    });
  }

  _hideAcertoFX(stopSound = false) {
    this._killAcertoTweens();
    if (this.feedbackSprite) {
      this.feedbackSprite.setAlpha(0).setVisible(false);
    }
    if (stopSound && this.sfxAcerto && this.sfxAcerto.isPlaying) {
      this.sfxAcerto.stop();
    }
  }

  _killAcertoTweens() {
    if (this._fxTweenIn) {
      this._fxTweenIn.stop();
      this._fxTweenIn = null;
    }
    if (this._fxTweenOut) {
      this._fxTweenOut.stop();
      this._fxTweenOut = null;
    }
  }

  _playErroFX() {
    this.feedbackErroSprite.setPosition(
      this.sombraSprite.x,
      this.sombraSprite.y
    );
    this.feedbackErroSprite.setScale(this.sombraSprite.scaleX || 1);

    this._killErroTweens();
    this.feedbackErroSprite.setAlpha(0).setVisible(true);
    this.children.bringToTop(this.feedbackErroSprite);

    if (this.sfxErro) {
      this.sfxErro.stop();
      this.sfxErro.play();
    }

    this._fxErrIn = this.tweens.add({
      targets: this.feedbackErroSprite,
      alpha: 1,
      duration: 220,
      ease: "Sine.easeOut",
      onComplete: () => {
        this._fxErrOut = this.tweens.add({
          targets: this.feedbackErroSprite,
          alpha: 0,
          duration: 260,
          delay: 260,
          ease: "Sine.easeIn",
          onComplete: () => this.feedbackErroSprite.setVisible(false),
        });
      },
    });
  }

  _hideErroFX(stopSound = false) {
    this._killErroTweens();
    if (this.feedbackErroSprite) {
      this.feedbackErroSprite.setAlpha(0).setVisible(false);
    }
    if (stopSound && this.sfxErro && this.sfxErro.isPlaying) {
      this.sfxErro.stop();
    }
  }

  _killErroTweens() {
    if (this._fxErrIn) {
      this._fxErrIn.stop();
      this._fxErrIn = null;
    }
    if (this._fxErrOut) {
      this._fxErrOut.stop();
      this._fxErrOut = null;
    }
  }
}

export default Game3;
