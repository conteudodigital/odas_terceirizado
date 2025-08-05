import { BaseCena } from '../../js/library/base/BaseCena.js';
import { Intro } from '../../js/library/components/Intro.js';
import { DragDropGame } from '../../js/library/components/DragDropGame.js';

export class Game extends BaseCena {
    constructor(controladorDeCenas) {
        super('Game');
        this.controladorDeCenas = controladorDeCenas;
        this.loaded = false;
    }

create() {
  super.create();

  // Adiciona a tela de introdução
  this.intro = new Intro(this);
  this.add.existing(this.intro);

  // Quando a intro terminar, adiciona o DragDropGame
  this.events.once('intro-finished', () => {
    this.intro.destroy(); // remove a intro da tela

    this.dragDropGame = new DragDropGame(this);
    this.add.existing(this.dragDropGame);
  });
}
}

export default Game;
