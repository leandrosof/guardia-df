const tintColor = "#8A2BE2"; // Violeta Azulada (Roxo Guardiã)
const primaryPurple = "#6A0DAD"; // Roxo mais escuro e forte
const accentPink = "#FF69B4"; // Rosa choque para acentos vibrantes
const supportGreen = "#2E8B57"; // Verde Marítimo para sucesso/apoio
const warningYellow = "#FFD700"; // Dourado para alertas
const dangerRed = "#DC143C"; // Carmesim para perigo

export default {
  light: {
    text: "#333333",
    background: "#FFFFFF",
    tint: tintColor, // Cor principal para elementos ativos, botões primários
    primary: primaryPurple,
    accent: accentPink,
    tabIconDefault: "#B0B0B0", // Cinza para ícones inativos
    tabIconSelected: tintColor,
    cardBackground: "#F8F8F8",
    borderColor: "#E0E0E0",
    inputBackground: "#F0F0F0",
    success: supportGreen,
    warning: warningYellow,
    danger: dangerRed,
    placeholderText: "#999999",
    white: "#FFFFFF",
    black: "#000000",
    lightGrey: "#D3D3D3",
    mediumGrey: "#A9A9A9"
  },
  dark: {
    // Opcional: Se quiser implementar tema escuro no futuro
    text: "#FFFFFF",
    background: "#121212",
    tint: accentPink,
    primary: tintColor,
    accent: primaryPurple,
    tabIconDefault: "#707070",
    tabIconSelected: accentPink,
    cardBackground: "#1E1E1E",
    borderColor: "#2C2C2C",
    inputBackground: "#2C2C2C",
    success: supportGreen,
    warning: warningYellow,
    danger: dangerRed,
    placeholderText: "#888888",
    white: "#FFFFFF",
    black: "#000000",
    lightGrey: "#D3D3D3",
    mediumGrey: "#A9A9A9"
  }
};
