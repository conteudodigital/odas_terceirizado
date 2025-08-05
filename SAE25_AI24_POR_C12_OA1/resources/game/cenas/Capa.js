import { ColorManager } from '../../js/library/managers/ColorManager.js';
import { BaseCena } from '../../js/library/base/BaseCena.js';
import { Button } from '../../js/library/components/Button.js';
import SoundManager from '../../js/library/managers/SoundManager.js';


export class Capa extends BaseCena {
    constructor(controladorDeCenas) {
        super('Capa'); // Passa o nome da cena para a classe base
        this.controladorDeCenas = controladorDeCenas; // Armazena a referência ao controlador de cenas
        this.loaded = false;
    }

    create() {
        const background = this.add.image(0, 0, 'bgCapa').setOrigin(0, 0);
        const titulo = this.add.image(0, 0, 'gameTitle').setOrigin(0, 0);
        titulo.x = background.x + (background.width - titulo.width) / 2 + 260;
        titulo.y = 300;

        const buttonAudio = this.add.image(0, 0, 'button_voice').setOrigin(0, 0).setInteractive({ cursor: 'pointer' });
        buttonAudio.x = background.x + (background.width - buttonAudio.width) / 2 + 260;
        buttonAudio.y = 140;

        // Obter a marca atual
        const marca = ColorManager.getCurrentMarca(this);
        
        // Pegando a cor da marca
        const colors = ColorManager.getColors(marca, ColorManager.BLUE);

        const btIniciar = new Button(this, {
           text: 'INICIAR',
           showIcon: true,
           colors: colors
        });
        SoundManager.play('NA001');

        btIniciar.x = background.x + (background.width - btIniciar.width) / 2 + 260;
        btIniciar.y = 820;

        btIniciar.on('buttonClick', () => {
           this.controladorDeCenas.proximaCena();
        });

        buttonAudio.on('pointerdown', () =>{
            SoundManager.stopAll();
            SoundManager.play('NA001');
        });

        super.create();


    }
}
