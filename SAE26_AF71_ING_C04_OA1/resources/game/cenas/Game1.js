import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1");
    this.controladorDeCenas = controladorDeCenas;
    this.loaded = false;

    this.categories = ["vegetables", "carbs", "proteins"];

    this.currentCategoryIndex = 0;

    this.currentDayIndex = 0;

    this.dayBackgroundKeys = [
      "mondayBg",
      "tuesdayBg",
      "wednesdayBg",
      "thursdayBg",
      "fridayBg",
    ];

    this.selectedItems = { vegetables: null, carbs: null, proteins: null };

    this.scaleMenu = 0.25;
    this.scalePlate = 1;

    this.dropRadius = 400;

    this.servedItems = { vegetables: null, carbs: null, proteins: null };

    this.activeServedItem = null;

    this.baseEditMenuOffset = -375;
  }

  create() {
    this.sfxAcerto = this.sound.add("acerto");

    this.dayBg = this.add
      .image(0, 0, this.dayBackgroundKeys[this.currentDayIndex])
      .setOrigin(0, 0);

    this.categoryBackgrounds = {
      vegetables: this.add.image(1572, 540, "vegetablesFundo"),
      carbs: this.add.image(1572, 540, "carbohydratesFundo").setVisible(false),
      proteins: this.add.image(1572, 540, "proteinsFundo").setVisible(false),
    };

    this.placas = {
      vegetables: this.add.image(1572, 141, "vegetablesPlaca"),
      carbs: this.add.image(1572, 141, "carbohydratesPlaca").setVisible(false),
      proteins: this.add.image(1572, 141, "proteinsPlaca").setVisible(false),
    };

    this.prato = this.add.image(595, 650, "prato");

    this.feedbacks = {
      vegetables: {
        blank: this.add.image(50, 411, "blankFeedback"),
        correct: this.add.image(50, 411, "correctFeedback").setVisible(false),
      },
      carbs: {
        blank: this.add.image(50, 576, "blankFeedback"),
        correct: this.add.image(50, 576, "correctFeedback").setVisible(false),
      },
      proteins: {
        blank: this.add.image(50, 740, "blankFeedback"),
        correct: this.add.image(50, 740, "correctFeedback").setVisible(false),
      },
    };

    this.btnPrev = this.add
      .image(1314, 145, "Botao-Previous")
      .setInteractive()
      .on("pointerdown", () => this.changeCategory(-1));

    this.btnNext = this.add
      .image(1830, 145, "Botao-Next")
      .setInteractive()
      .on("pointerdown", () => this.changeCategory(1));

    this.buttonReadyOff = this.add.image(1048, 985, "buttonReadyOff");

    this.buttonReadyOn = this.add
      .image(1048, 985, "buttonReadyOn")
      .setVisible(false)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.onReady());

    this.createNextDayModal();

    this.createFinalModal();

    this.items = {
      vegetables: [
        { key: "steamedBroccoli", x: 1343, y: 348 },
        { key: "lettuceSalad", x: 1573, y: 346 },
        { key: "tomato", x: 1795, y: 344 },
        { key: "roastedCarrot", x: 1345, y: 615 },
        { key: "steamedCauliflower", x: 1566, y: 615 },
        { key: "cucumber", x: 1798, y: 607 },
        { key: "arugula", x: 1452, y: 865 },
        { key: "bellPepper", x: 1685, y: 872 },
      ],
      carbs: [
        { key: "brownRice", x: 1350, y: 348 },
        { key: "whiteRice", x: 1573, y: 346 },
        { key: "mashedPotatoes", x: 1800, y: 340 },
        { key: "sliceOfBread", x: 1350, y: 605 },
        { key: "cookedSweetPotato", x: 1573, y: 605 },
        { key: "pasta", x: 1800, y: 607 },
        { key: "farofa", x: 1460, y: 865 },
        { key: "polenta", x: 1685, y: 865 },
      ],
      proteins: [
        { key: "grilledBeef", x: 1343, y: 348 },
        { key: "roastedChicken", x: 1573, y: 346 },
        { key: "beans", x: 1795, y: 344 },
        { key: "shrimp", x: 1350, y: 600 },
        { key: "boiledEgg", x: 1573, y: 605 },
        { key: "tofu", x: 1800, y: 607 },
        { key: "fishFillet", x: 1452, y: 865 },
        { key: "friedEgg", x: 1688, y: 870 },
      ],
    };

    this.itemSprites = [];
    this.loadCategoryItems(this.categories[this.currentCategoryIndex]);

    this.createEditMenu();

    this.input.on("dragstart", (pointer, gameObject) => {
      gameObject.dragStartX = gameObject.x;
      gameObject.dragStartY = gameObject.y;

      if (!gameObject.isFromMenu) {
        this.setActiveServedItem(gameObject);
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;

      if (!gameObject.isFromMenu && this.activeServedItem === gameObject) {
        this.positionEditMenu(gameObject);
      }
    });

    this.input.on("dragend", (pointer, gameObject) => {
      const dist = Phaser.Math.Distance.Between(
        gameObject.x,
        gameObject.y,
        this.prato.x,
        this.prato.y
      );
      const inPlate = dist < this.dropRadius;

      if (gameObject.isFromMenu && inPlate) {
        const cat = this.categories[this.currentCategoryIndex];

        const prevServed = this.servedItems[cat];
        if (prevServed) {
          this.selectedItems[cat] = null;
          this.feedbacks[cat].correct.setVisible(false);
          this.feedbacks[cat].blank.setVisible(true);

          if (cat === this.categories[this.currentCategoryIndex]) {
            const oldReturned = this.add
              .image(prevServed.menuX, prevServed.menuY, prevServed.texture.key)
              .setInteractive({ draggable: true })
              .setScale(this.scaleMenu);

            oldReturned.startX = prevServed.menuX;
            oldReturned.startY = prevServed.menuY;
            oldReturned.isFromMenu = true;
            this.input.setDraggable(oldReturned);
            this.itemSprites.push(oldReturned);
          }

          prevServed.destroy();
          this.servedItems[cat] = null;
        }

        this.onItemDropped(gameObject.texture.key);

        const served = this.add
          .image(this.prato.x, this.prato.y, gameObject.texture.key)
          .setInteractive({ draggable: true })
          .setScale(this.scalePlate);

        served.isFromMenu = false;
        served.originCategory = cat;
        served.menuX = gameObject.startX;
        served.menuY = gameObject.startY;

        this.input.setDraggable(served);

        served.on("pointerdown", () => {
          this.setActiveServedItem(served);
        });

        this.servedItems[cat] = served;

        gameObject.destroy();

        this.setActiveServedItem(served);
        return;
      }

      if (!gameObject.isFromMenu && !inPlate) {
        const cat = gameObject.originCategory;

        this.selectedItems[cat] = null;
        this.feedbacks[cat].correct.setVisible(false);
        this.feedbacks[cat].blank.setVisible(true);
        this.checkReady();

        if (cat === this.categories[this.currentCategoryIndex]) {
          const returned = this.add
            .image(gameObject.menuX, gameObject.menuY, gameObject.texture.key)
            .setInteractive({ draggable: true })
            .setScale(this.scaleMenu);

          returned.startX = gameObject.menuX;
          returned.startY = gameObject.menuY;
          returned.isFromMenu = true;

          this.input.setDraggable(returned);
          this.itemSprites.push(returned);
        }

        if (this.activeServedItem === gameObject) {
          this.activeServedItem = null;
          this.hideEditMenu();
        }

        gameObject.destroy();
        this.servedItems[cat] = null;

        return;
      }

      if (!gameObject.isFromMenu && inPlate) {
        if (this.activeServedItem === gameObject) {
          this.positionEditMenu(gameObject);
        }
        return;
      }
      if (gameObject.isFromMenu && !inPlate) {
        gameObject.x = gameObject.startX;
        gameObject.y = gameObject.startY;
        return;
      }
    });

    super.create();
  }

  createNextDayModal() {
    this.nextDayModalContainer = this.add.container(960, 540);
    this.nextDayModalContainer.setDepth(10000);
    this.nextDayModalContainer.setVisible(false);

    const overlay = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, 0.5)
      .setOrigin(0.5)
      .setInteractive();
    this.nextDayModalContainer.add(overlay);

    this.modalBg = this.add.image(0, 115, "nextDay").setOrigin(0.5);
    this.nextDayModalContainer.add(this.modalBg);

    this.nextDayButton = this.add
      .image(105, 360, "Button-Nextday")
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.goToNextDay());
    this.nextDayModalContainer.add(this.nextDayButton);
  }

  showNextDayModal() {
    if (this.currentDayIndex === this.dayBackgroundKeys.length - 1) {
      this.showFinalModal();
      return;
    }

    this.nextDayModalContainer.setVisible(true);
    this.nextDayModalContainer.setDepth(10000);
  }

  hideNextDayModal() {
    this.nextDayModalContainer.setVisible(false);
  }

  createFinalModal() {
    this.finalModalContainer = this.add.container(960, 540);
    this.finalModalContainer.setDepth(11000);
    this.finalModalContainer.setVisible(false);

    const overlay = this.add
      .rectangle(0, 0, 1920, 1080, 0x000000, 0.75)
      .setOrigin(0.5)
      .setInteractive();
    this.finalModalContainer.add(overlay);

    this.finalBg = this.add.image(0, 0, "modalFinal").setOrigin(0.5);
    this.finalModalContainer.add(this.finalBg);

    const marca = ColorManager.getCurrentMarca(this);
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    this.restartButton = new Button(this, {
      text: "RESTART",
      showIcon: false,
      colors: colors,
    });

    this.restartButton.x =
      this.finalBg.x -
      this.restartButton.width / 2 +
      this.finalBg.displayWidth / 2 -
      this.finalBg.displayWidth / 2 +
      0;

    this.restartButton.x =
      -this.restartButton.width / 2 + this.finalBg.width / 2 - 691;
    this.restartButton.y = this.finalBg.y + this.finalBg.height / 2 - 328;

    this.finalModalContainer.add(this.restartButton);

    this.restartButton.on("buttonClick", () => {
      this.scene.start("Capa");
    });
  }

  showFinalModal() {
    if (this.sfxAcerto && this.sfxAcerto.play) {
      this.sfxAcerto.play();
    }

    this.finalModalContainer.setVisible(true);
    this.finalModalContainer.setDepth(11000);
  }

  hideFinalModal() {
    this.finalModalContainer.setVisible(false);
  }

  goToNextDay() {
    this.currentDayIndex =
      (this.currentDayIndex + 1) % this.dayBackgroundKeys.length;

    this.dayBg.setTexture(this.dayBackgroundKeys[this.currentDayIndex]);

    this.resetDayState();

    this.hideNextDayModal();
  }

  resetDayState() {
    Object.keys(this.servedItems).forEach((cat) => {
      const sprite = this.servedItems[cat];
      if (sprite && sprite.destroy) {
        sprite.destroy();
      }
      this.servedItems[cat] = null;
    });

    this.activeServedItem = null;
    this.hideEditMenu();

    this.selectedItems = { vegetables: null, carbs: null, proteins: null };

    Object.values(this.feedbacks).forEach((f) => {
      f.blank.setVisible(true);
      f.correct.setVisible(false);
    });

    this.buttonReadyOn.setVisible(false);
    this.buttonReadyOff.setVisible(true);

    this.itemSprites.forEach((s) => s.destroy && s.destroy());
    this.itemSprites = [];
    this.loadCategoryItems(this.categories[this.currentCategoryIndex]);
  }

  createEditMenu() {
    this.editMenuGroup = this.add.container(0, 0);
    this.editMenuGroup.setDepth(9999);
    this.editMenuGroup.setVisible(false);

    const defs = [
      { id: "zoomIn", tex: "Button-Zoom-In" },
      { id: "zoomOut", tex: "Button-Zoom-Out" },
      { id: "rotate", tex: "Button-Rotate" },
      { id: "backward", tex: "Button-Backward" },
      { id: "forward", tex: "Button-Forward" },
      { id: "delete", tex: "Button-Delete" },
    ];

    const spacing = 70;
    defs.forEach((info, i) => {
      const btn = this.add
        .image(i * spacing, 0, info.tex)
        .setInteractive({ useHandCursor: true });
      btn.on("pointerdown", () => this.handleEditAction(info.id));
      this.editMenuGroup.add(btn);
    });

    const totalWidth = (defs.length - 1) * spacing;
    this.editMenuGroup.list.forEach((btn) => {
      btn.x -= totalWidth / 2;
    });
  }

  positionEditMenu(target) {
    if (!target || !target.active) return;
    const scaleRef = Math.max(target.scaleX, target.scaleY);
    const offset = this.baseEditMenuOffset * scaleRef;
    this.editMenuGroup.x = target.x;
    this.editMenuGroup.y = target.y + offset;
    this.editMenuGroup.setVisible(true);
  }

  hideEditMenu() {
    this.editMenuGroup.setVisible(false);
  }

  setActiveServedItem(sprite) {
    this.activeServedItem = sprite;
    this.positionEditMenu(sprite);
  }

  handleEditAction(actionId) {
    const item = this.activeServedItem;
    if (!item || !item.active) return;

    switch (actionId) {
      case "zoomIn": {
        item.setScale(item.scaleX + 0.1, item.scaleY + 0.1);
        this.positionEditMenu(item);
        break;
      }
      case "zoomOut": {
        const newScaleX = Math.max(0.2, item.scaleX - 0.1);
        const newScaleY = Math.max(0.2, item.scaleY - 0.1);
        item.setScale(newScaleX, newScaleY);
        this.positionEditMenu(item);
        break;
      }
      case "rotate": {
        item.angle += 15;
        this.positionEditMenu(item);
        break;
      }
      case "backward": {
        item.setDepth(item.depth - 1);
        break;
      }
      case "forward": {
        item.setDepth(item.depth + 1);
        break;
      }
      case "delete": {
        const cat = item.originCategory;

        this.selectedItems[cat] = null;
        this.feedbacks[cat].correct.setVisible(false);
        this.feedbacks[cat].blank.setVisible(true);
        this.checkReady();

        if (cat === this.categories[this.currentCategoryIndex]) {
          const returned = this.add
            .image(item.menuX, item.menuY, item.texture.key)
            .setInteractive({ draggable: true })
            .setScale(this.scaleMenu);

          returned.startX = item.menuX;
          returned.startY = item.menuY;
          returned.isFromMenu = true;

          this.input.setDraggable(returned);
          this.itemSprites.push(returned);
        }

        item.destroy();
        this.servedItems[cat] = null;

        this.activeServedItem = null;
        this.hideEditMenu();
        break;
      }
    }
  }

  loadCategoryItems(category) {
    Object.values(this.categoryBackgrounds).forEach((bg) =>
      bg.setVisible(false)
    );
    this.categoryBackgrounds[category].setVisible(true);

    Object.values(this.placas).forEach((p) => p.setVisible(false));
    this.placas[category].setVisible(true);

    this.itemSprites.forEach((s) => s.destroy && s.destroy());
    this.itemSprites = [];

    this.items[category].forEach((data) => {
      const alreadyServed =
        this.servedItems[category] &&
        this.servedItems[category].texture &&
        this.servedItems[category].texture.key === data.key;

      if (alreadyServed) return;

      const sprite = this.add
        .image(data.x, data.y, data.key)
        .setInteractive({ draggable: true })
        .setScale(this.scaleMenu);

      sprite.startX = data.x;
      sprite.startY = data.y;
      sprite.isFromMenu = true;

      this.input.setDraggable(sprite);
      this.itemSprites.push(sprite);
    });
  }

  changeCategory(dir) {
    this.currentCategoryIndex =
      (this.currentCategoryIndex + dir + this.categories.length) %
      this.categories.length;

    const newCat = this.categories[this.currentCategoryIndex];
    this.loadCategoryItems(newCat);
  }

  onItemDropped(itemKey) {
    const cat = this.categories[this.currentCategoryIndex];

    this.selectedItems[cat] = itemKey;

    this.feedbacks[cat].correct.setVisible(true);
    this.feedbacks[cat].blank.setVisible(false);

    this.checkReady();
  }

  checkReady() {
    const allComplete = Object.values(this.selectedItems).every(Boolean);

    this.buttonReadyOn.setVisible(allComplete);
    this.buttonReadyOff.setVisible(!allComplete);

    if (allComplete) {
      this.buttonReadyOn.setInteractive({ useHandCursor: true });
    } else {
      this.buttonReadyOn.disableInteractive();
    }
  }

  onReady() {
    if (this.currentDayIndex === this.dayBackgroundKeys.length - 1) {
      this.showFinalModal();
    } else {
      this.showNextDayModal();
    }
  }
}

export default Game1;
