import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game2 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game2");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;
  }

  create() {
    const MARGEM_MODAL_ESQUERDA = 40;
    const OFFSET_MODAL_Y = 60;

    const POPUP_KEYS = ["pop_up_branco1", "pop_up_branco2", "pop_up_branco3"];
    const ESPACAMENTO = 40;
    const GRUPO_OFFSET_X = 200;
    const GRUPO_OFFSET_Y = 0;

    const MARGEM_DIREITA_BTN = 50;
    const MARGEM_INFERIOR_BTN = 75;

    const COL_OFFSET_X = 177;
    const ESPACAMENTO_V = 10;
    const OFFSET_QUADROS_Y = 0;

    const POPUP_YELLOW_KEYS = [
      "pop_up_amarelo1",
      "pop_up_amarelo2",
      "pop_up_amarelo3",
    ];

    const POPUP_CONTENT_W_RATIO = 0.82;
    const POPUP_CONTENT_H_RATIO = 8;
    const POPUP_CONTENT_OFFSET_Y = -98;
    const POPUP_CONTENT_RADIUS = 25;

    const POPUP_CONTENT_SCALE_BOOST = 1;

    const POPUP_HOVER_TINT = 0xffffaa;
    const POPUP_RESTORE_TINT = 0xffffff;

    const SRC_TO_OVERLAY = {
      quadro_img_1: "amarelo_mictorio",
      quadro_img_2: "amarelo_doge",
      quadro_img_3: "amarelo_bansky",
    };

    const DRAG_DEPTH = 10000;

    const COPYRIGHT_BTN_KEY = "Button-Copyright";
    const COPYRIGHT_BTN_DX = -125;
    const COPYRIGHT_BTN_DY = -100;
    const COPYRIGHT_DISABLED_ALPHA = 0;

    const MODAL_DEPTH = 20000;
    const COPYRIGHT_BTN_DEPTH = MODAL_DEPTH - 1;

    const CREDIT_KEYS_BY_INDEX = [
      "credits_mictorio",
      "credits_doge",
      "credits_bansky",
    ];
    const CREDIT_MAX_W_RATIO = 0.85;
    const CREDIT_MAX_H_RATIO = 0.65;

    const CLOSE_BTN_KEY = "closeCreditsModal";
    const CLOSE_BTN_OFFSET_X = 75;
    const CLOSE_BTN_OFFSET_Y = 75;
    const CLOSE_BTN_DEPTH = MODAL_DEPTH + 2;

    const background = this.add.image(0, 0, "backgroundBlur").setOrigin(0, 0);

    const atv1text = this.add.image(0, 0, "atv1text").setOrigin(0, 1);
    atv1text.x = (this.scale.width - atv1text.width) / 2 + 10;
    atv1text.y = (this.scale.height - atv1text.height) / 2 - 325;

    const modal_atv1 = this.add.image(0, 0, "modal_atv1").setOrigin(0, 0);
    modal_atv1.x = background.x + MARGEM_MODAL_ESQUERDA;
    modal_atv1.y =
      background.y +
      (background.height - modal_atv1.height) / 2 +
      OFFSET_MODAL_Y;

    const centerY = background.y + background.height / 2 + GRUPO_OFFSET_Y;

    const popups = POPUP_KEYS.map((key) =>
      this.add.image(0, 0, key).setOrigin(0.5, 0.5)
    );

    const totalWidth =
      popups.reduce((acc, p) => acc + p.width, 0) +
      ESPACAMENTO * Math.max(popups.length - 1, 0);

    const startX =
      background.x + background.width / 2 - totalWidth / 2 + GRUPO_OFFSET_X;

    let cursorX = startX;
    popups.forEach((p) => {
      p.x = cursorX + p.width / 2;
      p.y = centerY;
      cursorX += p.width + ESPACAMENTO;
    });

    this.popups = popups;

    const medidaQuadro = this.add.image(0, 0, "quadro_vazio").setOrigin(0.5);
    const quadroW = medidaQuadro.width;
    const quadroH = medidaQuadro.height;
    medidaQuadro.destroy();

    const COL_X = modal_atv1.x + COL_OFFSET_X;
    const totalH = quadroH * 3 + ESPACAMENTO_V * 2;
    const centerYQuadros = modal_atv1.y + modal_atv1.height / 2;

    const firstY = centerYQuadros - totalH / 2 + quadroH / 2 + OFFSET_QUADROS_Y;

    const quadrosY = [
      firstY,
      firstY + (quadroH + ESPACAMENTO_V),
      firstY + 2 * (quadroH + ESPACAMENTO_V),
    ];

    this.quadros = quadrosY.map((y) => {
      return this.add.image(COL_X, y, "quadro_vazio").setOrigin(0.5);
    });

    const QUADRO_PADDING = 22;

    const QUADRO_IMAGES = [
      { key: "quadro_img_1", dx: 0, dy: 0, scale: 1.0 },
      { key: "quadro_img_2", dx: 0, dy: 4, scale: 1.0 },
      { key: "quadro_img_3", dx: 0, dy: 4, scale: 1.0 },
    ];

    const QUADRO_CFG_BY_KEY = QUADRO_IMAGES.reduce((acc, cfg) => {
      acc[cfg.key] = { dx: cfg.dx, dy: cfg.dy, scale: cfg.scale };
      return acc;
    }, {});

    const placeImageInQuadro = (quadro, cfg, index) => {
      if (!cfg || !cfg.key) return null;

      const innerW = quadro.width - QUADRO_PADDING * 2;
      const innerH = quadro.height - QUADRO_PADDING * 2 - 5;

      const img = this.add.image(0, 0, cfg.key).setOrigin(0.5);
      const baseScale = Math.min(innerW / img.width, innerH / img.height);
      img.setScale(baseScale * (cfg.scale ?? 1));

      img.x = quadro.x + (cfg.dx ?? 0);
      img.y = quadro.y + (cfg.dy ?? 0) - 5;

      img.setInteractive({ useHandCursor: true, draggable: true });
      img.setData("srcKey", cfg.key);
      img.setData("itemIndex", index);
      img.setData("startX", img.x);
      img.setData("startY", img.y);

      const gx = this.make.graphics({ x: 0, y: 0, add: false });
      gx.fillStyle(0xffffff, 1);
      gx.fillRect(quadro.x - innerW / 2, quadro.y - innerH / 2, innerW, innerH);
      const mask = gx.createGeometryMask();
      img.setMask(mask);

      return { sprite: img, mask, maskGfx: gx };
    };

    this.quadroConteudos = [];
    this.quadros.forEach((quadro, i) => {
      const handle = placeImageInQuadro(quadro, QUADRO_IMAGES[i], i);
      this.quadroConteudos.push({
        quadro,
        ...QUADRO_IMAGES[i],
        ...handle,
        cleared: false,
      });
    });

    this.updateQuadroImg = (index, newCfg = {}) => {
      const item = this.quadroConteudos[index];
      if (!item) return;

      if (item.sprite) item.sprite.destroy();
      if (item.mask) item.mask.destroy();
      if (item.maskGfx) item.maskGfx.destroy();

      const cfg = {
        key: newCfg.key ?? item.key,
        dx: newCfg.dx ?? item.dx,
        dy: newCfg.dy ?? item.dy,
        scale: newCfg.scale ?? item.scale,
      };
      const handle = placeImageInQuadro(item.quadro, cfg, index);

      Object.assign(item, cfg, handle, { cleared: false });
    };

    const setCopyrightBtnEnabled = (slotIndex, enabled) => {
      const btn = this.copyrightButtons?.[slotIndex];
      if (!btn) return;
      if (enabled) {
        btn.setAlpha(1);
        btn.setInteractive({ useHandCursor: true });
      } else {
        btn.setAlpha(COPYRIGHT_DISABLED_ALPHA);
        btn.disableInteractive();
      }
    };

    const clearQuadroSlot = (index) => {
      const item = this.quadroConteudos[index];
      if (!item) return;
      if (item.sprite) {
        item.sprite.destroy();
        item.sprite = null;
      }
      if (item.mask) {
        item.mask.destroy();
        item.mask = null;
      }
      if (item.maskGfx) {
        item.maskGfx.destroy();
        item.maskGfx = null;
      }
      item.cleared = true;

      copyrightButtonsReady && copyrightButtonsReady();
      setCopyrightBtnEnabled(index, false);
    };

    const findEmptySlotIndex = () =>
      this.quadroConteudos.findIndex(
        (q) => q.cleared || (!q.sprite && !q.mask)
      );

    this.popupStates = this.popups.map((p, idx) => {
      p.setInteractive();
      p.input.dropZone = true;
      p.setData("popupIndex", idx);
      return {
        base: p,
        contentSprite: null,
        contentMask: null,
        contentMaskGfx: null,
        isYellow: false,
        sourceKey: null,
      };
    });

    this.usedSourceKeys = new Set();

    const placeInPopup = (popupIndex, sourceKey) => {
      const state = this.popupStates[popupIndex];
      if (!state) return;

      if (!state.isYellow) {
        state.base.setTexture(POPUP_YELLOW_KEYS[popupIndex]);
        state.isYellow = true;
      }

      const overlayKey = SRC_TO_OVERLAY[sourceKey];
      if (!overlayKey) return;

      if (state.contentSprite) state.contentSprite.destroy();
      if (state.contentMask) state.contentMask.destroy();
      if (state.contentMaskGfx) state.contentMaskGfx.destroy();

      const spr = this.add
        .image(state.base.x, state.base.y + POPUP_CONTENT_OFFSET_Y, overlayKey)
        .setOrigin(0.5);

      const maxW = state.base.width * POPUP_CONTENT_W_RATIO;
      const maxH = state.base.height * POPUP_CONTENT_H_RATIO;

      const fitScale = Math.min(maxW / spr.width, maxH / spr.height);
      spr.setScale(fitScale * POPUP_CONTENT_SCALE_BOOST);

      const gx = this.make.graphics({ x: 0, y: 0, add: false });
      gx.fillStyle(0xffffff, 1);
      gx.fillRoundedRect(
        state.base.x - maxW / 2,
        state.base.y + POPUP_CONTENT_OFFSET_Y - maxH / 2,
        maxW,
        maxH,
        POPUP_CONTENT_RADIUS
      );
      const mask = gx.createGeometryMask();
      spr.setMask(mask);

      this.children.bringToTop(spr);

      state.contentSprite = spr;
      state.contentMask = mask;
      state.contentMaskGfx = gx;
      state.sourceKey = sourceKey;
    };

    this.input.on("dragstart", (_p, gameObject) => {
      if (!gameObject.getData("srcKey")) return;

      gameObject.setData("origDepth", gameObject.depth || 0);
      gameObject.clearMask();
      gameObject.setDepth(DRAG_DEPTH);
      this.children.bringToTop(gameObject);
      gameObject.setData("droppedAccepted", false);
    });

    this.input.on("drag", (_p, gameObject, dragX, dragY) => {
      if (!gameObject.getData("srcKey")) return;
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("dragenter", (_p, _go, dropZone) => {
      const idx = dropZone.getData && dropZone.getData("popupIndex");
      if (idx === 0 || idx === 1 || idx === 2) {
        dropZone.setTint(POPUP_HOVER_TINT);
        dropZone.setScale(1.02);
      }
    });

    this.input.on("dragleave", (_p, _go, dropZone) => {
      const idx = dropZone.getData && dropZone.getData("popupIndex");
      if (idx === 0 || idx === 1 || idx === 2) {
        dropZone.setTint(POPUP_RESTORE_TINT);
        dropZone.setScale(1.0);
      }
    });

    this.input.on("drop", (_p, gameObject, dropZone) => {
      const idx = dropZone.getData && dropZone.getData("popupIndex");
      if (!(idx === 0 || idx === 1 || idx === 2)) return;

      const srcKey = gameObject.getData("srcKey");
      const state = this.popupStates[idx];

      if (state.contentSprite) {
        const emptyIdx = findEmptySlotIndex();
        if (emptyIdx === -1) {
          gameObject.setData("droppedAccepted", false);
          return;
        }
        const oldKey = state.sourceKey;
        const oldCfg = QUADRO_CFG_BY_KEY[oldKey] || { dx: 0, dy: 0, scale: 1 };

        this.updateQuadroImg(emptyIdx, { key: oldKey, ...oldCfg });
        copyrightButtonsReady && copyrightButtonsReady();
        setCopyrightBtnEnabled(emptyIdx, true);

        this.usedSourceKeys.delete(oldKey);

        placeInPopup(idx, srcKey);
        this.usedSourceKeys.add(srcKey);

        gameObject.setData("droppedAccepted", true);
        this.updateAdvanceButtonState?.();
        return;
      }

      if (this.usedSourceKeys.has(srcKey)) {
        gameObject.setData("droppedAccepted", false);
        return;
      }

      placeInPopup(idx, srcKey);
      this.usedSourceKeys.add(srcKey);
      gameObject.setData("droppedAccepted", true);

      this.updateAdvanceButtonState?.();
    });

    this.input.on("dragend", (_p, gameObject) => {
      if (!gameObject.getData("srcKey")) return;

      this.popups.forEach((p) => {
        p.setTint(POPUP_RESTORE_TINT);
        p.setScale(1.0);
      });

      const accepted = gameObject.getData("droppedAccepted");

      if (accepted) {
        const itemIndex = gameObject.getData("itemIndex");
        clearQuadroSlot(itemIndex);
        gameObject.destroy();
        return;
      }

      const sx = gameObject.getData("startX");
      const sy = gameObject.getData("startY");
      gameObject.x = sx;
      gameObject.y = sy;

      const itemIndex = gameObject.getData("itemIndex");
      const item = this.quadroConteudos[itemIndex];
      if (item?.mask) {
        gameObject.setMask(item.mask);
      }
      const origDepth = gameObject.getData("origDepth") || 0;
      gameObject.setDepth(origDepth);
      gameObject.setInteractive({ useHandCursor: true, draggable: true });
    });

    const marca = ColorManager.getCurrentMarca(this);
    const colorsEnabled = ColorManager.getColors(marca, ColorManager.BLUE);
    const colorsDisabled = ColorManager.getColors(marca, ColorManager.GRAY);

    const btAvancar = new Button(this, {
      text: "AVANÇAR",
      showIcon: false,
      colors: colorsDisabled,
    });

    btAvancar.x =
      background.x + background.width - btAvancar.width - MARGEM_DIREITA_BTN;
    btAvancar.y =
      background.y + background.height - btAvancar.height - MARGEM_INFERIOR_BTN;

    const btnBlocker = this.add
      .zone(btAvancar.x, btAvancar.y, btAvancar.width, btAvancar.height)
      .setOrigin(0, 0)
      .setInteractive({ cursor: "default" });
    this.children.bringToTop(btnBlocker);

    const applyButtonColors = (btn, palette) => {
      if (typeof btn.setColors === "function") {
        btn.setColors(palette);
      } else if ("colors" in btn) {
        btn.colors = palette;
        if (typeof btn.redraw === "function") btn.redraw();
      }
    };

    this.canAdvance = false;

    const setAdvanceEnabled = (enabled) => {
      this.canAdvance = enabled;
      btnBlocker.setPosition(btAvancar.x, btAvancar.y);
      btnBlocker.setSize(btAvancar.width, btAvancar.height);

      if (enabled) {
        applyButtonColors(btAvancar, colorsEnabled);
        btnBlocker.disableInteractive();
        btnBlocker.setActive(false);
      } else {
        applyButtonColors(btAvancar, colorsDisabled);
        btnBlocker.setActive(true);
        btnBlocker.setInteractive({ cursor: "default" });
        this.children.bringToTop(btnBlocker);
      }
    };

    this.updateAdvanceButtonState = () => {
      const allFilled = this.popupStates.every((s) => !!s.contentSprite);
      setAdvanceEnabled(allFilled);
    };

    setAdvanceEnabled(false);

    btAvancar.on("buttonClick", () => {
      if (!this.canAdvance) return;
      this.scene.start("Game3");
    });

    let copyrightButtonsReady = null;
    this.copyrightButtons = this.quadros.map((q, i) => {
      const btn = this.add
        .image(
          q.x + COPYRIGHT_BTN_DX,
          q.y + COPYRIGHT_BTN_DY,
          COPYRIGHT_BTN_KEY
        )
        .setOrigin(0.5)
        .setScale(0.9)
        .setInteractive({ useHandCursor: true })
        .setDepth(COPYRIGHT_BTN_DEPTH);

      btn.on("pointerdown", () => showCreditModal(i));
      return btn;
    });
    copyrightButtonsReady = () => true;

    const overlay = this.add
      .rectangle(
        background.x + background.width / 2,
        background.y + background.height / 2,
        background.width,
        background.height,
        0x000000,
        0.65
      )
      .setInteractive()
      .setDepth(MODAL_DEPTH)
      .setVisible(false);

    const creditImg = this.add
      .image(
        background.x + background.width / 2,
        background.y + background.height / 2,
        CREDIT_KEYS_BY_INDEX[0]
      )
      .setOrigin(0.5)
      .setDepth(MODAL_DEPTH + 1)
      .setVisible(false);

    const closeBtn = this.add
      .image(0, 0, CLOSE_BTN_KEY)
      .setOrigin(0.5)
      .setDepth(CLOSE_BTN_DEPTH)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });
    closeBtn.on("pointerdown", () => hideCreditModal());

    const fitCreditImage = () => {
      const maxW = background.width * CREDIT_MAX_W_RATIO;
      const maxH = background.height * CREDIT_MAX_H_RATIO;
      const s = Math.min(maxW / creditImg.width, maxH / creditImg.height);
      creditImg.setScale(s);
    };

    const positionCloseBtn = () => {
      const dispW = creditImg.displayWidth;
      const dispH = creditImg.displayHeight;
      closeBtn.x = creditImg.x + dispW / 2 - CLOSE_BTN_OFFSET_X;
      closeBtn.y = creditImg.y - dispH / 2 + CLOSE_BTN_OFFSET_Y;
    };

    const setCreditModalVisible = (v) => {
      overlay.setVisible(v);
      creditImg.setVisible(v);
      closeBtn.setVisible(v);
      if (v) {
        overlay.once("pointerdown", hideCreditModal);
        this.input.keyboard?.once("keydown-ESC", hideCreditModal);
      }
    };

    const showCreditModal = (index) => {
      const key = CREDIT_KEYS_BY_INDEX[index] || CREDIT_KEYS_BY_INDEX[0];
      creditImg.setTexture(key);
      fitCreditImage();
      positionCloseBtn();
      setCreditModalVisible(true);
      this.children.bringToTop(overlay);
      this.children.bringToTop(creditImg);
      this.children.bringToTop(closeBtn);
    };

    const hideCreditModal = () => setCreditModalVisible(false);

    super.create(); // manter
  }
}

export default Game2;
