export class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        // Fazer o preload de todos os assets aqui

        // Efeitos sonoros
        this.load.audio('click', 'resources/game/sounds/click.mp3');
        this.load.audio('acerto', 'resources/game/sounds/acerto.mp3');
        this.load.audio('erro', 'resources/game/sounds/erro.mp3');
        
        // Narrações
        this.load.audio('NA001', 'resources/game/sounds/Narracoes/NA001.mp3');
        this.load.audio('NA002', 'resources/game/sounds/Narracoes/NA002.mp3');
        this.load.audio('NA003', 'resources/game/sounds/Narracoes/NA003.mp3');
        this.load.audio('NA004', 'resources/game/sounds/Narracoes/NA004.mp3');
        this.load.audio('NA005', 'resources/game/sounds/Narracoes/NA005.mp3');
        this.load.audio('NA006', 'resources/game/sounds/Narracoes/NA006.mp3');
        this.load.audio('NA007', 'resources/game/sounds/Narracoes/NA007.mp3');
        this.load.audio('NA008', 'resources/game/sounds/Narracoes/NA008.mp3');
        this.load.audio('NA009', 'resources/game/sounds/Narracoes/NA009.mp3');
        this.load.audio('NA010', 'resources/game/sounds/Narracoes/NA010.mp3');
        this.load.audio('NA011', 'resources/game/sounds/Narracoes/NA011.mp3');
        this.load.audio('NA012', 'resources/game/sounds/Narracoes/NA012.mp3');
        this.load.audio('NA013', 'resources/game/sounds/Narracoes/NA013.mp3');
        this.load.audio('NA014', 'resources/game/sounds/Narracoes/NA014.mp3');
        this.load.audio('NA015', 'resources/game/sounds/Narracoes/NA015.mp3');
        this.load.audio('NA016', 'resources/game/sounds/Narracoes/NA016.mp3');
        this.load.audio('NA017', 'resources/game/sounds/Narracoes/NA017.mp3');
        this.load.audio('NA018', 'resources/game/sounds/Narracoes/NA018.mp3');
        this.load.audio('NA019', 'resources/game/sounds/Narracoes/NA019.mp3');
        this.load.audio('NA020', 'resources/game/sounds/Narracoes/NA020.mp3');
        this.load.audio('NA021', 'resources/game/sounds/Narracoes/NA021.mp3');
        this.load.audio('NA022', 'resources/game/sounds/Narracoes/NA022.mp3');
        this.load.audio('NA023', 'resources/game/sounds/Narracoes/NA023.mp3');
        this.load.audio('NA024', 'resources/game/sounds/Narracoes/NA024.mp3');
        this.load.audio('NA025', 'resources/game/sounds/Narracoes/NA025.mp3');
        this.load.audio('NA026', 'resources/game/sounds/Narracoes/NA026.mp3');
        this.load.audio('NA027', 'resources/game/sounds/Narracoes/NA027.mp3');
        this.load.audio('NA028', 'resources/game/sounds/Narracoes/NA028.mp3');
        this.load.audio('NA029', 'resources/game/sounds/Narracoes/NA029.mp3');
        this.load.audio('NA030', 'resources/game/sounds/Narracoes/NA030.mp3');
        this.load.audio('NA031', 'resources/game/sounds/Narracoes/NA031.mp3');

        

        // Adicione um texto de carregamento
        const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Carregando...', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5, 0.5);
        
        // Atualize a barra de carregamento (opcional)
        this.load.on('progress', (value) => {
            loadingText.setText(`Carregando... ${Math.round(value * 100)}%`);
        });
        
    }

    create() {

        const gameData = this.cache.json.get('gameData');
        this.game.registry.set('gameData', gameData);

        // Colocar as fontes aqui para garantir que foram carregadas. Verificar em index.html se está fazendo o load no css.
        Promise.all([
            document.fonts.load('36px Nunito-ExtraBold'),
            document.fonts.load('40px Nunito'),
        ]).then(() => {
            this.scene.start('Capa');
        });

    }
}
