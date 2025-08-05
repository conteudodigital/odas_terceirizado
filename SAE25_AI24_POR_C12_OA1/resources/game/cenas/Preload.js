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
        this.load.audio('CH_ALF001', 'resources/game/sounds/CH_ALF001.mp3');
        this.load.audio('CH_ALF002', 'resources/game/sounds/CH_ALF002.mp3');
        this.load.audio('CH_ALF003', 'resources/game/sounds/CH_ALF003.mp3');
        this.load.audio('CH_ALF004', 'resources/game/sounds/CH_ALF004.mp3');
        this.load.audio('NA001', 'resources/game/sounds/NA001.mp3');
        this.load.audio('NA002', 'resources/game/sounds/NA002.mp3');
        this.load.audio('NA003', 'resources/game/sounds/NA003.mp3');
        this.load.audio('NA004', 'resources/game/sounds/NA004.mp3');
        this.load.audio('NA005', 'resources/game/sounds/NA005.mp3');
        this.load.audio('NA006', 'resources/game/sounds/NA006.mp3');
        this.load.audio('NA007', 'resources/game/sounds/NA007.mp3');
        this.load.audio('NA008', 'resources/game/sounds/NA008.mp3');
        this.load.audio('NA009', 'resources/game/sounds/NA009.mp3');
        this.load.audio('music', 'resources/game/sounds/Adventures in Adventureland.mp3');

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
