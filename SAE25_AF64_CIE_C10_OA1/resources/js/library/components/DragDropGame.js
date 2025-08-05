import { ObjectUtil } from "../utils/ObjectUtils.js";
import SoundManager from "../managers/SoundManager.js";

export class DragDropGame extends Phaser.GameObjects.Container {
  constructor(scene, x = 0, y = 0) {
    super(scene, x, y);
    this.scene = scene;

    SoundManager.init(scene.game);
    const gametexts = scene.cache.json.get("gametexts");
    this.feedbacks1 = gametexts?.feedbacks1 || [];
    this.feedbacks2 = gametexts?.feedbacks2 || [];
    this.feedbacks3 = gametexts?.feedbacks3 || [];
    this.textList = gametexts?.fase1 || [];
    this.textIndex = 0;
    this.lastDraggedIndex = 0;
    this.dragInteractionCount = 0;
    this.feedbacktext1 = null;
    this.feedbacktext2 = null;
    this.feecbacktext3 = null;

    this.baloonTitles = ["title_captacao", "", "title_pre_cloracao", "title_coagualacao", "title_floculacao", "", "", "title_pos_cloracao", "title_fluoretacao","title_armazenamento", "title_distribuicao"]

    this.dragPhaseModals1 = ["modal_gradeamento_2", "modal_gradeamento_3", "modal_gradeamento_4"];
    this.dragPhaseModals2 = ["modal_decantacao_4", "modal_decantacao_3", "modal_decantacao_2"];
    this.dragPhaseModals3 = ["modal_filtracao_3", "modal_filtracao_2", "modal_filtracao_4"];

    this.nonDragPhaseModals = ["", "modal_gradeamento_1", "modal_pre_coloracao", "modal_coagulacao", "modal_floculacao", "modal_decantacao_1", "modal_pos_cloracao", "modal_pos_cloracao", "modal_fluoretacao", "modal_armazenamento", "modal_distribuicao" ];

    this.tadeu = scene.add.image(0, 0, "tadeufull").setOrigin(0, 1);
    this.tadeu.x = 0;
    this.tadeu.y = scene.scale.height;
    
    this.modal_feedback = scene.add.image(0, 0, "modal_feedback").setOrigin(0.5, 0.5);
    this.modal_feedback.setVisible(false);
    this.modal_feedback.x = scene.scale.width / 2;
    this.modal_feedback.y = scene.scale.height / 2;

    this.finishButton = scene.add.image(0, 0, "Button-SAE").setOrigin(0.5, 0.5);
    this.finishButton.x = this.modal_feedback.width / 2 + 308;
    this.finishButton.y = scene.scale.height / 2 + 260;
    this.finishButton.setDepth(9999);
    this.finishButton.setVisible(false);
    this.finishButton.setInteractive({ cursor: "pointer" });
    this.finishButton.on("pointerdown", () => {
      if (this.finalSound && this.finalSound.isPlaying) {
        this.finalSound.stop();
      }
      window.location.reload();


    });

    this.sceneSounds = [
      "NA011", "NA012",
      "NA016", "NA017", "NA018", "NA019",
      "NA023", "NA027", "NA028", "NA029", "NA030"
    ];

    this.feedbackSounds1 = ["NA013", "NA014", "NA015"];
    this.feedbackSounds2 = ["NA022", "NA021", "NA020"];
    this.feedbackSounds3 = ["NA025", "NA024", "NA026"];

    this.feedbackSounds = [this.feedbackSounds1, this.feedbackSounds2, this.feedbackSounds3];

    this.bt_verificar_ativo = scene.add.image(0, 0, "bt_verificar_ativo").setOrigin(0, 1);
    this.bt_verificar_ativo.x = scene.scale.width - this.bt_verificar_ativo.width - 110;
    this.bt_verificar_ativo.y = scene.scale.height - 100;
    this.bt_verificar_ativo.setInteractive({ cursor: "pointer" });
    this.bt_verificar_ativo.setVisible(false);

    this.bt_verificar_inativo = scene.add.image(0, 0, "bt_verificar_inativo").setOrigin(0, 1);
    this.bt_verificar_inativo.x = scene.scale.width - this.bt_verificar_ativo.width - 110;
    this.bt_verificar_inativo.y = scene.scale.height - 100;
    this.bt_verificar_inativo.setVisible(false);

    this.bt_proximo = scene.add.image(0, 0, "bt_proximo").setOrigin(0, 1);
    this.bt_proximo.x = scene.scale.width - this.bt_verificar_ativo.width - 110;
    this.bt_proximo.y = scene.scale.height - 100;
    this.bt_proximo.setInteractive({ cursor: "pointer" });
    this.bt_proximo.setVisible(false);

    this.bt_tentar = scene.add.image(0, 0, "bt_tentar").setOrigin(0, 1);
    this.bt_tentar.x = scene.scale.width - this.bt_verificar_ativo.width - 140;
    this.bt_tentar.y = scene.scale.height - 70;
    this.bt_tentar.setInteractive({ cursor: "pointer" });
    this.bt_tentar.setVisible(false);

    this.baloon = scene.add.image(0, 0, "baloon").setOrigin(0, 1);
    this.baloon.x = this.tadeu.width - 30;
    this.baloon.y = scene.scale.height - 10;

    this.baloonTitle = scene.add.image(0, 0, "title_captacao").setOrigin(0.5, 0.5);
    this.baloonTitle.x = this.baloon.x + 360;
    this.baloonTitle.y = this.baloon.y - 230;
    this.baloonTitle.setDepth(10);

    const baloonTextMarginSides = 100;
    const baloonTextWidth = this.baloon.width - baloonTextMarginSides;

    this.text = scene.add.text(
      this.baloon.x + this.baloon.width / 2,
      this.baloon.y - this.baloon.height / 2 - 15,
      this.textList[0] || "",
      {
        fontFamily: 'Nunito-ExtraBold',
        fontSize: '32px',
        color: '#000000',
        wordWrap: { width: baloonTextWidth - 100 },
        align: "center",
      }
    ).setOrigin(0.5, 0.5);

    this.btNext = scene.add.image(0, 0, "buttonnext").setOrigin(1, 1);
    this.btNext.x = this.baloon.x + this.baloon.width - 5;
    this.btNext.y = this.baloon.y - 50;
    this.btNext.setInteractive({ cursor: "pointer" });

    this.modal = scene.add.image(0, 0, "modal_captacao").setOrigin(0.5, 1);
    this.modal.x = scene.scale.width / 2;
    this.modal.y = this.baloon.y - this.baloon.height - 40;

    this.modalIcons = scene.add.image(0, 0, "modal_icons").setOrigin(0, 1);
    this.modalIcons.x = this.modal.x + this.modal.width / 2 + 10;
    this.modalIcons.y = this.modal.y;
    this.modalIcons.setVisible(false);

    this.baloonSmall = scene.add.image(
      this.baloon.x,
      this.baloon.y,
      "baloonsmall"
    ).setOrigin(0, 1);
    this.baloonSmall.setVisible(false);

    const smallTextWidth = this.baloonSmall.width - 60;
    this.textSmall = scene.add.text(
      this.baloonSmall.x + this.baloonSmall.width / 2 + 20,
      this.baloonSmall.y - this.baloonSmall.height / 2 - 15,
      "",
      {
        fontFamily: 'Nunito-ExtraBold',
        fontSize: '32px',
        color: '#000000',
        wordWrap: { width: smallTextWidth },
        align: "center",
      }
    ).setOrigin(0.5, 0.5);
    this.textSmall.setVisible(false);

    const centerX = this.modalIcons.x + this.modalIcons.width / 2;
    const startY = this.modalIcons.y - this.modalIcons.height + 172;
    const itemSpacing = 186;

    this.dragItem1 = scene.add.image(centerX, startY, 'filtracao').setOrigin(0.5, 0.5);
    this.dragItem2 = scene.add.image(centerX, startY + itemSpacing, 'gradeamento').setOrigin(0.5, 0.5);
    this.dragItem3 = scene.add.image(centerX, startY + itemSpacing * 2, 'decantacao').setOrigin(0.5, 0.5);

    this.dragItem1.startX = this.dragItem1.x;
    this.dragItem1.startY = this.dragItem1.y;
    this.dragItem2.startX = this.dragItem2.x;
    this.dragItem2.startY = this.dragItem2.y;
    this.dragItem3.startX = this.dragItem3.x;
    this.dragItem3.startY = this.dragItem3.y;

    [this.dragItem1, this.dragItem2, this.dragItem3].forEach(item => {
      item.setInteractive({ draggable: true });
      item.setVisible(false);
      item.setDepth(99999);
    });

    // --- Drop Target (emptyslot) ---
    this.dropTarget = scene.add.image(
      scene.scale.width / 2 - 211,
      scene.scale.height / 2 + 92,
      "emptyslot"
    ).setOrigin(0.5).setInteractive();
    this.dropTarget.setDepth(10);
    this.dropTarget.setVisible(false); // deixa invisível

    this.dropTarget2 = scene.add.image(
      scene.scale.width / 2 + 100,
      scene.scale.height / 2 - 110,
      "emptyslot"
    ).setOrigin(0.5).setInteractive();
    this.dropTarget2.setDepth(10);
    this.dropTarget2.setVisible(false);

        this.dropTarget3 = scene.add.image(
      scene.scale.width / 2 - 110,
      scene.scale.height / 2 - 110,
      "emptyslot"
    ).setOrigin(0.5).setInteractive();
    this.dropTarget3.setDepth(10);
    this.dropTarget3.setVisible(false);


    this.add([
      this.tadeu,
      this.baloon,
      this.baloonSmall,
      this.text,
      this.textSmall,
      this.btNext,
      this.modal,
      this.modalIcons,
      this.dropTarget,
      this.dragItem1,
      this.dragItem2,
      this.dragItem3,
    ]);

    scene.add.existing(this);

    scene.input.setDraggable(this.dragItem1);
    scene.input.setDraggable(this.dragItem2);
    scene.input.setDraggable(this.dragItem3);

    

    scene.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setAlpha(0.7);
      this.modalIcons.setTexture("modal_icons_inactive");
    });

    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.correctDraggedItem = false;
    scene.input.on('dragend', (pointer, gameObject) => {
      gameObject.setAlpha(1);
      const boundsA = gameObject.getBounds();
      let boundsB;

      if (this.dragInteractionCount === 0) {
        boundsB = this.dropTarget.getBounds();
      } else if (this.dragInteractionCount === 1) {
        boundsB = this.dropTarget2.getBounds();
      } else if (this.dragInteractionCount === 2){
        boundsB = this.dropTarget3.getBounds();
      }
      

      if (Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)) {
        gameObject.disableInteractive();

        if (gameObject === this.dragItem2) {
          this.lastDraggedIndex = 0;
          gameObject.setVisible(false);
          if(this.dragInteractionCount === 0){
            this.correctDraggedItem = true;
          }
          else{
            this.correctDraggedItem = false;
          }         
        }
        else if (gameObject === this.dragItem1){
          this.lastDraggedIndex = 1;
          gameObject.setVisible(false);
          if(this.dragInteractionCount === 2){
            this.correctDraggedItem = true;
          }
          else{
            this.correctDraggedItem = false;
          } 
        }
        else if (gameObject === this.dragItem3){
          this.lastDraggedIndex = 2;
          gameObject.setVisible(false);
          if(this.dragInteractionCount === 1){
            this.correctDraggedItem = true;
          }
          else{
            this.correctDraggedItem = false;
          } 
        }
        this.toggleVerifyButton(true);
        this._resetDragItems(gameObject);
        this.setModalAfterDraggable();
      } else {
        if (gameObject.startX !== undefined && gameObject.startY !== undefined) {
          gameObject.x = gameObject.startX;
          gameObject.y = gameObject.startY;
        }
      }
    });

    this.playCurrentAudio();

    this.btNext.on("pointerdown", () => {
      this._nextText();
      if(this.textIndex === 1){
        this.toggleVerifyButton(false);
      }
      if(this.textIndex === 3){
        this.modal.setTexture("modal_coagulacao");
      }
      if(this.textIndex === 4){
        this.modal.setTexture("modal_floculacao");
      }
      this.updateBaloonTitles();
      this.playCurrentAudio();
      this.emit("nextClick");
      this.playClickSound();     
    });

    this.bt_verificar_ativo.on("pointerdown", () => {
      this.setFeedbackTexts();
    if (this.correctDraggedItem) {
        if(this.dragInteractionCount === 0){
          this.modal.setTexture("modal_gradeamento_acerto");
        }
        else if(this.dragInteractionCount === 1){
          this.modal.setTexture("modal_decantacao_acerto");
        }
        else if(this.dragInteractionCount === 2){
          this.modal.setTexture("modal_filtracao_acerto");
        }
      this.playCorrectFeedback();
      this.bt_proximo.setVisible(true);
    } 
    else {
      if(this.dragInteractionCount === 0){
        this.modal.setTexture("modal_gradeamento_erro");
      }
      else if(this.dragInteractionCount === 1){
        this.modal.setTexture("modal_decantacao_erro");
      }
      else if(this.dragInteractionCount === 2){
        this.modal.setTexture("modal_filtracao_erro");
      }
      this.bt_tentar.setVisible(true);
      this.playIncorrectFeedback();
    }
    this.putFeedbackTextOnBaloon();
    this.bt_verificar_ativo.setVisible(false);
    this.disableInteractivity();
    this.playCurrentFeedbackAudio();

  });

    this.bt_proximo.on("pointerdown", () => {
      
      this.enableInteractivity();
      this.dragInteractionCount++;
      this.bt_proximo.setVisible(false);
      this.textIndex++;
      if(this.dragInteractionCount !== 2){
        this.toggleGameLayout(true);
      }
      else{
        this._resetDragItems();
        this.modal.setTexture("modal_filtracao_1");
      }
      this.textSmall.setText(this.textList[this.textIndex]);
      this.text.setText(this.textList[this.textIndex]);
      this.updateBaloonTitles();
      this.playCurrentAudio();
      this.playClickSound();
    });

    this.bt_tentar.on("pointerdown", () => {
      this.enableInteractivity();
      this._resetDragItems();
      this.bt_tentar.setVisible(false);
      this.bt_verificar_inativo.setVisible(true);
      if(this.dragInteractionCount === 0){
        this.modal.setTexture("modal_gradeamento_1");
      }
      else if(this.dragInteractionCount === 1){
        this.modal.setTexture("modal_decantacao_1");
      }
      else{
        this.modal.setTexture("modal_filtracao_1");
      }
      this.playCurrentAudio();
      
      this.textSmall.setText(this.textList[this.textIndex]);
      this.playClickSound();
    })
  }

  _nextText() {
    this.textIndex++;

    if (this.textIndex === 1 || this.textIndex === 5) {
      /*this.baloon.setVisible(false);
      this.text.setVisible(false);
      this.btNext.setVisible(false);

      this.modal.setTexture("modal_gradeamento_1");

      this.baloonSmall.setVisible(true);
      this.textSmall.setText(this.textList[this.textIndex] || "");
      this.textSmall.setVisible(true);

      this.dragItem1.setVisible(true);
      this.dragItem2.setVisible(true);
      this.dragItem3.setVisible(true);

      this.modal.x -= 100;
      this.modalIcons.setVisible(true);*/
      this.toggleGameLayout(false);
    } else if (this.textIndex < this.textList.length) {
      this.textSmall.setText(this.textList[this.textIndex]);
      this.text.setText(this.textList[this.textIndex]);
      if(this.textIndex > 7){
        this.modal.setTexture(this.nonDragPhaseModals[this.textIndex]);
      }
    } else {
      //this._handleEndOfDialog();
      this.finishGame();
    }
  }

  toggleGameLayout(toggle){
      this.baloon.setVisible(toggle);
      this.text.setVisible(toggle);
      this.btNext.setVisible(toggle);

      this.modal.setTexture(this.nonDragPhaseModals[this.textIndex]);
      this._resetDragItems();

      this.baloonSmall.setVisible(!toggle);
      this.textSmall.setText(this.textList[this.textIndex] || "");
      this.textSmall.setVisible(!toggle);

      this.dragItem1.setVisible(!toggle);
      this.dragItem2.setVisible(!toggle);
      this.dragItem3.setVisible(!toggle);
      if(toggle === false){
        this.modal.x -= 100;
      }
      else{
        this.modal.x += 100;
      }

      this.modalIcons.setVisible(!toggle);
  }

  _resetDragItems(exceptItem) {
  const dragItems = [this.dragItem1, this.dragItem2, this.dragItem3];

  dragItems.forEach(item => {
    if (item !== exceptItem) {
      item.setVisible(true);
      item.setInteractive({ draggable: true });
      item.x = item.startX;
      item.y = item.startY;
    }
  });
}

  finishGame(){
    this.modal_feedback.setVisible(true);
    this.modal_feedback.setDepth(999);
    this.finishButton.setVisible(true);
    this.baloon.setVisible(false);
    this.btNext.setVisible(false);
    this.text.setVisible(false);
    this.baloonSmall.setVisible(false);
    this.textSmall.setVisible(false);
    this.tadeu.setVisible(false);
    this.modal.setVisible(false);
    this.playFinalSound();
  }

  _handleEndOfDialog() {
    this.baloon.setVisible(false);
    this.btNext.setVisible(false);
    this.text.setVisible(false);
    this.baloonSmall.setVisible(false);
    this.textSmall.setVisible(false);
    this.modalIcons.setVisible(true);
  }

  onNext(callback) {
    this.btNext.on("pointerdown", callback);
  }

  showModal(show = true) {
    this.modal.setVisible(show);
    this.modalIcons.setVisible(show);
  }

  toggleVerifyButton(active = true) {
    this.bt_verificar_ativo.setVisible(active);
    this.bt_verificar_inativo.setVisible(!active);
  }

  disableInteractivity(){
    this.dragItem1.disableInteractive();
    this.dragItem2.disableInteractive();
    this.dragItem3.disableInteractive();
  }

  enableInteractivity(){
    this.dragItem1.setInteractive();
    this.dragItem2.setInteractive();
    this.dragItem3.setInteractive();
  }

  setFeedbackTexts(){
    this.feedbacktext1 = this.feedbacks1[this.lastDraggedIndex];
    this.feedbacktext2 = this.feedbacks2[this.lastDraggedIndex];
    this.feedbacktext3 = this.feedbacks3[this.lastDraggedIndex];
  }

  putFeedbackTextOnBaloon(){
    if(this.dragInteractionCount === 0){
      this.textSmall.setText(this.feedbacktext1);
    }
    else if(this.dragInteractionCount === 1){
      this.textSmall.setText(this.feedbacktext2);
    }
    else if(this.dragInteractionCount === 2){
      this.textSmall.setText(this.feedbacktext3);
    }
  }

  setModalAfterDraggable(){
    if(this.dragInteractionCount === 0){
      this.modal.setTexture(this.dragPhaseModals1[this.lastDraggedIndex]);
    }
    else if(this.dragInteractionCount === 1){
      this.modal.setTexture(this.dragPhaseModals2[this.lastDraggedIndex]);
    }
    else if(this.dragInteractionCount === 2){
      this.modal.setTexture(this.dragPhaseModals3[this.lastDraggedIndex]);
    }
  }

  updateBaloonTitles(){
    if (this.textIndex !== 1 && this.textIndex !== 5 && this.textIndex !== 6) {
    const textureKey = this.baloonTitles[this.textIndex];

    if (textureKey && this.scene.textures.exists(textureKey)) {
      this.baloonTitle.setTexture(textureKey);
      this.baloonTitle.setVisible(true);
    } else {
      this.baloonTitle.setVisible(false);
    }
    } else {
    this.baloonTitle.setVisible(false);
    }
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

  playCurrentFeedbackAudio() {
    if (this.currentAudio && this.currentAudio.isPlaying) {
      this.currentAudio.stop();
    }

    const audioMatrix = this.feedbackSounds[this.dragInteractionCount];
    const audioKey = audioMatrix?.[this.lastDraggedIndex];

    if (audioKey) {
      this.currentAudio = SoundManager.play(audioKey);
    }
  }

  playCorrectFeedback(){
    SoundManager.play("acerto");
  }

  playIncorrectFeedback(){
    SoundManager.play("erro");
  }

  playClickSound(){
    SoundManager.play("click");
  }

  playFinalSound(){
    this.finalSound = SoundManager.play("NA031");
  }
}
