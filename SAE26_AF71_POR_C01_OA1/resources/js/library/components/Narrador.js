import { TextFrameHUD } from "../components/TextFrameHUD.js";
import SoundManager from "../managers/SoundManager.js";
import { Button } from "../components/Button.js";
import { ColorManager } from "../managers/ColorManager.js";

export class Narrador {
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
    this.navigateTo = navigateTo;

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
            data,
          });
        } else {
          this.scene.scene.start(key, data);
        }
      }
    });

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

    this._applyUIState();
    this._playCurrent();
  }

  setNavigateTo(navigateTo) {
    this.navigateTo = navigateTo;
    return this;
  }

  setAvancarText(novoTexto = "AVANÇAR") {
    if (typeof this.hud.setAvancarText === "function") {
      this.hud.setAvancarText(novoTexto);
      return this;
    }
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
    if (this.currentIndex >= this.legendas.length - 1) return;
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
    if (this.currentIndex >= (this.legendas?.length ?? 0)) {
      this._finishSequence();
      return;
    }

    this.hud.setText(this.legendas[this.currentIndex]);

    const tex =
      this.currentIndex % 2 === 1 ? this.personagens.v1 : this.personagens.v2;
    if (tex) {
      this.hud.setPersonagemTexture(tex).showPersonagem(true);
    } else {
      this.hud.showPersonagem(false);
    }

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

    this._applyUIState();
  }

  _onSoundComplete() {
    if (this.currentIndex < this.legendas.length - 1) {
      this.currentIndex += 1;
      this._playCurrent();
    } else {
      this._applyUIState();
    }
  }

  _finishSequence() {
    this._stopCurrentSound();
    this.hud.showNav(true);
    this.hud.showAvancar(true);
    this._forceHideNext();
    const total = this.legendas?.length ?? 0;
    if (total <= 1) {
      this._forceHideBack();     // <-- esconder Previous quando só há 1 diálogo
    } else {
      this.hud.setBackEnabled?.(true);
      this._forceShowBack();
    }
  }

  _stopCurrentSound() {
    if (this.currentSound) {
      this.currentSound.off?.("complete", this._onCompleteCallback);
      SoundManager.stop(this.currentSound);
      this.currentSound = null;
    }
  }

  // Helpers robustos para controlar o botão Next em qualquer implementação
  _forceHideNext() {
    this.hud.showNext?.(false);
    this.hud.setNextEnabled?.(false);

    const cand =
      this.hud.nextButton ||
      this.hud.btNext ||
      this.hud.rightButton ||
      this.hud.navNext ||
      this.hud?.buttons?.next ||
      null;

    if (cand) {
      cand.setVisible?.(false);
      cand.disableInteractive?.();
      cand.setActive?.(false);
      if (cand.list?.length) {
        cand.list.forEach(ch => {
          ch.setVisible?.(false);
          ch.disableInteractive?.();
          ch.setActive?.(false);
        });
      }
      cand.setAlpha?.(0);
    }
  }

  _forceShowNext() {
    this.hud.showNext?.(true);
    this.hud.setNextEnabled?.(true);

    const cand =
      this.hud.nextButton ||
      this.hud.btNext ||
      this.hud.rightButton ||
      this.hud.navNext ||
      this.hud?.buttons?.next ||
      null;

    if (cand) {
      cand.setVisible?.(true);
      cand.setActive?.(true);
      cand.setAlpha?.(1);
      cand.setInteractive?.();
      if (cand.list?.length) {
        cand.list.forEach(ch => {
          ch.setVisible?.(true);
          ch.setActive?.(true);
          ch.setAlpha?.(1);
          ch.setInteractive?.();
        });
      }
    }
  }

  // Helpers para o botão Previous/Left
  _forceHideBack() {
    this.hud.showBack?.(false);
    this.hud.setBackEnabled?.(false);

    const cand =
      this.hud.backButton ||
      this.hud.btBack ||
      this.hud.leftButton ||
      this.hud.navBack ||
      this.hud?.buttons?.prev ||
      null;

    if (cand) {
      cand.setVisible?.(false);
      cand.disableInteractive?.();
      cand.setActive?.(false);
      if (cand.list?.length) {
        cand.list.forEach(ch => {
          ch.setVisible?.(false);
          ch.disableInteractive?.();
          ch.setActive?.(false);
        });
      }
      cand.setAlpha?.(0);
    }
  }

  _forceShowBack() {
    this.hud.showBack?.(true);
    this.hud.setBackEnabled?.(true);

    const cand =
      this.hud.backButton ||
      this.hud.btBack ||
      this.hud.leftButton ||
      this.hud.navBack ||
      this.hud?.buttons?.prev ||
      null;

    if (cand) {
      cand.setVisible?.(true);
      cand.setActive?.(true);
      cand.setAlpha?.(1);
      cand.setInteractive?.();
      if (cand.list?.length) {
        cand.list.forEach(ch => {
          ch.setVisible?.(true);
          ch.setActive?.(true);
          ch.setAlpha?.(1);
          ch.setInteractive?.();
        });
      }
    }
  }

  _applyUIState() {
    const total = this.legendas?.length ?? 0;
    const isLast = total > 0 && this.currentIndex === total - 1;
    const hasPrev = this.currentIndex > 0;

    if (total <= 1) {
      // Uma única legenda: só CONTINUAR; esconder Next e Previous
      this.hud.showNav(true);
      this.hud.showAvancar(true);
      this._forceHideNext();
      this._forceHideBack();     // <-- esconder Previous de fato
      return;
    }

    if (isLast) {
      // Último diálogo (em sequências >1): CONTINUAR + LEFT; Next oculto
      this.hud.showNav(true);
      this.hud.showAvancar(true);
      this._forceHideNext();
      this._forceShowBack();
    } else {
      // Intermediários: LEFT + NEXT; CONTINUAR oculto
      this.hud.showNav(true);
      this.hud.showAvancar(false);
      this._forceShowNext();
      if (hasPrev) this._forceShowBack();
      else this._forceHideBack();
    }
  }

  _updateNavState() {
    this._applyUIState();
  }

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
      return res;
    }

    if (typeof this.navigateTo === "string") {
      return { key: this.navigateTo };
    }

    return this.navigateTo;
  }

  destroy() {
    this._stopCurrentSound();
    this.hud.destroy();
    if (this.btPular) this.btPular.destroy();
  }
}
