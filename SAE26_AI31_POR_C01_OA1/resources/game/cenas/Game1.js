import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.inputArea = { x: 1001, y: 406, width: 605, height: 395 };
    this.textStyle = { fontFamily: "Nunito", fontSize: "24px", color: "#000000", align: "left" };

    this.capituloAtual = 1;
    this.textosCapitulo = { 1: "", 2: "", 3: "", 4: "" };

    this.modalAberto = false;
  }

  create() {
    this.input.setTopOnly(true);

    this.heroiIndex = this.registry.get("heroiEscolhido");
    this.desafioIndex = this.registry.get("desafioEscolhido");
    this.localIndex = this.registry.get("localEscolhido");

    this.heroiNome = this.getNomeHeroi(this.heroiIndex);
    this.desafioNome = this.getNomeDesafio(this.desafioIndex);
    this.localNome = this.getNomeLocal(this.localIndex);

    this.spriteIntroducaoKey = `${this.heroiNome}-${this.localNome}-introducao`;
    this.spriteConflitoKey = `${this.heroiNome}-${this.desafioNome}-${this.localNome}`;
    this.spriteClimaxKey = `${this.heroiNome}-climax-${this.localNome}`;
    this.spriteDesfechoKey = `${this.heroiNome}-desfecho-${this.desafioNome}-${this.localNome}`;

    this.background = this.add.image(0, 0, "bgGame").setOrigin(0, 0).setDepth(0);

    this.botaoConcluirCinza = this.add.image(1722, 95, "concluirCinza").setDepth(1).setInteractive({ useHandCursor: true });
    this.botaoConcluirAmarelo = this.add.image(1722, 95, "concluirAmarelo").setDepth(2).setVisible(false).disableInteractive();

    this.livroIntroducao = this.add.image(960, 613, "livroIntroducao").setDepth(3).setVisible(true);
    this.livroConflito = this.add.image(960, 613, "livroConflito").setDepth(3).setVisible(false);
    this.livroClimax = this.add.image(960, 613, "livroClimax").setDepth(3).setVisible(false);
    this.livroDesfecho = this.add.image(960, 613, "livroDesfecho").setDepth(3).setVisible(false);

    this.botaoNext = this.add.image(1560, 893, "Botao-Next").setDepth(4).setInteractive({ useHandCursor: true });
    this.botaoPrevious = this.add.image(1050, 893, "Botao-Previous").setDepth(4).setInteractive({ useHandCursor: true });
    this.botaoPrevious.setVisible(false);

    this.blankMoldura = this.add.image(619, 593, "blankMoldura").setDepth(5);

    this.spriteIntroducao = this.add.image(this.blankMoldura.x, this.blankMoldura.y, this.spriteIntroducaoKey).setDepth(5.1).setVisible(true);
    this.spriteConflito = this.add.image(this.blankMoldura.x, this.blankMoldura.y, this.spriteConflitoKey).setDepth(5.1).setVisible(false);
    this.spriteClimax = this.add.image(this.blankMoldura.x, this.blankMoldura.y, this.spriteClimaxKey).setDepth(5.1).setVisible(false);
    this.spriteDesfecho = this.add.image(this.blankMoldura.x, this.blankMoldura.y, this.spriteDesfechoKey).setDepth(5.1).setVisible(false);

    this.Adesivos = this.add.image(615, 585, "Adesivos").setDepth(6);

    const { x, y, width, height } = this.inputArea;
    this.textInput = this.add
      .dom(x + width / 2, y + height / 2, "textarea", {
        width: `${width}px`,
        height: `${height}px`,
        fontFamily: "Nunito, sans-serif",
        fontSize: "24px",
        color: "#000000",
        padding: "20px",
        lineHeight: "1.5",
        overflowY: "auto",
        boxSizing: "border-box",
        resize: "none",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
      })
      .setDepth(10);

    this.textInput.node.placeholder = "Digite aqui sua história...";
    this.textInput.node.maxLength = 500;
    this.textInput.node.value = this.textosCapitulo[this.capituloAtual] || "";
    this.textInput.node.focus();

    this.textInput.node.addEventListener("input", () => {
      this.textosCapitulo[this.capituloAtual] = this.textInput.node.value;
      this.atualizarEstadoConcluir();
    });

    this.botaoNext.on("pointerdown", () => {
      this.sound.play("click");
      this.irParaProximoCapitulo();
    });
    this.botaoPrevious.on("pointerdown", () => {
      this.sound.play("click");
      this.irParaCapituloAnterior();
    });

    this.botaoConcluirCinza.on("pointerdown", () => {
      console.log("Concluir ainda bloqueado (usar botão cinza).");
    });
    this.botaoConcluirAmarelo.on("pointerdown", () => {
      const tudoPreenchido = this.verificarTudoPreenchido();
      if (tudoPreenchido && !this.modalAberto) this.mostrarModalConcluido();
    });

    this.atualizarCapituloVisual();
    this.atualizarEstadoConcluir();
  }

  irParaProximoCapitulo() {
    if (this.capituloAtual === 1) {
      this.textosCapitulo[1] = this.textInput.node.value || "";
      this.capituloAtual = 2;
    } else if (this.capituloAtual === 2) {
      this.textosCapitulo[2] = this.textInput.node.value || "";
      this.capituloAtual = 3;
    } else if (this.capituloAtual === 3) {
      this.textosCapitulo[3] = this.textInput.node.value || "";
      this.capituloAtual = 4;
    }
    this.atualizarCapituloVisual();
    this.atualizarEstadoConcluir();
  }

  irParaCapituloAnterior() {
    if (this.capituloAtual === 4) {
      this.textosCapitulo[4] = this.textInput.node.value || "";
      this.capituloAtual = 3;
    } else if (this.capituloAtual === 3) {
      this.textosCapitulo[3] = this.textInput.node.value || "";
      this.capituloAtual = 2;
    } else if (this.capituloAtual === 2) {
      this.textosCapitulo[2] = this.textInput.node.value || "";
      this.capituloAtual = 1;
    }
    this.atualizarCapituloVisual();
    this.atualizarEstadoConcluir();
  }

  atualizarCapituloVisual() {
    const mostrandoIntroducao = this.capituloAtual === 1;
    const mostrandoConflito = this.capituloAtual === 2;
    const mostrandoClimax = this.capituloAtual === 3;
    const mostrandoDesfecho = this.capituloAtual === 4;

    this.livroIntroducao.setVisible(mostrandoIntroducao);
    this.livroConflito.setVisible(mostrandoConflito);
    this.livroClimax.setVisible(mostrandoClimax);
    this.livroDesfecho.setVisible(mostrandoDesfecho);

    this.spriteIntroducao.setVisible(mostrandoIntroducao);
    this.spriteConflito.setVisible(mostrandoConflito);
    this.spriteClimax.setVisible(mostrandoClimax);
    this.spriteDesfecho.setVisible(mostrandoDesfecho);

    this.textInput.node.value = this.textosCapitulo[this.capituloAtual] || "";

    if (mostrandoIntroducao) this.textInput.node.placeholder = "Apresente seu herói e o lugar onde ele vive...";
    else if (mostrandoConflito) this.textInput.node.placeholder = "Qual é o problema/desafio que surge?";
    else if (mostrandoClimax) this.textInput.node.placeholder = "Como o herói enfrenta o momento mais difícil?";
    else if (mostrandoDesfecho) this.textInput.node.placeholder = "Como tudo termina? Qual é o final da história?";

    this.atualizarBotoesNavegacao();
  }

  atualizarBotoesNavegacao() {
    const hasPrev = this.capituloAtual > 1;
    const hasNext = this.capituloAtual < 4;

    this.botaoPrevious.setVisible(hasPrev);
    if (hasPrev) this.botaoPrevious.setInteractive({ useHandCursor: true });
    else this.botaoPrevious.disableInteractive();

    this.botaoNext.setVisible(hasNext);
    if (hasNext) this.botaoNext.setInteractive({ useHandCursor: true });
    else this.botaoNext.disableInteractive();
  }

  atualizarEstadoConcluir() {
    const tudoPreenchido = this.verificarTudoPreenchido();
    if (tudoPreenchido) {
      this.botaoConcluirAmarelo.setVisible(true).setInteractive({ useHandCursor: true });
      this.botaoConcluirCinza.setVisible(false).disableInteractive();
    } else {
      this.botaoConcluirAmarelo.setVisible(false).disableInteractive();
      this.botaoConcluirCinza.setVisible(true).setInteractive({ useHandCursor: true });
    }
  }

  verificarTudoPreenchido() {
    const t1 = (this.textosCapitulo[1] || "").trim();
    const t2 = (this.textosCapitulo[2] || "").trim();
    const t3 = (this.textosCapitulo[3] || "").trim();
    const t4 = (this.textosCapitulo[4] || "").trim();
    return t1 && t2 && t3 && t4;
  }

  mostrarModalConcluido() {
    this.modalAberto = true;

   
    if (this.textInput) {
      try {
        
        if (this.textInput.node) {
          this.textInput.node.blur();
        }
      } catch (_) {}
      this.textInput.destroy(); 
      this.textInput = null;
    }

    this.sound.play("acerto");

    
    const overlayDepth = 998;
    const blockerDepth = 999; 
    const modalDepth = 1000;
    const buttonDepth = 1001;

  
    this.overlayFinal = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, 0.75)
      .setOrigin(0, 0)
      .setDepth(overlayDepth);

   
    this.inputBlocker = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, 0)
      .setOrigin(0, 0)
      .setDepth(blockerDepth)
      .setInteractive(); 

    
    this.modalConcluidoSprite = this.add.image(960, 540, "modalConcluido").setDepth(modalDepth);

    const marca = ColorManager.getCurrentMarca(this);
    const colorsAzul = ColorManager.getColors(marca, ColorManager.BLUE);
    const colorsAmarelo = ColorManager.getColors(marca, ColorManager.YELLOW);

    this.btIniciarHistoriaFinal = new Button(this, { text: "INÍCIO", showIcon: false, colors: colorsAzul });
    this.btDownloadPDF = new Button(this, { text: "DOWNLOAD", showIcon: false, colors: colorsAmarelo });

    const gap = this.registry.get("modalButtonGap") !== undefined ? this.registry.get("modalButtonGap") : 60;
    const totalW = this.btIniciarHistoriaFinal.width + gap + this.btDownloadPDF.width;

    const baseYRegistry = this.registry.get("modalButtonsY");
    const baseY = baseYRegistry !== undefined ? this.registry.get("modalButtonsY") : this.modalConcluidoSprite.y + 200;

    const offsetXRegistry = this.registry.get("modalButtonsOffsetX");
    const offsetX = offsetXRegistry !== undefined ? offsetXRegistry : 0;

    const baseX = this.modalConcluidoSprite.x - totalW / 2 + offsetX - 130;

    this.btIniciarHistoriaFinal.x = baseX + this.btIniciarHistoriaFinal.width / 2;
    this.btIniciarHistoriaFinal.y = baseY;
    this.btIniciarHistoriaFinal.setDepth(buttonDepth);

    this.btDownloadPDF.x = this.btIniciarHistoriaFinal.x + this.btIniciarHistoriaFinal.width / 2 + gap + this.btDownloadPDF.width / 2;
    this.btDownloadPDF.y = baseY;
    this.btDownloadPDF.setDepth(buttonDepth);

    
    this._attachWorldClickZone(this.btIniciarHistoriaFinal);
    this._attachWorldClickZone(this.btDownloadPDF);

 
    this.btIniciarHistoriaFinal.on("buttonClick", () => {
      this.scene.start("Capa");
    });

    this.btDownloadPDF.on("buttonClick", async () => {
      try {
        await this.gerarPDFHistoria();
      } catch (e) {
        console.error("[DOWNLOAD] Erro ao gerar PDF:", e);
      }
    });
  }

 
  _attachWorldClickZone(btn) {
    if (btn._clickZone && !btn._clickZone.destroyed) {
      btn._clickZone.destroy();
      btn._clickZone = null;
    }

    const b = btn.getBounds();
    const zone = this.add
      .zone(b.centerX, b.centerY, b.width, b.height)
      .setOrigin(0.5, 0.5)
      .setDepth((btn.depth || 0) + 1)
      .setInteractive({ useHandCursor: true });

    zone.on("pointerdown", () => {
      if (typeof btn.emit === "function") btn.emit("buttonClick");
    });

    const sync = () => {
      if (!zone.scene || !btn.scene) return;
      const bb = btn.getBounds();
      zone.x = bb.centerX;
      zone.y = bb.centerY;
      zone.setSize(bb.width, bb.height);
    };
    this.events.on("postupdate", sync);
    btn.once("destroy", () => this.events.off("postupdate", sync));

    btn._clickZone = zone;
    this.children.bringToTop(zone);
  }

  async gerarPDFHistoria() {
    const jsPDFCtor = await this._ensureJsPDF();
    if (!jsPDFCtor) {
      console.error("[PDF] jsPDF não encontrado e não foi possível carregar.");
      return;
    }

    const doc = new jsPDFCtor({ unit: "pt", format: "a4", compress: true });

    const margin = 36;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const maxImgWidth = pageWidth - margin * 2;
    const maxImgHeight = pageHeight * 0.42;

    const gapAfterImage = 20;
    const gapAfterTitle = 20;
    const lineHeight = 18;

    const capitulos = [
      { titulo: "Introdução", texto: (this.textosCapitulo[1] || "").trim(), key: this.spriteIntroducaoKey },
      { titulo: "Conflito", texto: (this.textosCapitulo[2] || "").trim(), key: this.spriteConflitoKey },
      { titulo: "Clímax", texto: (this.textosCapitulo[3] || "").trim(), key: this.spriteClimaxKey },
      { titulo: "Desfecho", texto: (this.textosCapitulo[4] || "").trim(), key: this.spriteDesfechoKey },
    ];

    capitulos.forEach((cap, idx) => {
      if (idx > 0) doc.addPage();

      let currentY = margin;

      const imgInfo = this._getTextureDataUrlAndSize(cap.key);
      if (imgInfo && imgInfo.dataUrl) {
        const nW = imgInfo.width;
        const nH = imgInfo.height;
        const scale = Math.min(maxImgWidth / nW, maxImgHeight / nH, 1);
        const drawW = nW * scale;
        const drawH = nH * scale;
        const x = margin + (maxImgWidth - drawW) / 2;
        doc.addImage(imgInfo.dataUrl, "PNG", x, currentY, drawW, drawH);
        currentY += drawH + gapAfterImage;
      }

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`${cap.titulo}`, margin, currentY);
      currentY += gapAfterTitle;

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);

      const fullText = cap.texto || "";
      const textWidth = pageWidth - margin * 2;
      const lines = doc.splitTextToSize(fullText, textWidth);

      lines.forEach((line) => {
        if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, margin, currentY);
        currentY += lineHeight;
      });
    });

    const nomeArquivo = `historia-${this.heroiNome}-${this.desafioNome}-${this.localNome}.pdf`;
    doc.save(nomeArquivo);
  }

  async _ensureJsPDF() {
    let ctor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null;
    if (ctor) return ctor;
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
      s.async = true;
      s.onload = () => {
        const c = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null;
        resolve(c);
      };
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
  }

  _getTextureDataUrlAndSize(key) {
    const tex = this.textures.get(key);
    if (!tex) {
      console.warn(`[PDF] Texture não encontrada: ${key}`);
      return null;
    }
    try {
      const dataUrl = this.textures.getBase64(key);
      const src = tex.getSourceImage();
      return { dataUrl, width: src.width, height: src.height };
    } catch (e) {
      console.warn(`[PDF] Falha ao obter base64 de ${key}`, e);
      return null;
    }
  }

  getNomeHeroi(index) {
    switch (index) {
      case 0: return "rico";
      case 1: return "luna";
      case 2: return "teo";
      default: return "heroi";
    }
  }

  getNomeDesafio(index) {
    switch (index) {
      case 0: return "resgate";
      case 1: return "proteger";
      case 2: return "misterio";
      default: return "desafio";
    }
  }

  getNomeLocal(index) {
    switch (index) {
      case 0: return "floresta";
      case 1: return "cidade";
      case 2: return "planeta";
      default: return "lugar";
    }
  }
}

export default Game1;
