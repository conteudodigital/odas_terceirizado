import { BaseCena } from "../../js/library/base/BaseCena.js";
import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { Button } from "../../js/library/components/Button.js";

export class Game1 extends BaseCena {
  constructor(controladorDeCenas) {
    super("Game1"); // Passa o nome da cena para a classe base
    this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
    this.loaded = false;
  }

  create() {
    const background = this.add.image(0, 0, "backgroundBlur").setOrigin(0, 0);

    const popUpAtv1 = this.add.image(0, 0, "popUpAtv1").setOrigin(0, 0);

    popUpAtv1.x = (this.scale.width - popUpAtv1.width) / 2;
    popUpAtv1.y = (this.scale.height - popUpAtv1.height) / 2;

    // Obter a marca atual
    const marca = ColorManager.getCurrentMarca(this);

    // Pegando a cor da marca
    const colors = ColorManager.getColors(marca, ColorManager.YELLOW);

    const btAvançar = new Button(this, {
      text: "AVANÇAR",
      showIcon: false,
      colors: colors,
    });

    btAvançar.x = background.x + (background.width - btAvançar.width) / 2;
    btAvançar.y = 725;

    btAvançar.on("buttonClick", () => {
      this.scene.start("Game2");
    });

    super.create(); // manter
  }
}

export default Game1;
