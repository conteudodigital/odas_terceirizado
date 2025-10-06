export class ControladorDeCenas {
    constructor(game, cenas) {
        this.game = game; // Armazena a referência ao objeto game
        this.cenas = cenas; // Array de cenas
        this.cenaAtualIndex = 0; // Índice da cena atual
        this.cenasCarregadas = new Set();
        this._gameData = null; // Inicializa como null
        this.data = null;
    }

    // Getter e Setter para gameData
    get gameData() {
        return this._gameData;
    }

    set gameData(data) {
        this._gameData = data;
    }

    // Método para inicializar o gameData
    initGameData() {
        this._gameData = this.game.registry.get('gameData');
    }

    // Métodos para navegação entre cenas
    proximaCena() {
        if (this.cenaAtualIndex < this.cenas.length - 1) {
            this.mudarCena(this.cenaAtualIndex + 1);
        }
    }

    cenaAnterior() {
        if (this.cenaAtualIndex > 0) {
            this.mudarCena(this.cenaAtualIndex - 1);
        }
    }

    home() {
        // Inicia a cena inicial apenas se todas estiverem carregadas
        this.cenaAtualIndex = 0;
        if (this.cenasCarregadas.size === this.cenas.length + 1) {
            this.mudarCena(this.cenaAtualIndex);
        } else {
            //console.log('Aguardando carregamento completo...');
        }
    }

    mudarCena(index) {
        if (index >= 0 && index < this.cenas.length) {
            const cenaAtual = this.cenas[this.cenaAtualIndex].key;
            const proximaCena = this.cenas[index].key;

            // Atualizar o índice
            this.cenaAtualIndex = index;

            // Para todos os sons de todas as formas possíveis
            if (this.game.sound) {
                //console.log('Parando todos os sons...');
                
                // Método 1: Usar o stopAll do Phaser
                this.game.sound.stopAll();
                
                // Método 2: Parar cada som individualmente
                this.game.sound.sounds.forEach(sound => {
                    if (sound) {
                        sound.stop();
                        sound.destroy();
                    }
                });
                
                // Método 3: Desativar e reativar o sistema de som
                this.game.sound.mute = true;
                setTimeout(() => {
                    this.game.sound.mute = false;
                }, 100);
            }

            // Para a cena atual
            this.game.scene.stop(cenaAtual);

            // Inicia a nova cena
            this.game.scene.start(proximaCena);
        }
    }

    get cenaAtual() {
        return this.cenas[this.cenaAtualIndex];
    }

    cenaCarregada(nomeCena) {
        this.cenasCarregadas.add(nomeCena);
        //console.log(`Cena ${nomeCena} carregada. Total: ${this.cenasCarregadas.size}`);
        
        // Verifica se todas as cenas foram carregadas
        if (this.cenasCarregadas.size === this.cenas.length + 1) { // +1 para incluir o Boot
            //console.log('Todas as cenas foram carregadas!');
            // Esconde o indicador de carregamento
            const loadingIndicator = document.getElementById('loading');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    }

    resetarCena() {
        const cenaAtual = this.cenas[this.cenaAtualIndex].key;
        
        // Para todos os sons
        if (this.game.sound) {
            this.game.sound.stopAll();
        }

        // Para a cena atual
        this.game.scene.stop(cenaAtual);

        // Reinicia a mesma cena
        this.game.scene.start(cenaAtual);
    }
}
