export class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Hud
        this.load.image('Bg', './resources/images/hud/Bg.png');
        this.load.image('btMenu', './resources/images/hud/btMenu.png');
        this.load.image('btFechar', './resources/images/hud/btFechar.png');
        
        this.load.image('btSoundOn', './resources/images/hud/btSonsNormal.png'); // Botão de som ligado
        this.load.image('btSoundOff', './resources/images/hud/btSonsMutado.png'); //
        this.load.image('btEnunciado', './resources/images/hud/btEnunciado.png');
        this.load.image('btMusicasOn', './resources/images/hud/btMusicasNormal.png');
        this.load.image('btMusicasOff', './resources/images/hud/btMusicasMutado.png');
        this.load.image('btTelaCheia', './resources/images/hud/btTelaCheia.png');
        this.load.image('btOrientacao', './resources/images/hud/btOrientacao.png');
        this.load.image('modalEnunciado', './resources/images/hud/modal1.png');
        this.load.image('modalFeedbackPositivo', './resources/images/hud/modal3.png');
        this.load.image('modalFeedbackNegativo', './resources/images/hud/modal2.png');
        this.load.image('btVamosLa', './resources/images/hud/btVamosLa.png');
        this.load.image('btVoltar', './resources/images/hud/btVoltar.png');
        this.load.image('btNarracao', '././resources/images/hud/btNarracao.png');
        this.load.image('btConfirmar', '././resources/images/hud/btConfirmar.png');
        this.load.image('btJogarNovamente', '././resources/images/hud/btJogarNovamente.png');
        this.load.image('digiPositivo', '././resources/images/hud/digi1.png');
        this.load.image('digiNegativo', '././resources/images/hud/digi2.png');
        this.load.image('boxCreditos', '././resources/images/hud/boxCreditos.png');
        this.load.image('btCreditos', '././resources/images/hud/btCreditos.png');
        this.load.image('bgCapa', '././resources/images/hud/bgCapa.png');
        this.load.image('gameTitle', '././resources/images/hud/gameTitle.png');
        this.load.image('button_voice', '././resources/images/hud/button_voice.png');

        //Game
        this.load.image('bg-intro1', '././resources/images/hud/bg-intro1.png');
        this.load.image('dialog1', '././resources/images/Game/dialog1.png');
        this.load.image('alfabeton1', '././resources/images/Game/alfabeton1.png');
        this.load.image('alfabeton2', '././resources/images/Game/alfabeton2.png');
        this.load.image('btNext', '././resources/images/Game/btNext.png');
        this.load.image('lavarmaos', '././resources/images/Game/lavarmaos.png');
        this.load.image('arrow1', '././resources/images/Game/arrow1.png');
        this.load.image('silabas', '././resources/images/Game/silabas.png');
        this.load.image('hand', '././resources/images/Game/hand.png');
        this.load.image('bg-jogo-fase1', '././resources/images/Game/bg-jogo-fase1.png');
        this.load.image('bg-jogo-fase1-V', '././resources/images/Game/bg-jogo-fase1-V.png');
        this.load.image('bg-jogo-fase1-VV', '././resources/images/Game/bg-jogo-fase1-VV.png');
        this.load.image('bg-jogo-fase2', '././resources/images/Game/bg-jogo-fase2.png');
        this.load.image('bg-jogo-fase2-V', '././resources/images/Game/bg-jogo-fase2-V.png');
        this.load.image('bg-jogo-fase2-VV', '././resources/images/Game/bg-jogo-fase2-VV.png');
        this.load.image('bg-jogo-fase3', '././resources/images/Game/bg-jogo-fase3.png');
        this.load.image('bg-jogo-fase3-V', '././resources/images/Game/bg-jogo-fase3-V.png');
        this.load.image('bg-jogo-fase3-VV', '././resources/images/Game/bg-jogo-fase3-VV.png');
        this.load.image('bg-jogo-fase4', '././resources/images/Game/bg-jogo-fase4.png');
        this.load.image('bg-jogo-fase4-V', '././resources/images/Game/bg-jogo-fase4-V.png');
        this.load.image('bg-jogo-fase4-VV', '././resources/images/Game/bg-jogo-fase4-VV.png');
        this.load.image('bg-jogo-fase5', '././resources/images/Game/bg-jogo-fase5.png');
        this.load.image('bg-jogo-fase5-V', '././resources/images/Game/bg-jogo-fase5-V.png');
        this.load.image('bg-jogo-fase5-VV', '././resources/images/Game/bg-jogo-fase5-VV.png');
        this.load.image('bg-jogo-fase6', '././resources/images/Game/bg-jogo-fase6.png');
        this.load.image('bg-jogo-fase6-V', '././resources/images/Game/bg-jogo-fase6-V.png');
        this.load.image('bg-jogo-fase6-VV', '././resources/images/Game/bg-jogo-fase6-VV.png');
        this.load.image('silaba_ao', '././resources/images/Game/silaba_ao.png');
        this.load.image('silaba_aos', '././resources/images/Game/silaba_aos.png');
        this.load.image('silaba_a', '././resources/images/Game/silaba_a.png');
        this.load.image('silaba_aes', '././resources/images/Game/silaba_aes.png');
        this.load.image('silaba_oes', '././resources/images/Game/silaba_oes.png');
        this.load.image('topText', '././resources/images/Game/topText.png');
        this.load.image('feedback-acerto', '././resources/images/Game/feedback-acerto.png');
        this.load.image('feedback-erro', '././resources/images/Game/feedback-erro.png');
        this.load.image('target', '././resources/images/Game/target.png');
        this.load.image('modalfeedback', '././resources/images/Game/modalfeedback.png');
        this.load.image('Button-SAE', '././resources/images/Game/Button-SAE.png');

        this.load.plugin('rextagtextplugin', 'resources/js/library/plugins/rextagtextplugin.min.js', true);

        this.load.svg('btFechar_sae', './resources/images/hud/btFechar_sae.svg');
        this.load.svg('btFechar_cqt', './resources/images/hud/btFechar_cqt.svg');
        this.load.svg('btFechar_spe', './resources/images/hud/btFechar_spe.svg');

        this.load.svg('iconPlayButton', './resources/images/hud/iconPlay.svg');
        this.load.svg('elipse', './resources/images/hud/elipse.svg');

        this.load.json('gameData', './resources/game/data/oda.json');
        this.load.json('introData', './resources/game/data/intro.json');
        this.load.json('gameinfo', './resources/game/data/gameinfo.json');

        // Adicione um texto de carregamento
        const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Carregando...', {
            fontSize: '32px',
            color: '#ffffff',
        }).setOrigin(0.5, 0.5);
        
        // Atualize a barra de carregamento (opcional)
        this.load.on('progress', (value) => {
            loadingText.setText(`Carregando... ${Math.round(value * 100)}%`);
        });

        // Monitora o carregamento
        /*this.load.on('complete', () => {
            this.scene.start('Preload');
        });*/
    }

    create() {

        const gameData = this.cache.json.get('gameData');
        this.game.registry.set('gameData', gameData);

        this.scene.start('Preload'); // Fazendo o preload dos assets.

        // Removemos o start daqui, pois agora está no evento complete
    }
}
