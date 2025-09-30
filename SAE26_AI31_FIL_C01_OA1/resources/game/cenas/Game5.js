import { BaseCena } from "../../js/library/base/BaseCena.js";
import SoundManager from "../../js/library/managers/SoundManager.js";

export class Game5 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game5");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    /** @type {Phaser.GameObjects.Container} */
    this.artContainer = null;
    this.selectedItem = null;
    this.counters = {
      banana_atv2: 0,
      xicara_atv2: 0,
      controle_atv2: 0,
      mochila_atv2: 0,
    };

    this.nomeDom = null;
    this.justDom = null;

    this._uiToHide = [];
    this._modalFeedback = null;
    this._btDownload = null;
    this._btFinalizar = null;

    this._ART = { x: 0, y: 0, w: 0, h: 0 };

    this._QUADRO = { x: 0, y: 0, w: 0, h: 0 };

    this.CLICK_SFX_KEY = "click";
  }

  create() {
    // <<< ADIÇÃO >>>

    SoundManager.init(this);

    const MARGEM_MODAL_ESQUERDA = 40;
    const OFFSET_MODAL_Y = 80;

    const LEFT_PAD = 115;
    const RIGHT_PAD = 95;
    const TOP_PAD = -10;
    const BOTTOM_PAD = 0;

    const N_ITEMS = 4;
    const TARGET_COL_W = 220;
    const MAX_ITEM_H = 130;
    const MIN_SCALE = 0.35;
    const MAX_SCALE = 2.0;
    const SCALE_TUNING = {
      controle_atv2: 1.4,
      banana_atv2: 0.9,
      xicara_atv2: 0.9,
      mochila_atv2: 1.0,
    };

    const POPUP = {
      x: 400,
      y: 180,
      scale: 1.0,
      originX: 0,
      originY: 0,
      depth: 5,
    };
    const FRAME_RELATIVE_TO_POPUP = true;
    const FRAME_OFFSETS = { x: 65, y: 50 };
    const FRAME = {
      x: 520,
      y: 160,
      scale: 1.0,
      innerPad: { left: 0, right: 0, top: 0, bottom: 0 },
    };

    const EDIT_BTNS = {
      y: () => frameY + frameDrawH + 70,
      startX: () => frameX + frameDrawW * 0.3,
      gap: 120,
      scale: 0.95,
    };

    const REGISTRAR = {
      x: () => frameX + frameDrawW + 560,
      y: () => frameY + frameDrawH + 65,
      originX: 1.0,
      originY: 0.5,
      scale: 1.0,
    };

    const FORM = {
      baseOffsetX: 60,
      baseOffsetY: 0,

      inputsDX: -24,
      inputsDY: 0,

      labelsFollowInputs: true,
      labelDX: 0,
      labelDY: 0,

      labelColor: "#1a1a1a",
      labelSize: 26,
      labelFont: "Nunito, Inter, Arial, sans-serif",

      nome: { dx: 0, dy: 50, w: 520, h: 60, placeholder: "DIGITE AQUI" },
      just: {
        dx: 0,
        dy: 190,
        w: 520,
        h: 400,
        placeholder: "EXPLIQUE SUA OBRA",
      },

      tituloNomeDY: 0,
      tituloJustDY: 132,

      borderColor: "#d6c5f1",
      borderWidth: 4,
      borderRadius: 16,
      textColor: "#1f1f1f",
      bgColor: "#ffffff",
      padding: "12px 16px",

      inputFontSize: 26,
      placeholderSize: 26,
      lineHeightMult: 1.25,

      placeholderColor: "#cfc3f1",
      placeholderWeight: 800,

      inputWeight: 900,
      inputStrokeThickness: 0.6,
      inputStrokeColor: "#1a1a1a",
      useInputStroke: true,
    };

    const MAX_PER_TYPE = 5;
    const ROTATE_STEP = 15;
    const SCALE_UP = 1.12;
    const SCALE_DOWN = 1 / SCALE_UP;

    const background = this.add.image(0, 0, "bgGame").setOrigin(0, 0);

    const atv2text = this.add.image(0, 0, "atv2text").setOrigin(0, 1);
    atv2text.x = (this.scale.width - atv2text.width) / 2 + 10;
    atv2text.y = (this.scale.height - atv2text.height) / 2 - 350;

    const modal_atv2 = this.add.image(0, 0, "modal_atv2").setOrigin(0, 0);
    modal_atv2.x = background.x + MARGEM_MODAL_ESQUERDA;
    modal_atv2.y =
      background.y +
      (background.height - modal_atv2.height) / 2 +
      OFFSET_MODAL_Y;

    const innerX = modal_atv2.x + LEFT_PAD;
    const innerY = modal_atv2.y + TOP_PAD;
    const innerW = modal_atv2.width - LEFT_PAD - RIGHT_PAD;
    const innerH = modal_atv2.height - TOP_PAD - BOTTOM_PAD;
    const colCenterX = innerX + innerW / 2;

    const popUpFundo = this.add
      .image(POPUP.x, POPUP.y, "popUpFundoAtv2")
      .setOrigin(POPUP.originX, POPUP.originY)
      .setScale(POPUP.scale)
      .setDepth(POPUP.depth);

    const frameX = FRAME_RELATIVE_TO_POPUP
      ? POPUP.x + FRAME_OFFSETS.x
      : FRAME.x;
    const frameY = FRAME_RELATIVE_TO_POPUP
      ? POPUP.y + FRAME_OFFSETS.y
      : FRAME.y;

    const quadro = this.add
      .image(frameX, frameY, "quadroDeArte")
      .setOrigin(0, 0);
    quadro.setScale(FRAME.scale).setDepth(POPUP.depth + 1);

    const frameDrawW = this._frameDrawW(quadro);
    const frameDrawH = this._frameDrawH(quadro);

    const innerLeft = FRAME.innerPad.left;
    const innerRight = frameDrawW - FRAME.innerPad.right;
    const innerTop = FRAME.innerPad.top;
    const innerBottom = frameDrawH - FRAME.innerPad.bottom;

    const maskG = this.add.graphics();
    maskG.fillStyle(0xffffff, 1);
    maskG.fillRoundedRect(
      frameX + innerLeft,
      frameY + innerTop,
      innerRight - innerLeft,
      innerBottom - innerTop,
      16
    );
    const geoMask = maskG.createGeometryMask();
    maskG.setVisible(false);

    this.artContainer = this.add.container(
      frameX + innerLeft,
      frameY + innerTop
    );
    this.artContainer.setMask(geoMask).setDepth(POPUP.depth + 2);

    const ART = {
      x: frameX + innerLeft,
      y: frameY + innerTop,
      w: innerRight - innerLeft,
      h: innerBottom - innerTop,
    };
    this._ART = ART;

    this._QUADRO = {
      x: frameX,
      y: frameY,
      w: frameDrawW,
      h: frameDrawH,
    };

    const artHitZone = this.add
      .zone(ART.x, ART.y, ART.w, ART.h)
      .setOrigin(0, 0)
      .setInteractive()
      .setDepth(POPUP.depth + 1);
    artHitZone.on("pointerdown", () => this._selectItem(null));

    const buttonsY = EDIT_BTNS.y();
    const btnStartX = EDIT_BTNS.startX();
    const btnGap = EDIT_BTNS.gap;

    const btnRotate = this.add
      .image(btnStartX + -0.25 * btnGap, buttonsY, "Botao_Rotate")
      .setOrigin(0.5);
    const btnPlus = this.add
      .image(btnStartX + 1.25 * btnGap, buttonsY, "Botao_Zoom_In")
      .setOrigin(0.5);
    const btnMinus = this.add
      .image(btnStartX + 2.4 * btnGap, buttonsY, "Botao_Zoom_Out")
      .setOrigin(0.5);

    btnRotate.setScale(EDIT_BTNS.scale);
    btnPlus.setScale(EDIT_BTNS.scale);
    btnMinus.setScale(EDIT_BTNS.scale);

    [btnRotate, btnPlus, btnMinus].forEach((b) =>
      b.setInteractive({ useHandCursor: true }).setDepth(1000)
    );

    btnRotate.on("pointerdown", () => {
      SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);
      if (!this.selectedItem) return;
      this.selectedItem.angle = Phaser.Math.Wrap(
        this.selectedItem.angle + ROTATE_STEP,
        -180,
        180
      );
    });
    btnPlus.on("pointerdown", () => {
      SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);
      if (!this.selectedItem) return;
      const s = Phaser.Math.Clamp(
        this.selectedItem.scale * SCALE_UP,
        MIN_SCALE,
        MAX_SCALE
      );
      this.selectedItem.setScale(s);
    });
    btnMinus.on("pointerdown", () => {
      SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);
      if (!this.selectedItem) return;
      const s = Phaser.Math.Clamp(
        this.selectedItem.scale * SCALE_DOWN,
        MIN_SCALE,
        MAX_SCALE
      );
      this.selectedItem.setScale(s);
    });

    const registrar = this.add
      .image(REGISTRAR.x(), REGISTRAR.y(), "Botao_Registrar_Obra")
      .setOrigin(REGISTRAR.originX, REGISTRAR.originY)
      .setScale(REGISTRAR.scale)
      .setInteractive({ useHandCursor: true })
      .setDepth(1000);

    registrar.on("pointerdown", () => {
      SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);

      this._handleRegistrar();
    });

    const baseX = () => frameX + frameDrawW + FORM.baseOffsetX;
    const baseY = () => frameY + FORM.baseOffsetY;
    const labelsBaseX = () =>
      baseX() + (FORM.labelsFollowInputs ? FORM.inputsDX : 0) + FORM.labelDX;

    const labelStyle = {
      fontFamily: FORM.labelFont,
      fontSize: `${FORM.labelSize}px`,
      color: FORM.labelColor,
      fontStyle: "bold",
      stroke: FORM.labelColor,
      strokeThickness: 1,
    };

    const lblNome = this.add
      .text(
        labelsBaseX(),
        baseY() + FORM.tituloNomeDY + FORM.labelDY,
        "NOME DA OBRA",
        labelStyle
      )
      .setOrigin(0, 0)
      .setDepth(1000);

    const lblJust = this.add
      .text(
        labelsBaseX(),
        baseY() + FORM.tituloJustDY + FORM.labelDY,
        "JUSTIFICATIVA ARTÍSTICA",
        labelStyle
      )
      .setOrigin(0, 0)
      .setDepth(1000);

    const makeTextShadow = (t, c) => {
      if (!FORM.useInputStroke || !t) return "none";
      const d = [
        [0, t],
        [0, -t],
        [t, 0],
        [-t, 0],
        [t, t],
        [t, -t],
        [-t, t],
        [-t, -t],
      ];
      return d.map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(", ");
    };

    const cssForField = (w, h) =>
      `width:${w}px;height:${h}px;` +
      `background:${FORM.bgColor};border:${FORM.borderWidth}px solid ${FORM.borderColor};` +
      `border-radius:${FORM.borderRadius}px;outline:none;` +
      `padding:${FORM.padding};box-sizing:border-box;` +
      `font-family:${FORM.labelFont} !important;` +
      `font-weight:${FORM.inputWeight};` +
      `font-variation-settings:"wght" ${FORM.inputWeight};` +
      `font-size:${FORM.inputFontSize}px;` +
      `line-height:${Math.round(FORM.inputFontSize * FORM.lineHeightMult)}px;` +
      `color:${FORM.textColor};` +
      `text-shadow:${makeTextShadow(
        FORM.inputStrokeThickness,
        FORM.inputStrokeColor
      )};` +
      `-webkit-font-smoothing:antialiased;` +
      `box-shadow:0 2px 0 rgba(0,0,0,.05);` +
      `transition:border-color .12s, box-shadow .12s;`;

    this.nomeDom = this.add
      .dom(
        baseX() + FORM.inputsDX + FORM.nome.dx,
        baseY() + FORM.inputsDY + FORM.nome.dy
      )
      .createFromHTML(
        `
        <style>
          #nomeObra{
            font-family:${FORM.labelFont} !important;
            font-size:${FORM.inputFontSize}px !important;
            line-height:${Math.round(
              FORM.inputFontSize * FORM.lineHeightMult
            )}px !important;
            font-weight:${FORM.inputWeight} !important;
          }
          #nomeObra::placeholder{
            color:${FORM.placeholderColor};
            font-weight:${FORM.placeholderWeight};
            font-family:${FORM.labelFont};
            font-size:${FORM.placeholderSize}px !important;
            text-shadow:none;
          }
          #nomeObra:focus{
            border-color:#b39be0 !important;
            box-shadow:0 0 0 2px rgba(179,155,224,.35);
          }
        </style>
        <input type="text" id="nomeObra" maxlength="80"
               placeholder="${FORM.nome.placeholder}"
               style="${cssForField(FORM.nome.w, FORM.nome.h)}" />
        `
      );
    this.nomeDom.setOrigin(0, 0).setDepth(1500);

    this.justDom = this.add
      .dom(
        baseX() + FORM.inputsDX + FORM.just.dx,
        baseY() + FORM.inputsDY + FORM.just.dy
      )
      .createFromHTML(
        `
        <style>
          #justObra{
            font-family:${FORM.labelFont} !important;
            font-size:${FORM.inputFontSize}px !important;
            line-height:${Math.round(
              FORM.inputFontSize * FORM.lineHeightMult
            )}px !important;
            font-weight:${FORM.inputWeight} !important;
          }
          #justObra::placeholder{
            color:${FORM.placeholderColor};
            font-weight:${FORM.placeholderWeight};
            font-family:${FORM.labelFont};
            font-size:${FORM.placeholderSize}px !important;
            text-shadow:none;
          }
          #justObra:focus{
            border-color:#b39be0 !important;
            box-shadow:0 0 0 2px rgba(179,155,224,.35);
          }
        </style>
        <textarea id="justObra" placeholder="${FORM.just.placeholder}"
                  style="${cssForField(
                    FORM.just.w,
                    FORM.just.h
                  )};resize:none;"></textarea>
        `
      );
    this.justDom.setOrigin(0, 0).setDepth(1500);

    const keys = [
      "controle_atv2",
      "banana_atv2",
      "xicara_atv2",
      "mochila_atv2",
    ];

    const totalH = innerH;
    const gap = totalH / (N_ITEMS + 1);

    const fitWithLimits = (img, maxW, maxH, mult = 1) => {
      const sx = maxW / img.width;
      const sy = maxH / img.height;
      let s = Math.min(sx, sy) * mult;
      s = Phaser.Math.Clamp(s, MIN_SCALE, MAX_SCALE);
      img.setScale(s);
    };

    const paletteImgs = [];

    keys.forEach((key, i) => {
      const y = innerY + (i + 1) * gap;
      const img = this.add.image(colCenterX, y, key).setOrigin(0.5);
      fitWithLimits(img, TARGET_COL_W, MAX_ITEM_H, SCALE_TUNING[key] || 1);

      img.setDepth((modal_atv2.depth || 0) + 1);
      img.setInteractive({ useHandCursor: true, draggable: true });

      img.isPalette = true;
      img.itemKey = key;

      img.on("dragstart", (pointer) => {
        if (this.counters[key] >= MAX_PER_TYPE) {
          this.tweens.add({
            targets: img,
            alpha: 0.5,
            yoyo: true,
            duration: 120,
            repeat: 1,
          });
          return;
        }

        const wx = pointer.worldX ?? pointer.x;
        const wy = pointer.worldY ?? pointer.y;
        const clone = this.add
          .image(wx - ART.x, wy - ART.y, key)
          .setOrigin(0.5);

        clone.setScale(img.scale);
        clone.itemKey = key;
        clone.isPalette = false;

        clone.setInteractive({ draggable: true, useHandCursor: true });
        clone.on("pointerdown", () => this._selectItem(clone));

        clone.on("drag", (p) => this._dragInsideArtFromPointer(clone, p, ART));
        clone.on("dragend", (p) =>
          this._onDragEndInArtFromPointer(clone, p, ART)
        );

        this.artContainer.add(clone);
        this._selectItem(clone);
        this.counters[key]++;
        img.setData("activeClone", clone);
      });

      img.on("drag", (pointer) => {
        const clone = img.getData("activeClone");
        if (!clone) return;
        const wx = pointer.worldX ?? pointer.x;
        const wy = pointer.worldY ?? pointer.y;
        clone.x = Phaser.Math.Clamp(wx - ART.x, 0, ART.w);
        clone.y = Phaser.Math.Clamp(wy - ART.y, 0, ART.h);
      });

      img.on("dragend", (pointer) => {
        const clone = img.getData("activeClone");
        img.setData("activeClone", null);
        if (!clone) return;
        const wx = pointer.worldX ?? pointer.x;
        const wy = pointer.worldY ?? pointer.y;
        const inside = this._pointInRect(wx, wy, ART.x, ART.y, ART.w, ART.h);
        if (!inside) this._destroyItem(clone);
      });

      paletteImgs.push(img);
    });

    this.input.on("gameobjectdown", (_pointer, gameObject) => {
      if (this._isInArtContainer(gameObject)) {
        this._selectItem(gameObject);
      }
    });

    this._modalFeedback = this.add
      .image(this.scale.width / 2, this.scale.height / 2, "Modal_Feedback")
      .setOrigin(0.5)
      .setDepth(4000)
      .setVisible(false);

    this._btDownload = this.add
      .image(
        this._modalFeedback.x + 225,
        this._modalFeedback.y + 250,
        "Botao_Download"
      )
      .setOrigin(0.5)
      .setDepth(4001)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this._btDownload.on("pointerdown", () => {
      SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);

      this._gerarPDF();
    });

    this._btFinalizar = this.add
      .image(
        this._modalFeedback.x - 225,
        this._modalFeedback.y + 250,
        "Botao_Finalizar"
      )
      .setOrigin(0.5)
      .setDepth(4001)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this._btFinalizar.on("pointerdown", () => {
      SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);

      this.scene.start("Capa");
    });

    this._uiToHide = [
      atv2text,
      modal_atv2,
      popUpFundo,
      quadro,
      maskG,
      artHitZone,
      this.artContainer,
      btnRotate,
      btnPlus,
      btnMinus,
      registrar,
      lblNome,
      lblJust,
      this.nomeDom,
      this.justDom,
      ...paletteImgs,
    ];

    super.create();
  }

  _handleRegistrar() {
    const nome = this._getNomeObra();
    const justificativa = this._getJustificativa();

    const { x, y, w, h } = this._QUADRO;
    this._selectItem(null);

    this.game.renderer.snapshotArea(x, y, w, h, (image) => {
      try {
        const fotoDataURL = image?.src || null;
        const payload = {
          nome,
          justificativa,
          foto: fotoDataURL,
          ts: Date.now(),
        };
        localStorage.setItem("obraAtual", JSON.stringify(payload));
      } catch (e) {
        console.warn("Falha ao salvar no localStorage", e);
      }

      this._toggleMainPanels(false);
      this._showFeedback(true);
    });
  }

  _ensureJsPDF() {
    return new Promise((resolve, reject) => {
      const ctor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null;
      if (ctor) return resolve(ctor);

      if (document.getElementById("jspdf-cdn-loader")) {
        const check = () => {
          const c =
            (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null;
          if (c) resolve(c);
          else setTimeout(check, 50);
        };
        return check();
      }

      const script = document.createElement("script");
      script.id = "jspdf-cdn-loader";
      script.src =
        "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
      script.async = true;
      script.onload = () => {
        const ctorLoaded =
          (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null;
        if (ctorLoaded) resolve(ctorLoaded);
        else reject(new Error("jsPDF carregado, mas construtor indisponível."));
      };
      script.onerror = () =>
        reject(new Error("Falha ao carregar jsPDF via CDN."));
      document.head.appendChild(script);
    });
  }

  async _gerarPDF() {
    let JsPdfCtor;
    try {
      JsPdfCtor = await this._ensureJsPDF();
    } catch (err) {
      console.warn("jsPDF não encontrado e não pôde ser carregado.", err);
      return;
    }

    let data;
    try {
      data = JSON.parse(localStorage.getItem("obraAtual") || "{}");
    } catch (_) {
      data = {};
    }
    const nome = (data?.nome || "").trim() || "Obra";
    const justificativa =
      (data?.justificativa || "").trim() || "(sem justificativa)";
    const foto = data?.foto || null;

    const CARD_W = 540;
    const M = 18;
    const IMAGE_BOX_H = 230;

    const probe = new JsPdfCtor({ unit: "pt", format: [CARD_W, 842] });
    const usableW = CARD_W - 2 * M;

    probe.setFont("helvetica", "bold");
    probe.setFontSize(14);
    const nameLines = probe.splitTextToSize(nome.toUpperCase(), usableW);
    const nameH = nameLines.length * 16;

    const justLines = probe.splitTextToSize(
      justificativa.toUpperCase(),
      usableW
    );
    const justH = justLines.length * 16;

    const afterImgGap = 22;
    const labelGap = 16;
    const betweenBlocks = 12;

    const totalH =
      M +
      IMAGE_BOX_H +
      afterImgGap +
      10 +
      labelGap +
      nameH +
      betweenBlocks +
      10 +
      labelGap +
      justH +
      M;

    const doc = new JsPdfCtor({
      orientation: "portrait",
      unit: "pt",
      format: [CARD_W, Math.ceil(totalH)],
    });

    const pageW = doc.internal.pageSize.getWidth();
    const imgLeft = M;
    const imgTop = M;
    const imgMaxW = pageW - 2 * M;
    const imgMaxH = IMAGE_BOX_H;

    const drawTexts = () => {
      let y = imgTop + IMAGE_BOX_H + afterImgGap;
      const textLeft = 40;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("NOME DA OBRA:", textLeft, y);

      y += labelGap;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(nameLines, textLeft, y);

      y += nameH + betweenBlocks;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("JUSTIFICATIVA ARTÍSTICA:", textLeft, y);

      y += labelGap;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(justLines, textLeft, y);

      doc.save(this._sanitizeFilename(`${nome}-registro.pdf`));
    };

    if (foto) {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(imgMaxW / img.width, imgMaxH / img.height, 1);
        const drawW = img.width * ratio;
        const drawH = img.height * ratio;
        const drawX = imgLeft + (imgMaxW - drawW) / 2;
        const drawY = imgTop + (imgMaxH - drawH) / 2;

        try {
          const type = foto.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
          doc.addImage(foto, type, drawX, drawY, drawW, drawH);
        } catch (e) {
          console.warn("Falha ao inserir imagem no PDF", e);
        }
        drawTexts();
      };
      img.onerror = drawTexts;
      img.src = foto;
    } else {
      drawTexts();
    }
  }

  _sanitizeFilename(name) {
    return String(name).replace(/[\\/:*?"<>|]+/g, "_");
  }

  _toggleMainPanels(visible) {
    this._uiToHide.forEach((obj) => {
      if (!obj) return;
      obj.setVisible(visible);
      if (obj.input) obj.disableInteractive();
    });
  }

  _showFeedback(show) {
    this._modalFeedback?.setVisible(show);
    this._btDownload?.setVisible(show).setInteractive(show);
    this._btFinalizar?.setVisible(show).setInteractive(show);
  }

  _frameDrawW(sprite) {
    return sprite ? sprite.displayWidth : 0;
  }
  _frameDrawH(sprite) {
    return sprite ? sprite.displayHeight : 0;
  }

  _isInArtContainer(obj) {
    if (!this.artContainer) return false;
    return this.artContainer.getIndex(obj) !== -1;
  }

  _selectItem(item) {
    if (this.selectedItem && this.selectedItem !== item) {
      this.selectedItem.clearTint();
    }
    this.selectedItem = item || null;
    if (item) {
      item.setTint(0xe9e0ff);
      this.artContainer.moveTo(item, this.artContainer.length - 1);
    }
  }

  _dragInsideArtFromPointer(obj, pointer, ART) {
    const wx = pointer.worldX ?? pointer.x;
    const wy = pointer.worldY ?? pointer.y;
    const localX = Phaser.Math.Clamp(wx - ART.x, 0, ART.w);
    const localY = Phaser.Math.Clamp(wy - ART.y, 0, ART.h);
    obj.x = localX;
    obj.y = localY;
  }

  _onDragEndInArtFromPointer(obj, pointer, ART) {
    const wx = pointer.worldX ?? pointer.x;
    const wy = pointer.worldY ?? pointer.y;
    const inside = this._pointInRect(wx, wy, ART.x, ART.y, ART.w, ART.h);
    if (!inside) this._destroyItem(obj);
  }

  _destroyItem(obj) {
    if (obj && obj.itemKey)
      this.counters[obj.itemKey] = Math.max(
        0,
        (this.counters[obj.itemKey] || 0) - 1
      );
    if (this.selectedItem === obj) this.selectedItem = null;
    obj.destroy();
  }

  _pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  _getNomeObra() {
    const el = this.nomeDom?.node?.querySelector?.("#nomeObra");
    return el ? el.value.trim() : "";
  }
  _getJustificativa() {
    const el = this.justDom?.node?.querySelector?.("#justObra");
    return el ? el.value.trim() : "";
  }
}

export default Game5;
