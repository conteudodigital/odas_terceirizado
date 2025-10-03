import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game2 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game2"); // Passa o nome da cena para a classe base
    this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
    this.loaded = false;
  }

  create() {
    const background = this.add.image(0, 0, "tutorial2Bg").setOrigin(0, 0);

    // Obter a marca atual
    const marca = ColorManager.getCurrentMarca(this);

    // Pegando a cor da marca
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const btComecar = new Button(this, {
      text: "COMEÇAR",
      showIcon: false,
      colors: colors,
    });

    btComecar.x = background.x + (background.width - btComecar.width) / 2 + 70;
    btComecar.y = 900;

    btComecar.on("buttonClick", () => {
      this.scene.start("Game3");
    });

    super.create(); // manter essa linha pois o super.create() é necessário para que a cena seja criada corretamente. Caso tenha próximas cenas também deve ser chamado o super.create().
  }
}

export default Game2;
