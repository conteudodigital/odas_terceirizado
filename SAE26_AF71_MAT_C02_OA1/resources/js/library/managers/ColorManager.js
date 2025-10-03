export class ColorManager {
  // Constantes estáticas para as cores
  static BLUE = "blue";
  static YELLOW = "yellow";
  static PINK = "pink";
  static ORANGE = "orange";
  static RED = "red";
  static GREEN = "green";
  static CYAN = "cyan";
  static GRAY = "gray";

  // Cores padrão (fallback)
  static DEFAULT_COLORS = {
    main: 0x5adcff,
    shadow: 0x288fce,
  };

  // Configurações de cores por marca
  static COLOR_SCHEMES = {
    SAE: {
      blue: {
        main: 0x5adcff,
        shadow: 0x288fce,
      },
      yellow: {
        main: 0xfbc82c,
        shadow: 0xd86f19,
      },
      green: {
        main: 0x2df98e,
        shadow: 0x26a373,
      },
      red: {
        main: 0xf2516c,
        shadow: 0x9b214d,
      },
      gray: {
        main: 0xc7c7c7,
        shadow: 0x7e878c,
      },
    },
    SPE: {
      orange: {
        main: 0xff5000,
        shadow: 0xbd3200,
      },
      blue: {
        main: 0x4e6adc,
        shadow: 0x273a8e,
      },
      pink: {
        main: 0x945ace,
        shadow: 0x641486,
      },
      red: {
        main: 0xf2516c,
        shadow: 0x9b214d,
      },
      cyan: {
        main: 0x13c0c0,
        shadow: 0x0f7677,
      },
    },
    CQT: {
      blue: {
        main: 0x21bdbe,
        shadow: 0x0f7677,
      },
      yellow: {
        main: 0xf3c836,
        shadow: 0xd86f19,
      },
      pink: {
        main: 0xae217f,
        shadow: 0x59093f,
      },
    },
  };

  // Cores padrão que não mudam entre marcas
  static COMMON_COLORS = {
    shadow2: 0x1f292d,
    text: "#FFFFFF",
    stroke: "#1F292D",
  };

  /**
   * Obtém as cores para uma marca específica
   * @param {string} marca - A marca (SAE, SPE, CQT)
   * @param {string} colorName - O nome da cor (blue, yellow, pink, orange, red, green)
   * @returns {Object} Objeto com as cores main, shadow, shadow2, text, stroke
   */
  static getColors(marca, colorName = "blue") {
    const marcaColors = this.COLOR_SCHEMES[marca];
    if (!marcaColors) {
      console.warn(`Marca '${marca}' não encontrada. Usando SAE como padrão.`);
      return this.getColors("SAE", colorName);
    }

    const colorScheme = marcaColors[colorName];
    if (!colorScheme) {
      console.warn(
        `Cor '${colorName}' não encontrada para marca '${marca}'. Aplicando cores padrão.`
      );
      return {
        main: this.DEFAULT_COLORS.main,
        shadow: this.DEFAULT_COLORS.shadow,
        ...this.COMMON_COLORS,
      };
    }

    return {
      main: colorScheme.main,
      shadow: colorScheme.shadow,
      ...this.COMMON_COLORS,
    };
  }

  /**
   * Obtém todas as cores disponíveis para uma marca
   * @param {string} marca - A marca (SAE, SPE, CQT)
   * @returns {Object} Objeto com todos os esquemas de cores da marca
   */
  static getAllColors(marca) {
    const marcaColors = this.COLOR_SCHEMES[marca];
    if (!marcaColors) {
      console.warn(`Marca '${marca}' não encontrada. Usando SAE como padrão.`);
      return this.getAllColors("SAE");
    }

    const result = {};
    for (const [colorName, colors] of Object.entries(marcaColors)) {
      result[colorName] = {
        main: colors.main,
        shadow: colors.shadow,
        ...this.COMMON_COLORS,
      };
    }
    return result;
  }

  /**
   * Obtém a marca atual do gameData
   * @param {Phaser.Scene} scene - A cena atual
   * @returns {string} A marca atual
   */
  static getCurrentMarca(scene) {
    try {
      const gameData = scene.cache.json.get("gameData");
      return gameData.configuracoes.marca || "SAE";
    } catch (error) {
      console.warn("Erro ao obter marca do gameData. Usando SAE como padrão.");
      return "SAE";
    }
  }

  /**
   * Verifica se uma cor está disponível para uma marca
   * @param {string} marca - A marca (SAE, SPE, CQT)
   * @param {string} colorName - O nome da cor
   * @returns {boolean} True se a cor está disponível
   */
  static hasColor(marca, colorName) {
    const marcaColors = this.COLOR_SCHEMES[marca];
    return marcaColors && marcaColors[colorName];
  }
}
