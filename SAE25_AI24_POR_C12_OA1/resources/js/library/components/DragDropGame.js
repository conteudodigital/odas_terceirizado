import SoundManager from "../managers/SoundManager.js"

export class DragDropGame extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);
    SoundManager.init(scene.game);
    // --- Sílabas corretas para cada target ---
    this.correctTarget1 = 'silaba_ao';
    this.correctTarget2 = 'silaba_aos';

    this.silabas = [];

    this.modalfeedback = scene.add.image(0, 0, 'modalfeedback')
    .setOrigin(0.5, 0.5)
    .setDepth(99999)
    .setInteractive()
    .setVisible(false);
    this.modalfeedback.x = scene.scale.width / 2;
    this.modalfeedback.y = scene.scale.height / 2;

    this.finalButton = scene.add.image(0, 0, 'Button-SAE').setOrigin(0.5, 0.5).setDepth(999999).setInteractive({ cursor: 'pointer' }).setVisible(false);
    this.finalButton.x = scene.scale.width / 2;
    this.finalButton.y = scene.scale.height / 2 + 260;
    this.finalButton.on('pointerdown', () => {
    window.location.reload()});

    this.currentIndex = 0;

    this.gameinfo = scene.cache.json.get('gameinfo');
    //console.log(gameinfo);

    this.bgGame = scene.add.image(0, 0, 'bg-jogo-fase1').setOrigin(0, 0);

    this.topText = scene.add.image(scene.scale.width / 2, 0, 'topText').setOrigin(0.5, 0);
    this.topText.y = 30;

    this.voiceButton = scene.add.image(170, 42, 'btNarracao').setOrigin(0, 0).setInteractive({ cursor: 'pointer' });
    this.voiceButton2 = scene.add.image(1150, 270, 'btNarracao').setOrigin(0, 0).setInteractive({ cursor: 'pointer' });
    this.voiceButton3 = scene.add.image(350, 225, 'btNarracao')
    .setOrigin(0, 0)
    .setInteractive({ cursor: 'pointer' })
    .setDepth(999999)
    .setVisible(false);
    this.voiceButton3.on('pointerdown', () => {
      SoundManager.stopAll();
      SoundManager.play('NA009');
    });

    this.voiceButton.on('pointerdown', () =>{
      this.playTopTextAudio();
    });
    
    this.voiceButton2.on('pointerdown', () =>{
      this.playCurrentAudio();
    });

    this.feedbackAcerto = scene.add.image(1350, 550, 'feedback-acerto').setOrigin(0, 0).setVisible(false);
    this.feedbackErro = scene.add.image(1350, 550, 'feedback-erro').setOrigin(0, 0).setVisible(false);

    this.target1 = scene.add.image(1310, 435, 'target').setOrigin(0, 0).setVisible(false);
    this.target2 = scene.add.image(1452, 822, 'target').setOrigin(0, 0).setVisible(false);

    this.dropZone1 = scene.add.zone(
      this.target1.x + this.target1.width / 2,
      this.target1.y + this.target1.height / 2,
      this.target1.width + 200,
      this.target1.height + 200
    ).setRectangleDropZone(this.target1.width + 200, this.target1.height + 200);

    this.dropZone2 = scene.add.zone(
      this.target2.x + this.target2.width / 2,
      this.target2.y + this.target2.height / 2,
      this.target2.width + 200,
      this.target2.height + 200
    ).setRectangleDropZone(this.target2.width + 200, this.target2.height + 200);

    this.dropZone1.active = true;
    this.dropZone2.active = false;

    this.acertos = 0;

    this.createDraggableSilaba('silaba_ao', 50, scene.scale.height - 800);
    this.createDraggableSilaba('silaba_aos', 50, scene.scale.height - 625);
    this.createDraggableSilaba('silaba_a', 50, scene.scale.height - 450);
    this.createDraggableSilaba('silaba_aes', 50, scene.scale.height - 275);
  }

  createDraggableSilaba(key, x, y) {
    const silaba = this.scene.add.image(x, y, key).setOrigin(0, 0).setInteractive({ draggable: true });
    silaba.startX = x;
    silaba.startY = y;
    silaba.wasDroppedOnTarget = false;
    this.scene.input.setDraggable(silaba);
    this.silabas.push(silaba);
    console.log(this.silabas);

    silaba.on('drag', (pointer, dragX, dragY) => {
      silaba.x = dragX;
      silaba.y = dragY;
    });

    silaba.on('dragstart', () => {
      silaba.setScale(1.1);
      silaba.wasDroppedOnTarget = false;
      this.feedbackErro.setVisible(false);
      this.feedbackAcerto.setVisible(false);
    });
    silaba.on('dragend', () => {
      silaba.setScale(1);
      if (!silaba.wasDroppedOnTarget) {
        silaba.x = silaba.startX;
        silaba.y = silaba.startY;
        //this.feedbackErro.setVisible(true);
      }
    });

    this.scene.input.on('drop', (pointer, gameObject, dropZone) => {
      const isSilaba = gameObject === silaba;

      // Se soltar no target 1
      if (isSilaba && dropZone === this.dropZone1 && this.dropZone1.active) {
        if (silaba.texture.key === this.gameinfo.gameinfo[this.currentIndex].target1.correctSilaba) {
          this.colocarSilaba(silaba, dropZone);
          this.bgGame.setTexture(this.gameinfo.gameinfo[this.currentIndex].modalComplete1);
          this.dropZone1.active = false;
          this.dropZone2.active = true;
          SoundManager.play('acerto');
        } else {
          this.feedbackErro.setVisible(true);
          SoundManager.play('erro');
        }
      }

      // Se soltar no target 2
      else if (isSilaba && dropZone === this.dropZone2 && this.dropZone2.active) {
        if (silaba.texture.key === this.gameinfo.gameinfo[this.currentIndex].target2.correctSilaba) {
          this.colocarSilaba(silaba, dropZone);
          this.dropZone2.active = false;
          this.bgGame.setTexture(this.gameinfo.gameinfo[this.currentIndex].modalComplete2);
          SoundManager.play('acerto');
          this.scene.time.delayedCall(1000, () => {
            this.changeToNextPhase();
          });

        } else {
          this.feedbackErro.setVisible(true);
          SoundManager.play('erro');
        }
      }
    });
  }

  playCurrentAudio(){
    SoundManager.stopAll();
    SoundManager.play(this.gameinfo.gameinfo[this.currentIndex].sound);
  }

  playTopTextAudio(){
    SoundManager.stopAll();
    SoundManager.play('NA002');
  }

  colocarSilaba(silaba, dropZone) {
    silaba.x = silaba.startX;
    silaba.y = silaba.startY;
    silaba.wasDroppedOnTarget = true;
    this.feedbackAcerto.setVisible(true);
    this.feedbackErro.setVisible(false);
  }



  changeToNextPhase() {
    this.currentIndex++;

    if (this.currentIndex >= this.gameinfo.gameinfo.length) {
      console.warn("Fim das fases!");
      this.finishGame();
      return;
    }

    const next = this.gameinfo.gameinfo[this.currentIndex];

    this.target1.x = next.target1.x;
    this.target1.y = next.target1.y;
    this.target2.x = next.target2.x;
    this.target2.y = next.target2.y;
    this.bgGame.setTexture(next.currentmodal);
    console.log(next.currentmodal);

    // Atualizar zonas de drop
    this.dropZone1.setPosition(
      this.target1.x + this.target1.width / 2,
      this.target1.y + this.target1.height / 2
    );

    this.dropZone2.setPosition(
      this.target2.x + this.target2.width / 2,
      this.target2.y + this.target2.height / 2
    );

    // Resetar estados
    this.dropZone1.active = true;
    this.dropZone2.active = false;
    this.feedbackAcerto.setVisible(false);
    this.feedbackErro.setVisible(false);

    if(this.currentIndex === 2){
      this.silabas[1].setTexture("silaba_oes");
    }
  }

  finishGame(){
    this.modalfeedback.setVisible(true);
    this.finalButton.setVisible(true);
    this.voiceButton3.setVisible(true);
    SoundManager.stopAll();
    SoundManager.play('NA009');
  }

}
