import { ColorManager } from "../../js/library/managers/ColorManager.js";
import { BaseCena } from "../../js/library/base/BaseCena.js";
import { Button } from "../../js/library/components/Button.js";

export class Capa extends BaseCena {
  constructor(controladorDeCenas) {
    super("Capa"); // Passa o nome da cena para a classe base
    this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
    this.loaded = false;
  }

  create() {
    const background = this.add.image(0, 0, "bgCapa").setOrigin(0, 0);
    const titulo = this.add.image(0, 0, "titulo").setOrigin(0, 0);
    titulo.x = background.x + (background.width - titulo.width) / 2;
    titulo.y = 285;

    // Obter a marca atual
    const marca = ColorManager.getCurrentMarca(this);

    // Pegando a cor da marca
    const colors = ColorManager.getColors(marca, ColorManager.BLUE);

    const btIniciar = new Button(this, {
      text: "INICIAR",
      showIcon: true,
      colors: colors,
    });

    btIniciar.x = background.x + (background.width - btIniciar.width) / 2;
    btIniciar.y = 700;

    btIniciar.on("buttonClick", () => {
      this.controladorDeCenas.proximaCena();
    });

    super.create();
  }
}
