import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";

export class Game2 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game2");
    this.controladorDeCenas = controladorDeCenas;

    this.CENTER_SCALE = 1.0;
    this.ZONE_SCALE = 0.47;
    this.SNAP_TWEEN = 160;

    this.TOTAL_ITEMS = 5;

    this.UI_DEPTH = 500;

    this.MODAL_CFG = {
      overlayAlpha: 0.78,
      depthBase: 100000,
      positivoBtn: { relX: 0.0, relY: 0.34, offsetX: -175, offsetY: -175 },
      negativoBtn: { relX: 0.0, relY: 0.34, offsetX: -135, offsetY: -175 },
    };
  }

  init() {
    this.loaded = false;

    /** @type {{ key:string, sprite:Phaser.GameObjects.Image, state:'center'|'entrada'|'saida', slotIndex?:number, prevState?:string }[]} */
    this.items = [];
    /** @type {string[]} */
    this.queue = [];
    /** @type {{ key:string, sprite:Phaser.GameObjects.Image } | null} */
    this.current = null;

    this.leftZone = null;
    this.rightZone = null;
    this.leftInner = null;
    this.rightInner = null;
    /** @type {{x:number,y:number,taken:boolean,occupant?:any}[]} */
    this.leftSlots = [];
    /** @type {{x:number,y:number,taken:boolean,occupant?:any}[]} */
    this.rightSlots = [];

    /** @type {Button | null} */
    this.btVerificar = null;
    this.bgRef = null;

    /** @type {Phaser.GameObjects.Rectangle | null} */
    this.modalOverlay = null;
    /** @type {Phaser.GameObjects.Container | null} */
    this.modalPositivo = null;
    /** @type {Phaser.GameObjects.Container | null} */
    this.modalNegativo = null;

    this.TOTAL_ITEMS = 5;
  }

  create() {
    const bg = this.add.image(0, 0, "background_atv1").setOrigin(0, 0);
    this.bgRef = bg;

    const TOP_Y = bg.y + bg.displayHeight * 0.35;
    const ZONE_H = bg.displayHeight * 0.6;
    const ZONE_W = bg.displayWidth * 0.3;
    const LEFT_X = bg.x + bg.displayWidth * 0.00001;
    const RIGHT_X = bg.x + bg.displayWidth - ZONE_W - bg.displayWidth * 0.00001;

    this.leftZone = new Phaser.Geom.Rectangle(LEFT_X, TOP_Y, ZONE_W, ZONE_H);
    this.rightZone = new Phaser.Geom.Rectangle(RIGHT_X, TOP_Y, ZONE_W, ZONE_H);

    const measure = this.add
      .image(-9999, -9999, "comprovante_pagamento")
      .setOrigin(0.5)
      .setScale(this.ZONE_SCALE);
    const cardW = measure.displayWidth;
    const cardH = measure.displayHeight;
    measure.destroy();

    const LEFT_INSETS = { top: 15, right: 45, bottom: 5, left: 15 };
    const RIGHT_INSETS = { top: 15, right: 30, bottom: 5, left: 45 };

    const shrinkRect = (r, ins) =>
      new Phaser.Geom.Rectangle(
        r.x + ins.left,
        r.y + ins.top,
        r.width - (ins.left + ins.right),
        r.height - (ins.top + ins.bottom)
      );

    this.leftInner = shrinkRect(this.leftZone, LEFT_INSETS);
    this.rightInner = shrinkRect(this.rightZone, RIGHT_INSETS);

    const horizPad = Math.max(0, cardW * 0);
    const bottomOffset = 50;

    const leftTopY = this.leftInner.y + cardH / 2;
    const leftBotY = this.leftInner.bottom - cardH / 2 - bottomOffset;
    const leftX1 = this.leftInner.x + cardW / 2 + horizPad;
    const leftX2 = this.leftInner.right - cardW / 2 - horizPad;

    this.leftSlots = [
      { x: leftX1, y: leftTopY, taken: false },
      { x: leftX2, y: leftTopY, taken: false },
      { x: leftX1, y: leftBotY, taken: false },
      { x: leftX2, y: leftBotY, taken: false },
    ];

    const rightTopY = this.rightInner.y + cardH / 2;
    const rightBotY = this.rightInner.bottom - cardH / 2 - bottomOffset;
    const rightX1 = this.rightInner.x + cardW / 2 + horizPad;
    const rightX2 = this.rightInner.right - cardW / 2 - horizPad;

    this.rightSlots = [
      { x: rightX1, y: rightTopY, taken: false },
      { x: rightX2, y: rightTopY, taken: false },
      { x: rightX1, y: rightBotY, taken: false },
      { x: rightX2, y: rightBotY, taken: false },
    ];

    this.queue = [
      "comprovante_pagamento",
      "comprovante_pix_enviado",
      "comprovante_pix_recebido",
      "comprovante_salario",
      "comprovante_transporte",
    ];
    this.TOTAL_ITEMS = this.queue.length;

    this.input.on("dragstart", (_p, go) => {
      const item = this.items.find((i) => i.sprite === go);
      if (!item) return;
      item.prevState = item.state;
      this.freePreviousSlot(item);
      go.setScale(this.CENTER_SCALE);
      go.setDepth(5);
      this.children.bringToTop(go);
    });

    this.input.on("drag", (_p, go, x, y) => {
      go.x = x;
      go.y = y;
    });

    this.input.on("dragend", (_p, go) => {
      const item = this.items.find((i) => i.sprite === go);
      if (!item) return;

      const insideRight = Phaser.Geom.Rectangle.Contains(
        this.rightZone,
        go.x,
        go.y
      );
      const insideLeft = Phaser.Geom.Rectangle.Contains(
        this.leftZone,
        go.x,
        go.y
      );

      const primary = insideRight
        ? { name: "entrada", zone: this.rightZone, slots: this.rightSlots }
        : insideLeft
        ? { name: "saida", zone: this.leftZone, slots: this.leftSlots }
        : null;

      const secondary =
        primary && primary.name === "entrada"
          ? { name: "saida", zone: this.leftZone, slots: this.leftSlots }
          : { name: "entrada", zone: this.rightZone, slots: this.rightSlots };

      let snapped = false;

      if (primary) {
        const r1 = this.trySnapToZone(
          item,
          primary.name,
          primary.zone,
          primary.slots,
          { allowDisplaceWhenFull: false }
        );
        if (r1.snapped) snapped = true;
        else if (r1.full) {
          const r2 = this.trySnapToZone(
            item,
            secondary.name,
            secondary.zone,
            secondary.slots,
            { allowDisplaceWhenFull: false }
          );
          if (r2.snapped) snapped = true;
          else this.returnToCenter(item);
        } else if (!r1.inside) {
          const r3 = this.trySnapToZone(
            item,
            "entrada",
            this.rightZone,
            this.rightSlots,
            { allowDisplaceWhenFull: false }
          );
          if (!(snapped = r3.snapped)) {
            const r4 = this.trySnapToZone(
              item,
              "saida",
              this.leftZone,
              this.leftSlots,
              { allowDisplaceWhenFull: false }
            );
            if (!(snapped = r4.snapped)) this.returnToCenter(item);
          }
        } else {
          this.returnToCenter(item);
        }
      } else {
        const rA = this.trySnapToZone(
          item,
          "entrada",
          this.rightZone,
          this.rightSlots,
          { allowDisplaceWhenFull: false }
        );
        if (!(snapped = rA.snapped)) {
          const rB = this.trySnapToZone(
            item,
            "saida",
            this.leftZone,
            this.leftSlots,
            { allowDisplaceWhenFull: false }
          );
          if (!(snapped = rB.snapped)) this.returnToCenter(item);
        }
      }

      const movedFromCenterToZone =
        item.prevState === "center" &&
        (item.state === "entrada" || item.state === "saida");
      if (
        movedFromCenterToZone &&
        this.current &&
        this.current.sprite === item.sprite
      ) {
        this.current = null;
        this.spawnNextIfNeeded();
      }

      this.updateVerifyVisibility();
    });

    const baseConfig = { text: "VERIFICAR", showIcon: false };
    const possibleColors = this.uiColors?.button || this.colors?.button;
    const btnConfig = possibleColors
      ? { ...baseConfig, colors: possibleColors }
      : baseConfig;

    this.btVerificar = new Button(this, btnConfig);
    this.add.existing(this.btVerificar);
    this.btVerificar.x = bg.x + (bg.displayWidth - this.btVerificar.width) / 2;
    this.btVerificar.y = bg.y + bg.displayHeight * 0.84;
    this.btVerificar.setVisible(false);
    this.btVerificar.setDepth(this.UI_DEPTH);
    this.btVerificar.setScrollFactor(0);
    this.btVerificar.on("buttonClick", () => this.onVerify());

    this.createOverlay(bg);
    this.createFeedbackModals(bg);
    this.raiseModals();

    this.spawnNextIfNeeded();

    super.create();
  }

  createOverlay(bg) {
    const cam = this.cameras.main;
    const w = Math.max(bg.displayWidth, cam.width);
    const h = Math.max(bg.displayHeight, cam.height);

    this.modalOverlay = this.add
      .rectangle(0, 0, w, h, 0x000000, this.MODAL_CFG.overlayAlpha)
      .setOrigin(0, 0)
      .setVisible(false)
      .setScrollFactor(0)
      .setDepth(this.MODAL_CFG.depthBase)
      .setInteractive();
  }

  raiseModals() {
    const base = this.MODAL_CFG.depthBase;
    this.modalOverlay?.setDepth(base);
    this.modalPositivo?.setDepth(base + 1);
    this.modalNegativo?.setDepth(base + 1);
    if (this.modalOverlay) this.children.bringToTop(this.modalOverlay);
    if (this.modalPositivo) this.children.bringToTop(this.modalPositivo);
    if (this.modalNegativo) this.children.bringToTop(this.modalNegativo);
  }

  createFeedbackModals(bg) {
    const centerX = bg.x + bg.displayWidth / 2;
    const centerY = bg.y + bg.displayHeight / 2;
    const palette = this.uiColors?.button || this.colors?.button;

    this.modalPositivo = this.add
      .container(0, 0)
      .setVisible(false)
      .setScrollFactor(0)
      .setDepth(this.MODAL_CFG.depthBase + 1);
    const okImg = this.add
      .image(centerX, centerY, "Modal_FeedbackPositivo_Atv1")
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.modalPositivo.add(okImg);

    const btContinuarCfg = palette
      ? { text: "CONTINUAR", showIcon: false, colors: palette }
      : { text: "CONTINUAR", showIcon: false };
    const btContinuar = new Button(this, btContinuarCfg);
    this.add.existing(btContinuar);
    btContinuar.setScrollFactor(0);
    this.modalPositivo.add(btContinuar);

    btContinuar.x =
      okImg.x +
      okImg.displayWidth * this.MODAL_CFG.positivoBtn.relX +
      this.MODAL_CFG.positivoBtn.offsetX;
    btContinuar.y =
      okImg.y +
      okImg.displayHeight * this.MODAL_CFG.positivoBtn.relY +
      this.MODAL_CFG.positivoBtn.offsetY;

    btContinuar.on("buttonClick", () => {
      this.scene.start("Game3");
    });

    this.modalNegativo = this.add
      .container(0, 0)
      .setVisible(false)
      .setScrollFactor(0)
      .setDepth(this.MODAL_CFG.depthBase + 1);
    const badImg = this.add
      .image(centerX, centerY, "Modal_FeedbackNegativo_Atv1")
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.modalNegativo.add(badImg);

    const btVoltarCfg = palette
      ? { text: "VOLTAR", showIcon: false, colors: palette }
      : { text: "VOLTAR", showIcon: false };
    const btVoltar = new Button(this, btVoltarCfg);
    this.add.existing(btVoltar);
    btVoltar.setScrollFactor(0);
    this.modalNegativo.add(btVoltar);

    btVoltar.x =
      badImg.x +
      badImg.displayWidth * this.MODAL_CFG.negativoBtn.relX +
      this.MODAL_CFG.negativoBtn.offsetX;
    btVoltar.y =
      badImg.y +
      badImg.displayHeight * this.MODAL_CFG.negativoBtn.relY +
      this.MODAL_CFG.negativoBtn.offsetY;

    btVoltar.on("buttonClick", () => {
      this.scene.restart();
    });
  }

  showPositiveModal() {
    this.btVerificar.setVisible(false);
    this.modalOverlay?.setVisible(true);
    this.modalPositivo?.setVisible(true);
    this.raiseModals();
    this.items.forEach((i) => i.sprite.disableInteractive());
  }

  showNegativeModal() {
    this.btVerificar.setVisible(false);
    this.modalOverlay?.setVisible(true);
    this.modalNegativo?.setVisible(true);
    this.raiseModals();
    this.items.forEach((i) => i.sprite.disableInteractive());
  }

  getCenterPos() {
    return {
      x: this.bgRef.x + this.bgRef.displayWidth / 2,
      y: this.bgRef.y + this.bgRef.displayHeight * 0.55,
    };
  }

  spawnNextIfNeeded() {
    if (this.current || this.queue.length === 0) return;
    const key = this.queue.shift();
    const { x, y } = this.getCenterPos();

    const sprite = this.add
      .image(x, y, key)
      .setOrigin(0.5)
      .setScale(this.CENTER_SCALE);
    sprite.setInteractive({ draggable: true, useHandCursor: true });
    sprite.setDepth(5);

    const item = { key, sprite, state: "center" };
    this.items.push(item);
    this.current = { key, sprite };
  }

  freePreviousSlot(item) {
    if (item.state === "entrada" && typeof item.slotIndex === "number") {
      const s = this.rightSlots[item.slotIndex];
      if (s) {
        s.taken = false;
        s.occupant = undefined;
      }
    }
    if (item.state === "saida" && typeof item.slotIndex === "number") {
      const s = this.leftSlots[item.slotIndex];
      if (s) {
        s.taken = false;
        s.occupant = undefined;
      }
    }
  }

  getPlacedCount() {
    return (
      this.leftSlots.filter((s) => s.taken).length +
      this.rightSlots.filter((s) => s.taken).length
    );
  }

  isArrangementCorrect() {
    const ENTRADA = new Set([
      "comprovante_salario",
      "comprovante_pix_recebido",
    ]);
    const SAIDA = new Set([
      "comprovante_pagamento",
      "comprovante_pix_enviado",
      "comprovante_transporte",
    ]);

    for (const i of this.items) {
      if (i.state === "entrada" && !ENTRADA.has(i.key)) return false;
      if (i.state === "saida" && !SAIDA.has(i.key)) return false;
      if (i.state !== "entrada" && i.state !== "saida") return false;
    }
    return true;
  }

  getNearestSlot(slots, x, y) {
    return slots
      .map((s, idx) => ({
        ...s,
        idx,
        d: Phaser.Math.Distance.Between(x, y, s.x, s.y),
      }))
      .sort((a, b) => a.d - b.d)[0];
  }

  getNearestFreeSlotIdx(slots, x, y, excludeIdx = -1) {
    let bestIdx = -1,
      bestD = Infinity;
    for (let i = 0; i < slots.length; i++) {
      if (i === excludeIdx) continue;
      const s = slots[i];
      if (s.taken) continue;
      const d = Phaser.Math.Distance.Between(x, y, s.x, s.y);
      if (d < bestD) {
        bestD = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  trySnapToZone(
    item,
    zoneName,
    geomRect,
    slots,
    opts = { allowDisplaceWhenFull: true }
  ) {
    const go = item.sprite;
    const inside = Phaser.Geom.Rectangle.Contains(geomRect, go.x, go.y);
    if (!inside) return { snapped: false, inside: false };

    const nearest = this.getNearestSlot(slots, go.x, go.y);
    if (!nearest) return { snapped: false, inside: true };

    if (!nearest.taken) {
      this.occupySlot(item, slots, nearest.idx);
      return { snapped: true, inside: true };
    }

    const otherIdx = this.getNearestFreeSlotIdx(slots, go.x, go.y, nearest.idx);
    const occupantItem = nearest.occupant;

    if (otherIdx !== -1) {
      this.occupySlot(occupantItem, slots, otherIdx, true);
      this.occupySlot(item, slots, nearest.idx);
      return { snapped: true, inside: true };
    }

    if (!opts.allowDisplaceWhenFull) {
      return { snapped: false, full: true, inside: true };
    }

    if (occupantItem) {
      const occSlot = slots[occupantItem.slotIndex];
      if (occSlot) {
        occSlot.taken = false;
        occSlot.occupant = undefined;
      }

      this.tweens.add({
        targets: occupantItem.sprite,
        x: go.x + 10,
        y: go.y + 10,
        scale: this.CENTER_SCALE,
        duration: this.SNAP_TWEEN,
        ease: "Quad.easeOut",
      });
      occupantItem.state = "center";
      delete occupantItem.slotIndex;
    }

    this.occupySlot(item, slots, nearest.idx);
    return { snapped: true, inside: true };
  }

  occupySlot(item, slots, slotIndex, instant = false) {
    const s = slots[slotIndex];
    s.taken = true;
    s.occupant = item;

    this.tweens.add({
      targets: item.sprite,
      x: s.x,
      y: s.y,
      scale: this.ZONE_SCALE,
      duration: instant ? 120 : this.SNAP_TWEEN,
      ease: "Quad.easeOut",
    });

    item.state = slots === this.rightSlots ? "entrada" : "saida";
    item.slotIndex = slotIndex;
  }

  returnToCenter(item) {
    const { x, y } = this.getCenterPos();
    this.tweens.add({
      targets: item.sprite,
      x,
      y,
      scale: this.CENTER_SCALE,
      duration: this.SNAP_TWEEN,
      ease: "Quad.easeOut",
    });
    item.state = "center";
    delete item.slotIndex;
  }

  updateVerifyVisibility() {
    this.btVerificar.setVisible(this.getPlacedCount() === this.TOTAL_ITEMS);
    this.btVerificar.setDepth(this.UI_DEPTH);
  }

  onVerify() {
    if (this.getPlacedCount() !== this.TOTAL_ITEMS) return;

    if (this.isArrangementCorrect()) {
      this.showPositiveModal();
    } else {
      const ENTRADA = new Set([
        "comprovante_salario",
        "comprovante_pix_recebido",
      ]);
      const SAIDA = new Set([
        "comprovante_pagamento",
        "comprovante_pix_enviado",
        "comprovante_transporte",
      ]);
      this.items.forEach((i) => {
        if (i.state === "entrada" && !ENTRADA.has(i.key)) this.shake(i.sprite);
        if (i.state === "saida" && !SAIDA.has(i.key)) this.shake(i.sprite);
      });
      this.showNegativeModal();
    }
  }

  shake(target) {
    this.tweens.add({
      targets: target,
      x: target.x + 6,
      duration: 60,
      yoyo: true,
      repeat: 3,
      ease: "Sine.easeInOut",
    });
  }
}

export default Game2;
