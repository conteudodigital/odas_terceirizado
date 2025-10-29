import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;

    this.MAX_PER_ZONE = 3;

    this.MODAL_POS = {
      bottomMargin: 0,
      centerXOffset: 0,
      btnOffsetX: -375,
      btnOffsetY: -200,
    };

    this.DEPTH = {
      MODAL_OVERLAY: 99998,
      MODAL: 100000,
    };

    this.dropzones = {};
    this.tokens = [];
    this._dragCtx = new Map();
    this._onGlobalDrop = null;

    this.btConfirmar = null;

    this.modalOverlay = null;
    this.modalPositivo = null;
    this.modalNegativo = null;

    this._lastAllPlaced = false;
  }

  getDropLayout() {
    return {
      ANDAR: { x: 63, y: 275, w: 550, h: 188 },
      NADAR: { x: 675, y: 275, w: 550, h: 188 },
      VOAR: { x: 1295, y: 275, w: 550, h: 188 },
      RASTEJAR: { x: 340, y: 590, w: 550, h: 188 },
      SALTAR: { x: 970, y: 590, w: 550, h: 188 },
    };
  }

  getAnimalsData() {
    return [
      { key: "sapo", label: "Sapo", category: "SALTAR" },
      { key: "passaro", label: "Pássaro", category: "VOAR" },
      { key: "golfinho", label: "Golfinho", category: "NADAR" },
      { key: "pato", label: "Pato", category: "VOAR" },
      { key: "caracol", label: "Caracol", category: "RASTEJAR" },
      { key: "cobra", label: "Cobra", category: "RASTEJAR" },
      { key: "cachorro", label: "Cachorro", category: "ANDAR" },
      { key: "lagarto", label: "Lagarto", category: "RASTEJAR" },
      { key: "peixe", label: "Peixe", category: "NADAR" },
      { key: "inseto", label: "Inseto", category: "ANDAR" },
    ];
  }

  getTokenStripLayout() {
    return { startX: 205, y: 950, step: 160 };
  }

  _resetRuntime() {
    this.dropzones = {};
    this.tokens = [];
    this._dragCtx = new Map();
    this._lastAllPlaced = false;

    if (this._onGlobalDrop) {
      this.input.off("drop", this._onGlobalDrop);
    }
    this._onGlobalDrop = (pointer, gameObject, dropZone) => {
      if (dropZone && typeof dropZone.onDrop === "function") {
        dropZone.onDrop(pointer, gameObject);
      } else {
        if (gameObject) this._returnHome(gameObject, true);
      }
    };
    this.input.on("drop", this._onGlobalDrop);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this._onGlobalDrop) this.input.off("drop", this._onGlobalDrop);
    });
  }

  create() {
    const background = this.add.image(0, 0, "gameFullBg").setOrigin(0, 0);

    this._resetRuntime();

    this._createDropZones();
    this._createAnimalTokens();

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    this.btConfirmar = new Button(this, {
      text: "CONFIRMAR",
      showIcon: false,
      colors: colors,
    });
    this.add.existing(this.btConfirmar);
    this.btConfirmar.x =
      background.x + (background.width - this.btConfirmar.width) / 2;
    this.btConfirmar.y = 875;
    this.btConfirmar.setVisible(false);
    this.btConfirmar.on("buttonClick", () => this._validarResposta());

    this._checkAllPlaced(true);

    super.create();
  }

  _createDropZones() {
    const layout = this.getDropLayout();

    Object.entries(layout).forEach(([name, rect]) => {
      const zone = this.add
        .zone(rect.x + rect.w / 2, rect.y + rect.h / 2, rect.w, rect.h)
        .setRectangleDropZone(rect.w, rect.h);
      zone.setName(name);

      this.dropzones[name] = {
        zone,
        items: [],
        rect: { ...rect },
        slots: this._buildSlots(rect, this.MAX_PER_ZONE),
      };

      zone.onDrop = (pointer, gameObject) => {
        this._handleDrop(this.dropzones[name], gameObject);
      };
    });
  }

  _buildSlots(rect, count) {
    const padding = 16;
    const usableW = rect.w - padding * 2;
    const cellW = usableW / count;
    const y = rect.y + rect.h / 2;
    const slots = [];
    for (let i = 0; i < count; i++) {
      const cx = rect.x + padding + cellW * i + cellW / 2;
      slots.push({ x: cx, y, occupant: null });
    }
    return slots;
  }

  _createAnimalTokens() {
    const data = this.getAnimalsData();
    const strip = this.getTokenStripLayout();

    data.forEach((cfg, idx) => {
      const x = strip.startX + strip.step * idx;
      const y = strip.y;

      const spr = this.add.image(x, y, cfg.key).setOrigin(0.5);
      spr.setData("key", cfg.key);
      spr.setData("category", cfg.category);
      spr.setData("home", { x, y });
      spr.setData("currentZone", null);
      spr.setInteractive({ draggable: true, useHandCursor: true });

      if (!spr.originalScale) spr.originalScale = spr.scale;
      spr.setScale(0.9 * spr.originalScale);

      this.input.setDraggable(spr);
      spr.on("dragstart", () => this._onDragStart(spr));
      spr.on("drag", (_p, dragX, dragY) => this._onDrag(spr, dragX, dragY));
      spr.on("dragend", () => this._onDragEnd(spr));

      this.tokens.push(spr);
    });
  }

  _onDragStart(spr) {
    spr.setDepth(1000);
    this._rememberHome(spr);

    const prevZoneName = spr.getData("currentZone");
    if (prevZoneName && this.dropzones[prevZoneName]) {
      const z = this.dropzones[prevZoneName];
      z.items = z.items.filter((s) => s !== spr);
      const slot = z.slots.find((s) => s.occupant === spr);
      if (slot) slot.occupant = null;
      spr.setData("currentZone", null);
    }

    this._checkAllPlaced();
  }

  _onDrag(spr, x, y) {
    spr.x = x;
    spr.y = y;
  }

  _onDragEnd(spr) {
    if (!spr.getData("currentZone")) {
      this._returnHome(spr, true);
    } else {
      this._checkAllPlaced();
    }
  }

  _handleDrop(zoneCtrl, spr) {
    if (zoneCtrl.items.length >= this.MAX_PER_ZONE) {
      this._bounce(spr);
      this._returnHome(spr, true);
      return;
    }

    const freeSlot = zoneCtrl.slots.find((s) => !s.occupant);
    if (!freeSlot) {
      this._bounce(spr);
      this._returnHome(spr, true);
      return;
    }

    freeSlot.occupant = spr;
    zoneCtrl.items.push(spr);
    spr.setData("currentZone", zoneCtrl.zone.name);

    this.tweens.add({
      targets: spr,
      x: freeSlot.x,
      y: freeSlot.y,
      duration: 180,
      ease: "Sine.easeOut",
      onComplete: () => {
        spr.setDepth(10);
        this._checkAllPlaced();
      },
    });
  }

  _checkAllPlaced(force = false) {
    const todos =
      this.tokens.length > 0 &&
      this.tokens.every((t) => t && !!t.getData("currentZone"));

    if (force || todos !== this._lastAllPlaced) {
      this._lastAllPlaced = todos;
      if (this.btConfirmar) this.btConfirmar.setVisible(todos);
    }
  }

  _validarResposta() {
    const todosPosicionados =
      this.tokens.length > 0 &&
      this.tokens.every((t) => t && !!t.getData("currentZone"));
    if (!todosPosicionados) {
      this._abrirModalNegativo();
      return;
    }

    const allowedPato = new Set(["ANDAR", "NADAR", "VOAR"]);
    const allowedLagarto = new Set(["ANDAR", "RASTEJAR"]);
    const allowedInseto = new Set(["ANDAR", "VOAR"]);

    const tudoCorreto = this.tokens.every((t) => {
      const key = t.getData("key");
      const placed = t.getData("currentZone");
      const expected = t.getData("category");

      if (key === "pato") {
        return allowedPato.has(placed);
      }
      if (key === "lagarto") {
        return allowedLagarto.has(placed);
      }
      if (key === "inseto") {
        return allowedInseto.has(placed);
      }
      return placed === expected;
    });

    if (tudoCorreto) this._abrirModalPositivo();
    else this._abrirModalNegativo();
  }

  _createOverlay(alpha) {
    if (this.modalOverlay) {
      this.modalOverlay.destroy();
      this.modalOverlay = null;
    }
    const bg = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, alpha)
      .setOrigin(0, 0)
      .setDepth(this.DEPTH.MODAL_OVERLAY)
      .setInteractive();
    this.modalOverlay = bg;

    this.scale.on("resize", ({ width, height }) => {
      if (!this.modalOverlay) return;
      this.modalOverlay.setSize(width, height);
    });
  }

  _posicionarModalAbaixo(img) {
    const cx = this.scale.width / 2 + this.MODAL_POS.centerXOffset;
    const desiredBottom = this.scale.height - this.MODAL_POS.bottomMargin;
    const half = img.displayHeight ? img.displayHeight / 2 : img.height / 2;
    const yByBottom = desiredBottom - half;
    img.setPosition(cx, yByBottom);
  }

  _abrirModalPositivo() {
    this._createOverlay(0.6);

    if (!this.modalPositivo) {
      this.modalPositivo = this.add
        .container(0, 0)
        .setDepth(this.DEPTH.MODAL)
        .setVisible(false);

      const img = this.add
        .image(0, 0, "modal_feedback_positivo_atv1")
        .setOrigin(0.5);
      this._posicionarModalAbaixo(img);
      this.modalPositivo.add(img);

      const marca = ColorManager.getCurrentMarca(this);
      const colors = ColorManager.getColors(marca, ColorManager.BLUE);

      const btContinuar = new Button(this, {
        text: "CONTINUAR",
        showIcon: false,
        colors: colors,
      });
      this.add.existing(btContinuar);
      this.modalPositivo.add(btContinuar);

      const half = img.displayHeight ? img.displayHeight / 2 : img.height / 2;
      btContinuar.x = img.x + this.MODAL_POS.btnOffsetX;
      btContinuar.y = img.y + half + this.MODAL_POS.btnOffsetY;

      btContinuar.on("buttonClick", () => {
        this.scene.start("Game2");
      });

      this.scale.on("resize", () => this._posicionarModalAbaixo(img));
    } else {
      const img = this.modalPositivo.list.find((go) => go.texture);
      if (img) this._posicionarModalAbaixo(img);
      this.modalPositivo.setDepth(this.DEPTH.MODAL);
    }

    this.modalOverlay.setVisible(true);
    this.modalPositivo.setVisible(true);
  }

  _abrirModalNegativo() {
    this._createOverlay(0.45);

    if (!this.modalNegativo) {
      this.modalNegativo = this.add
        .container(0, 0)
        .setDepth(this.DEPTH.MODAL)
        .setVisible(false);

      const img = this.add
        .image(0, 0, "modal_feedback_negativo_atv1")
        .setOrigin(0.5);
      this._posicionarModalAbaixo(img);
      this.modalNegativo.add(img);

      const marca = ColorManager.getCurrentMarca(this);
      const colors = ColorManager.getColors(marca, ColorManager.BLUE);

      const btTentar = new Button(this, {
        text: "TENTAR NOVAMENTE",
        showIcon: false,
        colors: colors,
      });
      this.add.existing(btTentar);
      this.modalNegativo.add(btTentar);

      const half = img.displayHeight ? img.displayHeight / 2 : img.height / 2;
      btTentar.x = img.x + this.MODAL_POS.btnOffsetX;
      btTentar.y = img.y + half + this.MODAL_POS.btnOffsetY;

      btTentar.on("buttonClick", () => {
        this.scene.restart();
      });

      this.scale.on("resize", () => this._posicionarModalAbaixo(img));
    } else {
      const img = this.modalNegativo.list.find((go) => go.texture);
      if (img) this._posicionarModalAbaixo(img);
      this.modalNegativo.setDepth(this.DEPTH.MODAL);
    }

    this.modalOverlay.setVisible(true);
    this.modalNegativo.setVisible(true);
  }

  _fecharTodosModais() {
    if (this.modalOverlay) this.modalOverlay.setVisible(false);
    if (this.modalPositivo) this.modalPositivo.setVisible(false);
    if (this.modalNegativo) this.modalNegativo.setVisible(false);
  }

  _rememberHome(spr) {
    if (!this._dragCtx.has(spr)) {
      this._dragCtx.set(spr, { ...spr.getData("home") });
    }
  }

  _returnHome(spr, recheck = false) {
    const home = this._dragCtx.get(spr) || spr.getData("home");
    this.tweens.add({
      targets: spr,
      x: home.x,
      y: home.y,
      duration: 180,
      ease: "Sine.easeOut",
      onComplete: () => {
        spr.setDepth(10);
        if (recheck) this._checkAllPlaced();
      },
    });
  }

  _bounce(spr) {
    this.tweens.add({
      targets: spr,
      scale: spr.scale * 1.06,
      duration: 90,
      yoyo: true,
      ease: "Quad.easeOut",
    });
  }

  _shake(spr) {
    this.tweens.add({
      targets: spr,
      x: spr.x + 10,
      duration: 40,
      yoyo: true,
      repeat: 3,
      ease: "Sine.easeInOut",
    });
  }

  update() {
    this._checkAllPlaced();
  }
}

export default Game1;
