import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game6 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game6");
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
    this.btRestart = null;
    this.wall = null;

    this.bolinha = null;
    this.atvBalls = [];
    this.atvGroup = null;

    this.pockets = [];
    this.ballToPocket = [];

    this.colBallWall = null;
    this.colTargetsWall = null;

    this.stars = [];
    this.earnedStars = 0;
    this.lastShownStars = 0;

    this.feedbackOK = null;
    this.feedbackShown = false;
    this.feedbackTimer = null;

    this.modalBackdrop = null;
    this.modalSprite = null;
    this.btnInicio = null;
    this.modalTimer = null;

    this.ballSpinTween = null;

    this.DEPTH = {
      BG: -9999,
      FORCE: 100,
      AREA_BOLINHA: 200,
      POCKET: 240,
      AIM: 300,
      ATVBALL: 301,
      BALL: 302,
      STARS: 380,
      UI: 400,
      FEEDBACK: 20000,
      MODAL_BACKDROP: 20005,
      MODAL: 20010,
      MODAL_UI: 20020,
    };

    this.LAYOUT = {
      BG_KEY: "game4_bg",

      LAUNCHER: { x: 660, y: 640, scale: 1.0 },
      AREA_BOLINHA: { x: 660, y: 640, scale: 1.0, key: "area_bolinha" },

      AIM: { x: 825, y: 649, rotationDeg: 0, scale: 1.0 },
      AIM_BTN_UP: { x: 665, y: 400 },
      AIM_BTN_DOWN: { x: 665, y: 890 },
      AIM_FIRE_OFFSET: 52,

      WALL: { x: 925, width: 8, debug: false, color: 0x00ff00, alpha: 0 },

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
      BTN_RESTART: {
        x: 1015,
        y: 40,
        centerXToBG: false,
        palette: ColorManager.BLUE,
        text: "REINICIAR",
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

      ATVBALLS: [
        { key: "bolinha_laranja", x: 1525, y: 842, scale: 1.0 },
        { key: "bolinha_rosa", x: 1525, y: 597, scale: 1.0 },
        { key: "bolinha_verde", x: 1525, y: 350, scale: 1.0 },
      ],
      POCKETS: [
        { key: "buraco_modelo", x: 1753, y: 932, scale: 1.0 },
        { key: "buraco_modelo", x: 1753, y: 595, scale: 1.0 },
        { key: "buraco_modelo", x: 1753, y: 256, scale: 1.0 },
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

      MODAL: {
        key: "modal_feedback_finalizacao",
        x: 960,
        y: 540,
        scale: 1.0,
        showDelayMs: 2000,
        backdropColor: 0x000000,
        backdropAlpha: 0.6,

        BTN_INICIO: {
          text: "INÍCIO",
          x: 850,
          y: 740,
          centerXToBG: false,
          palette: ColorManager.BLUE,
          showIcon: false,
        },

        sfxKey: null,
        sfxVolume: 1.0,
      },

      NEXT_SCENE: { key: "Game5", delayAfterMs: 3000 },
    };

    this.FORCE_LEVELS = {
      1: { name: "fraco", power: 400 },
      2: { name: "medio", power: 600 },
      3: { name: "forte", power: 900 },
    };

    this.PHYSICS = {
      ATTRACT_RADIUS: 160,
      CAPTURE_RADIUS: 46,
      ATTRACT_FORCE: 1200,
      ATTRACT_CURVE_EXP: 1.35,
      MAX_ATTRACT_SPEED: 360,
      SINK_DURATION: 280,
      SINK_SCALE_MULT: 0.55,
      PULL_SHOOTER: false,

      SHOT_DECEL_MULT_PER_SEC: 0.85,
      MIN_SPEED_TO_STOP: 18,

      RESET_FORCE_ON_RESTART: false,
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
      showIcon: this.LAYOUT.BTN_REPOS.showIcon,
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

    this.btRestart = new Button(this, {
      text: this.LAYOUT.BTN_RESTART.text,
      showIcon: this.LAYOUT.BTN_RESTART.showIcon,
      colors,
    });
    this.btRestart.setDepth(this.DEPTH.UI);
    this.btRestart.x = this.LAYOUT.BTN_RESTART.centerXToBG
      ? bg.x + (bg.width - this.btRestart.width) / 2
      : this.LAYOUT.BTN_RESTART.x;
    this.btRestart.y = this.LAYOUT.BTN_RESTART.y;
    this.btRestart.on("buttonClick", () => this._restartGame());

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
      go.setDrag(0.997);
      go.setCollideWorldBounds(true);
      go.setMass(0.3);
      go.setData("removed", false);
      go.setData("index", idx);
      this.atvGroup.add(go);
      return go;
    });

    this._setupPockets();

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

    this.physics.add.collider(
      this.bolinha,
      this.atvGroup,
      (proj, tgt) =>
        this._resolveBallBall(proj, tgt, {
          restitution: 0.95,
          minKick: 130,
          posFix: 0.6,
          markHit: true,
          boostForA: 1.35,
        }),
      null,
      this
    );

    this.colTargetsWall = this.physics.add.collider(this.atvGroup, this.wall);
    this.colBallWall = this.physics.add.collider(this.bolinha, this.wall);
    this.colBallWall.active = false;

    this.physics.add.collider(
      this.atvGroup,
      this.atvGroup,
      (a, b) =>
        this._resolveBallBall(a, b, {
          restitution: 0.9,
          minKick: 80,
          posFix: 0.55,
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

    this._createFinishModal(bg);

    this._setAimAngle(this.LAYOUT.AIM.rotationDeg);
    this._refreshForceUI();
    this._showReadyUI();

    super.create();
  }

  update() {
    if (this.isShooting && this.colBallWall && !this.colBallWall.active) {
      const rightOfWall =
        this.bolinha.x >= this.wall.x + this.LAYOUT.WALL.width * 0.5;
      if (rightOfWall) this.colBallWall.active = true;
    }

    if (this.isShooting) this._applyExtraShotDecel();

    this._applyPocketAttraction();

    if (this.isShooting && this.hasHitTarget && this._allTargetsStopped()) {
      this._resetShooter();
    }
  }

  _setupPockets() {
    this.pockets = this.LAYOUT.POCKETS.map((p, i) => {
      const s = this.add
        .image(p.x, p.y, p.key)
        .setOrigin(0.5)
        .setScale(p.scale ?? 1)
        .setDepth(this.DEPTH.POCKET);
      s.setData("index", i);
      return s;
    });

    this.ballToPocket = this.atvBalls.map((_, i) => i);
  }

  _applyPocketAttraction() {
    const dt = (this.game.loop.delta || 16.6667) / 1000;
    const {
      ATTRACT_RADIUS,
      CAPTURE_RADIUS,
      ATTRACT_FORCE,
      ATTRACT_CURVE_EXP,
      MAX_ATTRACT_SPEED,
      PULL_SHOOTER,
      SINK_DURATION,
      SINK_SCALE_MULT,
    } = this.PHYSICS;

    const applyPull = (bodyGO, px, py, doCapture = false) => {
      if (!bodyGO || !bodyGO.body || bodyGO.getData("removed")) return;

      const dx = px - bodyGO.x;
      const dy = py - bodyGO.y;
      const dist = Math.hypot(dx, dy);
      if (dist > ATTRACT_RADIUS) return;

      const nx = dist ? dx / dist : 0;
      const ny = dist ? dy / dist : 0;

      if (doCapture && dist <= CAPTURE_RADIUS) {
        this._captureBall(bodyGO, {
          x: px,
          y: py,
          duration: SINK_DURATION,
          endScaleMult: SINK_SCALE_MULT,
        });
        return;
      }

      const t = Phaser.Math.Clamp(
        1 -
          (dist - CAPTURE_RADIUS) /
            Math.max(1, ATTRACT_RADIUS - CAPTURE_RADIUS),
        0,
        1
      );
      const curve = Math.pow(t, ATTRACT_CURVE_EXP);

      const addV = ATTRACT_FORCE * curve * dt;
      let vx = bodyGO.body.velocity.x + nx * addV;
      let vy = bodyGO.body.velocity.y + ny * addV;

      const sp = Math.hypot(vx, vy);
      if (sp > MAX_ATTRACT_SPEED) {
        const k = MAX_ATTRACT_SPEED / sp;
        vx *= k;
        vy *= k;
      }
      bodyGO.setVelocity(vx, vy);
    };

    this.atvBalls.forEach((ball, i) => {
      if (!ball || ball.getData("removed")) return;
      const pocketIdx = this.ballToPocket[i];
      const pocket = this.pockets[pocketIdx];
      if (!pocket) return;
      applyPull(ball, pocket.x, pocket.y, true);
    });

    if (PULL_SHOOTER && this.bolinha && this.bolinha.body) {
      let nearest = null;
      let nd = Infinity;
      for (const p of this.pockets) {
        const dx = p.x - this.bolinha.x;
        const dy = p.y - this.bolinha.y;
        const d = Math.hypot(dx, dy);
        if (d < nd) {
          nd = d;
          nearest = p;
        }
      }
      if (nearest) applyPull(this.bolinha, nearest.x, nearest.y, false);
    }
  }

  _captureBall(ball, { x, y, duration, endScaleMult }) {
    if (!ball || ball.getData("removed")) return;
    ball.setData("removed", true);
    if (ball.body) ball.body.enable = false;

    this.tweens.add({
      targets: ball,
      x,
      y,
      scale: (ball.scale || 1) * endScaleMult,
      alpha: 0.6,
      duration: duration || 280,
      ease: "Quad.easeIn",
      onComplete: () => {
        ball.setVisible(false).setActive(false);
        this.earnedStars = Phaser.Math.Clamp(this.earnedStars + 1, 0, 3);
        this._refreshStars();

        if (this.earnedStars === 3 && !this.feedbackShown) {
          const delay = this.LAYOUT.FEEDBACK.delayMs ?? 3000;
          if (this.feedbackTimer) this.feedbackTimer.remove(false);
          this.feedbackTimer = this.time.delayedCall(delay, () =>
            this._showFeedbackOK()
          );
        }
      },
    });
  }

  _allTargetsStopped() {
    return this.atvBalls.every((b) => {
      if (!b || b.getData("removed")) return true;
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

    if (this.colBallWall) this.colBallWall.active = false;

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

  _applyExtraShotDecel() {
    if (!this.bolinha || !this.bolinha.body) return;

    const dt = (this.game.loop.delta || 16.6667) / 1000;
    const mult = Math.pow(this.PHYSICS.SHOT_DECEL_MULT_PER_SEC, dt);
    const vx = this.bolinha.body.velocity.x * mult;
    const vy = this.bolinha.body.velocity.y * mult;

    if (Math.hypot(vx, vy) < this.PHYSICS.MIN_SPEED_TO_STOP) {
      this.bolinha.setVelocity(0, 0);
      if (this._allTargetsStopped()) this._resetShooter();
      return;
    }
    this.bolinha.setVelocity(vx, vy);
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

    if (this.colBallWall) this.colBallWall.active = false;

    this._showReadyUI();
  }

  _restartGame() {
    this._cancelTimersAndFeedback();

    this.earnedStars = 0;
    this.lastShownStars = 0;
    this._refreshStars();

    this.isShooting = false;
    this.hasHitTarget = false;
    this._stopBallSpin();
    if (this.bolinha && this.bolinha.body) {
      this.bolinha.setVelocity(0, 0);
      this.bolinha.setPosition(
        this.LAYOUT.AREA_BOLINHA.x,
        this.LAYOUT.AREA_BOLINHA.y
      );
      this.bolinha.setAlpha(1);
      this.bolinha.setScale(this.LAYOUT.BALL_SCALE);
      if (this.colBallWall) this.colBallWall.active = false;
    }

    this._setAimAngle(this.LAYOUT.AIM.rotationDeg);

    if (this.PHYSICS.RESET_FORCE_ON_RESTART) {
      this.forceLevel = 0;
      this._refreshForceUI();
    }

    this.atvBalls.forEach((ball, i) => {
      const orig = this.LAYOUT.ATVBALLS[i];
      if (!orig) return;
      ball.setVisible(true).setActive(true).setAlpha(1);
      ball.setScale(orig.scale ?? 1);
      ball.setPosition(orig.x, orig.y);
      if (ball.body) {
        ball.body.enable = true;
        ball.setVelocity(0, 0);
      }
      ball.setData("removed", false);
    });

    this._showReadyUI();
  }

  _cancelTimersAndFeedback() {
    if (this.repositionTimerEvt) {
      this.repositionTimerEvt.remove(false);
      this.repositionTimerEvt = null;
    }

    if (this.feedbackTimer) {
      this.feedbackTimer.remove(false);
      this.feedbackTimer = null;
    }

    if (this.modalTimer) {
      this.modalTimer.remove(false);
      this.modalTimer = null;
    }
    this._hideFinishModal();

    this.feedbackShown = false;
    if (this.feedbackOK) {
      this.feedbackOK.setVisible(false).setAlpha(0);
      this.feedbackOK.setScale(this.LAYOUT.FEEDBACK.scale ?? 1);
    }
  }

  _showFeedbackOK() {
    if (this.feedbackShown || !this.feedbackOK) return;
    this.feedbackShown = true;

    const fcfg = this.LAYOUT.FEEDBACK;
    if (this.sound && fcfg.sfxKey) {
      this.sound.play(fcfg.sfxKey, { volume: fcfg.sfxVolume ?? 1.0 });
    }

    this.feedbackOK.setDepth(this.DEPTH.FEEDBACK).setVisible(true).setAlpha(0);

    this.tweens.add({
      targets: this.feedbackOK,
      alpha: 1,
      scale: (this.LAYOUT.FEEDBACK.scale ?? 1) * 1.08,
      duration: 520,
      ease: "Quad.easeOut",
      yoyo: true,
    });

    const delayMs = this.LAYOUT.MODAL.showDelayMs ?? 2000;
    if (this.modalTimer) this.modalTimer.remove(false);
    this.modalTimer = this.time.delayedCall(delayMs, () =>
      this._showFinishModal()
    );
  }

  _createFinishModal(bg) {
    const m = this.LAYOUT.MODAL;

    this.modalBackdrop = this.add
      .rectangle(
        this.game.config.width / 2,
        this.game.config.height / 2,
        this.game.config.width,
        this.game.config.height,
        m.backdropColor ?? 0x000000,
        m.backdropAlpha ?? 0.6
      )
      .setDepth(this.DEPTH.MODAL_BACKDROP)
      .setVisible(false)
      .setAlpha(0)
      .setInteractive({ useHandCursor: false });

    this.modalSprite = this.add
      .image(m.x, m.y, m.key)
      .setOrigin(0.5)
      .setScale(m.scale ?? 1)
      .setDepth(this.DEPTH.MODAL)
      .setVisible(false)
      .setAlpha(0);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, m.BTN_INICIO.palette);

    this.btnInicio = new Button(this, {
      text: m.BTN_INICIO.text,
      showIcon: m.BTN_INICIO.showIcon,
      colors,
    });
    this.btnInicio.setDepth(this.DEPTH.MODAL_UI);
    this.btnInicio.x = m.BTN_INICIO.centerXToBG
      ? bg.x + (bg.width - this.btnInicio.width) / 2
      : m.BTN_INICIO.x;
    this.btnInicio.y = m.BTN_INICIO.y;
    this.btnInicio.setVisible(false);
    this.btnInicio.on("buttonClick", () => {
      this.scene.start("Capa");
    });
  }

  _showFinishModal() {
    const m = this.LAYOUT.MODAL;

    if (m.sfxKey && this.sound) {
      this.sound.play(m.sfxKey, { volume: m.sfxVolume ?? 1.0 });
    }

    this.modalBackdrop.setVisible(true);
    this.modalSprite.setVisible(true).setScale((m.scale ?? 1) * 0.95);
    this.btnInicio.setVisible(true);

    this.tweens.add({
      targets: this.modalBackdrop,
      alpha: m.backdropAlpha ?? 0.6,
      duration: 180,
      ease: "Quad.easeOut",
    });
    this.tweens.add({
      targets: this.modalSprite,
      alpha: 1,
      scale: m.scale ?? 1,
      duration: 220,
      ease: "Quad.easeOut",
    });
    this.tweens.add({
      targets: this.btnInicio,
      alpha: 1,
      duration: 220,
      ease: "Quad.easeOut",
    });
  }

  _hideFinishModal() {
    if (!this.modalBackdrop || !this.modalBackdrop.visible) return;

    this.modalBackdrop.setVisible(false).setAlpha(0);
    this.modalSprite.setVisible(false).setAlpha(0);
    this.btnInicio.setVisible(false);
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

export default Game6;
