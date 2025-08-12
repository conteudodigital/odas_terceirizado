import SoundManager from "../managers/SoundManager.js";

export class Intro extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;
    scene.add.existing(this);

    // JSON carregado
    this.introInfo = scene.cache.json.get("introData")?.introInfo || [];
    this.currentIndex = 0;
    this.autoAdvanceTimer = null;

    // Fundo
    const background = scene.add.image(0, 0, 'bg-intro1').setOrigin(0, 0);
    this.add(background);

    // Alfabeton
    this.alfabeton = scene.add.image(0, 0, 'alfabeton2').setOrigin(0, 1);
    this.alfabeton.x = scene.scale.width - this.alfabeton.width - 150;
    this.alfabeton.y = scene.scale.height;
    
    // DialogBox
    this.dialogBox = scene.add.image(0, 0, 'dialog1').setOrigin(0, 1);
    this.dialogBox.x = 100;
    this.dialogBox.y = scene.scale.height - 40;
    this.add(this.dialogBox);
    
    this.finalElements = [];

    this.silabas = scene.add.image(0, 0, 'silabas').setOrigin(0, 0);
    this.silabas.setPosition(100, scene.scale.height - 700);
    this.finalElements.push(this.silabas);

    this.arrow = scene.add.image(0, 0, 'arrow1').setOrigin(0, 0);
    this.arrow.setPosition(350, scene.scale.height - 860);
    this.finalElements.push(this.arrow);

    this.lavarmaos = scene.add.image(0, 0, 'lavarmaos').setOrigin(0, 0);
    this.lavarmaos.setPosition(730, scene.scale.height - 910);
    this.finalElements.push(this.lavarmaos);

    this.hand = scene.add.image(0, 0, 'hand').setOrigin(0, 0);
    this.hand.setPosition(330, scene.scale.height - 630);
    this.finalElements.push(this.hand);

    this.finalElements.forEach(obj => obj.setVisible(false));

    SoundManager.playMusic('music', 0.05);

    // Padding
    this.padding = {
      left: 100,
      right: 250,
      top: 70,
      bottom: 30
    };

    const usableWidth = this.dialogBox.width - this.padding.left - this.padding.right;

    // Texto
    this.dialogText = scene.add.text(0, 0, "", {
      fontFamily: 'Nunito-ExtraBold',
      fontSize: '32px',
      color: '#000000',
      wordWrap: { width: usableWidth, useAdvancedWrap: true },
      align: 'left'
    });
    this.dialogText.setOrigin(0, 0.5);
    this.dialogText.x = this.dialogBox.x + this.padding.left;
    this.dialogText.y = this.dialogBox.y - this.dialogBox.height + this.padding.top + (this.dialogBox.height - this.padding.top - this.padding.bottom) / 2;
    this.add(this.dialogText);

    // Botão "Próximo"
    this.nextButton = scene.add.image(0, 0, 'btNext').setInteractive({ useHandCursor: true });
    this.nextButton.setOrigin(1, 1);
    this.nextButton.x = scene.scale.width - 50;
    this.nextButton.y = this.nextButton.height + 50;

    this.nextButton.on('pointerdown', () => {
      if (this.currentIndex >= this.introInfo.length - 1) {
        this.endIntro(); // fim da intro → transição de cena
      } else {
        this.advanceText(); // avança manual
      }
      SoundManager.play('click');
    });

    this.add(this.nextButton);

    // Exibe o primeiro texto
    this.showCurrentText();
  }

showCurrentText() {
  const info = this.introInfo[this.currentIndex];
  this.dialogText.setText(info?.text || "");

  if (info?.sprite && info.sprite !== this.alfabeton.texture.key) {
    this.alfabeton.setTexture(info.sprite);
  }

  // Último item?
  const isLast = this.currentIndex >= this.introInfo.length - 1;

  // Limpa timer anterior
  if (this.autoAdvanceTimer) {
    this.autoAdvanceTimer.remove();
    this.autoAdvanceTimer = null;
  }

  // Toca áudio e agenda próxima ação
  if (info?.audio) {
    SoundManager.stopAll();
    const sound = SoundManager.play(info.audio, 1.0, false);

    if (sound) {
      sound.once('complete', () => {
        this.autoAdvanceTimer = this.scene.time.delayedCall(1000, () => {
          if (isLast) {
            this.endIntro();
          } else {
            this.advanceText();
          }
        });
      });
    } else {
      // fallback se o som não tocou
      this.autoAdvanceTimer = this.scene.time.delayedCall(1000, () => {
        if (isLast) {
          this.endIntro();
        } else {
          this.advanceText();
        }
      });
    }
  } else {
    // Sem áudio → fallback automático
    this.autoAdvanceTimer = this.scene.time.delayedCall(1000, () => {
      if (isLast) {
        this.endIntro();
      } else {
        this.advanceText();
      }
    });
  }
}


  advanceText() {
    if (this.autoAdvanceTimer) {
      this.autoAdvanceTimer.remove();
      this.autoAdvanceTimer = null;
    }

    // Protege contra ultrapassar o final
    if (this.currentIndex >= this.introInfo.length - 1) {
      return;
      
    }

    this.currentIndex++;
    if(this.currentIndex == this.introInfo.length - 1){
      this.finalElements.forEach(obj => obj.setVisible(true));
    }
    this.showCurrentText();
  }

  endIntro() {
    this.alfabeton.destroy();
    this.finalElements.forEach(obj => obj.destroy());
    this.scene.events.emit('intro-finished');
    SoundManager.stopAll();

  }

}
