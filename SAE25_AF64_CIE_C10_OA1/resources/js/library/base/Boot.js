export class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Hud
        this.load.image('bg', './resources/images/hud/bg.png');
        this.load.image('btMenu', './resources/images/hud/btMenu.png');
        this.load.image('btFechar', './resources/images/hud/btFechar.png');
        this.load.image('titulo', './resources/images/hud/titulo.png')
        this.load.image('tadeuCorner', './resources/images/hud/TadeuCorner.png')
        this.load.image('waterdrop', './resources/images/hud/waterdrop.png')
        this.load.image('faucet', './resources/images/hud/faucet.png')
        this.load.image('sidebg', './resources/images/hud/sidebg.png')
        this.load.image('tadeubig', './resources/images/hud/tadeubig.png')
        this.load.image('textframe1', './resources/images/hud/textframe1.png')
        this.load.image('buttonback', './resources/images/hud/buttonback.png')
        this.load.image('buttonnext', './resources/images/hud/buttonnext.png')
        this.load.image('tadeuname', './resources/images/hud/tadeuname.png')



        //Game
        this.load.image('modal_armazenamento', './resources/images/game/modal_armazenamento.png')
        this.load.image('floor', './resources/images/game/floor.png')
        this.load.image('modal_captacao', './resources/images/game/modal_captacao.png')
        this.load.image('modal_coagulacao', './resources/images/game/modal_coagulacao.png')
        this.load.image('modal_decantacao_1', './resources/images/game/modal_decantacao_1.png')
        this.load.image('modal_decantacao_2', './resources/images/game/modal_decantacao_2.png')
        this.load.image('modal_decantacao_3', './resources/images/game/modal_decantacao_3.png')
        this.load.image('modal_decantacao_4', './resources/images/game/modal_decantacao_4.png')
        this.load.image('modal_decantacao_acerto', './resources/images/game/modal_decantacao_acerto.png')
        this.load.image('modal_decantacao_erro', './resources/images/game/modal_decantacao_erro.png')
        this.load.image('baloon', './resources/images/game/baloon.png')
        this.load.image('tadeufull', './resources/images/game/tadeufull.png')
        this.load.image('modal_icons', './resources/images/game/modal_icons.png')
        this.load.image('modal_icons_inactive', './resources/images/game/modal_icons_inactive.png')
        this.load.image('modal_icons1', './resources/images/game/modal_icons1.png')
        this.load.image('modal_icons2', './resources/images/game/modal_icons2.png')
        this.load.image('modal_icons3', './resources/images/game/modal_icons3.png')
        this.load.image('baloonsmall', './resources/images/game/baloonsmall.png')
        this.load.image('decantacao', './resources/images/game/decantacao.png')
        this.load.image('filtracao', './resources/images/game/filtracao.png')
        this.load.image('gradeamento', './resources/images/game/gradeamento.png')
        this.load.image('emptyslot', './resources/images/game/emptyslot.png')
        this.load.image('modal_gradeamento_1', './resources/images/game/modal_gradeamento_1.png')
        this.load.image('modal_gradeamento_2', './resources/images/game/modal_gradeamento_2.png')
        this.load.image('modal_gradeamento_3', './resources/images/game/modal_gradeamento_3.png')
        this.load.image('modal_gradeamento_4', './resources/images/game/modal_gradeamento_4.png')
        this.load.image('modal_gradeamento_acerto', './resources/images/game/modal_gradeamento_acerto.png')
        this.load.image('modal_gradeamento_erro', './resources/images/game/modal_gradeamento_erro.png')
        this.load.image('modal_pre_coloracao', './resources/images/game/modal_pre_coloracao.png')
        this.load.image('modal_floculacao', './resources/images/game/modal_floculacao.png')
        this.load.image('modal_filtracao_1', './resources/images/game/modal_filtracao_1.png')
        this.load.image('modal_filtracao_2', './resources/images/game/modal_filtracao_2.png')
        this.load.image('modal_filtracao_3', './resources/images/game/modal_filtracao_3.png')
        this.load.image('modal_filtracao_4', './resources/images/game/modal_filtracao_4.png')
        this.load.image('modal_filtracao_acerto', './resources/images/game/modal_filtracao_acerto.png')
        this.load.image('modal_filtracao_erro', './resources/images/game/modal_filtracao_erro.png')
        this.load.image('modal_fluoretacao', './resources/images/game/modal_fluoretacao.png')
        this.load.image('modal_distribuicao', './resources/images/game/modal_distribuicao.png')
        this.load.image('modal_feedback', './resources/images/game/modal_feedback.png')
        this.load.image('title_captacao', './resources/images/game/title_captacao.png')
        this.load.image('title_coagualacao', './resources/images/game/title_coagualacao.png')
        this.load.image('title_distribuicao', './resources/images/game/title_distribuicao.png')
        this.load.image('title_floculacao', './resources/images/game/title_floculacao.png')
        this.load.image('title_fluoretacao', './resources/images/game/title_fluoretacao.png')
        this.load.image('title_pos_cloracao', './resources/images/game/title_pos_cloracao.png')
        this.load.image('title_pre_cloracao', './resources/images/game/title_pre_cloracao.png')
        this.load.image('title_armazenamento', './resources/images/game/title_armazenamento.png')
        this.load.image('modal_pos_cloracao', './resources/images/game/modal_pos_cloracao.png')
        this.load.image('Button-SAE', './resources/images/game/Button-SAE.png')

        this.load.image('bt_proximo', './resources/images/game/bt_proximo.png')
        this.load.image('bt_verificar_ativo', './resources/images/game/bt_verificar_ativo.png')
        this.load.image('bt_verificar_inativo', './resources/images/game/bt_verificar_inativo.png')
        this.load.image('bt_tentar', './resources/images/game/bt_tentar.png')

        this.load.image('btSoundOn', './resources/images/hud/btSonsNormal.png');
        this.load.image('btSoundOff', './resources/images/hud/btSonsMutado.png');
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
        this.load.image('tadeublink', '././resources/images/hud/tadeublink.png')

        this.load.plugin('rextagtextplugin', 'resources/js/library/plugins/rextagtextplugin.min.js', true);

        this.load.svg('btFechar_sae', './resources/images/hud/btFechar_sae.svg');
        this.load.svg('btFechar_cqt', './resources/images/hud/btFechar_cqt.svg');
        this.load.svg('btFechar_spe', './resources/images/hud/btFechar_spe.svg');

        this.load.svg('iconPlayButton', './resources/images/hud/iconPlay.svg');
        this.load.svg('elipse', './resources/images/hud/elipse.svg');

        this.load.json('gameData', './resources/game/data/oda.json');
        this.load.json('dialogues', 'resources/game/data/dialogues.json');
        this.load.json('gametexts', 'resources/game/data/gametexts.json')


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
