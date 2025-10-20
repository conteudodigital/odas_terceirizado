import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game2 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game2");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.forceLevel = 0;
    this.aimAngleDeg = 0;
    this.isShooting = false;
    this.hasHitTarget = false;
    this.forceSlots = [];

    this.repositionMode = false;
    this.repositionCountdown = 0;
    this.repositionTimerEvt = null;

    this.aim = null;
    this.btnAimUp = null;
    this.btnAimDown = null;
    this.areaBolinha = null;
    this.btPronto = null;
    this.btRepos = null;
    this.triangleArea = null;
    this.wall = null;

    this.bolinha = null;
    this.atvBalls = [];
    this.atvGroup = null;

    this.stars = [];
    this.earnedStars = 0;
    this.lastShownStars = 0;

    this.feedbackOK = null;
    this.feedbackShown = false;
    this.feedbackTimer = null;

    this.ballSpinTween = null;

    this.DEPTH = {
      BG: -9999,
      TRIANGLE: 250,
      FORCE: 100,
      AIM: 300,
      AREA_BOLINHA: 200,
      ATVBALL: 301,
      BALL: 302,
      STARS: 380,
      UI: 400,
      FEEDBACK: 500,
    };

    this.LAYOUT = {
      BG_KEY: "game2_bg",

      LAUNCHER: { x: 660, y: 640, scale: 1.0 },
      AREA_BOLINHA: { x: 660, y: 640, scale: 1.0, key: "area_bolinha" },

      AIM: { x: 825, y: 649, rotationDeg: 0, scale: 1.0 },
      AIM_BTN_UP: { x: 665, y: 400 },
      AIM_BTN_DOWN: { x: 665, y: 890 },
      AIM_FIRE_OFFSET: 52,

      WALL: {
        x: 925,
        width: 8,
        debug: false,
        color: 0x00ff00,
        alpha: 0,
      },

      FORCE_SLOTS: [
        { level: 1, x: 464, y: 636, scale: 1.0 },
        { level: 2, x: 310, y: 636, scale: 1.0 },
        { level: 3, x: 160, y: 636, scale: 1.0 },
      ],

      BTN_READY: {
        x: 75,
        y: 897,
        centerXToBG: false,
        palette: ColorManager.BLUE,
        text: "PRONTO",
        showIcon: false,
      },

      BTN_REPOS: {
        x: 75,
        y: 897,
        centerXToBG: false,
        palette: ColorManager.BLUE,
        text: "REPOSICIONAR      ",
        showIcon: false,
      },

      STARS: {
        key: "estrela_bolinha",
        lockedAlpha: 0,
        items: [
          { x: 1845, y: 75, scale: 1.0 },
          { x: 1756, y: 75, scale: 1.0 },
          { x: 1669, y: 75, scale: 1.0 },
        ],
      },

      TRIANGLE_AREA: {
        key: "triangulo_area_atv1",
        x: 1460,
        y: 565,
        scale: 1.0,
        rotationDeg: 0,
      },

      TRIANGLE_INSIDE: {
        a: { x: 1460, y: 250 },
        b: { x: 1825, y: 875 },
        c: { x: 1100, y: 875 },
      },

      ATVBALLS: [
        { key: "bolinha_laranja", x: 1460, y: 450, scale: 1.0 },
        { key: "bolinha_rosa", x: 1300, y: 750, scale: 1.0 },
        { key: "bolinha_verde", x: 1620, y: 750, scale: 1.0 },
      ],

      AIM_STEP_DEG: 7,
      AIM_MIN_DEG: -35,
      AIM_MAX_DEG: 35,

      BALL_SCALE: 0.9,

      FEEDBACK: {
        key: "feedback-acerto",
        x: 1460,
        y: 625,
        scale: 0.9,
        delayMs: 3000,
        sfxKey: "acerto",
        sfxVolume: 1.0,
      },

      NEXT_SCENE: {
        key: "Game3",
        delayAfterMs: 3000,
      },
    };

    this.FORCE_LEVELS = {
      1: { name: "fraco", power: 400 },
      2: { name: "medio", power: 600 },
      3: { name: "forte", power: 900 },
    };

    this.TARGET_STOP_SPEED = 20;
  }

  init(data) {
    if (data && data.bolinhaSelecionada) {
      this.registry.set("bolinhaSelecionada", data.bolinhaSelecionada);
    }
  }

  create() {
    this.physics.world.setBounds(
      0,
      0,
      this.game.config.width,
      this.game.config.height
    );

    const bg = this.add.image(0, 0, this.LAYOUT.BG_KEY).setOrigin(0, 0);
    bg.setDepth(this.DEPTH.BG);

    const keysByLevel = {
      1: { vazia: "forca1_vazia", cheia: "forca1_cheia" },
      2: { vazia: "forca2_vazia", cheia: "forca2_cheia" },
      3: { vazia: "forca3_vazia", cheia: "forca3_cheia" },
    };
    this.LAYOUT.FORCE_SLOTS.forEach((cfg) => {
      const k = keysByLevel[cfg.level];
      const slot = this.add
        .image(cfg.x, cfg.y, k.vazia)
        .setOrigin(0.5)
        .setScale(cfg.scale ?? 1)
        .setInteractive({ useHandCursor: true })
        .setDepth(this.DEPTH.FORCE);
      slot.__level = cfg.level;
      slot.__keys = k;
      slot.on("pointerdown", () => {
        this.forceLevel = slot.__level;
        this._refreshForceUI();
      });
      this.forceSlots.push(slot);
    });

    this.areaBolinha = this.add
      .image(
        this.LAYOUT.AREA_BOLINHA.x,
        this.LAYOUT.AREA_BOLINHA.y,
        this.LAYOUT.AREA_BOLINHA.key
      )
      .setOrigin(0.5)
      .setScale(this.LAYOUT.AREA_BOLINHA.scale)
      .setDepth(this.DEPTH.AREA_BOLINHA);

    const bolinhaKey =
      this.registry.get("bolinhaSelecionada") || "bolinha_azul";
    this.bolinha = this.physics.add
      .image(this.LAYOUT.AREA_BOLINHA.x, this.LAYOUT.AREA_BOLINHA.y, bolinhaKey)
      .setOrigin(0.5)
      .setScale(this.LAYOUT.BALL_SCALE)
      .setDepth(this.DEPTH.BALL);

    this.bolinha.setCircle(this.bolinha.width * 0.5, 0, 0);
    this.bolinha.setBounce(0.7);
    this.bolinha.setDamping(true);
    this.bolinha.setDrag(0.992);
    this.bolinha.setCollideWorldBounds(true);

    this.bolinha.setMass(4);

    this.aim = this.add
      .image(this.LAYOUT.AIM.x, this.LAYOUT.AIM.y, "mira")
      .setOrigin(0.0, 0.5)
      .setScale(this.LAYOUT.AIM.scale)
      .setRotation(Phaser.Math.DegToRad(this.LAYOUT.AIM.rotationDeg))
      .setDepth(this.DEPTH.AIM);

    this.btnAimUp = this.add
      .image(this.LAYOUT.AIM_BTN_UP.x, this.LAYOUT.AIM_BTN_UP.y, "mira_cima")
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(this.DEPTH.UI);
    this.btnAimDown = this.add
      .image(
        this.LAYOUT.AIM_BTN_DOWN.x,
        this.LAYOUT.AIM_BTN_DOWN.y,
        "mira_baixo"
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setDepth(this.DEPTH.UI);
    this.btnAimUp.on("pointerdown", () =>
      this._setAimAngle(this.aimAngleDeg - this.LAYOUT.AIM_STEP_DEG)
    );
    this.btnAimDown.on("pointerdown", () =>
      this._setAimAngle(this.aimAngleDeg + this.LAYOUT.AIM_STEP_DEG)
    );

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, this.LAYOUT.BTN_READY.palette);

    this.btPronto = new Button(this, {
      text: this.LAYOUT.BTN_READY.text,
      showIcon: this.LAYOUT.BTN_READY.showIcon,
      colors,
    });
    this.btPronto.setDepth(this.DEPTH.UI);
    this.btPronto.x = this.LAYOUT.BTN_READY.centerXToBG
      ? bg.x + (bg.width - this.btPronto.width) / 2
      : this.LAYOUT.BTN_READY.x;
    this.btPronto.y = this.LAYOUT.BTN_READY.y;
    this.btPronto.on("buttonClick", () => this._shoot());

    this.btRepos = new Button(this, {
      text: this.LAYOUT.BTN_REPOS.text,
      showIcon: this.LAYOUT.BTN_REPOS.showIcon,
      colors,
    });
    this.btRepos.setDepth(this.DEPTH.UI);
    this.btRepos.x = this.btPronto.x;
    this.btRepos.y = this.btPronto.y;
    this.btRepos.on("buttonClick", () => {
      if (this.repositionMode) this._resetShooter();
    });

    const tri = this.LAYOUT.TRIANGLE_AREA;
    this.triangleArea = this.add
      .image(tri.x, tri.y, tri.key)
      .setOrigin(0.5)
      .setScale(tri.scale ?? 1)
      .setRotation(Phaser.Math.DegToRad(tri.rotationDeg ?? 0))
      .setDepth(this.DEPTH.TRIANGLE);

    this.atvGroup = this.physics.add.group();
    this.atvBalls = this.LAYOUT.ATVBALLS.map((b, idx) => {
      const go = this.physics.add
        .image(b.x, b.y, b.key)
        .setOrigin(0.5)
        .setScale(b.scale ?? 1)
        .setDepth(this.DEPTH.ATVBALL);
      go.setCircle(go.width * 0.5, 0, 0);
      go.setBounce(0.7);
      go.setDamping(true);
      go.setDrag(0.991);
      go.setCollideWorldBounds(true);
      go.setMass(0.5);
      go.setData("removed", false);
      go.setData("index", idx);
      this.atvGroup.add(go);
      return go;
    });

    const wh = this.scale.height;
    const wCfg = this.LAYOUT.WALL;
    const wallGizmo = this.add.rectangle(
      wCfg.x,
      wh / 2,
      wCfg.width,
      wh,
      wCfg.color,
      wCfg.alpha
    );
    wallGizmo.setDepth(this.DEPTH.AIM);
    this.physics.add.existing(wallGizmo, true);
    this.wall = wallGizmo;
    this._setWallActive(false);

    this.physics.add.collider(
      this.bolinha,
      this.atvGroup,
      (proj, tgt) =>
        this._resolveBallBall(proj, tgt, {
          restitution: 0.9,
          minKick: 110,
          posFix: 0.6,
          markHit: true,
          boostForA: 1.25,
        }),
      null,
      this
    );
    this.physics.add.collider(this.bolinha, this.wall);
    this.physics.add.collider(
      this.atvGroup,
      this.atvGroup,
      (a, b) =>
        this._resolveBallBall(a, b, {
          restitution: 0.65,
          minKick: 50,
          posFix: 0.5,
        }),
      null,
      this
    );

    this._createStars();

    const fcfg = this.LAYOUT.FEEDBACK;
    this.feedbackOK = this.add
      .image(fcfg.x, fcfg.y, fcfg.key)
      .setOrigin(0.5)
      .setScale(fcfg.scale ?? 1)
      .setDepth(this.DEPTH.FEEDBACK)
      .setVisible(false)
      .setAlpha(0);

    this._setAimAngle(this.LAYOUT.AIM.rotationDeg);
    this._refreshForceUI();
    this._showReadyUI();

    super.create();
  }

  update() {
    this._checkTriangleRemovals();

    if (this.isShooting && !this.wall.body.enable) {
      const rightOfWall =
        this.bolinha.x >= this.wall.x + this.LAYOUT.WALL.width * 0.5;
      if (rightOfWall) this._setWallActive(true);
    }

    if (this.isShooting && this.hasHitTarget && this._allTargetsStopped()) {
      this._resetShooter();
    }
  }

  _setWallActive(active) {
    if (!this.wall || !this.wall.body) return;
    this.wall.body.enable = active;
    this.wall.body.checkCollision.none = !active;
  }

  _allTargetsStopped() {
    return this.atvBalls.every((b) => {
      if (b.getData("removed")) return true;
      if (!b.body) return true;
      return b.body.velocity.length() < this.TARGET_STOP_SPEED;
    });
  }

  _resolveBallBall(a, b, opts = {}) {
    const restitution = opts.restitution ?? 0.7;
    const minKick = opts.minKick ?? 50;
    const posFix = opts.posFix ?? 0.5;
    const boostForA = opts.boostForA ?? 1;

    const nx = b.x - a.x;
    const ny = b.y - a.y;
    let dist = Math.hypot(nx, ny);
    const ux = dist ? nx / dist : 1;
    const uy = dist ? ny / dist : 0;

    const ra =
      a.body && a.body.width ? a.body.width * 0.5 : a.displayWidth * 0.5;
    const rb =
      b.body && b.body.width ? b.body.width * 0.5 : b.displayWidth * 0.5;

    const rvx = a.body.velocity.x - b.body.velocity.x;
    const rvy = a.body.velocity.y - b.body.velocity.y;
    let rel = rvx * ux + rvy * uy;

    if (rel > -minKick) rel = -minKick;

    const ma = a.body.mass || 1;
    const mb = b.body.mass || 1;
    const j = (boostForA * (-(1 + restitution) * rel)) / (1 / ma + 1 / mb);

    a.setVelocity(
      a.body.velocity.x - (j / ma) * ux,
      a.body.velocity.y - (j / ma) * uy
    );
    b.setVelocity(
      b.body.velocity.x + (j / mb) * ux,
      b.body.velocity.y + (j / mb) * uy
    );

    dist = Math.max(dist, 0.0001);
    const penetration = Math.max(0, ra + rb - dist);
    if (penetration > 0) {
      const corr = penetration * posFix;
      a.x -= ux * (corr * (mb / (ma + mb)));
      a.y -= uy * (corr * (mb / (ma + mb)));
      b.x += ux * (corr * (ma / (ma + mb)));
      b.y += uy * (corr * (ma / (ma + mb)));
      a.body.updateFromGameObject();
      b.body.updateFromGameObject();
    }

    if (opts.markHit) this.hasHitTarget = true;
  }

  _showReadyUI() {
    this.repositionMode = false;
    if (this.repositionTimerEvt) {
      this.repositionTimerEvt.remove(false);
      this.repositionTimerEvt = null;
    }
    this.btPronto.setVisible(true);
    this.btRepos.setVisible(false);
    this._setButtonText(this.btRepos, "REPOSICIONAR");
  }

  _showReposUI(seconds = 5) {
    this.repositionMode = true;
    this.repositionCountdown = seconds;
    this.btPronto.setVisible(false);
    this.btRepos.setVisible(true);
    this._updateReposText();

    if (this.repositionTimerEvt) this.repositionTimerEvt.remove(false);
    this.repositionTimerEvt = this.time.addEvent({
      delay: 1000,
      repeat: seconds - 1,
      callback: () => {
        if (!this.repositionMode) return;
        this.repositionCountdown -= 1;
        this._updateReposText();
        if (this.repositionCountdown <= 0) {
          this._resetShooter();
        }
      },
    });
  }

  _updateReposText() {
    this._setButtonText(
      this.btRepos,
      `REPOSICIONAR (${this.repositionCountdown}s)`
    );
  }

  _setButtonText(btn, text) {
    if (!btn) return;
    if (typeof btn.setText === "function") btn.setText(text);
    else if (btn.textObj && btn.textObj.setText) btn.textObj.setText(text);
  }

  _startBallSpin() {
    this._stopBallSpin();

    this.ballSpinTween = this.tweens.add({
      targets: this.bolinha,
      angle: "+=360",
      duration: 450,
      ease: "Linear",
      repeat: -1,
    });
  }

  _stopBallSpin() {
    if (this.ballSpinTween) {
      this.ballSpinTween.stop();
      this.ballSpinTween.remove();
      this.ballSpinTween = null;
    }
    if (this.bolinha) {
      this.bolinha.angle = Phaser.Math.Wrap(this.bolinha.angle, 0, 360);
    }
  }

  _shoot() {
    if (this.isShooting) return;
    if (this.forceLevel <= 0) return;

    this._setWallActive(false);

    const angleRad = Phaser.Math.DegToRad(this.aimAngleDeg);
    const startX =
      this.LAYOUT.AIM.x + Math.cos(angleRad) * this.LAYOUT.AIM_FIRE_OFFSET;
    const startY =
      this.LAYOUT.AIM.y + Math.sin(angleRad) * this.LAYOUT.AIM_FIRE_OFFSET;

    this.bolinha.setPosition(startX, startY);
    this.bolinha.setVelocity(0, 0);

    const power = this.getCurrentForcePower();
    const vx = Math.cos(angleRad) * power;
    const vy = Math.sin(angleRad) * power;

    this.bolinha.setVelocity(vx, vy);
    this.isShooting = true;
    this.hasHitTarget = false;

    this._startBallSpin();

    this._showReposUI(5);
  }

  _resetShooter() {
    this.isShooting = false;
    this.hasHitTarget = false;

    this._stopBallSpin();

    this.bolinha.setVelocity(0, 0);
    this.bolinha.setPosition(
      this.LAYOUT.AREA_BOLINHA.x,
      this.LAYOUT.AREA_BOLINHA.y
    );
    this._setWallActive(false);

    this._showReadyUI();
  }

  _checkTriangleRemovals() {
    const { a, b, c } = this.LAYOUT.TRIANGLE_INSIDE;
    let newlyRemoved = 0;

    this.atvBalls.forEach((ball) => {
      if (ball.getData("removed")) return;
      const inside = this._pointInTriangle({ x: ball.x, y: ball.y }, a, b, c);
      if (!inside) {
        ball.setData("removed", true);
        newlyRemoved += 1;

        this.time.delayedCall(
          3000,
          () => {
            if (!ball || !ball.active) return;
            if (ball.body) ball.disableBody(true, true);
            else ball.setActive(false).setVisible(false);
          },
          null,
          this
        );
      }
    });

    if (newlyRemoved > 0) {
      this.earnedStars = Phaser.Math.Clamp(
        this.earnedStars + newlyRemoved,
        0,
        3
      );
      this._refreshStars();

      if (this.earnedStars === 3 && !this.feedbackShown) {
        const delay = this.LAYOUT.FEEDBACK.delayMs ?? 3000;
        if (this.feedbackTimer) this.feedbackTimer.remove(false);
        this.feedbackTimer = this.time.delayedCall(delay, () => {
          this._showFeedbackOK();
        });
      }
    }
  }

  _showFeedbackOK() {
    if (this.feedbackShown || !this.feedbackOK) return;
    this.feedbackShown = true;

    const fcfg = this.LAYOUT.FEEDBACK;
    if (this.sound && fcfg.sfxKey) {
      this.sound.play(fcfg.sfxKey, {
        volume: fcfg.sfxVolume ?? 1.0,
      });
    }

    this.feedbackOK.setVisible(true);
    this.tweens.add({
      targets: this.feedbackOK,
      alpha: 1,
      scale: (this.LAYOUT.FEEDBACK.scale ?? 1) * 1.08,
      duration: 520,
      ease: "Quad.easeOut",
      yoyo: true,
      onComplete: () => {
        const nextCfg = this.LAYOUT.NEXT_SCENE || {};
        const waitMs = nextCfg.delayAfterMs ?? 3000;
        this.time.delayedCall(waitMs, () => this._goToNextScene());
      },
    });
  }

  _goToNextScene() {
    const nextCfg = this.LAYOUT.NEXT_SCENE || {};
    const key = nextCfg.key || this.LAYOUT.NEXT_SCENE_KEY || "Game3";

    this.scene.start(key);
  }

  _pointInTriangle(p, a, b, c) {
    const area = (v1, v2, v3) =>
      (v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y)) / 2;
    const A = Math.abs(area(a, b, c));
    const A1 = Math.abs(area(p, b, c));
    const A2 = Math.abs(area(a, p, c));
    const A3 = Math.abs(area(a, b, p));
    return Math.abs(A - (A1 + A2 + A3)) < 1.0;
  }

  _setAimAngle(newDeg) {
    const clamped = Phaser.Math.Clamp(
      newDeg,
      this.LAYOUT.AIM_MIN_DEG || -35,
      this.LAYOUT.AIM_MAX_DEG || 35
    );
    this.aimAngleDeg = clamped;
    if (this.aim) this.aim.setRotation(Phaser.Math.DegToRad(clamped));
  }

  _refreshForceUI() {
    this.forceSlots.forEach((slot) => {
      const filled = this.forceLevel > 0 && slot.__level <= this.forceLevel;
      slot.setTexture(filled ? slot.__keys.cheia : slot.__keys.vazia);
      slot.setDepth(this.DEPTH.FORCE);
    });
  }

  _createStars() {
    const cfg = this.LAYOUT.STARS;
    this.stars = cfg.items.map((pos) => {
      const s = this.add
        .image(pos.x, pos.y, cfg.key)
        .setOrigin(0.5)
        .setScale(pos.scale ?? 1)
        .setDepth(this.DEPTH.STARS);
      s.setAlpha(cfg.lockedAlpha);
      return s;
    });
    this.lastShownStars = 0;
    this._refreshStars();
  }

  _refreshStars() {
    const cfg = this.LAYOUT.STARS;

    this.stars.forEach((s, i) => {
      s.setAlpha(i < this.earnedStars ? 1 : cfg.lockedAlpha);
    });

    if (this.earnedStars > this.lastShownStars) {
      for (let i = this.lastShownStars; i < this.earnedStars; i++) {
        const star = this.stars[i];
        if (!star) continue;
        this.tweens.add({
          targets: star,
          scale: (star.scale || 1) * 1.15,
          duration: 120,
          yoyo: true,
          ease: "Quad.easeOut",
        });
      }
    }

    this.lastShownStars = this.earnedStars;
  }

  getCurrentForcePower() {
    const conf = this.FORCE_LEVELS[this.forceLevel];
    return conf ? conf.power : 0;
  }
}

export default Game2;
