import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.state = "menu";
    this.currentItemKey = null;

    this.ITEMS = {
      girassol: { baseKey: "girassol", correctSide: "left" },
      copo: { baseKey: "copo", correctSide: "right" },
      suco: { baseKey: "suco", correctSide: "right" },
      pato: { baseKey: "pato", correctSide: "right" },
      frutas: { baseKey: "abacaxiMelancia", correctSide: "left" },
    };

    this.completed = Object.keys(this.ITEMS).reduce((acc, k) => {
      acc[k] = false;
      return acc;
    }, {});

    this.POS = {
      girassol: { x: 220, y: 1080 },
      copo: { x: 590, y: 1080 },
      suco: { x: 960, y: 1080 },
      pato: { x: 1330, y: 1080 },
      frutas: { x: 1700, y: 1080 },
    };

    this.MODAL = {
      overlayAlpha: 0.65,
      content: { x: 960, y: 540 },
      closeBtn: { x: 1316, y: 362 },
      negativeBtn: { x: 825, y: 750 },
    };

    this.CONCLUSAO = {
      overlayAlpha: 0.75,
      modalTex: "modal-conclusao",
      content: { x: 960, y: 540 },
      btnInicio: {
        x: 840,
        y: 745,
        text: "INÍCIO",
        scheme: ColorManager.BLUE,
      },
    };

    this.DROP = {
      left: { x: 315, y: 835, w: 550, h: 1300 },
      right: { x: 1605, y: 835, w: 550, h: 1300 },
    };

    this.DROP_SPRITE_OFFSET_Y = { left: -57, right: -57 };

    this.PER_ITEM_APPLY_OFFSET = {
      _default: { left: 0, right: 0 },
      girassol: { left: 0, right: 0 },
      copo: { left: 57, right: 57 },
      suco: { left: 28, right: 28 },
      pato: { left: 57, right: 57 },
      frutas: { left: 32, right: 32 },
    };

    this.DEPTH = { BG: 0, UI: 10, OVERLAY: 998, MODAL: 1000 };

    this.items = {};
    this.feedbacks = {};
    this.menuBackground = null;

    this.gameBackground = null;
    this.modalOverlay = null;
    this.modalContainer = null;
    this.modalOpen = false;

    this.conclusaoOverlay = null;
    this.conclusaoContainer = null;

    this.centerGO = null;
    this.dragGhost = null;
    this.pointerMoveHandler = null;

    this.boxLeft = null;
    this.boxRight = null;
    this.appliedLeft = null;
    this.appliedRight = null;

    this.namePlate = null;

    this.selectedSide = null;

    this.btConfirmarAtivo = null;
    this.btConfirmarInativo = null;
    this.btMais = null;

    // chave para persistência no Registry do Phaser
    this.REG_KEY = "Game1:completed";
  }

  // ---------- Persistência ----------
  _loadPersistedState() {
    const saved = this.registry.get(this.REG_KEY);
    if (saved && typeof saved === "object") {
      for (const k of Object.keys(this.completed)) {
        if (Object.prototype.hasOwnProperty.call(saved, k)) {
          this.completed[k] = !!saved[k];
        }
      }
    }
  }

  _savePersistedState() {
    this.registry.set(this.REG_KEY, { ...this.completed });
  }

  _resetProgress(clearRegistry = true) {
    for (const k of Object.keys(this.completed)) this.completed[k] = false;
    if (clearRegistry) this.registry.set(this.REG_KEY, { ...this.completed });
  }
  // ----------------------------------

  create() {
    // carrega progresso salvo (se houver)
    this._loadPersistedState();

    this.menuBackground = this.add
      .image(0, 0, "bgMenu")
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.BG);

    for (const key of Object.keys(this.ITEMS)) {
      const baseKey = this.ITEMS[key].baseKey;
      const menuTex = `${baseKey}_Menu`;
      this.items[key] = this._addItem(menuTex, this.POS[key]);
      this.feedbacks[key] = this._addFeedback(this.items[key], {
        offsetY: -150,
      });
    }

    this._refreshMenuFeedbacksVisibility();
    this._wireMenuInteractions();
    this._updateMenuInteractivity();

    super.create();
  }

  _addItem(texKey, pos) {
    return this.add
      .image(pos.x, pos.y, texKey)
      .setOrigin(0.5, 1)
      .setDepth(this.DEPTH.UI);
  }

  _addFeedback(item, cfg) {
    return this.add
      .image(item.x, item.y + (cfg.offsetY ?? 0), "feedback-acerto")
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(this.DEPTH.UI + 1)
      .setVisible(true);
  }

  _refreshMenuFeedbacksVisibility() {
    for (const key in this.feedbacks) {
      const fb = this.feedbacks[key];
      if (!fb) continue;
      fb.setVisible(true);
      fb.setAlpha(this.completed[key] ? 1 : 0);
    }
  }

  _wireMenuInteractions() {
    for (const key of Object.keys(this.ITEMS)) {
      const sprite = this.items[key];
      if (!sprite || sprite.__wired) continue;
      sprite.__wired = true;
      sprite.on("pointerdown", () => this._openDragAndDrop(key));
    }
  }

  _updateMenuInteractivity() {
    for (const key in this.items) {
      const sprite = this.items[key];
      if (!sprite) continue;

      if (this.completed[key]) {
        sprite.disableInteractive();
        sprite.input && (sprite.input.cursor = "default");
      } else {
        sprite.setInteractive({ useHandCursor: true });
      }
    }
  }

  _hideMenuLayer() {
    if (this.menuBackground) this.menuBackground.setVisible(false);
    for (const key in this.items) {
      this.items[key].setVisible(false);
      if (this.feedbacks[key]) this.feedbacks[key].setVisible(false);
    }
  }

  _showMenuLayer() {
    if (this.menuBackground) this.menuBackground.setVisible(true);
    for (const key in this.items) {
      this.items[key].setVisible(true);
      if (this.feedbacks[key]) this.feedbacks[key].setVisible(true);
    }
    this._refreshMenuFeedbacksVisibility();
    this._updateMenuInteractivity();
  }

  _allCompleted() {
    return Object.values(this.completed).every(Boolean);
  }

  _showMenuAfterSuccess(itemKey) {
    this.completed[itemKey] = true;
    this._savePersistedState(); // salva progresso
    this._showMenuLayer();
    this.state = "menu";

    if (this._allCompleted()) {
      this.time.delayedCall(50, () => this._openModalConclusao());
    }
  }

  _openDragAndDrop(itemKey) {
    if (this.state === "dragAndDrop") return;
    if (!this.ITEMS[itemKey]) return;

    this.state = "dragAndDrop";
    this.currentItemKey = itemKey;

    this._hideMenuLayer();

    const { baseKey } = this.ITEMS[itemKey];

    const dragTex = `${baseKey}Drag`;
    const placaTex = `${baseKey}PlacaNome`;
    const leftTex = `${baseKey}-esquerda`;
    const rightTex = `${baseKey}-direita`;
    const infoModal = `modal-${baseKey}`;

    this.gameBackground = this.add
      .image(0, 0, "bgGameMain")
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.BG);

    this.centerGO = this.add
      .image(960, 600, dragTex)
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", (pointer) => this._startDrag(pointer));

    this.namePlate = this.add
      .image(960, 220, placaTex)
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI);

    this.boxLeft = this.add
      .image(this.DROP.left.x, this.DROP.left.y, "caixaVaziaEsquerda")
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI);

    this.boxRight = this.add
      .image(this.DROP.right.x, this.DROP.right.y, "caixaVaziaDireita")
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI);

    const perItem = this._getItemApplyOffset(itemKey);

    this.appliedLeft = this.add
      .image(
        this.boxLeft.x,
        this.boxLeft.y + this.DROP_SPRITE_OFFSET_Y.left + perItem.left,
        leftTex
      )
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(this.DEPTH.UI)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", (p) => this._startDrag(p));

    this.appliedRight = this.add
      .image(
        this.boxRight.x,
        this.boxRight.y + this.DROP_SPRITE_OFFSET_Y.right + perItem.right,
        rightTex
      )
      .setOrigin(0.5)
      .setVisible(false)
      .setDepth(this.DEPTH.UI)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", (p) => this._startDrag(p));

    this.btMais = this.add
      .image(1225, 550, "Botao-Mais")
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI - 1)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this._openModalInfo(infoModal));

    this.btConfirmarAtivo = this.add
      .image(960, 1000, "Confirmar-Laranja")
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI)
      .setVisible(false)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this._onConfirmar());

    this.btConfirmarInativo = this.add
      .image(960, 1000, "Confirmar-Cinza")
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI)
      .setVisible(true);

    this._updateConfirm(false);
    this.selectedSide = null;
  }

  _getItemApplyOffset(itemKey) {
    const custom = this.PER_ITEM_APPLY_OFFSET[itemKey];
    const def = this.PER_ITEM_APPLY_OFFSET._default || { left: 0, right: 0 };
    return {
      left: custom?.left ?? def.left,
      right: custom?.right ?? def.right,
    };
  }

  _onConfirmar() {
    if (!this.selectedSide) return;

    const itemKey = this.currentItemKey;
    const cfg = this.ITEMS[itemKey];
    if (!cfg) return;

    const acertou = this.selectedSide === cfg.correctSide;

    if (!acertou) {
      this._openModalErro();
    } else {
      if (this.sound) this.sound.play("acerto");
      this._cleanupDragAndDrop();
      this._showMenuAfterSuccess(itemKey);
    }
  }

  _openModalConclusao() {
    if (this.conclusaoContainer) return;

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(
      marca,
      this.CONCLUSAO.btnInicio.scheme
    );

    this.conclusaoOverlay = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, this.CONCLUSAO.overlayAlpha)
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.OVERLAY);

    this.conclusaoContainer = this.add
      .container(0, 0)
      .setDepth(this.DEPTH.MODAL);

    const modal = this.add
      .image(
        this.CONCLUSAO.content.x,
        this.CONCLUSAO.content.y,
        this.CONCLUSAO.modalTex
      )
      .setOrigin(0.5)
      .setDepth(this.DEPTH.MODAL);
    this.conclusaoContainer.add(modal);

    const btInicio = new Button(this, {
      text: this.CONCLUSAO.btnInicio.text,
      showIcon: false,
      colors,
    });
    btInicio.x = this.CONCLUSAO.btnInicio.x;
    btInicio.y = this.CONCLUSAO.btnInicio.y;

    // >>> ALTERAÇÃO: Ao clicar em INÍCIO, limpamos o progresso salvo <<<
    btInicio.on("buttonClick", () => {
      // limpa lista de já respondidos/visualizados
      this._resetProgress(true);    // zera o mapa e atualiza o Registry
      this._closeModalConclusao();

      // Reinicia o fluxo indo para a Capa (ou pode reentrar no Game1, se preferir)
      this.scene.start("Capa");
    });

    this.conclusaoContainer.add(btInicio);
  }

  _closeModalConclusao() {
    if (this.conclusaoOverlay) {
      this.conclusaoOverlay.destroy();
      this.conclusaoOverlay = null;
    }
    if (this.conclusaoContainer) {
      this.conclusaoContainer.destroy(true);
      this.conclusaoContainer = null;
    }
  }

  _openModalErro() {
    if (this.modalOpen) return;
    this.modalOpen = true;

    if (this.sound) this.sound.play("erro");
    if (this.centerGO) this.centerGO.disableInteractive();

    this.modalOverlay = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, this.MODAL.overlayAlpha)
      .setOrigin(0)
      .setDepth(this.DEPTH.OVERLAY);

    this.modalContainer = this.add.container(0, 0).setDepth(this.DEPTH.MODAL);

    const modal = this.add
      .image(
        this.MODAL.content.x,
        this.MODAL.content.y,
        "modal-feedback-negativo"
      )
      .setOrigin(0.5)
      .setDepth(this.DEPTH.MODAL);
    this.modalContainer.add(modal);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const btVoltar = new Button(this, {
      text: "VOLTAR",
      showIcon: false,
      colors,
    });
    btVoltar.x = this.MODAL.negativeBtn.x;
    btVoltar.y = this.MODAL.negativeBtn.y;
    btVoltar.on("buttonClick", () => {
      this._closeModalErro();
      this._clearDrop();
    });

    this.modalContainer.add(btVoltar);
  }

  _closeModalErro() {
    if (!this.modalOpen) return;
    this.modalOpen = false;

    if (this.centerGO) this.centerGO.setInteractive({ useHandCursor: true });
    if (this.modalOverlay) this.modalOverlay.destroy();
    if (this.modalContainer) this.modalContainer.destroy(true);
  }

  _openModalInfo(texKey) {
    if (this.modalOpen) return;
    this.modalOpen = true;

    if (this.centerGO) this.centerGO.disableInteractive();

    this.modalOverlay = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, this.MODAL.overlayAlpha)
      .setOrigin(0)
      .setDepth(this.DEPTH.OVERLAY);

    this.modalContainer = this.add.container(0, 0).setDepth(this.DEPTH.MODAL);

    const modalContent = this.add
      .image(this.MODAL.content.x, this.MODAL.content.y, texKey)
      .setOrigin(0.5)
      .setDepth(this.DEPTH.MODAL);
    this.modalContainer.add(modalContent);

    const closeBtn = this.add
      .image(
        this.MODAL.closeBtn.x,
        this.MODAL.closeBtn.y,
        "button-fechar-modal"
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(this.DEPTH.MODAL + 1)
      .on("pointerdown", () => this._closeModalInfo());
    this.modalContainer.add(closeBtn);
  }

  _closeModalInfo() {
    if (!this.modalOpen) return;
    this.modalOpen = false;

    if (this.centerGO) this.centerGO.setInteractive({ useHandCursor: true });
    if (this.modalOverlay) this.modalOverlay.destroy();
    if (this.modalContainer) this.modalContainer.destroy(true);
  }

  _startDrag(pointer) {
    if (this.dragGhost) return;

    if (this.appliedLeft) this.appliedLeft.setVisible(false);
    if (this.appliedRight) this.appliedRight.setVisible(false);
    if (this.boxLeft) this.boxLeft.setVisible(true);
    if (this.boxRight) this.boxRight.setVisible(true);

    this.centerGO.setAlpha(0.35);

    this.dragGhost = this.add
      .image(pointer.x, pointer.y, this.centerGO.texture.key)
      .setOrigin(0.5)
      .setDepth(this.DEPTH.UI + 2);

    this.pointerMoveHandler = (p) => {
      if (this.dragGhost) {
        this.dragGhost.x = p.x;
        this.dragGhost.y = p.y;
      }
    };

    this.input.on("pointermove", this.pointerMoveHandler);
    this.input.once("pointerup", (p) => this._endDrag(p));
  }

  _endDrag(pointer) {
    const inLeft = this._pointInRect(pointer.x, pointer.y, this.DROP.left);
    const inRight = this._pointInRect(pointer.x, pointer.y, this.DROP.right);
    let dropped = false;

    if (inLeft) {
      this._applyDrop("left");
      dropped = true;
    } else if (inRight) {
      this._applyDrop("right");
      dropped = true;
    }

    if (this.dragGhost) {
      this.dragGhost.destroy();
      this.dragGhost = null;
    }
    if (this.pointerMoveHandler) {
      this.input.off("pointermove", this.pointerMoveHandler);
      this.pointerMoveHandler = null;
    }
    if (!dropped) this.centerGO.setAlpha(1);
  }

  _applyDrop(side) {
    this.selectedSide = side;
    this.appliedLeft.setVisible(side === "left");
    this.boxLeft.setVisible(side !== "left");
    this.appliedRight.setVisible(side === "right");
    this.boxRight.setVisible(side !== "right");
    this.centerGO.setAlpha(0.35);
    this._updateConfirm(true);
  }

  _clearDrop() {
    this.boxLeft.setVisible(true);
    this.boxRight.setVisible(true);
    this.appliedLeft.setVisible(false);
    this.appliedRight.setVisible(false);
    this.selectedSide = null;
    this._updateConfirm(false);
    this.centerGO.setAlpha(1);
  }

  _updateConfirm(enabled) {
    if (enabled) {
      this.btConfirmarAtivo.setVisible(true).setInteractive();
      this.btConfirmarInativo.setVisible(false);
    } else {
      this.btConfirmarAtivo.setVisible(false).disableInteractive();
      this.btConfirmarInativo.setVisible(true).disableInteractive();
    }
  }

  _pointInRect(px, py, rect) {
    const halfW = (rect.w ?? 0) / 2;
    const halfH = (rect.h ?? 0) / 2;
    return (
      px >= rect.x - halfW &&
      px <= rect.x + halfW &&
      py >= rect.y - halfH &&
      py <= rect.y + halfH
    );
  }

  _cleanupDragAndDrop() {
    const destroyIf = (o) => {
      if (o && o.destroy) o.destroy();
    };

    if (this.dragGhost) {
      this.dragGhost.destroy();
      this.dragGhost = null;
    }
    if (this.pointerMoveHandler) {
      this.input.off("pointermove", this.pointerMoveHandler);
      this.pointerMoveHandler = null;
    }

    if (this.centerGO) this.centerGO.clearTint && this.centerGO.clearTint();

    destroyIf(this.centerGO);
    this.centerGO = null;
    destroyIf(this.namePlate);
    this.namePlate = null;
    destroyIf(this.boxLeft);
    this.boxLeft = null;
    destroyIf(this.boxRight);
    this.boxRight = null;
    destroyIf(this.appliedLeft);
    this.appliedLeft = null;
    destroyIf(this.appliedRight);
    this.appliedRight = null;
    destroyIf(this.btMais);
    this.btMais = null;
    destroyIf(this.btConfirmarAtivo);
    this.btConfirmarAtivo = null;
    destroyIf(this.btConfirmarInativo);
    this.btConfirmarInativo = null;
    destroyIf(this.gameBackground);
    this.gameBackground = null;

    this.selectedSide = null;
    this.currentItemKey = null;
  }
}

export default Game1;
