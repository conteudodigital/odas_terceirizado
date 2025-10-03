import { TextFrameHUD } from "../components/TextFrameHUD.js";
import SoundManager from "../managers/SoundManager.js";
import { Button } from "../components/Button.js";
import { ColorManager } from "../managers/ColorManager.js";

export class Narrador {
  /**
   * @param {Phaser.Scene} scene
   * @param {string[]} legendas
   * @param {string[]} narracoes - keys dos áudios; 1:1 com legendas
   * @param {Object|null} colors - estilo do botão "PULAR" (se usado)
   * @param {Function|null} onFinish - callback ao finalizar (ex.: métricas/cleanup)
   * @param {Object} personagens - { v1, v2 } para alternar retratos
   * @param {boolean} permitirPular
   * @param {string} textFrameKey - ex: "textframe-Ana"
   * @param {string|function(Object): (string|Object)|Object|null} navigateTo
   *   - String: key da cena
   *   - Function: (ctx) => string | { key, data?, transition? }
   *   - Object: { key, data?, transition? }
   *   transition: { duration?:number, moveAbove?:boolean, sleep?:boolean, allowInput?:boolean }
   * @param {Object} hudOptions - (NOVO) repassado ao TextFrameHUD
   *   - { prevConfig?, nextConfig?, avancarConfig? }
   *   - Ex.: { avancarConfig: { text: "FINALIZAR" } }
   */
  constructor(
    scene,
    legendas = [],
    narracoes = [],
    colors = null,
    onFinish = null,
    personagens = { v1: "personagem-ana-v1", v2: "personagem-ana-v2" },
    permitirPular = false,
    textFrameKey = "textframe-Ana",
    navigateTo = null,
    hudOptions = {}
  ) {
    this.scene = scene;
    this.legendas = legendas;
    this.narracoes = narracoes;
    this.colors = colors;
    this.currentIndex = 0;
    this.currentSound = null;
    this.onFinish = onFinish;
    this.personagens = personagens;
    this.permitirPular = permitirPular;
    this.textFrameKey = textFrameKey;

    // config de navegação
    this.navigateTo = navigateTo;

    // Key do SFX de clique (mesmo som do botão AVANÇAR).
    this.CLICK_SFX_KEY = "click";

    SoundManager.init(scene);

    const defaultHudOptions = {
      prevConfig: { key: "Botao-Previous" },
      nextConfig: { key: "Botao-Next" },
      avancarConfig: { text: "AVANÇAR" },
    };

    const mergedHudOptions = {
      ...defaultHudOptions,
      ...(hudOptions || {}),
      avancarConfig: {
        ...defaultHudOptions.avancarConfig,
        ...(hudOptions?.avancarConfig || {}),
      },
    };

    // HUD no rodapé, centralizado
    this.hud = new TextFrameHUD(
      scene,
      0,
      0,
      this.textFrameKey,
      0,
      mergedHudOptions
    );

    const frameH = this.hud.frame.height;
    this.hud.y = scene.scale.height - frameH - 25;
    this.hud.x = (scene.scale.width - this.hud.frame.width) / 2 - 70;

    // Handlers
    this.hud.onBack(this.previous.bind(this));
    this.hud.onNext(this.next.bind(this));
    this.hud.onAvancar(() => {
      try {
        if (this.onFinish) this.onFinish();
      } catch (e) {
        console.warn("[Narrador] onFinish falhou:", e);
      }

      const target = this._resolveNextScene();
      if (target && target.key) {
        const { key, data, transition } = target;
        if (transition) {
          this.scene.scene.transition({
            target: key,
            duration: transition.duration ?? 300,
            moveAbove: transition.moveAbove ?? false,
            sleep: transition.sleep ?? false,
            allowInput: transition.allowInput ?? true,
            data: data,
          });
        } else {
          this.scene.scene.start(key, data);
        }
      }
    });

    // Botão opcional "PULAR" (amarelo)
    if (this.permitirPular) {
      let pularColors = this.colors;
      if (!pularColors) {
        try {
          const marca = ColorManager.getCurrentMarca(this.scene);
          pularColors = ColorManager.getColors(marca, ColorManager.YELLOW);
        } catch (e) {
          pularColors = {
            background: 0xffd60a,
            border: 0x000000,
            text: 0x000000,
          };
        }
      }

      this.btPular = new Button(this.scene, {
        text: "PULAR",
        showIcon: false,
        colors: pularColors,
      });
      this.scene.add.existing(this.btPular);

      const pad = 100;
      const b = this.btPular.getBounds();
      this.btPular.x = this.scene.scale.width - b.width - pad;
      this.btPular.y = 40;
      this.btPular.setScrollFactor(0);
      this.btPular.setDepth(9999);
      this.btPular.on("buttonClick", this.skip.bind(this));
    }

    // Estado inicial
    this._updateNavState();
    this._playCurrent();
  }

  /** Permite ajustar/definir a navegação depois de instanciar */
  setNavigateTo(navigateTo) {
    this.navigateTo = navigateTo;
    return this;
  }

  /** (Opcional) Trocar o texto do botão AVANÇAR em runtime */
  setAvancarText(novoTexto = "AVANÇAR") {
    // Se o TextFrameHUD tiver um setter específico, use-o:
    if (typeof this.hud.setAvancarText === "function") {
      this.hud.setAvancarText(novoTexto);
      return this;
    }
    // fallback comum
    if (this.hud.avancarButton?.setText) {
      this.hud.avancarButton.setText(novoTexto);
    }
    return this;
  }

  // --- Navegação ---
  previous() {
    if (this.currentIndex <= 0) return;
    SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);
    this._stopCurrentSound();
    this.currentIndex -= 1;
    this._playCurrent();
  }

  next() {
    if (this.currentIndex >= this.legendas.length - 1) {
      SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);
      this._finishSequence();
      return;
    }
    SoundManager.play(this.CLICK_SFX_KEY, 1.0, false);
    this._stopCurrentSound();
    this.currentIndex += 1;
    this._playCurrent();
  }

  skip() {
    this._stopCurrentSound();
    this._finishSequence();
  }

  // --- Reprodução ---
  _playCurrent() {
    if (this.currentIndex >= this.legendas.length) {
      this._finishSequence();
      return;
    }

    // Legenda
    this.hud.setText(this.legendas[this.currentIndex]);

    // Personagem
    const tex =
      this.currentIndex % 2 === 1 ? this.personagens.v1 : this.personagens.v2;
    if (tex) {
      this.hud.setPersonagemTexture(tex).showPersonagem(true);
    } else {
      this.hud.showPersonagem(false);
    }

    // Áudio
    this._stopCurrentSound();
    const key = this.narracoes?.[this.currentIndex];
    if (key) {
      this._onCompleteCallback = () => this._onSoundComplete();
      this.currentSound = SoundManager.play(
        key,
        1.0,
        false,
        this._onCompleteCallback
      );
    } else {
      this.currentSound = null;
    }

    this._updateNavState();
  }

  _onSoundComplete() {
    if (this.currentIndex < this.legendas.length - 1) {
      this.currentIndex += 1;
      this._playCurrent();
    } else {
      this._finishSequence();
    }
  }

  _finishSequence() {
    this._stopCurrentSound();
    this.hud.showNav(false);
    this.hud.showAvancar(true);
  }

  _stopCurrentSound() {
    if (this.currentSound) {
      this.currentSound.off?.("complete", this._onCompleteCallback);
      SoundManager.stop(this.currentSound);
      this.currentSound = null;
    }
  }

  _updateNavState() {
    const inSequence = this.currentIndex < this.legendas.length;
    this.hud.showNav(inSequence);
    this.hud.showAvancar(false);
    this.hud.setBackEnabled(this.currentIndex > 0);
  }

  /** Resolve a próxima cena com base em this.navigateTo */
  _resolveNextScene() {
    if (!this.navigateTo) return null;

    const ctx = {
      index: this.currentIndex,
      total: this.legendas?.length ?? 0,
      scene: this.scene,
      hud: this.hud,
      state: this.state,
    };

    if (typeof this.navigateTo === "function") {
      const res = this.navigateTo(ctx);
      if (!res) return null;
      if (typeof res === "string") return { key: res };
      return res; // { key, data?, transition? }
    }

    if (typeof this.navigateTo === "string") {
      return { key: this.navigateTo };
    }

    return this.navigateTo; // objeto já no formato esperado
  }

  destroy() {
    this._stopCurrentSound();
    this.hud.destroy();
    if (this.btPular) this.btPular.destroy();
  }
}
