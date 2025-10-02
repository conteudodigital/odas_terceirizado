import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game5 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game5");
    this.controladorDeCenas = controladorDeCenas;

    this.TARGET_TOTAL = 350;

    this.DEBUG_BOXES = false;

    this.CALC_DISPLAY_POS = { x: 1415, y: 305, width: 650, height: 100 };

    this.LEFT_TOTAL_POS = { x: 605, y: 880, width: 400, height: 100 };

    this.UI_DEPTH = 500;

    this.MODAL_DEPTH = 100000;
    this.OVERLAY_ALPHA = 0.75;
  }

  init() {
    this.tokens = [];
    this.current = "";
    this.justEvaluated = false;

    this.btNextEnabled = false;

    this.lastResult = null;

    this.overlay = null;
    this.modalNegativo = null;
  }

  create() {
    const bg = this.add.image(0, 0, "calculadora_saidas").setOrigin(0, 0);

    const v = this.CALC_DISPLAY_POS;
    const visorX = bg.x + v.x;
    const visorY = bg.y + v.y;

    if (this.DEBUG_BOXES) {
      this.add
        .rectangle(visorX, visorY, v.width, v.height, 0x00aaff, 0.12)
        .setStrokeStyle(2, 0x0077aa)
        .setOrigin(0.5);
    }

    this.displayText = this.add
      .text(visorX, visorY, "", {
        fontFamily: "Nunito",
        fontSize: "56px",
        fontStyle: "900",
        color: "#1D2935",
        fixedWidth: v.width,
        align: "right",
      })
      .setOrigin(0.5);

    const t = this.LEFT_TOTAL_POS;
    const totalX = bg.x + t.x;
    const totalY = bg.y + t.y;

    if (this.DEBUG_BOXES) {
      this.add
        .rectangle(totalX, totalY, t.width, t.height, 0xff7700, 0.1)
        .setStrokeStyle(2, 0xaa5500)
        .setOrigin(0.5);
    }

    this.totalText = this.add
      .text(totalX, totalY, "", {
        fontFamily: "Nunito",
        fontSize: "56px",
        fontStyle: "900",
        color: "#1D2935",
        fixedWidth: t.width,
        align: "center",
      })
      .setOrigin(0.5);

    const B = (x, y, w = 120, h = 128) => ({ x: bg.x + x, y: bg.y + y, w, h });

    const layout = {
      1: B(1137, 445),
      2: B(1276, 445),
      3: B(1416, 445),
      4: B(1556, 445),
      5: B(1696, 445),
      6: B(1206, 593),
      7: B(1347, 593),
      8: B(1486, 593),
      9: B(1626, 593),
      DEL: B(1137, 742),
      "-": B(1276, 742),
      0: B(1416, 742),
      "+": B(1556, 742),
      "=": B(1696, 742),
    };

    const make = (cfg, cb) =>
      this.createPadZone(cfg.x, cfg.y, cfg.w, cfg.h, cb);

    make(layout["1"], () => this.pressDigit("1"));
    make(layout["2"], () => this.pressDigit("2"));
    make(layout["3"], () => this.pressDigit("3"));
    make(layout["4"], () => this.pressDigit("4"));
    make(layout["5"], () => this.pressDigit("5"));
    make(layout["6"], () => this.pressDigit("6"));
    make(layout["7"], () => this.pressDigit("7"));
    make(layout["8"], () => this.pressDigit("8"));
    make(layout["9"], () => this.pressDigit("9"));
    make(layout["DEL"], () => this.pressDel());
    make(layout["-"], () => this.pressOp("-"));
    make(layout["0"], () => this.pressDigit("0"));
    make(layout["+"], () => this.pressOp("+"));
    make(layout["="], () => this.pressEquals());

    const baseCfg = { text: "PRÓXIMO", showIcon: false };
    const marca = ColorManager.getCurrentMarca(this);
    const colorsBlue = ColorManager.getColors(marca, ColorManager.BLUE);
    const colorsGray = ColorManager.getColors(marca, ColorManager.GRAY);

    const cfgDisabled = { ...baseCfg, colors: colorsGray };
    const cfgEnabled = { ...baseCfg, colors: colorsBlue };

    const NEXT_POS = {
      anchorX: 0.5,
      anchorY: 0.9,
      offsetX: 450,
      offsetY: -60,
      center: true,
    };
    const baseX = bg.x + bg.displayWidth * NEXT_POS.anchorX;
    const baseY = bg.y + bg.displayHeight * NEXT_POS.anchorY;
    const layoutX = (btn) =>
      (NEXT_POS.center ? baseX - btn.width / 2 : baseX) + NEXT_POS.offsetX;
    const layoutY = () => baseY + NEXT_POS.offsetY;

    this.btProximoOff = new Button(this, cfgDisabled);
    this.add.existing(this.btProximoOff);
    this.btProximoOff.setDepth(this.UI_DEPTH);
    this.btProximoOff.x = layoutX(this.btProximoOff);
    this.btProximoOff.y = layoutY();

    this.btProximoOn = new Button(this, cfgEnabled);
    this.add.existing(this.btProximoOn);
    this.btProximoOn.setDepth(this.UI_DEPTH);
    this.btProximoOn.x = layoutX(this.btProximoOn);
    this.btProximoOn.y = layoutY();
    this.btProximoOn.setVisible(false);
    this.btProximoOn.on("buttonClick", () => {
      if (!this.totalText.text || !this.totalText.text.trim()) return;

      if (this.lastResult === this.TARGET_TOTAL) {
        this.scene.start("Game6");
      } else {
        this.showNegativeModal();
      }
    });

    this.createNegativeModal(bg, colorsBlue);

    this.updateCalcDisplay();
    this.updateNextState(false);
  }

  createNegativeModal(bg, btnColors) {
    const w = Math.max(bg.displayWidth, this.cameras.main.width);
    const h = Math.max(bg.displayHeight, this.cameras.main.height);

    this.overlay = this.add
      .rectangle(0, 0, w, h, 0x000000, this.OVERLAY_ALPHA)
      .setOrigin(0, 0)
      .setDepth(this.MODAL_DEPTH)
      .setScrollFactor(0)
      .setVisible(false)
      .setInteractive();

    this.modalNegativo = this.add
      .container(0, 0)
      .setDepth(this.MODAL_DEPTH + 1)
      .setScrollFactor(0)
      .setVisible(false);

    const cx = bg.x + bg.displayWidth / 2;
    const cy = bg.y + bg.displayHeight / 2;

    const img = this.add
      .image(cx, cy, "Modal_FeedbackNegativo_Atv2")
      .setOrigin(0.5);
    this.modalNegativo.add(img);

    const btVoltar = new Button(this, {
      text: "VOLTAR",
      showIcon: false,
      colors: btnColors,
    });
    this.add.existing(btVoltar);
    this.modalNegativo.add(btVoltar);

    btVoltar.x = img.x + img.displayWidth * -0.1;
    btVoltar.y = img.y + img.displayHeight * 0.1;

    btVoltar.on("buttonClick", () => {
      this.scene.restart();
    });
  }

  showNegativeModal() {
    this.overlay?.setVisible(true);
    this.modalNegativo?.setVisible(true);

    this.input.setTopOnly(true);
  }

  createPadZone(x, y, w, h, onClick) {
    const zone = this.add
      .zone(x, y, w, h)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    zone.on("pointerdown", onClick);

    if (this.DEBUG_BOXES) {
      this.add
        .rectangle(x, y, w, h, 0x00ff99, 0.18)
        .setStrokeStyle(2, 0x006644)
        .setOrigin(0.5);
    }
    return zone;
  }

  pressDigit(d) {
    if (this.justEvaluated) {
      this.tokens = [];
      this.current = "";
      this.justEvaluated = false;
    }
    if (this.current.length >= 9) return;
    if (this.current === "0") this.current = d;
    else this.current += d;
    this.updateCalcDisplay();
  }

  pressOp(op) {
    if (this.justEvaluated) this.justEvaluated = false;

    if (!this.current) {
      if (this.tokens.length > 0) {
        const last = this.tokens[this.tokens.length - 1];
        if (last === "+" || last === "-") {
          this.tokens[this.tokens.length - 1] = op;
          this.updateCalcDisplay();
          return;
        }
      }
      return;
    }

    this.tokens.push(this.current);
    this.tokens.push(op);
    this.current = "";
    this.updateCalcDisplay();
  }

  pressDel() {
    if (this.justEvaluated) {
      this.tokens = [];
      this.current = "";
      this.justEvaluated = false;
      this.lastResult = null;
      this.totalText.setText("");
      this.updateCalcDisplay();
      this.updateNextState(false);
      return;
    }

    if (this.current) {
      this.current = this.current.slice(0, -1);
      this.updateCalcDisplay();
      return;
    }

    if (this.tokens.length > 0) {
      const last = this.tokens.pop();
      if (last !== "+" && last !== "-") {
        this.current = String(last).slice(0, -1);
      }
      this.updateCalcDisplay();
    }
  }

  pressEquals() {
    const expr = [...this.tokens];
    if (this.current) expr.push(this.current);
    if (expr.length === 0) return;

    const result = this.evalTokens(expr);

    this.displayText.setText(this.formatNumber(result));
    this.totalText.setText(this.formatNumber(result));
    this.justEvaluated = true;
    this.lastResult = result;

    this.updateNextState(true);
  }

  evalTokens(tokens) {
    let acc = 0;
    let pendingOp = "+";
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      if (tk === "+" || tk === "-") {
        pendingOp = tk;
      } else {
        const n = parseInt(tk, 10) || 0;
        acc = pendingOp === "+" ? acc + n : acc - n;
      }
    }
    return acc;
  }

  updateCalcDisplay() {
    const parts = [];
    for (let i = 0; i < this.tokens.length; i++) {
      const tk = this.tokens[i];
      if (tk === "+" || tk === "-") parts.push(tk);
      else parts.push(this.formatNumber(parseInt(tk, 10) || 0));
    }
    if (this.current)
      parts.push(this.formatNumber(parseInt(this.current, 10) || 0));

    const exprStr = parts.join("");
    this.displayText.setText(exprStr);
  }

  formatNumber(n) {
    const s = Math.abs(n).toString();
    const pretty = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return n < 0 ? `-${pretty}` : pretty;
  }

  updateNextState(enabled) {
    this.btNextEnabled = !!enabled;
    this.btProximoOn.setVisible(this.btNextEnabled);
    this.btProximoOff.setVisible(!this.btNextEnabled);
  }
}

export default Game5;
