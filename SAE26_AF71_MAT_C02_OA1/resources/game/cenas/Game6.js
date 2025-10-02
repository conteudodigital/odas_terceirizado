import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game6 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game6");
    this.controladorDeCenas = controladorDeCenas;

    // Resultado correto (2 530 - 350)
    this.TARGET_TOTAL = 2180;

    // Debug
    this.DEBUG_BOXES = false;

    // Posicionamento dos visores
    this.CALC_DISPLAY_POS = { x: 1415, y: 305, width: 650, height: 100 };
    this.LEFT_TOTAL_POS = { x: 605, y: 880, width: 400, height: 100 };

    // UI depths
    this.UI_DEPTH = 500;
    this.MODAL_DEPTH = 100000;
    this.OVERLAY_ALPHA = 0.75;

    // Ajustes fáceis do botão nos modais (percentual da imagem + offsets px)
    this.MODAL_BTN_POS = {
      positivo: { relX: -0.125, relY: 0.2, offsetX: 0, offsetY: 0 },
      negativo: { relX: -0.05, relY: 0.2, offsetX: 0, offsetY: 0 },
    };
  }

  init() {
    // Expressão da calculadora
    this.tokens = [];
    this.current = "";
    this.justEvaluated = false;

    // Botão próximo
    this.btNextEnabled = false;

    // Último resultado confirmado (=) mostrado no TOTAL
    this.lastResult = null;

    // Refs de modal
    this.overlay = null;
    this.modalPositivo = null;
    this.modalNegativo = null;
  }

  create() {
    // Background da atividade
    const bg = this.add
      .image(0, 0, "calculadora_entradasesaidas")
      .setOrigin(0, 0);

    // Visor da calculadora (direita)
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

    // Campo TOTAL (esquerda)
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

    // Zonas clicáveis da calculadora
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

    // Botão PRÓXIMO (ColorManager: GRAY desativado / BLUE ativado)
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
      // Só reage se houver TOTAL mostrado
      if (!this.totalText.text || !this.totalText.text.trim()) return;

      if (this.lastResult === this.TARGET_TOTAL) {
        this.showPositiveModal();
      } else {
        this.showNegativeModal();
      }
    });

    // Overlay + Modais (atv3)
    this.createModals(bg, colorsBlue);

    // Estado inicial
    this.updateCalcDisplay();
    this.updateNextState(false);
  }

  // ---------- Overlay + Modais (atv3) ----------
  createModals(bg, btnColors) {
    const w = Math.max(bg.displayWidth, this.cameras.main.width);
    const h = Math.max(bg.displayHeight, this.cameras.main.height);

    // Overlay comum
    this.overlay = this.add
      .rectangle(0, 0, w, h, 0x000000, this.OVERLAY_ALPHA)
      .setOrigin(0, 0)
      .setDepth(this.MODAL_DEPTH)
      .setScrollFactor(0)
      .setVisible(false)
      .setInteractive();

    const cx = bg.x + bg.displayWidth / 2;
    const cy = bg.y + bg.displayHeight / 2;

    // ----- Modal Positivo -----
    this.modalPositivo = this.add
      .container(0, 0)
      .setDepth(this.MODAL_DEPTH + 1)
      .setScrollFactor(0)
      .setVisible(false);

    const imgOk = this.add
      .image(cx, cy, "Modal_FeedbackPositivo_Atv3")
      .setOrigin(0.5);
    this.modalPositivo.add(imgOk);

    const btContinuar = new Button(this, {
      text: "CONTINUAR",
      showIcon: false,
      colors: btnColors,
    });
    this.add.existing(btContinuar);
    this.modalPositivo.add(btContinuar);

    btContinuar.x =
      imgOk.x +
      imgOk.displayWidth * this.MODAL_BTN_POS.positivo.relX +
      this.MODAL_BTN_POS.positivo.offsetX;
    btContinuar.y =
      imgOk.y +
      imgOk.displayHeight * this.MODAL_BTN_POS.positivo.relY +
      this.MODAL_BTN_POS.positivo.offsetY;

    btContinuar.on("buttonClick", () => {
      this.scene.start("Game7"); // fallback direto
    });

    // ----- Modal Negativo -----
    this.modalNegativo = this.add
      .container(0, 0)
      .setDepth(this.MODAL_DEPTH + 1)
      .setScrollFactor(0)
      .setVisible(false);

    const imgBad = this.add
      .image(cx, cy, "Modal_FeedbackNegativo_Atv3")
      .setOrigin(0.5);
    this.modalNegativo.add(imgBad);

    const btVoltar = new Button(this, {
      text: "VOLTAR",
      showIcon: false,
      colors: btnColors,
    });
    this.add.existing(btVoltar);
    this.modalNegativo.add(btVoltar);

    btVoltar.x =
      imgBad.x +
      imgBad.displayWidth * this.MODAL_BTN_POS.negativo.relX +
      this.MODAL_BTN_POS.negativo.offsetX;
    btVoltar.y =
      imgBad.y +
      imgBad.displayHeight * this.MODAL_BTN_POS.negativo.relY +
      this.MODAL_BTN_POS.negativo.offsetY;

    btVoltar.on("buttonClick", () => {
      this.scene.restart();
    });
  }

  showPositiveModal() {
    this.overlay?.setVisible(true);
    this.modalPositivo?.setVisible(true);
    this.input.setTopOnly(true);
  }

  showNegativeModal() {
    this.overlay?.setVisible(true);
    this.modalNegativo?.setVisible(true);
    this.input.setTopOnly(true);
  }

  // ---------- Zonas clicáveis ----------
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

  // ---------- Lógica da calculadora ----------
  pressDigit(d) {
    if (this.justEvaluated) {
      this.tokens = [];
      this.current = "";
      this.justEvaluated = false;
      // Mantemos o TOTAL até apertar "=" novamente
    }
    if (this.current.length >= 9) return;
    this.current = this.current === "0" ? d : this.current + d;
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
      // Limpa tudo e desativa PRÓXIMO
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

    // Atualiza visor e TOTAL
    this.displayText.setText(this.formatNumber(result));
    this.totalText.setText(this.formatNumber(result));
    this.justEvaluated = true;
    this.lastResult = result;

    // Botão azul assim que existir TOTAL (correto ou não)
    this.updateNextState(true);
  }

  evalTokens(tokens) {
    let acc = 0;
    let op = "+";
    for (let i = 0; i < tokens.length; i++) {
      const tk = tokens[i];
      if (tk === "+" || tk === "-") {
        op = tk;
      } else {
        const n = parseInt(tk, 10) || 0;
        acc = op === "+" ? acc + n : acc - n;
      }
    }
    return acc;
  }

  // ---------- Visor ----------
  updateCalcDisplay() {
    const parts = [];
    for (let i = 0; i < this.tokens.length; i++) {
      const tk = this.tokens[i];
      if (tk === "+" || tk === "-") parts.push(tk);
      else parts.push(this.formatNumber(parseInt(tk, 10) || 0));
    }
    if (this.current)
      parts.push(this.formatNumber(parseInt(this.current, 10) || 0));
    this.displayText.setText(parts.join(""));
  }

  formatNumber(n) {
    const s = Math.abs(n).toString();
    const pretty = s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return n < 0 ? `-${pretty}` : pretty;
  }

  // ---------- Botão PRÓXIMO ----------
  updateNextState(enabled) {
    this.btNextEnabled = !!enabled;
    this.btProximoOn.setVisible(this.btNextEnabled);
    this.btProximoOff.setVisible(!this.btNextEnabled);
  }
}

export default Game6;
