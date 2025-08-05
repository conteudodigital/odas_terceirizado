import { BaseCena } from '../../js/library/base/BaseCena.js';
import { InitialDialog } from '../../js/library/components/InitialDialog.js';
import { DragDropGame } from '../../js/library/components/DragDropGame.js';
import { ObjectUtil } from '../../js/library/utils/ObjectUtils.js';

export class Game extends BaseCena {
    constructor(controladorDeCenas) {
        super('Game');
        this.controladorDeCenas = controladorDeCenas;
        this.loaded = false;
    }

create() {
    const background = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    super.create();

    const hud = new InitialDialog(this, 100, 650);
    hud.startDialog();


    hud.setOnDialogEnd(() => {
      hud.setVisible(false); // opcional: esconder HUD
      const dragDrop = new DragDropGame(this, 0, 0);
    });
  }
}

export default Game;
