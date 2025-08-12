import { ObjectUtil } from '../utils/ObjectUtils.js';
import SoundManager from '../managers/SoundManager.js';

export class InitialDialog extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);

    this.scene = scene;

    scene.load.plugin('rextagtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextagtextplugin.min.js', true);


    // Imagem principal (frame)
    this.frame = scene.add.image(0, 0, 'textframe1').setOrigin(0, 0);

    const frameWidth = this.frame.width;
    const frameHeight = this.frame.height;

    //Array de sons na cena
    this.sceneSounds = ["NA001", "NA002", "NA003", "NA004", "NA005", "NA006", "NA007", "NA008", "NA009", "NA010"]

    // Botão Voltar
    this.btBack = scene.add.image(0, 0, 'buttonback').setOrigin(0, 0);
    this.btBack.x = 100;
    this.btBack.y = frameHeight - 180;

    // Botão Avançar
    this.btNext = scene.add.image(0, 0, 'buttonnext').setOrigin(1, 0);
    this.btNext.x = frameWidth - 100;
    this.btNext.y = frameHeight - 180;

    // Texto central
    this.centerText = scene.add.text(0, 0, '', {
      fontFamily: 'Nunito-ExtraBold',
      fontSize: '32px',
      color: '#000000',
      align: 'left',
      wordWrap: { width: this.frame.width - 300 }
    }).setOrigin(0.5);
    this.centerText.x = frameWidth / 2;
    this.centerText.y = frameHeight / 3;

    // Nome do Tadeu
    this.tadeuName = scene.add.image(0, 0, 'tadeuname').setOrigin(0, 0);
    this.tadeuName.x = this.frame.x + 80;
    this.tadeuName.y = -50;

    // Sprite do Tadeu
    this.tadeuBig = scene.add.image(0, 0, 'tadeubig').setOrigin(0, 0);
    this.tadeuBig.x = scene.scale.width - this.tadeuBig.width;
    this.tadeuBig.y = scene.scale.height - this.tadeuBig.height;
    ObjectUtil.bringToFront(this.tadeuBig);

    // Adiciona ao container
    this.add([this.frame, this.btBack, this.btNext, this.tadeuName, this.centerText]);

    // Adiciona à cena
    scene.add.existing(this);

    // Inicializa variáveis de diálogo
    this.textIndex = 0;
    const dialogos = scene.cache.json.get('dialogues');
    this.mensagens = dialogos?.mensagens || [];

    // Eventos dos botões
    this.btBack.setInteractive({ cursor: 'pointer' });
    this.btNext.setInteractive({ cursor: 'pointer' });

    this.playCurrentAudio();

    this.btBack.on('pointerdown', () => {
      if (this.textIndex > 0) {
        this.textIndex--;
        this.playCurrentAudio();
        this.updateText();
      }
      this.playClickSound();
    });

    this.btNext.on('pointerdown', () => {
    if (this.textIndex < this.mensagens.length - 1) {
        this.textIndex++;        
        this.playCurrentAudio();
        this.updateText();
    } else {
        // Esconde o HUD e o Tadeu ao finalizar
        this.setVisible(false);
        if (this.tadeuBig) {
        this.tadeuBig.setVisible(false);
        }
        if (this.currentAudio && this.currentAudio.isPlaying) {
        this.currentAudio.stop();
        }
        if (this.dialogEndCallback) {
        this.dialogEndCallback(); // dispara callback externo
        }
    }
    this.playClickSound();
    });


  }

  startDialog() {
    this.textIndex = 0;
    this.updateText();
  }

  setOnDialogEnd(callback) {
  this.dialogEndCallback = callback;
}


  updateText() {
    this.centerText.setText(this.mensagens[this.textIndex] || '');

    const isBlink = this.textIndex % 2 !== 0;
    const novaTextura = isBlink ? 'tadeublink' : 'tadeubig';
    this.tadeuBig.setTexture(novaTextura);

    this.btBack.setVisible(this.textIndex > 0);
  }

  playCurrentAudio(){
    // Para o áudio anterior, se existir
    if (this.currentAudio && this.currentAudio.isPlaying) {
      this.currentAudio.stop();
    }
    const audioKey = this.sceneSounds[this.textIndex];
    if (audioKey) {
      this.currentAudio = SoundManager.play(audioKey);
    }
  }

  playClickSound(){
    SoundManager.play("click");
  }
}
